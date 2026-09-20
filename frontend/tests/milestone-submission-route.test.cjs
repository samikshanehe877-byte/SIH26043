// The milestone submission route is the trust boundary for who a submission (and its evidence) is
// attributed to: FastAPI has no auth of its own, so this route must build the identity it forwards
// from the signed-in session and never from anything in the request. Loads the real route source,
// with the session and the upstream fetch replaced, and checks exactly what would be sent on.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const vm = require("node:vm");

// ROUTE_SOURCE lets the test be pointed at a deliberately broken copy, to prove it can actually fail.
const source = fs.readFileSync(process.env.ROUTE_SOURCE ?? "app/api/projects/[problemId]/milestones/route.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

class TestResponse {
  constructor(body, init) { this.body = body; this.status = init.status; }
  static json(body, init = {}) { return new TestResponse(body, { status: init.status ?? 200 }); }
}

function loadRoute(user, upstream) {
  const calls = [];
  const fetchMock = async (url, init) => {
    calls.push({ url, init });
    return upstream(url, init);
  };
  const moduleUnderTest = { exports: {} };
  vm.runInNewContext(compiled, {
    exports: moduleUnderTest.exports,
    module: moduleUnderTest,
    Request, FormData, File, Blob, Response, console, process,
    fetch: fetchMock,
    require: (name) => {
      if (name === "next/server") return { NextResponse: TestResponse };
      if (name === "@/lib/auth") return { getAuthUser: async () => user };
      throw new Error(`Unexpected module: ${name}`);
    },
  });
  return { POST: moduleUnderTest.exports.POST, calls };
}

const ok = (status = 201, body = { id: "m1" }) => async () => ({ status, json: async () => body });
const params = { params: Promise.resolve({ problemId: "p1" }) };
const request = (body) => new Request("http://localhost/api/projects/p1/milestones", { method: "POST", body });
const jsonRequest = (payload) =>
  new Request("http://localhost/api/projects/p1/milestones", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  });

const faculty = { id: "fac-1", name: "Dr. Priya Coordinator", role: "FACULTY", universityId: "u1", organizationName: "ABC Institute of Technology" };
const employee = { id: "emp-1", name: "Amit Kumar", role: "INDUSTRY_EMPLOYEE", industryId: "i1", organizationName: "TechSolutions Pvt Ltd" };
const citizen = { id: "cit-1", name: "Rahul Sharma", role: "CITIZEN" };

(async () => {
  // Not signed in: rejected, and nothing is forwarded.
  {
    const { POST, calls } = loadRoute(null, ok());
    const response = await POST(request(new FormData()), params);
    assert.equal(response.status, 401);
    assert.equal(calls.length, 0);
  }

  // Signed in but belonging to no university or industry (a citizen): rejected, nothing forwarded.
  {
    const form = new FormData();
    form.set("milestone_type", "project_accepted");
    const { POST, calls } = loadRoute(citizen, ok());
    const response = await POST(request(form), params);
    assert.equal(response.status, 403);
    assert.equal(calls.length, 0, "a citizen's upload must never reach the API");
  }

  // The main path: files + links + note through, and a client trying to claim another identity is ignored.
  {
    const form = new FormData();
    form.set("milestone_type", "prototype_completed");
    form.set("note", "Demo ready");
    form.append("links", "https://example.com/demo");
    form.append("links", "www.example.org/repo");
    form.append("files", new File([Buffer.from("photo-bytes")], "photo.png", { type: "image/png" }));
    form.append("files", new File([Buffer.from("%PDF-1.4")], "report.pdf", { type: "application/pdf" }));
    // Spoofing attempt: none of these may make it upstream.
    form.set("party_type", "industry");
    form.set("party_name", "XYZ University of Engineering");
    form.set("user_id", "spoofed-user");
    form.set("user_name", "Mallory");
    form.set("is_verified", "true");

    const { POST, calls } = loadRoute(faculty, ok(201, { id: "m1", status: "submitted" }));
    const response = await POST(request(form), params);

    assert.equal(response.status, 201);
    assert.deepEqual(response.body, { id: "m1", status: "submitted" });
    assert.equal(calls.length, 1);
    const { url, init } = calls[0];
    assert.equal(url, "http://localhost:8000/projects/p1/milestones/with-attachments");
    assert.equal(init.method, "POST");
    assert.ok(init.body instanceof FormData);
    assert.equal(init.headers?.["Content-Type"], undefined, "fetch must add the multipart boundary itself");

    const sent = init.body;
    assert.equal(sent.get("party_type"), "university", "identity comes from the session, not the form");
    assert.equal(sent.get("party_name"), "ABC Institute of Technology");
    assert.equal(sent.get("user_id"), "fac-1");
    assert.equal(sent.get("user_name"), "Dr. Priya Coordinator");
    assert.equal(sent.get("milestone_type"), "prototype_completed");
    assert.equal(sent.get("note"), "Demo ready");
    assert.deepEqual(sent.getAll("links"), ["https://example.com/demo", "www.example.org/repo"]);
    const files = sent.getAll("files");
    assert.deepEqual(files.map((f) => f.name), ["photo.png", "report.pdf"]);
    assert.equal(await files[0].text(), "photo-bytes", "file contents are forwarded intact");
    assert.deepEqual(
      [...new Set(sent.keys())].sort(),
      ["files", "links", "milestone_type", "note", "party_name", "party_type", "user_id", "user_name"],
      "only the known fields are forwarded; anything else a client adds is dropped",
    );
  }

  // An industry user submits as their own company.
  {
    const form = new FormData();
    form.set("milestone_type", "testing_completed");
    const { POST, calls } = loadRoute(employee, ok());
    await POST(request(form), params);
    assert.equal(calls[0].init.body.get("party_type"), "industry");
    assert.equal(calls[0].init.body.get("party_name"), "TechSolutions Pvt Ltd");
  }

  // A plain JSON body (no files) is accepted too, and forwarded the same way.
  {
    const { POST, calls } = loadRoute(faculty, ok());
    const response = await POST(jsonRequest({ milestone_type: "initial_planning", links: ["https://example.com/a", 7, null] }), params);
    assert.equal(response.status, 201);
    assert.deepEqual(calls[0].init.body.getAll("links"), ["https://example.com/a"], "non-string links are ignored");
    assert.equal(calls[0].init.body.getAll("files").length, 0);
  }

  // No milestone type: rejected before anything is forwarded.
  {
    const { POST, calls } = loadRoute(faculty, ok());
    const response = await POST(request(new FormData()), params);
    assert.equal(response.status, 400);
    assert.equal(calls.length, 0);
  }

  // The API's own rejection (a bad file type, say) reaches the client with its status and message intact.
  {
    const form = new FormData();
    form.set("milestone_type", "project_accepted");
    const detail = "'virus.exe' can't be uploaded: EXE files aren't allowed.";
    const { POST } = loadRoute(faculty, ok(415, { detail }));
    const response = await POST(request(form), params);
    assert.equal(response.status, 415);
    assert.equal(response.body.detail, detail);
  }

  // The API being down is a clear 502, not a crash.
  {
    const form = new FormData();
    form.set("milestone_type", "project_accepted");
    const { POST } = loadRoute(faculty, async () => { throw new Error("ECONNREFUSED"); });
    const originalError = console.error;
    console.error = () => {};
    const response = await POST(request(form), params);
    console.error = originalError;
    assert.equal(response.status, 502);
  }

  console.log("milestone submission route: PASS");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
