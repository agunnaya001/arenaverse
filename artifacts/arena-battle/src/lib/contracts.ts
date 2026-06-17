// Contract addresses — hardcoded to deployed Base Mainnet contracts
export const CONTRACT_ADDRESSES = {
  ARENA_COIN: (import.meta.env.VITE_ARENA_COIN_ADDRESS || '0x3b855F88CB93aA642EaEB13F59987C552Fc614b5') as `0x${string}`,
  FIGHTER_NFT: (import.meta.env.VITE_ARENA_FIGHTER_NFT_ADDRESS || '0x68f08b005b09B0F7D07E1c0B5CDe18E43CE2486A') as `0x${string}`,
  BATTLE: (import.meta.env.VITE_ARENA_BATTLE_ADDRESS || '0xF6fc2B6a306B626548ca9dF25B31a22D0f8971CF') as `0x${string}`,
  MARKETPLACE: (import.meta.env.VITE_ARENA_MARKETPLACE_ADDRESS || '0x67817157Dd6E5945ac2fAf1a822e7f1dE26C698E') as `0x${string}`,
  PVP: (import.meta.env.VITE_ARENA_PVP_ADDRESS || '0xd0C4Af12E95f9590e7314D079C58597771E57533') as `0x${string}`,
} as const;

export const BASE_CHAIN_ID = 8453;

export const ARENA_COIN_ABI = [
  { type: 'function', name: 'name', inputs: [], outputs: [{ type: 'string' }], stateMutability: 'view' },
  { type: 'function', name: 'symbol', inputs: [], outputs: [{ type: 'string' }], stateMutability: 'view' },
  { type: 'function', name: 'decimals', inputs: [], outputs: [{ type: 'uint8' }], stateMutability: 'view' },
  { type: 'function', name: 'totalSupply', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'balanceOf', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'allowance', inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'approve', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'transfer', inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }], stateMutability: 'nonpayable' },
  { type: 'event', name: 'Transfer', inputs: [{ name: 'from', type: 'address', indexed: true }, { name: 'to', type: 'address', indexed: true }, { name: 'value', type: 'uint256', indexed: false }] },
  { type: 'event', name: 'Approval', inputs: [{ name: 'owner', type: 'address', indexed: true }, { name: 'spender', type: 'address', indexed: true }, { name: 'value', type: 'uint256', indexed: false }] },
] as const;

export const FIGHTER_NFT_ABI = [
  {
    type: 'function', name: 'mint', stateMutability: 'nonpayable',
    inputs: [{ name: 'to', type: 'address' }, { name: 'fighterClass', type: 'uint8' }, { name: 'tokenURI', type: 'string' }],
    outputs: [{ type: 'uint256' }],
  },
  { type: 'function', name: 'ownerOf', inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [{ type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'balanceOf', inputs: [{ name: 'owner', type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'tokenOfOwnerByIndex', inputs: [{ name: 'owner', type: 'address' }, { name: 'index', type: 'uint256' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'getTokensByOwner', inputs: [{ name: 'owner', type: 'address' }], outputs: [{ type: 'uint256[]' }], stateMutability: 'view' },
  {
    type: 'function', name: 'getFighterStats', stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple', name: 'stats',
        components: [
          { name: 'class_', type: 'uint8' },
          { name: 'attack', type: 'uint8' },
          { name: 'defense', type: 'uint8' },
          { name: 'speed', type: 'uint8' },
          { name: 'level', type: 'uint8' },
          { name: 'wins', type: 'uint256' },
          { name: 'losses', type: 'uint256' },
        ],
      },
    ],
  },
  { type: 'function', name: 'tokenURI', inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [{ type: 'string' }], stateMutability: 'view' },
  { type: 'event', name: 'FighterMinted', inputs: [{ name: 'owner', type: 'address', indexed: true }, { name: 'tokenId', type: 'uint256', indexed: true }, { name: 'class_', type: 'uint8', indexed: false }] },
  { type: 'event', name: 'Transfer', inputs: [{ name: 'from', type: 'address', indexed: true }, { name: 'to', type: 'address', indexed: true }, { name: 'tokenId', type: 'uint256', indexed: true }] },
] as const;

export const BATTLE_ABI = [
  { type: 'function', name: 'battle', inputs: [{ name: 'fighterId', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'cancelBattle', inputs: [], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'battleCount', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'STAKE_AMOUNT', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'REWARD_AMOUNT', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  {
    type: 'function', name: 'getPendingBattle', stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        type: 'tuple', name: 'pending',
        components: [
          { name: 'player', type: 'address' },
          { name: 'fighterId', type: 'uint256' },
          { name: 'stakedAmount', type: 'uint256' },
          { name: 'active', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'function', name: 'getPlayerStats', stateMutability: 'view',
    inputs: [{ name: 'player', type: 'address' }],
    outputs: [
      {
        type: 'tuple', name: 'stats',
        components: [
          { name: 'wins', type: 'uint256' },
          { name: 'losses', type: 'uint256' },
          { name: 'totalTokensEarned', type: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'function', name: 'getBattle', stateMutability: 'view',
    inputs: [{ name: 'battleId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple', name: 'battle',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'player1', type: 'address' },
          { name: 'player2', type: 'address' },
          { name: 'fighter1Id', type: 'uint256' },
          { name: 'fighter2Id', type: 'uint256' },
          { name: 'winner', type: 'address' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'resolved', type: 'bool' },
        ],
      },
    ],
  },
  { type: 'event', name: 'BattleResolved', inputs: [{ name: 'battleId', type: 'uint256', indexed: true }, { name: 'player1', type: 'address', indexed: true }, { name: 'player2', type: 'address', indexed: true }, { name: 'winner', type: 'address', indexed: false }, { name: 'fighter1Id', type: 'uint256', indexed: false }, { name: 'fighter2Id', type: 'uint256', indexed: false }] },
  { type: 'event', name: 'BattleQueued', inputs: [{ name: 'player', type: 'address', indexed: true }, { name: 'fighterId', type: 'uint256', indexed: true }] },
  { type: 'event', name: 'BattleCancelled', inputs: [{ name: 'player', type: 'address', indexed: true }, { name: 'fighterId', type: 'uint256', indexed: true }] },
] as const;

export const MARKETPLACE_ABI = [
  { type: 'function', name: 'listItem', inputs: [{ name: 'nftContract', type: 'address' }, { name: 'tokenId', type: 'uint256' }, { name: 'price', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'buyItem', inputs: [{ name: 'nftContract', type: 'address' }, { name: 'tokenId', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'cancelListing', inputs: [{ name: 'nftContract', type: 'address' }, { name: 'tokenId', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function', name: 'getListing', stateMutability: 'view',
    inputs: [{ name: 'nftContract', type: 'address' }, { name: 'tokenId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple', name: 'listing',
        components: [
          { name: 'seller', type: 'address' },
          { name: 'price', type: 'uint256' },
          { name: 'active', type: 'bool' },
        ],
      },
    ],
  },
  { type: 'event', name: 'ItemListed', inputs: [{ name: 'seller', type: 'address', indexed: true }, { name: 'nftContract', type: 'address', indexed: true }, { name: 'tokenId', type: 'uint256', indexed: true }, { name: 'price', type: 'uint256', indexed: false }] },
  { type: 'event', name: 'ItemSold', inputs: [{ name: 'buyer', type: 'address', indexed: true }, { name: 'nftContract', type: 'address', indexed: true }, { name: 'tokenId', type: 'uint256', indexed: true }, { name: 'price', type: 'uint256', indexed: false }] },
] as const;

export const PVP_ABI = [
  { type: 'function', name: 'challenge', inputs: [{ name: 'opponent', type: 'address' }, { name: 'myFighterId', type: 'uint256' }, { name: 'opponentFighterId', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'acceptChallenge', inputs: [{ name: 'challengeId', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'event', name: 'ChallengeIssued', inputs: [{ name: 'challengeId', type: 'uint256', indexed: true }, { name: 'challenger', type: 'address', indexed: true }, { name: 'opponent', type: 'address', indexed: true }] },
  { type: 'event', name: 'ChallengeResolved', inputs: [{ name: 'challengeId', type: 'uint256', indexed: true }, { name: 'winner', type: 'address', indexed: false }] },
] as const;

export const FIGHTER_CLASSES = {
  0: 'Warrior',
  1: 'Mage',
  2: 'Rogue',
} as const;

export const STAKE_AMOUNT = BigInt('10000000000000000000'); // 10 ARENA
export const REWARD_AMOUNT = BigInt('20000000000000000000'); // 20 ARENA
