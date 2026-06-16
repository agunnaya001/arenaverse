-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  arena_tokens_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Champions table
CREATE TABLE IF NOT EXISTS public.champions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  nft_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  class TEXT NOT NULL, -- Warrior, Mage, Archer, Paladin
  rarity TEXT NOT NULL, -- Common, Rare, Epic, Legendary
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  health INTEGER NOT NULL,
  mana INTEGER NOT NULL,
  attack INTEGER NOT NULL,
  defense INTEGER NOT NULL,
  speed INTEGER NOT NULL,
  skill_ids TEXT[], -- Array of equipped skill IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  class_requirement TEXT NOT NULL,
  description TEXT,
  damage_type TEXT, -- Physical, Magical, Mixed
  base_damage INTEGER,
  mana_cost INTEGER,
  cooldown_seconds INTEGER,
  effect_json JSONB, -- Additional effects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Battle History table
CREATE TABLE IF NOT EXISTS public.battle_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  opponent_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  champion_id UUID NOT NULL REFERENCES public.champions(id) ON DELETE CASCADE,
  opponent_champion_id UUID REFERENCES public.champions(id) ON DELETE SET NULL,
  battle_type TEXT NOT NULL, -- PvE, PvP
  result TEXT NOT NULL, -- Win, Loss, Draw
  xp_earned INTEGER,
  arena_tokens_earned INTEGER,
  duration_seconds INTEGER,
  battle_log JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard (materialized view)
CREATE TABLE IF NOT EXISTS public.leaderboard (
  rank INTEGER PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  total_xp INTEGER NOT NULL,
  level INTEGER NOT NULL,
  wins INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL, -- FirstWin, CollectChampions, ReachLevel, etc
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staking table
CREATE TABLE IF NOT EXISTS public.staking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  champion_id UUID NOT NULL REFERENCES public.champions(id) ON DELETE CASCADE,
  arena_tokens_staked INTEGER NOT NULL,
  reward_multiplier DECIMAL(5,2) DEFAULT 1.0,
  staked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unlocked_at TIMESTAMP WITH TIME ZONE,
  claimed_rewards INTEGER DEFAULT 0
);

-- Row Level Security Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.champions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking ENABLE ROW LEVEL SECURITY;

-- Users RLS
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Champions RLS
CREATE POLICY "Users can view all champions" ON public.champions FOR SELECT USING (true);
CREATE POLICY "Users can manage own champions" ON public.champions FOR ALL USING (auth.uid() = user_id);

-- Battle History RLS
CREATE POLICY "Users can view battle history" ON public.battle_history FOR SELECT USING (true);
CREATE POLICY "Users can create battle records" ON public.battle_history FOR INSERT WITH CHECK (auth.uid() = player_id);

-- Achievements RLS
CREATE POLICY "Users can view achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Users can manage own achievements" ON public.achievements FOR ALL USING (auth.uid() = user_id);

-- Staking RLS
CREATE POLICY "Users can view all staking" ON public.staking FOR SELECT USING (true);
CREATE POLICY "Users can manage own staking" ON public.staking FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_champions_user_id ON public.champions(user_id);
CREATE INDEX idx_battle_history_player_id ON public.battle_history(player_id);
CREATE INDEX idx_battle_history_created ON public.battle_history(created_at DESC);
CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX idx_staking_user_id ON public.staking(user_id);
