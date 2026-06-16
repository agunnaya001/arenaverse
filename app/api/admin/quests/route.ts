import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { isAdmin } from '@/lib/contracts';

/**
 * POST /api/admin/quests
 * Create a new quest (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const adminAddress = request.headers.get('x-wallet-address');

    if (!adminAddress || !isAdmin(adminAddress)) {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      questType,
      difficulty,
      rewardXp,
      rewardTokens,
      rewardNft,
      requirements,
    } = body;

    if (!name || !questType || !difficulty || rewardXp === undefined || rewardTokens === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: quest, error } = await supabaseAdmin
      .from('quests')
      .insert({
        name,
        description,
        quest_type: questType,
        difficulty,
        reward_xp: rewardXp,
        reward_tokens: rewardTokens,
        reward_nft: rewardNft,
        requirements: requirements || {},
        active: true,
      })
      .select();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create quest' },
        { status: 500 }
      );
    }

    return NextResponse.json(quest?.[0], { status: 201 });
  } catch (error) {
    console.error('[v0] Quest creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create quest' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/quests
 * Update an existing quest (admin only)
 */
export async function PUT(request: NextRequest) {
  try {
    const adminAddress = request.headers.get('x-wallet-address');

    if (!adminAddress || !isAdmin(adminAddress)) {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { questId, ...updates } = body;

    if (!questId) {
      return NextResponse.json(
        { error: 'Missing quest ID' },
        { status: 400 }
      );
    }

    const { data: quest, error } = await supabaseAdmin
      .from('quests')
      .update(updates)
      .eq('id', questId)
      .select();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update quest' },
        { status: 500 }
      );
    }

    return NextResponse.json(quest?.[0], { status: 200 });
  } catch (error) {
    console.error('[v0] Quest update failed:', error);
    return NextResponse.json(
      { error: 'Failed to update quest' },
      { status: 500 }
    );
  }
}
