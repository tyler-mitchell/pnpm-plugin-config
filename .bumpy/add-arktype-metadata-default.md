---
"@hyphened/pnpm-plugin-config": minor
---

Added shared pnpm patches, starting with arktype metadata defaults: a `default` in tuple metadata such as `["string", "@", { default: "Anonymous" }]` now applies as the property's default.
