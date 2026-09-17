const assert = require("node:assert/strict");
const fs = require("node:fs");
const nodeCrypto = require("node:crypto");
const ts = require("typescript");
const vm = require("node:vm");

process.env.AUTH_SESSION_SECRET = "test-only-session-secret-that-is-long-enough-to-be-safe";
const source = fs.readFileSync("lib/session.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText;
const moduleUnderTest = { exports: {} };
vm.runInNewContext(compiled, {
  exports: moduleUnderTest.exports,
  module: moduleUnderTest,
  process,
  Buffer,
  require: (name) => name === "server-only" ? {} : name === "crypto" ? nodeCrypto : require(name),
});

const { createSessionToken, verifySessionToken } = moduleUnderTest.exports;
const token = createSessionToken("user_123", 1_000);
assert.equal(verifySessionToken(token, 1_001).userId, "user_123");
assert.equal(token.includes("CITIZEN"), false, "a role must never be stored in the session token");
assert.equal(verifySessionToken(`${token}x`, 1_001), null, "a modified token must be rejected");
assert.equal(verifySessionToken(token, 1_000 + 60 * 60 * 24 * 7 * 1000 + 1), null, "expired token must be rejected");

console.log("session token integrity: PASS");
