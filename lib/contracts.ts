// Contract addresses on Base
export const CONTRACTS = {
  ArenaMarketplace: '0x67817157Dd6E5945ac2fAf1a822e7f1dE26C698E',
  ArenaToken: '0x3b855F88CB93aA642EaEB13F59987C552Fc614b5',
  ArenaChampion: '0x68f08b005b09B0F7D07E1c0B5CDe18E43CE2486A',
  ArenaBattle: '0xF6fc2B6a306B626548ca9dF25B31a22D0f8971CF',
  ArenaPVP: '0xd0C4Af12E95f9590e7314D079C58597771E57533',
} as const;

// Base network configuration
export const BASE_CHAIN = {
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://mainnet.base.org'] },
    public: { http: ['https://mainnet.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://basescan.org' },
  },
} as const;

// ERC20 ABI (ArenaToken)
export const ARENA_TOKEN_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// ERC721 ABI (ArenaChampion NFT)
export const ARENA_CHAMPION_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'index', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getChampionStats',
    outputs: [
      { name: 'strength', type: 'uint256' },
      { name: 'agility', type: 'uint256' },
      { name: 'intelligence', type: 'uint256' },
      { name: 'vitality', type: 'uint256' },
      { name: 'level', type: 'uint256' },
      { name: 'experience', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintChampion',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'upgradeChampion',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

// Arena Battle ABI
export const ARENA_BATTLE_ABI = [
  {
    inputs: [{ name: 'championId', type: 'uint256' }],
    name: 'enterBattle',
    outputs: [{ name: 'battleId', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'battleId', type: 'uint256' }],
    name: 'getBattleResult',
    outputs: [
      { name: 'winner', type: 'address' },
      { name: 'loser', type: 'address' },
      { name: 'reward', type: 'uint256' },
      { name: 'completed', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getActiveBattles',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'player', type: 'address' }],
    name: 'getPlayerStats',
    outputs: [
      { name: 'wins', type: 'uint256' },
      { name: 'losses', type: 'uint256' },
      { name: 'totalRewards', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Arena PVP ABI
export const ARENA_PVP_ABI = [
  {
    inputs: [
      { name: 'championId', type: 'uint256' },
      { name: 'wagerAmount', type: 'uint256' },
    ],
    name: 'createChallenge',
    outputs: [{ name: 'challengeId', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'challengeId', type: 'uint256' },
      { name: 'championId', type: 'uint256' },
    ],
    name: 'acceptChallenge',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'challengeId', type: 'uint256' }],
    name: 'cancelChallenge',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getOpenChallenges',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'challenger', type: 'address' },
          { name: 'championId', type: 'uint256' },
          { name: 'wagerAmount', type: 'uint256' },
          { name: 'isActive', type: 'bool' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'player', type: 'address' }],
    name: 'getPVPRecord',
    outputs: [
      { name: 'wins', type: 'uint256' },
      { name: 'losses', type: 'uint256' },
      { name: 'totalWagered', type: 'uint256' },
      { name: 'totalWon', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Arena Marketplace ABI
export const ARENA_MARKETPLACE_ABI = [
  {
    inputs: [
      { name: 'nftContract', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'price', type: 'uint256' },
    ],
    name: 'listItem',
    outputs: [{ name: 'listingId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'listingId', type: 'uint256' }],
    name: 'buyItem',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'listingId', type: 'uint256' }],
    name: 'cancelListing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getActiveListings',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'seller', type: 'address' },
          { name: 'nftContract', type: 'address' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'price', type: 'uint256' },
          { name: 'isActive', type: 'bool' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'listingId', type: 'uint256' }],
    name: 'getListing',
    outputs: [
      { name: 'seller', type: 'address' },
      { name: 'nftContract', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'price', type: 'uint256' },
      { name: 'isActive', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'getStakedAmount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'getPendingRewards',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// Helper to format addresses
export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Helper to format token amounts
export function formatTokenAmount(amount: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals);
  const integerPart = amount / divisor;
  const fractionalPart = amount % divisor;
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0').slice(0, 4);
  return `${integerPart.toLocaleString()}.${fractionalStr}`;
}

// Helper to parse token amounts
export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  const [integer, fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(integer + paddedFraction);
}
