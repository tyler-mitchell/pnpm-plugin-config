import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Install arktype through the published pnpmfile and use the patched metadata default.
const pnpmfile = fileURLToPath(import.meta.resolve("@hyphened/pnpm-plugin-config/pnpmfile.mjs"));
const consumer = mkdtempSync(join(tmpdir(), "pnpm-plugin-config-consumer-"));
try {
  writeFileSync(
    join(consumer, "package.json"),
    JSON.stringify({ name: "consumer", private: true, type: "module", dependencies: { arktype: "2.2.10" } }),
  );
  writeFileSync(join(consumer, "pnpm-workspace.yaml"), `pnpmfile: ${JSON.stringify(pnpmfile)}\n`);
  writeFileSync(
    join(consumer, "probe.mjs"),
    [
      'import { type } from "arktype";',
      'const user = type({ name: ["string", "@", { default: "Anonymous" }] })({});',
      'if (user.name !== "Anonymous") throw new Error(`metadata default not applied: ${JSON.stringify(user)}`);',
    ].join("\n"),
  );
  execFileSync("pnpm", ["install"], { cwd: consumer, stdio: "inherit" });
  execFileSync(process.execPath, ["probe.mjs"], { cwd: consumer, stdio: "inherit" });
  console.log("arktype applies a metadata default through @hyphened/pnpm-plugin-config.");
} finally {
  rmSync(consumer, { recursive: true, force: true });
}
