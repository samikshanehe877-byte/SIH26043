// The Best Match feedback route decides whose "not interested" a request applies to. FastAPI has no
// auth of its own, so this route must take the person and organization from the signed-in session and
// never from the request. Loads the real route source with the session and the upstream fetch replaced.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const vm = require("node:vm");

const compile = (file) =>
  ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;

class TestResponse {
  constructor(body, init) { this.body = body; this.status = init.status; }
  static json(body, init = {}) { return new TestResponse(body, { status: init.status ?? 200 }); }
}

function load(file, user, upstream) {
  const calls = [];
  const moduleUnderTest = { exports: {} };
  vm.runInNewContext(compile(file), {
    exports: moduleUnderTest.exports,
    module: moduleUnderTest,
    Request, URL, JSON, Number, encodeURIComponent, console, process,
    fetch: async (url, init) => { calls.push({ url, init }); return upstream(url, init); },
    require: (name) => {
      if (name === "next/server") return { NextResponse: TestResponse };
      if (name === "@/lib/auth") return { getAuthUser: async () => user };
      throw new Error(`Unexpected module: ${name}`);
    },
  });
  return { ...moduleUnderTest.exports, calls };
}

const ok = (status = 200, body = { updated: 1 }) => async () => ({ status, json: async () => body });
const post = (payload) =>
  new Request("http://localhost/api/organization/problem-matches/feedback", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: typeof payload === "string" ? payload : JSON.stringify(payload),
  });

const FEEDBACK = "app/api/organization/problem-matches/feedback/route.ts";
const MATCHES = "app/api/organization/problem-matches/route.ts";
const faculty = { id: "fac-1", name: "Dr. Priya", role: "FACULTY", universityId: "u1", organizationName: "ABC Institute of Technology" };
const employee = { id: "emp-1", name: "Amit", role: "INDUSTRY_EMPLOYEE", industryId: "i1", organizationName: "TechSolutions" };
const citizen = { id: "cit-1", name: "Rahul", role: "CITIZEN" };

(async () => {
  // Not signed in, or not part of an organization: rejected, nothing forwarded.
  {
    const { POST, calls } = load(FEEDBACK, null, ok());
    assert.equal((await POST(post({ action: "seen", problemIds: ["p1"] }))).status, 401);
    assert.equal(calls.length, 0);
  }
  {
    const { POST, calls } = load(FEEDBACK, citizen, ok());
    assert.equal((await POST(post({ action: "dismiss", problemIds: ["p1"] }))).status, 403);
    assert.equal(calls.length, 0, "a citizen has no organization to give feedback for");
  }

  // The main path: person and organization come from the session, whatever the client claims.
  {
    const { POST, calls } = load(FEEDBACK, faculty, ok());
    const response = await POST(post({ action: "dismiss", problemIds: ["p1"], user_id: "spoofed", userId: "spoofed", orgId: "other-org", org_type: "industry" }));
    assert.equal(response.status, 200);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "http://localhost:8000/organizations/university/u1/problem-feedback");
    assert.deepEqual(JSON.parse(calls[0].init.body), { user_id: "fac-1", action: "dismiss", problem_ids: ["p1"] });
  }
  {
    const { POST, calls } = load(FEEDBACK, employee, ok());
    await POST(post({ action: "seen", problemIds: ["a", "b"] }));
    assert.equal(calls[0].url, "http://localhost:8000/organizations/industry/i1/problem-feedback");
    assert.equal(JSON.parse(calls[0].init.body).user_id, "emp-1");
  }

  // Bad requests are rejected before anything is forwarded.
  for (const bad of [
    "not json", null, {}, { action: "delete", problemIds: ["p1"] }, { action: "seen" }, { action: "seen", problemIds: [] },
    { action: "seen", problemIds: "p1" }, { action: "seen", problemIds: [1, 2] }, { action: "seen", problemIds: [""] },
    { action: "seen", problemIds: Array.from({ length: 21 }, (_, i) => `p${i}`) },
  ]) {
    const { POST, calls } = load(FEEDBACK, faculty, ok());
    assert.equal((await POST(post(bad))).status, 400, `should reject ${JSON.stringify(bad)}`);
    assert.equal(calls.length, 0);
  }

  // The API's own answer reaches the client, and an outage is a clear 502.
  {
    const { POST } = load(FEEDBACK, faculty, ok(404, { detail: "Problem not found" }));
    const response = await POST(post({ action: "seen", problemIds: ["nope"] }));
    assert.equal(response.status, 404);
    assert.equal(response.body.detail, "Problem not found");
  }
  {
    const { POST } = load(FEEDBACK, faculty, async () => { throw new Error("ECONNREFUSED"); });
    const original = console.error;
    console.error = () => {};
    const response = await POST(post({ action: "seen", problemIds: ["p1"] }));
    console.error = original;
    assert.equal(response.status, 502);
  }

  // The matches route asks for THIS user's ordering, taken from the session and not from the URL.
  {
    const { GET, calls } = load(MATCHES, faculty, ok(200, { matches: [] }));
    await GET(new Request("http://localhost/api/organization/problem-matches?top_k=3&user_id=spoofed"));
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "http://localhost:8000/organizations/university/u1/problem-matches?top_k=3&user_id=fac-1");
  }

  console.log("match feedback route: PASS");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
