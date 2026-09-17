const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const vm = require("node:vm");

const source = fs.readFileSync("lib/authorization.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUnderTest = { exports: {} };
vm.runInNewContext(compiled, { exports: moduleUnderTest.exports, module: moduleUnderTest });

const { getAllowedRolesForPath, hasRequiredRole } = moduleUnderTest.exports;
const canAccess = (role, pathname) => hasRequiredRole(role, getAllowedRolesForPath(pathname));

[
  ["CITIZEN", "/government", false],
  ["CITIZEN", "/government/verify", false],
  ["CITIZEN", "/university", false],
  ["CITIZEN", "/industry", false],
  ["CITIZEN", "/mentor", false],
  ["CITIZEN", "/student", false],
  ["GOVERNMENT_OFFICER", "/government", true],
  ["STUDENT", "/student", true],
  ["MENTOR", "/mentor", true],
  ["INDUSTRY_EMPLOYEE", "/industry", true],
  ["FACULTY", "/university", true],
].forEach(([role, pathname, expected]) => {
  assert.equal(canAccess(role, pathname), expected, `${role} ${pathname}`);
});

console.log("authorization policy matrix: PASS");
