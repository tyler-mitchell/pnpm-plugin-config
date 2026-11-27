import { fileURLToPath } from "node:url";

/** Patches applied in every consuming project, keyed by the dependency range each one targets. */
export const patches = {
  "arktype@^2.2.0": "arktype.patch",
};

export const hooks = {
  updateConfig: (config) => ({
    ...config,
    // A project that lacks a patched dependency still loads every shared patch.
    allowUnusedPatches: true,
    patchedDependencies: {
      ...Object.fromEntries(
        Object.entries(patches).map(([key, file]) => [
          key,
          fileURLToPath(new URL(`./patches/${file}`, import.meta.url)),
        ]),
      ),
      // The consuming project's own entries take precedence.
      ...config.patchedDependencies,
    },
  }),
};
