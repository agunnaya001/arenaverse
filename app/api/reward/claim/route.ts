import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { checkRateLimit } from '@/lib/middleware/rate-limit';

/**
 * POST /api/reward/claim
 * Claim quest or staking rewards
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
    const rateLimit = await checkRateLimit(userId, '/api/reward/claim');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many claim requests' },
        { status: 429, headers: { 'Retry-After': Math.ceil((rateLimit.resetTime.getTime() - Date.now()) / 1000).toString() } }
      );
    }

    const body = await request.json();
    const { type, sourceId } = body; // type: quest, staking

    if (!type || !sourceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let xpReward = 0;
    let tokenReward = 0;

    if (type === 'quest') {
      // Get quest details
      const { data: progress } = await supabaseAdmin
        .from('quest_progress')
        .select('*, quests(*)')
        .eq('id', sourceId)
        .eq('user_id', userId)
        .single();

      if (!progress) {
        return NextResponse.json(
          { error: 'Quest progress not found' },
          { status: 404 }
        );
      }

      if (progress.rewards_claimed) {
        return NextResponse.json(
          { error: 'Rewards already claimed' },
          { status: 400 }
        );
      }

      if (!progress.completed_at) {
        return NextResponse.json(
          { error: 'Quest not completed' },
          { status: 400 }
        );
      }

      const quest = progress.quests;
      xpReward = quest.reward_xp;
      tokenReward = quest.reward_tokens;

      // Mark as claimed
      await supabaseAdmin
        .from('quest_progress')
        .update({ rewards_claimed: true })
        .eq('id', sourceId);
    } else if (type === 'staking') {
      // Get staking record
      const { data: staking } = await supabaseAdmin
        .from('staking')
        .select('*')
        .eq('id', sourceId)
        .eq('user_id', userId)
        .single();

      if (!staking) {
        return NextResponse.json(
          { error: 'Staking record not found' },
          { status: 404 }
        );
      }

      // Calculate staking rewards
      const duration = staking.unlocked_at
        ? (new Date(staking.unlocked_at).getTime() - new Date(staking.staked_at).getTime()) / (1000 * 60 * 60 * 24)
        : 0;

      tokenReward = Math.round(staking.arena_tokens_staked * staking.reward_multiplier * (duration / 30)); // Monthly rewards

      // Update staking record
      await supabaseAdmin
        .from('staking')
        .update({ claimed_rewards: staking.claimed_rewards + tokenReward })
        .eq('id', sourceId);
    }

    // Update user stats
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('total_xp, level, arena_tokens_earned')
      .eq('id', userId)
      .single();

    const newXp = (user?.total_xp || 0) + xpReward;
    const newLevel = Math.floor(newXp / 1000) + 1;
    const newTokens = (user?.arena_tokens_earned || 0) + tokenReward;

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        total_xp: newXp,
        level: newLevel,
        arena_tokens_earned: newTokens,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('[v0] Failed to update user stats:', updateError);
    }

    // Record reward
    const { error: rewardError } = await supabaseAdmin
      .from('reward_history')
      .insert({
        user_id: userId,
        reward_type: type === 'quest' ? 'Quest' : 'Staking',
        reward_amount: tokenReward,
        source_id: sourceId,
        source_type: type,
      });

    if (rewardError) {
      console.error('[v0] Failed to record reward:', rewardError);
    }

    return NextResponse.json(
      {
        success: true,
        xpReward,
        tokenReward,
        newLevel,
        newXp,
        newTokens,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Reward claim failed:', error);
    return NextResponse.json(
      { error: 'Failed to claim rewards' },
      { status: 500 }
    );
  }
}
