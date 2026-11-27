# @hyphened/pnpm-plugin-config

Shared pnpm patches for hyphened projects. Every project that installs this
[config dependency](https://pnpm.io/config-dependencies) applies the same patch
files, so a change to a third-party package is made once and reaches every
project through one version.

## Use

Requires pnpm 12. Add the config dependency to `pnpm-workspace.yaml`:

```yaml
configDependencies:
  "@hyphened/pnpm-plugin-config": latest
```

pnpm loads the package's `pnpmfile.mjs` automatically because its name follows
the `@*/pnpm-plugin-*` pattern. `pnpm-lock.yaml` pins the resolved version;
`pnpm update @hyphened/pnpm-plugin-config` moves the project to the newest
release.

A project that sets `minimumReleaseAge` installs a new release only after that
age has passed.

## Patches

| Dependency | Change |
| --- | --- |
| `arktype@^2.2.0` | A `default` in tuple metadata applies as the property's default. |

```ts
import { type } from "arktype";

const user = type({ name: ["string", "@", { default: "Anonymous" }] });

user({}); // { name: "Anonymous" }
```

The hook sets `allowUnusedPatches`, so a project without a patched dependency
still installs. A patch that no longer applies to a matching version fails the
install. A project's own `patchedDependencies` entry for the same key takes
precedence over the shared one.
