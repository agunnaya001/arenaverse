import { parseAbi } from 'viem';

export const CONTRACT_ADDRESSES = {
  ARENA_COIN: (import.meta.env.VITE_ARENA_COIN_ADDRESS || '0x0000000000000000000000000000000000000001') as `0x${string}`,
  FIGHTER_NFT: (import.meta.env.VITE_ARENA_FIGHTER_NFT_ADDRESS || '0x0000000000000000000000000000000000000002') as `0x${string}`,
  BATTLE: (import.meta.env.VITE_ARENA_BATTLE_ADDRESS || '0x0000000000000000000000000000000000000003') as `0x${string}`,
};

export const ARENA_COIN_ABI = parseAbi([
  'function name() external view returns (string)',
  'function symbol() external view returns (string)',
  'function decimals() external view returns (uint8)',
  'function totalSupply() external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
]);

export const FIGHTER_NFT_ABI = parseAbi([
  'function mint(address to, uint8 class_, string memory tokenURI_) external returns (uint256)',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)',
  'function getTokensByOwner(address owner_) external view returns (uint256[])',
  'function getFighterStats(uint256 tokenId) external view returns (tuple(uint8 class_, uint8 attack, uint8 defense, uint8 speed, uint8 level, uint256 wins, uint256 losses))',
  'function tokenURI(uint256 tokenId) external view returns (string)',
  'event FighterMinted(address indexed owner, uint256 indexed tokenId, uint8 class_)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
]);

export const BATTLE_ABI = parseAbi([
  'function battle(uint256 fighterId) external',
  'function cancelBattle() external',
  'function getPendingBattle() external view returns (tuple(address player, uint256 fighterId, uint256 stakedAmount, bool active))',
  'function getPlayerStats(address player) external view returns (tuple(uint256 wins, uint256 losses, uint256 totalTokensEarned))',
  'function getBattle(uint256 battleId) external view returns (tuple(uint256 id, address player1, address player2, uint256 fighter1Id, uint256 fighter2Id, address winner, uint256 timestamp, bool resolved))',
  'function battleCount() external view returns (uint256)',
  'function STAKE_AMOUNT() external view returns (uint256)',
  'function REWARD_AMOUNT() external view returns (uint256)',
  'event BattleResolved(uint256 indexed battleId, address indexed player1, address indexed player2, address winner, uint256 fighter1Id, uint256 fighter2Id)',
  'event BattleQueued(address indexed player, uint256 indexed fighterId)',
  'event BattleCancelled(address indexed player, uint256 indexed fighterId)',
]);

export const FIGHTER_CLASSES = {
  0: 'Warrior',
  1: 'Mage',
  2: 'Rogue'
} as const;

export const STAKE_AMOUNT = BigInt('10000000000000000000'); // 10 ARENA
export const REWARD_AMOUNT = BigInt('20000000000000000000'); // 20 ARENA
