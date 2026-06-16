import { supabase } from '@/lib/supabase/client';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  class: string;
  level: number;
  stats: {
    attack: number;
    defense: number;
    speed: number;
    hp: number;
  };
}

const CHAMPION_CLASSES = ['Warrior', 'Mage', 'Archer', 'Paladin', 'Rogue'];
const ELEMENTS = ['Fire', 'Ice', 'Lightning', 'Nature', 'Void'];

export function generateRandomStats(rarity: string): NFTMetadata['stats'] {
  const rarityMultiplier = {
    'Common': 1.0,
    'Rare': 1.5,
    'Epic': 2.0,
    'Legendary': 3.0,
  }[rarity] || 1.0;

  const baseStats = {
    attack: Math.floor(50 + Math.random() * 100),
    defense: Math.floor(30 + Math.random() * 80),
    speed: Math.floor(20 + Math.random() * 60),
    hp: Math.floor(100 + Math.random() * 200),
  };

  return {
    attack: Math.floor(baseStats.attack * rarityMultiplier),
    defense: Math.floor(baseStats.defense * rarityMultiplier),
    speed: Math.floor(baseStats.speed * rarityMultiplier),
    hp: Math.floor(baseStats.hp * rarityMultiplier),
  };
}

export function generateRandomRarity(): NFTMetadata['rarity'] {
  const roll = Math.random();
  if (roll < 0.6) return 'Common';
  if (roll < 0.8) return 'Rare';
  if (roll < 0.95) return 'Epic';
  return 'Legendary';
}

export function generateChampionNFT(options?: {
  name?: string;
  class?: string;
  level?: number;
}): NFTMetadata {
  const rarity = generateRandomRarity();
  const championClass = options?.class || CHAMPION_CLASSES[Math.floor(Math.random() * CHAMPION_CLASSES.length)];
  const element = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
  const level = options?.level || Math.floor(Math.random() * 30) + 1;
  
  const championName = options?.name || `${element} ${championClass}`;
  const stats = generateRandomStats(rarity);

  const rarityEmoji = {
    'Common': '⚪',
    'Rare': '🔵',
    'Epic': '🟣',
    'Legendary': '🟡',
  }[rarity];

  return {
    name: championName,
    description: `A ${rarity} ${championClass} Champion of level ${level}. ${element}-aligned warrior with exceptional combat abilities.`,
    image: `https://api.placeholder.com/400?text=${encodeURIComponent(championName)}`,
    attributes: [
      { trait_type: 'Class', value: championClass },
      { trait_type: 'Element', value: element },
      { trait_type: 'Rarity', value: rarity },
      { trait_type: 'Level', value: level },
      { trait_type: 'Attack', value: stats.attack },
      { trait_type: 'Defense', value: stats.defense },
      { trait_type: 'Speed', value: stats.speed },
      { trait_type: 'HP', value: stats.hp },
    ],
    rarity,
    class: championClass,
    level,
    stats,
  };
}

export function generateBattleNFT(options?: {
  name?: string;
  difficulty?: number;
}): NFTMetadata {
  const difficulty = options?.difficulty || Math.floor(Math.random() * 5) + 1;
  const rarity = difficulty <= 2 ? 'Common' : difficulty <= 3 ? 'Rare' : difficulty === 4 ? 'Epic' : 'Legendary';
  const stats = generateRandomStats(rarity);

  const battleName = options?.name || `Battle Trophy #${Math.floor(Math.random() * 10000)}`;

  return {
    name: battleName,
    description: `A commemorative NFT from a ${difficulty}-difficulty battle. Represents victory and skillful gameplay.`,
    image: `https://api.placeholder.com/400?text=Battle+Trophy`,
    attributes: [
      { trait_type: 'Difficulty', value: difficulty },
      { trait_type: 'Rarity', value: rarity },
      { trait_type: 'Reward Multiplier', value: (difficulty * 0.5).toFixed(1) },
    ],
    rarity,
    class: 'Battle Certificate',
    level: difficulty,
    stats,
  };
}

export async function mintChampionNFT(
  walletAddress: string,
  championData: NFTMetadata
): Promise<{ success: boolean; tokenId?: string; error?: string }> {
  try {
    // Store metadata in database
    const { data, error: dbError } = await supabase
      .from('champions')
      .insert({
        user_id: walletAddress,
        name: championData.name,
        class: championData.class,
        level: championData.level,
        rarity: championData.rarity,
        metadata: championData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) throw new Error(`Database error: ${dbError.message}`);

    return { success: true, tokenId: data?.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mint NFT',
    };
  }
}

export async function mintBattleRewardNFT(
  walletAddress: string,
  battleId: string,
  battleData: NFTMetadata
): Promise<{ success: boolean; tokenId?: string; error?: string }> {
  try {
    const { data, error: dbError } = await supabase
      .from('battle_rewards')
      .insert({
        user_id: walletAddress,
        battle_id: battleId,
        reward_type: 'NFT',
        metadata: battleData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) throw new Error(`Database error: ${dbError.message}`);

    return { success: true, tokenId: data?.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mint battle NFT',
    };
  }
}
