---
name: Arena Battle ABI pattern
description: How to define contract ABIs for the arena-battle frontend — parseAbi() fails on structs/tuples
---

Use JSON ABI `as const` arrays in `artifacts/arena-battle/src/lib/contracts.ts`. Never use viem's `parseAbi()` human-readable format when contracts return structs/tuples.

**Why:** viem's `parseAbi()` cannot parse named tuple fields in return types (e.g. `tuple(uint8 class_, ...)`) and throws at runtime. JSON ABI with `components` arrays handles this correctly.

**How to apply:** Any new contract interaction that returns a struct must use the full JSON ABI format with `components: [{ name: ..., type: ... }]`.
