import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * GET /api/reward/history
 * Get user's reward history
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

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type'); // Filter by type

    let query = supabase
      .from('reward_history')
      .select('*')
      .eq('user_id', userId);

    if (type) {
      query = query.eq('reward_type', type);
    }

    const { data: rewards, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch reward history' },
        { status: 500 }
      );
    }

    // Get total stats
    const { data: allRewards } = await supabase
      .from('reward_history')
      .select('reward_amount')
      .eq('user_id', userId);

    const totalRewards = allRewards?.reduce((sum, r) => sum + r.reward_amount, 0) || 0;

    return NextResponse.json(
      {
        rewards,
        totalRewards,
        pagination: {
          offset,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Reward history fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reward history' },
      { status: 500 }
    );
  }
}
