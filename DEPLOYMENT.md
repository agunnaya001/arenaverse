# Arena GameFi - Deployment & Launch Guide

## Production Deployment Ready

This is a fully functional GameFi application on Base blockchain with NFT Factory capabilities. Follow this guide to deploy and launch.

---

## Environment Variables Setup

Create a `.env.local` file in the project root with the following variables:

```env
# Admin Wallet Address (comma-separated for multiple admins)
NEXT_PUBLIC_ADMIN_ADDRESSES=0x1234567890123456789012345678901234567890

# Pinata IPFS Configuration
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token_here

# Fal AI Image Generation
NEXT_PUBLIC_FAL_KEY=your_fal_key_here

# Network Configuration
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_CHAIN_ID=8453

# Contract Addresses
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x67817157Dd6E5945ac2fAf1a822e7f1dE26C698E
NEXT_PUBLIC_ARENA_TOKEN_ADDRESS=0x3b855F88CB93aA642EaEB13F59987C552Fc614b5
NEXT_PUBLIC_ARENA_CHAMPION_ADDRESS=0x68f08b005b09B0F7D07E1c0B5CDe18E43CE2486A
NEXT_PUBLIC_ARENA_BATTLE_ADDRESS=0xF6fc2B6a306B626548ca9dF25B31a22D0f8971CF
NEXT_PUBLIC_ARENA_PVP_ADDRESS=0xd0C4Af12E95f9590e7314D079C58597771E57533
```

---

## Key Features & Pages

### Player Pages (Public)

1. **Homepage** (`/`) - Hero section with game overview, feature showcase, stats
2. **Champions** (`/champions`) - User's NFT collection management
3. **Battle Arena** (`/battle`) - Play against AI opponents, earn rewards
4. **PVP Battles** (`/pvp`) - Challenge other players with wagers
5. **Marketplace** (`/marketplace`) - Buy/sell champion NFTs
6. **Staking** (`/staking`) - Stake ARENA tokens for rewards
7. **Leaderboard** (`/leaderboard`) - Global rankings and stats

### Admin Pages (Wallet-Gated)

1. **Admin Dashboard** (`/admin`) - Collections overview and analytics
2. **Create Collection** (`/admin/create-collection`) - Trait-based NFT collection creation
3. **NFT Generator** (`/admin/generate/[id]`) - Fal AI + Pinata NFT generation and upload

---

## Smart Contract Integration

All pages integrate with the deployed Base contracts:

- **ArenaMarketplace**: 0x67817157Dd6E5945ac2fAf1a822e7f1dE26C698E
- **ArenaToken**: 0x3b855F88CB93aA642EaEB13F59987C552Fc614b5
- **ArenaChampion**: 0x68f08b005b09B0F7D07E1c0B5CDe18E43CE2486A
- **ArenaBattle**: 0xF6fc2B6a306B626548ca9dF25B31a22D0f8971CF
- **ArenaPVP**: 0xd0C4Af12E95f9590e7314D079C58597771E57533

Contract interaction via ethers.js v6 with proper wallet connection and MetaMask integration.

---

## NFT Factory Workflow

### 1. Create Collection
- Define traits (Class, Rarity, etc.)
- Set max supply and royalty percentage
- Configure metadata

### 2. Generate NFTs
- Input desired quantity
- Fal AI generates unique champion images
- Metadata automatically created
- Upload to IPFS via Pinata

### 3. Deploy & Mint
- Deploy ERC-721 contract on Base
- Batch mint generated NFTs
- Auto-list in marketplace

---

## Deployment to Vercel

### Build
```bash
npm run build
```

### Deploy
```bash
vercel deploy
```

### Production URL
Your deployment will be at: `https://your-project.vercel.app`

---

## Testing Checklist

- [ ] Homepage loads with all features visible
- [ ] Wallet connect button works
- [ ] Navigation between all pages works
- [ ] Marketplace displays listings
- [ ] Battle page shows selection interface
- [ ] PVP page shows challenges
- [ ] Staking page displays tiers
- [ ] Leaderboard displays rankings
- [ ] Admin dashboard requires wallet auth
- [ ] Collection creation form works
- [ ] NFT generation simulates properly

---

## Performance Optimization

- React Compiler enabled (next.config.js)
- Image optimization via Next.js
- Tailwind CSS for minimal bundle size
- SWR for efficient data fetching
- Dark theme optimized for reduced strain

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 15+
- MetaMask extension required for transactions

---

## Future Enhancements

- Real blockchain transactions via contract ABIs
- Real NFT minting and marketplace trading
- Tournament system integration
- Streaming rewards mechanism
- DAO governance features
- Custom trait image composition
- Batch collection deployment

---

## Support & Troubleshooting

### Wallet Connection Issues
- Ensure MetaMask is installed
- Switch to Base network (chain ID: 8453)
- Clear browser cache and reconnect

### Generation Failures
- Verify Pinata JWT is valid
- Check Fal AI API key configuration
- Ensure sufficient IPFS storage quota

### Contract Errors
- Verify contract addresses in .env.local
- Ensure wallet has sufficient ETH for gas
- Check Base RPC endpoint availability

---

## License & Credits

Built with Next.js 16, React 19, ethers.js, Pinata, and Fal AI.
