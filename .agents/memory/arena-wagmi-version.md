---
name: Arena Battle wagmi version
description: wagmi version constraint for RainbowKit compatibility in arena-battle
---

wagmi must stay at `2.19.5` (not 3.x). RainbowKit 2.2.10 requires wagmi 2.x.

**Why:** RainbowKit 2.x has a peer dependency on wagmi 2.x. The `baseAccount` connector and wagmi 3.x are not compatible with RainbowKit 2.x.

**How to apply:** When updating dependencies in arena-battle, pin wagmi to `^2.19.5`.
