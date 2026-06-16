import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * GET /api/player/stats
 * Get player battle statistics
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 401 }
      );
    }

    // Get battle statistics
    const { data: battles } = await supabase
      .from('battle_history')
      .select('result')
      .eq('player_id', userId);

    const wins = battles?.filter((b) => b.result === 'Win').length || 0;
    const losses = battles?.filter((b) => b.result === 'Loss').length || 0;
    const draws = battles?.filter((b) => b.result === 'Draw').length || 0;
    const totalBattles = wins + losses + draws;
    const winRate = totalBattles > 0 ? ((wins / totalBattles) * 100).toFixed(2) : '0.00';

    // Get total rewards
    const { data: rewards } = await supabase
      .from('reward_history')
      .select('reward_amount')
      .eq('user_id', userId);

    const totalRewards = rewards?.reduce((sum, r) => sum + r.reward_amount, 0) || 0;

    // Get user profile for XP and level
    const { data: user } = await supabase
      .from('users')
      .select('total_xp,level')
      .eq('id', userId)
      .single();

    return NextResponse.json(
      {
        userId,
        totalBattles,
        wins,
        losses,
        draws,
        winRate: parseFloat(winRate),
        totalXp: user?.total_xp || 0,
        level: user?.level || 1,
        totalRewardsEarned: totalRewards,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Stats fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
