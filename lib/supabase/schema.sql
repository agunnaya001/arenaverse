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

-- SIWE (Sign In With Ethereum) Sessions table
CREATE TABLE IF NOT EXISTS public.siwe_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  signature TEXT NOT NULL,
  nonce TEXT UNIQUE NOT NULL,
  chain_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Quests table
CREATE TABLE IF NOT EXISTS public.quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  quest_type TEXT NOT NULL, -- Daily, Weekly, Campaign, Special
  difficulty TEXT NOT NULL, -- Easy, Normal, Hard, Legendary
  reward_xp INTEGER NOT NULL,
  reward_tokens INTEGER NOT NULL,
  reward_nft TEXT,
  requirements JSONB, -- Battle count, Champion level, etc
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Quest Progress table
CREATE TABLE IF NOT EXISTS public.quest_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  rewards_claimed BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quest_id)
);

-- Enhanced Leaderboard table (materialized view)
CREATE TABLE IF NOT EXISTS public.leaderboard_extended (
  rank INTEGER PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  total_xp INTEGER NOT NULL,
  level INTEGER NOT NULL,
  wins INTEGER NOT NULL,
  win_rate DECIMAL(5,2) NOT NULL,
  total_battles INTEGER NOT NULL,
  arena_tokens_earned INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rewards History table
CREATE TABLE IF NOT EXISTS public.reward_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL, -- Battle, Quest, Staking, Achievement, Referral
  reward_amount INTEGER NOT NULL,
  source_id TEXT, -- Battle ID, Quest ID, etc
  source_type TEXT, -- battle, quest, staking, achievement, referral
  transaction_hash TEXT, -- Blockchain transaction hash
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Index table for blockchain tracking
CREATE TABLE IF NOT EXISTS public.blockchain_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL, -- BattleCompleted, NFTMinted, TokenTransfer, etc
  contract_address TEXT NOT NULL,
  transaction_hash TEXT UNIQUE,
  block_number INTEGER,
  log_index INTEGER,
  data JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Audit Log table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate Limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, endpoint, window_start)
);

-- Deployments table (for Launchpad)
CREATE TABLE IF NOT EXISTS public.deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  contract_type TEXT NOT NULL, -- ERC20, ERC721, ERC1155, DAO, Staking
  contract_name TEXT NOT NULL,
  contract_code TEXT NOT NULL,
  contract_address TEXT,
  transaction_hash TEXT,
  status TEXT NOT NULL DEFAULT 'Pending', -- Pending, Deploying, Deployed, Failed, Verified
  chain_id INTEGER NOT NULL,
  gas_used INTEGER,
  deployment_cost TEXT,
  etherscan_url TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agents table (for Agent Marketplace)
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- Trading, Gaming, Analytics, Automation, etc
  tags TEXT[], -- Array of tags
  logo_url TEXT,
  webhook_url TEXT NOT NULL,
  pricing_tier TEXT NOT NULL, -- Free, Basic, Pro, Enterprise
  pricing_amount INTEGER, -- In arena tokens
  active BOOLEAN DEFAULT true,
  total_executions INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  monthly_active_users INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Reviews/Ratings table
CREATE TABLE IF NOT EXISTS public.agent_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL, -- 1-5
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agent_id, user_id)
);

-- Agent Subscriptions table
CREATE TABLE IF NOT EXISTS public.agent_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  tier TEXT NOT NULL, -- Free, Basic, Pro, Enterprise
  status TEXT NOT NULL DEFAULT 'Active', -- Active, Paused, Cancelled
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  executions_used INTEGER DEFAULT 0,
  executions_limit INTEGER DEFAULT -1, -- -1 = unlimited
  next_billing_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, agent_id)
);

-- Agent Execution Logs table
CREATE TABLE IF NOT EXISTS public.agent_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  webhook_payload JSONB,
  webhook_response JSONB,
  status TEXT NOT NULL, -- Success, Failed, Pending
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guilds table
CREATE TABLE IF NOT EXISTS public.guilds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  logo_url TEXT,
  treasury_balance INTEGER DEFAULT 0,
  member_count INTEGER DEFAULT 1,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guild Members table
CREATE TABLE IF NOT EXISTS public.guild_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'Member', -- Leader, Officer, Member
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(guild_id, user_id)
);

-- Tournaments table
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Upcoming', -- Upcoming, Active, Completed
  entry_fee INTEGER,
  prize_pool INTEGER,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tournament Participants table
CREATE TABLE IF NOT EXISTS public.tournament_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  champion_id UUID NOT NULL REFERENCES public.champions(id) ON DELETE CASCADE,
  rank INTEGER,
  wins INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

-- Referral Program table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reward_amount INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Active', -- Active, Claimed, Expired
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  claimed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(referrer_id, referred_id)
);

-- Social Feed/Activity table
CREATE TABLE IF NOT EXISTS public.activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- BattleWon, LevelUp, AchievementUnlocked, JoinedGuild, TournamentWon
  related_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  activity_data JSONB,
  visibility TEXT NOT NULL DEFAULT 'Public', -- Public, Friends, Private
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Relationships/Friends table
CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id1 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_id2 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Pending', -- Pending, Accepted, Blocked
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id1, user_id2),
  CHECK (user_id1 < user_id2)
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

-- Enable RLS on new tables
ALTER TABLE public.siwe_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_extended ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- SIWE Sessions RLS
CREATE POLICY "Users can view own sessions" ON public.siwe_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON public.siwe_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Quests RLS (everyone can view active quests)
CREATE POLICY "Users can view active quests" ON public.quests FOR SELECT USING (active = true);

-- Quest Progress RLS
CREATE POLICY "Users can view quest progress" ON public.quest_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.quest_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.quest_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leaderboard RLS
CREATE POLICY "Everyone can view leaderboard" ON public.leaderboard_extended FOR SELECT USING (true);

-- Reward History RLS
CREATE POLICY "Users can view own rewards" ON public.reward_history FOR SELECT USING (auth.uid() = user_id);

-- Blockchain Events RLS
CREATE POLICY "System can manage events" ON public.blockchain_events FOR ALL USING (true);

-- Audit Logs RLS (admin only)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = admin_id OR auth.jwt() ->> 'role' = 'admin');

-- Rate Limits RLS
CREATE POLICY "System manages rate limits" ON public.rate_limits FOR ALL USING (true);

-- Enable RLS on ecosystem tables
ALTER TABLE public.guilds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- Guilds RLS
CREATE POLICY "Everyone can view public guilds" ON public.guilds FOR SELECT USING (true);
CREATE POLICY "Leaders can manage their guild" ON public.guilds FOR ALL USING (auth.uid() = leader_id);

-- Guild Members RLS
CREATE POLICY "Everyone can view guild members" ON public.guild_members FOR SELECT USING (true);
CREATE POLICY "Guild leaders can manage members" ON public.guild_members FOR ALL USING (
  auth.uid() IN (
    SELECT leader_id FROM public.guilds WHERE id = guild_id
  ) OR auth.uid() = user_id
);

-- Tournaments RLS
CREATE POLICY "Everyone can view tournaments" ON public.tournaments FOR SELECT USING (true);

-- Tournament Participants RLS
CREATE POLICY "Everyone can view participants" ON public.tournament_participants FOR SELECT USING (true);
CREATE POLICY "Users can join tournaments" ON public.tournament_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Referrals RLS
CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Users can create referrals" ON public.referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Activity Feed RLS
CREATE POLICY "Public activity is visible" ON public.activity_feed FOR SELECT USING (visibility = 'Public');
CREATE POLICY "Users can see their own activity" ON public.activity_feed FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create activity" ON public.activity_feed FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Friendships RLS
CREATE POLICY "Users can view their friendships" ON public.friendships FOR SELECT USING (auth.uid() = user_id1 OR auth.uid() = user_id2);
CREATE POLICY "Users can manage friendships" ON public.friendships FOR ALL USING (auth.uid() = user_id1 OR auth.uid() = user_id2);

-- Enable RLS on deployment tables
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_executions ENABLE ROW LEVEL SECURITY;

-- Deployments RLS
CREATE POLICY "Users can view own deployments" ON public.deployments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create deployments" ON public.deployments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own deployments" ON public.deployments FOR UPDATE USING (auth.uid() = user_id);

-- Agents RLS
CREATE POLICY "Everyone can view active agents" ON public.agents FOR SELECT USING (active = true);
CREATE POLICY "Creators can manage their agents" ON public.agents FOR ALL USING (auth.uid() = creator_id);

-- Agent Reviews RLS
CREATE POLICY "Everyone can view reviews" ON public.agent_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.agent_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Agent Subscriptions RLS
CREATE POLICY "Users can view own subscriptions" ON public.agent_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create subscriptions" ON public.agent_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Agent Executions RLS
CREATE POLICY "Users can view own executions" ON public.agent_executions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create executions" ON public.agent_executions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_champions_user_id ON public.champions(user_id);
CREATE INDEX idx_battle_history_player_id ON public.battle_history(player_id);
CREATE INDEX idx_battle_history_created ON public.battle_history(created_at DESC);
CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX idx_staking_user_id ON public.staking(user_id);
CREATE INDEX idx_siwe_sessions_user_id ON public.siwe_sessions(user_id);
CREATE INDEX idx_siwe_sessions_nonce ON public.siwe_sessions(nonce);
CREATE INDEX idx_quest_progress_user_id ON public.quest_progress(user_id);
CREATE INDEX idx_quest_progress_quest_id ON public.quest_progress(quest_id);
CREATE INDEX idx_reward_history_user_id ON public.reward_history(user_id);
CREATE INDEX idx_reward_history_created ON public.reward_history(created_at DESC);
CREATE INDEX idx_blockchain_events_type ON public.blockchain_events(event_type);
CREATE INDEX idx_blockchain_events_processed ON public.blockchain_events(processed);
CREATE INDEX idx_audit_logs_admin_id ON public.audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);
CREATE INDEX idx_rate_limits_user_endpoint ON public.rate_limits(user_id, endpoint);
CREATE INDEX idx_deployments_user_id ON public.deployments(user_id);
CREATE INDEX idx_deployments_status ON public.deployments(status);
CREATE INDEX idx_deployments_created ON public.deployments(created_at DESC);
CREATE INDEX idx_agents_creator_id ON public.agents(creator_id);
CREATE INDEX idx_agents_category ON public.agents(category);
CREATE INDEX idx_agent_reviews_agent_id ON public.agent_reviews(agent_id);
CREATE INDEX idx_agent_subscriptions_user_id ON public.agent_subscriptions(user_id);
CREATE INDEX idx_agent_executions_user_id ON public.agent_executions(user_id);
CREATE INDEX idx_agent_executions_created ON public.agent_executions(created_at DESC);
CREATE INDEX idx_guilds_leader_id ON public.guilds(leader_id);
CREATE INDEX idx_guild_members_guild_id ON public.guild_members(guild_id);
CREATE INDEX idx_guild_members_user_id ON public.guild_members(user_id);
CREATE INDEX idx_tournaments_status ON public.tournaments(status);
CREATE INDEX idx_tournament_participants_tournament_id ON public.tournament_participants(tournament_id);
CREATE INDEX idx_tournament_participants_user_id ON public.tournament_participants(user_id);
CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_referred_id ON public.referrals(referred_id);
CREATE INDEX idx_activity_feed_user_id ON public.activity_feed(user_id);
CREATE INDEX idx_activity_feed_created ON public.activity_feed(created_at DESC);
CREATE INDEX idx_friendships_user1 ON public.friendships(user_id1);
CREATE INDEX idx_friendships_user2 ON public.friendships(user_id2);
