import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { hooks, patches } from "../pnpmfile.mjs";

test("every shared patch resolves to a file in the package", () => {
  const { patchedDependencies } = hooks.updateConfig({});
  assert.deepEqual(Object.keys(patchedDependencies), Object.keys(patches));
  for (const file of Object.values(patchedDependencies)) assert.ok(existsSync(file), file);
});

test("a project's own patch entry takes precedence", () => {
  const { patchedDependencies, allowUnusedPatches } = hooks.updateConfig({
    patchedDependencies: { "arktype@^2.2.0": "patches/local.patch" },
  });
  assert.equal(patchedDependencies["arktype@^2.2.0"], "patches/local.patch");
  assert.equal(allowUnusedPatches, true);
});
