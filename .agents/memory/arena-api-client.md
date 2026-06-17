---
name: Arena Battle api-client-react rebuild
description: When to rebuild the api-client-react dist after adding orval-generated hooks
---

After adding new hooks to `lib/api-client-react/src/generated/api.ts`, run `pnpm exec tsc --build` inside `lib/api-client-react/` to regenerate the dist declarations. TypeScript in arena-battle reads from `dist/`, not `src/`.

**Why:** The package.json exports `./src/index.ts` for runtime but arena-battle's tsconfig reads compiled declarations from `dist/`. Without rebuilding, new hooks don't appear in TypeScript's type resolution.

**How to apply:** After any orval codegen or manual hook addition, rebuild before running `tsc --noEmit` on the frontend.
