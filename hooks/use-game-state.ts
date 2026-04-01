'use client';

import { useState, useCallback, useEffect } from 'react';
import useSWR from 'swr';

// Types
export interface Champion {
  id: number;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  class: 'Warrior' | 'Mage' | 'Rogue' | 'Paladin';
  level: number;
  experience: number;
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    vitality: number;
  };
  imageUrl: string;
  isStaked: boolean;
}

export interface Listing {
  id: number;
  seller: string;
  championId: number;
  price: string;
  champion: Champion;
  createdAt: Date;
}

export interface Challenge {
  id: number;
  challenger: string;
  championId: number;
  wagerAmount: string;
  champion: Champion;
  isActive: boolean;
}

export interface BattleResult {
  id: number;
  winner: string;
  loser: string;
  reward: string;
  timestamp: Date;
  winnerChampion: Champion;
  loserChampion: Champion;
}

export interface PlayerStats {
  wins: number;
  losses: number;
  totalRewards: string;
  rank: number;
  pvpWins: number;
  pvpLosses: number;
  totalWagered: string;
  totalWon: string;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  wins: number;
  losses: number;
  winRate: number;
  totalRewards: string;
}

// Mock data generators
const CHAMPION_NAMES = [
  'Shadowblade', 'Ironforge', 'Flameheart', 'Frostweaver',
  'Stormbringer', 'Nightwhisper', 'Sunkeeper', 'Voidwalker',
  'Thunderclap', 'Moonshade', 'Dawnbreaker', 'Darkseeker',
];

const CLASSES: Champion['class'][] = ['Warrior', 'Mage', 'Rogue', 'Paladin'];
const RARITIES: Champion['rarity'][] = ['Common', 'Rare', 'Epic', 'Legendary'];

function generateChampion(id: number): Champion {
  const rarityRoll = Math.random();
  let rarity: Champion['rarity'] = 'Common';
  if (rarityRoll > 0.95) rarity = 'Legendary';
  else if (rarityRoll > 0.8) rarity = 'Epic';
  else if (rarityRoll > 0.5) rarity = 'Rare';

  const baseStats = {
    Common: 10,
    Rare: 15,
    Epic: 20,
    Legendary: 30,
  };

  const base = baseStats[rarity];

  return {
    id,
    name: `${CHAMPION_NAMES[id % CHAMPION_NAMES.length]} #${id}`,
    rarity,
    class: CLASSES[id % CLASSES.length],
    level: Math.floor(Math.random() * 50) + 1,
    experience: Math.floor(Math.random() * 10000),
    stats: {
      strength: base + Math.floor(Math.random() * 20),
      agility: base + Math.floor(Math.random() * 20),
      intelligence: base + Math.floor(Math.random() * 20),
      vitality: base + Math.floor(Math.random() * 20),
    },
    imageUrl: `/champions/${(id % 8) + 1}.jpg`,
    isStaked: Math.random() > 0.8,
  };
}

function generateMockAddress(): string {
  return '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

// Fetchers for SWR
const fetchChampions = async (address: string): Promise<Champion[]> => {
  // Simulate API call
  await new Promise((r) => setTimeout(r, 500));
  const count = Math.floor(Math.random() * 6) + 3;
  return Array.from({ length: count }, (_, i) => generateChampion(i + 1));
};

const fetchListings = async (): Promise<Listing[]> => {
  await new Promise((r) => setTimeout(r, 500));
  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    seller: generateMockAddress(),
    championId: i + 100,
    price: (Math.random() * 2 + 0.1).toFixed(4),
    champion: generateChampion(i + 100),
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 7),
  }));
};

const fetchChallenges = async (): Promise<Challenge[]> => {
  await new Promise((r) => setTimeout(r, 500));
  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    challenger: generateMockAddress(),
    championId: i + 200,
    wagerAmount: (Math.random() * 0.5 + 0.01).toFixed(4),
    champion: generateChampion(i + 200),
    isActive: true,
  }));
};

const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  await new Promise((r) => setTimeout(r, 500));
  return Array.from({ length: 20 }, (_, i) => {
    const wins = Math.floor(Math.random() * 100) + 10;
    const losses = Math.floor(Math.random() * 50) + 5;
    return {
      rank: i + 1,
      address: generateMockAddress(),
      wins,
      losses,
      winRate: Math.round((wins / (wins + losses)) * 100),
      totalRewards: (Math.random() * 50 + 1).toFixed(2),
    };
  }).sort((a, b) => b.wins - a.wins);
};

const fetchPlayerStats = async (address: string): Promise<PlayerStats> => {
  await new Promise((r) => setTimeout(r, 300));
  return {
    wins: Math.floor(Math.random() * 50) + 5,
    losses: Math.floor(Math.random() * 30) + 2,
    totalRewards: (Math.random() * 10 + 0.5).toFixed(4),
    rank: Math.floor(Math.random() * 100) + 1,
    pvpWins: Math.floor(Math.random() * 20) + 1,
    pvpLosses: Math.floor(Math.random() * 15) + 1,
    totalWagered: (Math.random() * 5 + 0.1).toFixed(4),
    totalWon: (Math.random() * 8 + 0.2).toFixed(4),
  };
};

// Custom hooks
export function useChampions(address: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    address ? ['champions', address] : null,
    ([, addr]) => fetchChampions(addr),
    { revalidateOnFocus: false }
  );

  return {
    champions: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useListings() {
  const { data, error, isLoading, mutate } = useSWR(
    'listings',
    fetchListings,
    { revalidateOnFocus: false }
  );

  return {
    listings: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useChallenges() {
  const { data, error, isLoading, mutate } = useSWR(
    'challenges',
    fetchChallenges,
    { revalidateOnFocus: false }
  );

  return {
    challenges: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useLeaderboard() {
  const { data, error, isLoading, mutate } = useSWR(
    'leaderboard',
    fetchLeaderboard,
    { revalidateOnFocus: false }
  );

  return {
    leaderboard: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

export function usePlayerStats(address: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    address ? ['playerStats', address] : null,
    ([, addr]) => fetchPlayerStats(addr),
    { revalidateOnFocus: false }
  );

  return {
    stats: data,
    isLoading,
    error,
    refresh: mutate,
  };
}

// Staking hook
export function useStaking(address: string | null) {
  const [stakedAmount, setStakedAmount] = useState('0');
  const [pendingRewards, setPendingRewards] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (address) {
      // Mock staking data
      setStakedAmount((Math.random() * 10000).toFixed(2));
      setPendingRewards((Math.random() * 100).toFixed(4));
    }
  }, [address]);

  const stake = useCallback(async (amount: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setStakedAmount((prev) => (parseFloat(prev) + parseFloat(amount)).toFixed(2));
    setIsLoading(false);
  }, []);

  const unstake = useCallback(async (amount: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setStakedAmount((prev) => Math.max(0, parseFloat(prev) - parseFloat(amount)).toFixed(2));
    setIsLoading(false);
  }, []);

  const claimRewards = useCallback(async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPendingRewards('0');
    setIsLoading(false);
  }, []);

  return {
    stakedAmount,
    pendingRewards,
    isLoading,
    stake,
    unstake,
    claimRewards,
  };
}
