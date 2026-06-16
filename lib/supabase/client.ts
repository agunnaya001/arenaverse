import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create clients safely - allow building without env vars
let supabaseClient: any = null;
let supabaseAdminClient: any = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  console.warn('[Supabase] Failed to initialize client');
}

try {
  if (supabaseUrl && supabaseServiceRoleKey) {
    supabaseAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey);
  }
} catch (error) {
  console.warn('[Supabase] Failed to initialize admin client');
}

// Create a simple mock that won't cause serialization issues
const mockDb = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: [], error: null }),
    delete: () => Promise.resolve({ data: [], error: null }),
  }),
};

// Export clients - use real if available, otherwise mock (for build time)
export const supabase = supabaseClient || mockDb;
export const supabaseAdmin = supabaseAdminClient || mockDb;

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

export interface SIWESession {
  id: string;
  user_id: string;
  message: string;
  signature: string;
  nonce: string;
  chain_id: number;
  created_at: string;
  verified_at?: string;
  expires_at?: string;
}

export interface Quest {
  id: string;
  name: string;
  description?: string;
  quest_type: string;
  difficulty: string;
  reward_xp: number;
  reward_tokens: number;
  reward_nft?: string;
  requirements?: any;
  active: boolean;
  created_at: string;
}

export interface QuestProgress {
  id: string;
  user_id: string;
  quest_id: string;
  progress: number;
  completed_at?: string;
  rewards_claimed: boolean;
  started_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  total_xp: number;
  level: number;
  wins: number;
  win_rate: number;
  total_battles: number;
  arena_tokens_earned: number;
  updated_at: string;
}

export interface RewardHistory {
  id: string;
  user_id: string;
  reward_type: string;
  reward_amount: number;
  source_id?: string;
  source_type?: string;
  transaction_hash?: string;
  claimed_at: string;
  created_at: string;
}

export interface BlockchainEvent {
  id: string;
  event_type: string;
  contract_address: string;
  transaction_hash?: string;
  block_number?: number;
  log_index?: number;
  data: any;
  processed: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_user_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
