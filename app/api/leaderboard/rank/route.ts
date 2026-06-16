import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * GET /api/leaderboard/rank
 * Get player's rank and surrounding players
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

    // Get all users sorted by XP
    const { data: allUsers } = await supabase
      .from('users')
      .select('id, total_xp, username, level, arena_tokens_earned')
      .order('total_xp', { ascending: false });

    if (!allUsers) {
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard' },
        { status: 500 }
      );
    }

    // Find player's rank
    const playerRank = allUsers.findIndex((u) => u.id === userId) + 1;
    const playerData = allUsers[playerRank - 1];

    if (!playerData) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Get surrounding players
    const startIdx = Math.max(0, playerRank - 3);
    const endIdx = Math.min(allUsers.length, playerRank + 2);
    const surroundingPlayers = allUsers.slice(startIdx, endIdx).map((user, idx) => ({
      rank: startIdx + idx + 1,
      userId: user.id,
      username: user.username,
      totalXp: user.total_xp,
      level: user.level,
      arenaTokensEarned: user.arena_tokens_earned,
    }));

    // Get battle stats for player
    const { data: battles } = await supabase
      .from('battle_history')
      .select('result')
      .eq('player_id', userId);

    const wins = battles?.filter((b) => b.result === 'Win').length || 0;
    const totalBattles = battles?.length || 0;
    const winRate = totalBattles > 0 ? ((wins / totalBattles) * 100).toFixed(2) : '0.00';

    return NextResponse.json(
      {
        currentRank: playerRank,
        totalPlayers: allUsers.length,
        playerStats: {
          username: playerData.username,
          totalXp: playerData.total_xp,
          level: playerData.level,
          arenaTokensEarned: playerData.arena_tokens_earned,
          wins,
          totalBattles,
          winRate: parseFloat(winRate),
        },
        surroundingPlayers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Rank fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rank information' },
      { status: 500 }
    );
  }
}
