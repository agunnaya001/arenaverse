import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { generateBattleNFT, mintBattleRewardNFT } from '@/lib/nft/nft-generator';

/**
 * POST /api/battle/result
 * Complete battle and calculate rewards
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

    const body = await request.json();
    const { battleId, result, duration, battleLog } = body;

    if (!battleId || !result) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get battle record
    const { data: battle } = await supabaseAdmin
      .from('battle_history')
      .select('*')
      .eq('id', battleId)
      .eq('player_id', userId)
      .single();

    if (!battle) {
      return NextResponse.json(
        { error: 'Battle not found' },
        { status: 404 }
      );
    }

    // Calculate rewards based on result
    const xpReward = result === 'Win' ? 50 : 10;
    const tokenReward = result === 'Win' ? 100 : 25;

    // Update battle record
    const { error: updateError } = await supabaseAdmin
      .from('battle_history')
      .update({
        result,
        xp_earned: xpReward,
        arena_tokens_earned: tokenReward,
        duration_seconds: duration,
        battle_log: battleLog,
      })
      .eq('id', battleId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update battle' },
        { status: 500 }
      );
    }

    // Update user stats
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('total_xp,level,arena_tokens_earned')
      .eq('id', userId)
      .single();

    const newXp = (user?.total_xp || 0) + xpReward;
    const newLevel = Math.floor(newXp / 1000) + 1;
    const newTokens = (user?.arena_tokens_earned || 0) + tokenReward;

    const { error: userError } = await supabaseAdmin
      .from('users')
      .update({
        total_xp: newXp,
        level: newLevel,
        arena_tokens_earned: newTokens,
      })
      .eq('id', userId);

    if (userError) {
      console.error('[v0] Failed to update user stats:', userError);
    }

    // Record reward
    const { error: rewardError } = await supabaseAdmin
      .from('reward_history')
      .insert({
        user_id: userId,
        reward_type: 'Battle',
        reward_amount: tokenReward,
        source_id: battleId,
        source_type: 'battle',
      });

    if (rewardError) {
      console.error('[v0] Failed to record reward:', rewardError);
    }

    // Mint NFT reward for wins
    let nftReward = null;
    if (result === 'Win') {
      const battleRewardNFT = generateBattleNFT({ difficulty: 3 });
      const nftResult = await mintBattleRewardNFT(userId, battleId, battleRewardNFT);
      
      if (nftResult.success) {
        nftReward = {
          tokenId: nftResult.tokenId,
          metadata: battleRewardNFT,
        };
      } else {
        console.error('[v0] Failed to mint battle reward NFT:', nftResult.error);
      }
    }

    return NextResponse.json(
      {
        battleId,
        result,
        xpEarned: xpReward,
        tokensEarned: tokenReward,
        newLevel,
        newXp,
        nftReward,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Battle result submission failed:', error);
    return NextResponse.json(
      { error: 'Failed to submit battle result' },
      { status: 500 }
    );
  }
}
