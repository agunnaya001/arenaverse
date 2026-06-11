'use client';

import { ethers } from 'ethers';

// Contract addresses on Base
export const CONTRACTS = {
  MARKETPLACE: '0x67817157Dd6E5945ac2fAf1a822e7f1dE26C698E',
  ARENA_TOKEN: '0x3b855F88CB93aA642EaEB13F59987C552Fc614b5',
  ARENA_CHAMPION: '0x68f08b005b09B0F7D07E1c0B5CDe18E43CE2486A',
  ARENA_BATTLE: '0xF6fc2B6a306B626548ca9dF25B31a22D0f8971CF',
  ARENA_PVP: '0xd0C4Af12E95f9590e7314D079C58597771E57533',
} as const;

// Base network configuration
export const BASE_CHAIN_ID = 8453;
export const BASE_RPC = 'https://mainnet.base.org';

// Admin addresses - set via environment variable
export const ADMIN_ADDRESSES = (process.env.NEXT_PUBLIC_ADMIN_ADDRESSES || '').split(',').filter(Boolean).map(a => a.toLowerCase());

// Rarity System
export enum ChampionRarity {
  COMMON = 0,
  RARE = 1,
  EPIC = 2,
  LEGENDARY = 3,
  MYTHIC = 4,
}

export const RARITY_NAMES: Record<ChampionRarity, string> = {
  [ChampionRarity.COMMON]: 'Common',
  [ChampionRarity.RARE]: 'Rare',
  [ChampionRarity.EPIC]: 'Epic',
  [ChampionRarity.LEGENDARY]: 'Legendary',
  [ChampionRarity.MYTHIC]: 'Mythic',
};

export const RARITY_COLORS: Record<ChampionRarity, string> = {
  [ChampionRarity.COMMON]: '#888888',
  [ChampionRarity.RARE]: '#4169E1',
  [ChampionRarity.EPIC]: '#9370DB',
  [ChampionRarity.LEGENDARY]: '#FFD700',
  [ChampionRarity.MYTHIC]: '#FF1493',
};

// Trait type for NFT Factory
export interface TraitDefinition {
  name: string;
  description?: string;
  values: TraitValue[];
}

export interface TraitValue {
  name: string;
  rarity: number;
  colorHint?: string;
}

// NFT Collection for Factory
export interface NFTCollection {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  creator: string;
  contractAddress?: string;
  traits: TraitDefinition[];
  maxSupply: number;
  royaltyPercentage: number;
  baseUri?: string;
  createdAt: number;
  totalMinted: number;
}

// Generated NFT Metadata
export interface GeneratedNFT {
  tokenId?: string;
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
  rarity: ChampionRarity;
  rarityScore: number;
}

// Types for champions
export interface Champion {
  tokenId: bigint;
  owner: string;
  rarity: ChampionRarity;
  power: number;
  name: string;
  class: string;
  attributes: {
    strength: number;
    agility: number;
    intelligence: number;
    vitality: number;
  };
  imageUrl: string;
  metadata?: Record<string, any>;
}

export interface MarketplaceListing {
  id: bigint;
  tokenId: bigint;
  seller: string;
  price: bigint;
  active: boolean;
  displayChampion?: Champion;
}

export interface PVPChallenge {
  id: bigint;
  challenger: string;
  opponent?: string;
  wager: bigint;
  status: 'OPEN' | 'ACCEPTED' | 'COMPLETED';
  winner?: string;
  championId: bigint;
  createdAt: number;
}

// ERC20 ABI (ArenaToken)
export const ARENA_TOKEN_ABI = [] as const;

// ERC721 ABI (ArenaChampion NFT)
export const ARENA_CHAMPION_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function approve(address to, uint256 tokenId)',
  'function transferFrom(address from, address to, uint256 tokenId)',
  'function totalSupply() view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function getChampionStats(uint256 tokenId) view returns (uint256 strength, uint256 agility, uint256 intelligence, uint256 vitality, uint256 level, uint256 experience)',
  'function mintChampion() payable returns (uint256)',
  'function upgradeChampion(uint256 tokenId) payable',
] as const;

// Arena Battle ABI
export const ARENA_BATTLE_ABI = [
  'function enterBattle(uint256 championId) payable returns (uint256 battleId)',
  'function getBattleResult(uint256 battleId) view returns (address winner, address loser, uint256 reward, bool completed)',
  'function getActiveBattles() view returns (uint256[])',
  'function getPlayerStats(address player) view returns (uint256 wins, uint256 losses, uint256 totalRewards)',
] as const;

// Arena PVP ABI
export const ARENA_PVP_ABI = [
  'function createChallenge(uint256 championId, uint256 wagerAmount) payable returns (uint256 challengeId)',
  'function acceptChallenge(uint256 challengeId, uint256 championId) payable',
  'function cancelChallenge(uint256 challengeId)',
  'function getOpenChallenges() view returns (tuple(uint256 id, address challenger, uint256 championId, uint256 wagerAmount, bool isActive)[])',
  'function getPVPRecord(address player) view returns (uint256 wins, uint256 losses, uint256 totalWagered, uint256 totalWon)',
] as const;

// Arena Marketplace ABI
export const ARENA_MARKETPLACE_ABI = [
  'function listItem(address nftContract, uint256 tokenId, uint256 price) returns (uint256 listingId)',
  'function buyItem(uint256 listingId) payable',
  'function cancelListing(uint256 listingId)',
  'function getActiveListings() view returns (tuple(uint256 id, address seller, address nftContract, uint256 tokenId, uint256 price, bool isActive)[])',
  'function getListing(uint256 listingId) view returns (address seller, address nftContract, uint256 tokenId, uint256 price, bool isActive)',
  'function stake(uint256 amount)',
  'function unstake(uint256 amount)',
  'function getStakedAmount(address account) view returns (uint256)',
  'function getPendingRewards(address account) view returns (uint256)',
  'function claimRewards()',
] as const;

// Utility functions
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTokenAmount(amount: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals);
  const integerPart = amount / divisor;
  const fractionalPart = amount % divisor;
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0').slice(0, 4);
  return `${integerPart.toLocaleString()}.${fractionalStr}`;
}

export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  const [integer, fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(integer + paddedFraction);
}

export function calculatePowerRating(attributes: { strength: number; agility: number; intelligence: number; vitality: number }): number {
  return (attributes.strength + attributes.agility + attributes.intelligence + attributes.vitality) / 4;
}

export function isAdmin(address?: string): boolean {
  if (!address) return false;
  return ADMIN_ADDRESSES.includes(address.toLowerCase());
}
