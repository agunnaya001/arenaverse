# ⚔️ Arena Battle — 3D Blockchain Battle Game

[![Built on Base](https://img.shields.io/badge/Built%20on-Base%20Mainnet-0052FF?style=for-the-badge&logo=coinbase&logoColor=white)](https://base.org)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![wagmi](https://img.shields.io/badge/wagmi-2.x-1C1C1C?style=for-the-badge)](https://wagmi.sh)
[![RainbowKit](https://img.shields.io/badge/RainbowKit-2.x-7B3FE4?style=for-the-badge)](https://rainbowkit.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Hardhat](https://img.shields.io/badge/Hardhat-EVM%20Dev-F0DB4F?style=for-the-badge)](https://hardhat.org)
[![pnpm](https://img.shields.io/badge/pnpm-monorepo-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> A fully on-chain cyberpunk battle game. Mint NFT fighters, stake ARENA tokens, and duel opponents in a live 3D WebGL arena — all on Base Mainnet.

---

## 🎮 Features

| Feature | Description |
|---|---|
| 🧬 **NFT Fighters** | Mint Warrior, Mage, or Rogue with randomized on-chain stats |
| ⚔️ **3D Battle Arena** | Real-time WebGL combat scene with animations, health bars & effects |
| 💰 **Token Staking** | Stake 10 ARENA per battle — winner earns 20 ARENA |
| 🏆 **Global Leaderboard** | Ranked by wins, backed by PostgreSQL via Express API |
| 🕵️ **Operative Dossier** | Profile page with fighter roster, stats, win rate & combat log |
| 📱 **Telegram Mini App** | Native TMA support with user identity from Telegram |
| 🔗 **Base Mainnet** | Sub-$0.01 gas, ~2s finality via Coinbase's Layer 2 |

---

## 🏗 Architecture

```
arena-battle/                    # pnpm monorepo root
├── artifacts/
│   ├── arena-battle/            # React + Vite frontend (Telegram Mini App)
│   │   ├── src/
│   │   │   ├── pages/           # Home, Mint, Battle, Leaderboard, Profile
│   │   │   ├── components/      # ThreeArena (WebGL), NeonCard, NeonButton
│   │   │   ├── hooks/           # wagmi contract hooks
│   │   │   └── lib/contracts.ts # ABIs + deployed addresses
│   │   └── public/images/       # Generated cyberpunk fighter assets
│   └── api-server/              # Express REST API
│       └── src/routes/          # leaderboard, battles, fighters, health
├── contracts/                   # Hardhat project (standalone)
│   ├── contracts/               # Solidity smart contracts
│   ├── scripts/deploy.js        # Deployment script
│   └── scripts/verify.js        # BaseScan verification
└── lib/
    └── db/                      # Drizzle ORM + PostgreSQL schema
```

---

## 📋 Smart Contracts (Base Mainnet)

| Contract | Address | Description |
|---|---|---|
| **ArenaCoin** (ERC-20) | [`0x3b855F88...`](https://basescan.org/address/0x3b855F88CB93aA642EaEB13F59987C552Fc614b5) | ARENA utility token (1M supply) |
| **ArenaFighterNFT** (ERC-721) | [`0x68f08b00...`](https://basescan.org/address/0x68f08b005b09B0F7D07E1c0B5CDe18E43CE2486A) | Fighter NFTs with on-chain stats |
| **ArenaBattle** | [`0xF6fc2B6a...`](https://basescan.org/address/0xF6fc2B6a306B626548ca9dF25B31a22D0f8971CF) | Battle matchmaking & resolution |
| **ArenaMarketplace** | [`0x67817157...`](https://basescan.org/address/0x67817157Dd6E5945ac2fAf1a822e7f1dE26C698E) | NFT marketplace |
| **ArenaPVP** | [`0xd0C4Af12...`](https://basescan.org/address/0xd0C4Af12E95f9590e7314D079C58597771E57533) | Direct player challenges |

---

## 🔧 Tech Stack

**Frontend**
- React 18 + Vite 6
- Three.js via `@react-three/fiber` + `@react-three/drei` (3D arena)
- Framer Motion (animations)
- wagmi v2 + RainbowKit v2 (wallet connection)
- viem (Ethereum utilities)
- TailwindCSS v4 (Orbitron + Rajdhani fonts)
- Telegram Mini App SDK

**Backend**
- Node.js + Express
- Drizzle ORM + PostgreSQL
- Auto-generated OpenAPI client

**Blockchain**
- Solidity ^0.8.20
- OpenZeppelin Contracts
- Hardhat + ethers.js
- Base Mainnet (Chain ID: 8453)

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- pnpm ≥ 9
- A wallet with some ETH on Base Mainnet

### Install & Run

```bash
# Install all workspace dependencies
pnpm install

# Start the frontend (port from $PORT env var)
pnpm --filter @workspace/arena-battle run dev

# Start the API server
pnpm --filter @workspace/api-server run dev
```

### Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect Cloud project ID | Recommended |
| `VITE_ARENA_COIN_ADDRESS` | Override ArenaCoin address | Optional |
| `VITE_ARENA_FIGHTER_NFT_ADDRESS` | Override FighterNFT address | Optional |
| `VITE_ARENA_BATTLE_ADDRESS` | Override ArenaBattle address | Optional |

---

## 📜 Contract Deployment

```bash
cd contracts
npm install

# Deploy to Base Mainnet
PRIVATE_KEY=0x... npx hardhat run scripts/deploy.js --network base

# Verify on BaseScan
BASESCAN_API_KEY=... npx hardhat run scripts/verify.js --network base
```

---

## 🎮 Game Flow

```
1. Connect Wallet (MetaMask / Coinbase Wallet / WalletConnect)
       ↓
2. Mint Fighter NFT  →  Choose class (Warrior / Mage / Rogue)
                     →  Pay 0.01 ETH mint fee
                     →  Receive NFT with randomized stats
       ↓
3. Enter Combat Zone →  Select fighter from roster
                     →  Approve 10 ARENA stake
                     →  Call battle() on ArenaBattle contract
                     →  Watch 3D combat animation
                     →  Win 20 ARENA or lose 10 ARENA
       ↓
4. Check Leaderboard →  Global ranking by wins & ARENA earned
5. View Profile      →  Full fighter roster, stats, combat log
```

---

## 🛡 Fighter Classes

| Class | ATK | DEF | SPD | Playstyle |
|---|---|---|---|---|
| ⚔️ Warrior | 70–100 | 50–80 | 30–55 | Tank — high health, heavy strikes |
| 🔮 Mage | 90–120 | 20–40 | 50–70 | Glass cannon — burst damage |
| 🗡️ Rogue | 60–90 | 30–50 | 80–100 | Speed — critical strikes first |

---

## 🔐 Security

- Smart contracts use OpenZeppelin audited implementations
- ERC-20 approve → transfer pattern prevents unauthorized token movement
- Fighter stats generated via on-chain pseudo-randomness (block data)
- All state transitions guarded by `require` checks

---

## 📄 License

MIT © 2026 Arena Battle

---

<div align="center">
  <strong>Built with ⚔️ on Base Mainnet</strong><br/>
  <a href="https://base.org">base.org</a> · <a href="https://basescan.org">basescan.org</a>
</div>
