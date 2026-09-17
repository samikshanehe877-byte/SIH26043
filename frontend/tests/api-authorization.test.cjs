const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const vm = require("node:vm");

const source = fs.readFileSync("lib/api-auth.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
class TestResponse {
  constructor(body, init) { this.body = body; this.status = init.status; }
  static json(body, init) { return new TestResponse(body, init); }
}

async function loadWithUser(user) {
  const moduleUnderTest = { exports: {} };
  vm.runInNewContext(compiled, {
    exports: moduleUnderTest.exports,
    module: moduleUnderTest,
    Request,
    console,
    require: (name) => {
      if (name === "next/server") return { NextResponse: TestResponse };
      if (name === "@/lib/auth") return { getAuthUser: async () => user };
      throw new Error(`Unexpected module: ${name}`);
    },
  });
  return moduleUnderTest.exports;
}

(async () => {
  const citizenApi = await loadWithUser({ id: "rahul", role: "CITIZEN" });
  const forbidden = await citizenApi.requireApiRole(["GOVERNMENT_OFFICER", "ADMIN"]);
  assert.ok(forbidden instanceof TestResponse);
  assert.equal(forbidden.status, 403, "a direct protected API request by a citizen must be forbidden");

  const governmentApi = await loadWithUser({ id: "officer", role: "GOVERNMENT_OFFICER" });
  const allowed = await governmentApi.requireApiRole(["GOVERNMENT_OFFICER", "ADMIN"]);
  assert.equal(allowed.id, "officer");
  console.log("direct API authorization: PASS");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
