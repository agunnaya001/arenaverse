import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * GET /api/leaderboard/top
 * Get top players on leaderboard
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Calculate leaderboard data from users and battles
    const { data: users } = await supabase
      .from('users')
      .select('*')
      .order('total_xp', { ascending: false })
      .range(offset, offset + limit - 1);

    // Enrich with battle stats
    const leaderboard = await Promise.all(
      users?.map(async (user) => {
        const { data: battles } = await supabase
          .from('battle_history')
          .select('result')
          .eq('player_id', user.id);

        const wins = battles?.filter((b) => b.result === 'Win').length || 0;
        const totalBattles = battles?.length || 0;
        const winRate = totalBattles > 0 ? (wins / totalBattles) * 100 : 0;

        return {
          userId: user.id,
          username: user.username,
          totalXp: user.total_xp,
          level: user.level,
          wins,
          winRate: parseFloat(winRate.toFixed(2)),
          totalBattles,
          arenaTokensEarned: user.arena_tokens_earned,
        };
      }) || []
    );

    return NextResponse.json(
      {
        leaderboard,
        pagination: {
          offset,
          limit,
          total: users?.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Leaderboard fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
