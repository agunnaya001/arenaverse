import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Types
export interface UserProfile {
  id: string;
  wallet_address: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  total_xp: number;
  level: number;
  arena_tokens_earned: number;
  created_at: string;
  updated_at: string;
}

export interface Champion {
  id: string;
  user_id: string;
  nft_id: string;
  name: string;
  class: string;
  rarity: string;
  level: number;
  experience: number;
  health: number;
  mana: number;
  attack: number;
  defense: number;
  speed: number;
  skill_ids?: string[];
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  class_requirement: string;
  description?: string;
  damage_type?: string;
  base_damage?: number;
  mana_cost: number;
  cooldown_seconds: number;
  effect_json?: any;
}

export interface BattleRecord {
  id: string;
  player_id: string;
  opponent_id?: string;
  champion_id: string;
  opponent_champion_id?: string;
  battle_type: string;
  result: string;
  xp_earned?: number;
  arena_tokens_earned?: number;
  duration_seconds?: number;
  battle_log?: any;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  unlocked_at: string;
}

export interface StakingRecord {
  id: string;
  user_id: string;
  champion_id: string;
  arena_tokens_staked: number;
  reward_multiplier: number;
  staked_at: string;
  unlocked_at?: string;
  claimed_rewards: number;
}
