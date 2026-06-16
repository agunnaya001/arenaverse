import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { checkRateLimit } from '@/lib/middleware/rate-limit';

/**
 * POST /api/battle/start
 * Start a new PvE battle
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 401 }
      );
    }

    // Check rate limit
    const rateLimit = await checkRateLimit(userId, '/api/battle/start');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many battle requests' },
        { status: 429, headers: { 'Retry-After': Math.ceil((rateLimit.resetTime.getTime() - Date.now()) / 1000).toString() } }
      );
    }

    const body = await request.json();
    const { championId } = body;

    if (!championId) {
      return NextResponse.json(
        { error: 'Missing champion ID' },
        { status: 400 }
      );
    }

    // Verify champion ownership
    const { data: champion } = await supabaseAdmin
      .from('champions')
      .select('*')
      .eq('id', championId)
      .eq('user_id', userId)
      .single();

    if (!champion) {
      return NextResponse.json(
        { error: 'Champion not found or does not belong to user' },
        { status: 404 }
      );
    }

    // Generate random opponent
    const { data: allChampions } = await supabaseAdmin
      .from('champions')
      .select('*')
      .neq('user_id', userId)
      .limit(1);

    const opponent = allChampions?.[0] || generateAIOpponent(champion.level);

    // Create battle record
    const { data: battle, error } = await supabaseAdmin
      .from('battle_history')
      .insert({
        player_id: userId,
        champion_id: championId,
        opponent_id: opponent?.user_id,
        opponent_champion_id: opponent?.id,
        battle_type: 'PvE',
        result: 'Pending',
        battle_log: [],
      })
      .select();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create battle' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        battleId: battle?.[0]?.id,
        playerChampion: champion,
        opponentChampion: opponent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Battle start failed:', error);
    return NextResponse.json(
      { error: 'Failed to start battle' },
      { status: 500 }
    );
  }
}

/**
 * Generate AI opponent based on player level
 */
function generateAIOpponent(playerLevel: number) {
  const classes = ['Warrior', 'Mage', 'Archer', 'Paladin'];
  const rarities = ['Common', 'Rare', 'Epic', 'Legendary'];

  return {
    id: `ai_${Date.now()}`,
    name: `${classes[Math.floor(Math.random() * classes.length)]} Opponent`,
    class: classes[Math.floor(Math.random() * classes.length)],
    rarity: rarities[Math.floor(Math.random() * rarities.length)],
    level: Math.max(1, playerLevel + Math.floor(Math.random() * 3) - 1),
    health: 100 + playerLevel * 10,
    mana: 80 + playerLevel * 8,
    attack: 50 + playerLevel * 5,
    defense: 30 + playerLevel * 3,
    speed: 40 + playerLevel * 4,
  };
}
