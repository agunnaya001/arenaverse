import { supabaseAdmin, supabase } from '../supabase/client';

// ===== GUILD TYPES =====
export interface Guild {
  id: string;
  name: string;
  description?: string;
  leader_id: string;
  logo_url?: string;
  treasury_balance: number;
  member_count: number;
  level: number;
  experience: number;
  created_at: string;
  updated_at: string;
}

export interface GuildMember {
  id: string;
  guild_id: string;
  user_id: string;
  role: 'Leader' | 'Officer' | 'Member';
  joined_at: string;
}

// ===== TOURNAMENT TYPES =====
export interface Tournament {
  id: string;
  name: string;
  description?: string;
  status: 'Upcoming' | 'Active' | 'Completed';
  entry_fee?: number;
  prize_pool: number;
  max_participants: number;
  current_participants: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export interface TournamentParticipant {
  id: string;
  tournament_id: string;
  user_id: string;
  champion_id: string;
  rank?: number;
  wins: number;
  joined_at: string;
}

// ===== REFERRAL TYPES =====
export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  reward_amount: number;
  status: 'Active' | 'Claimed' | 'Expired';
  created_at: string;
  claimed_at?: string;
}

// ===== SOCIAL TYPES =====
export interface ActivityFeed {
  id: string;
  user_id: string;
  activity_type: string;
  related_user_id?: string;
  activity_data?: any;
  visibility: 'Public' | 'Friends' | 'Private';
  created_at: string;
}

export interface Friendship {
  id: string;
  user_id1: string;
  user_id2: string;
  status: 'Pending' | 'Accepted' | 'Blocked';
  created_at: string;
}

// ===== GUILD OPERATIONS =====

export async function createGuild(
  leaderId: string,
  name: string,
  description: string
): Promise<Guild | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('guilds')
      .insert({
        name,
        description,
        leader_id: leaderId,
      })
      .select();

    if (error || !data) return null;

    // Add leader as member
    await supabaseAdmin.from('guild_members').insert({
      guild_id: data[0].id,
      user_id: leaderId,
      role: 'Leader',
    });

    return data[0] as Guild;
  } catch (error) {
    console.error('[v0] Guild creation failed:', error);
    return null;
  }
}

export async function joinGuild(userId: string, guildId: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from('guild_members').insert({
      guild_id: guildId,
      user_id: userId,
      role: 'Member',
    });

    // Update member count
    await supabaseAdmin.rpc('increment_guild_members', { p_guild_id: guildId });

    return !error;
  } catch (error) {
    console.error('[v0] Guild join failed:', error);
    return false;
  }
}

export async function getGuilds(limit: number = 50, offset: number = 0): Promise<Guild[]> {
  try {
    const { data, error } = await supabase
      .from('guilds')
      .select('*')
      .order('member_count', { ascending: false })
      .range(offset, offset + limit - 1);

    return data as Guild[] || [];
  } catch (error) {
    console.error('[v0] Guild fetch failed:', error);
    return [];
  }
}

// ===== TOURNAMENT OPERATIONS =====

export async function createTournament(
  name: string,
  description: string,
  prizePool: number,
  maxParticipants: number,
  entryFee?: number,
  startDate?: string,
  endDate?: string
): Promise<Tournament | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('tournaments')
      .insert({
        name,
        description,
        status: 'Upcoming',
        prize_pool: prizePool,
        max_participants: maxParticipants,
        entry_fee: entryFee,
        start_date: startDate,
        end_date: endDate,
      })
      .select();

    return data?.[0] as Tournament || null;
  } catch (error) {
    console.error('[v0] Tournament creation failed:', error);
    return null;
  }
}

export async function joinTournament(
  userId: string,
  tournamentId: string,
  championId: string
): Promise<TournamentParticipant | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('tournament_participants')
      .insert({
        tournament_id: tournamentId,
        user_id: userId,
        champion_id: championId,
      })
      .select();

    return data?.[0] as TournamentParticipant || null;
  } catch (error) {
    console.error('[v0] Tournament join failed:', error);
    return null;
  }
}

export async function getTournaments(status?: string): Promise<Tournament[]> {
  try {
    let query = supabase.from('tournaments').select('*');

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('start_date', { ascending: true });

    return data as Tournament[] || [];
  } catch (error) {
    console.error('[v0] Tournament fetch failed:', error);
    return [];
  }
}

// ===== REFERRAL OPERATIONS =====

export async function createReferral(referrerId: string, referredId: string, rewardAmount: number = 100): Promise<Referral | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('referrals')
      .insert({
        referrer_id: referrerId,
        referred_id: referredId,
        reward_amount: rewardAmount,
      })
      .select();

    return data?.[0] as Referral || null;
  } catch (error) {
    console.error('[v0] Referral creation failed:', error);
    return null;
  }
}

export async function getReferralStats(userId: string): Promise<{
  totalReferrals: number;
  activeReferrals: number;
  claimedRewards: number;
  pendingRewards: number;
} | null> {
  try {
    const { data: referrals } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId);

    if (!referrals) return null;

    const activeReferrals = referrals.filter((r) => r.status === 'Active').length;
    const claimedRewards = referrals
      .filter((r) => r.status === 'Claimed')
      .reduce((sum, r) => sum + r.reward_amount, 0);
    const pendingRewards = referrals
      .filter((r) => r.status === 'Active')
      .reduce((sum, r) => sum + r.reward_amount, 0);

    return {
      totalReferrals: referrals.length,
      activeReferrals,
      claimedRewards,
      pendingRewards,
    };
  } catch (error) {
    console.error('[v0] Referral stats fetch failed:', error);
    return null;
  }
}

// ===== SOCIAL OPERATIONS =====

export async function postActivity(
  userId: string,
  activityType: string,
  activityData?: any,
  visibility: string = 'Public'
): Promise<ActivityFeed | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('activity_feed')
      .insert({
        user_id: userId,
        activity_type: activityType,
        activity_data: activityData,
        visibility,
      })
      .select();

    return data?.[0] as ActivityFeed || null;
  } catch (error) {
    console.error('[v0] Activity post failed:', error);
    return null;
  }
}

export async function getActivityFeed(limit: number = 50, offset: number = 0): Promise<ActivityFeed[]> {
  try {
    const { data, error } = await supabase
      .from('activity_feed')
      .select('*')
      .eq('visibility', 'Public')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return data as ActivityFeed[] || [];
  } catch (error) {
    console.error('[v0] Feed fetch failed:', error);
    return [];
  }
}

export async function sendFriendRequest(userId1: string, userId2: string): Promise<boolean> {
  try {
    const [id1, id2] = [userId1, userId2].sort();

    const { error } = await supabaseAdmin.from('friendships').insert({
      user_id1: id1,
      user_id2: id2,
      status: 'Pending',
    });

    return !error;
  } catch (error) {
    console.error('[v0] Friend request failed:', error);
    return false;
  }
}

export async function acceptFriendRequest(userId1: string, userId2: string): Promise<boolean> {
  try {
    const [id1, id2] = [userId1, userId2].sort();

    const { error } = await supabaseAdmin
      .from('friendships')
      .update({ status: 'Accepted' })
      .eq('user_id1', id1)
      .eq('user_id2', id2);

    return !error;
  } catch (error) {
    console.error('[v0] Friend request acceptance failed:', error);
    return false;
  }
}

export async function getUserFriends(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('friendships')
      .select('*, user_profile:users!user_id2(*), friend_profile:users!user_id1(*)')
      .or(`user_id1.eq.${userId},user_id2.eq.${userId}`)
      .eq('status', 'Accepted');

    return data || [];
  } catch (error) {
    console.error('[v0] Friend list fetch failed:', error);
    return [];
  }
}
