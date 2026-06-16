import { NextRequest, NextResponse } from 'next/server';
import { subscribeToAgent, executeAgent } from '@/lib/marketplace/agent-marketplace';
import { supabase } from '@/lib/supabase/client';

/**
 * POST /api/marketplace/subscribe
 * Subscribe to an agent
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
    const { agentId, tier } = body;

    if (!agentId || !tier) {
      return NextResponse.json(
        { error: 'Missing required fields: agentId, tier' },
        { status: 400 }
      );
    }

    const subscription = await subscribeToAgent(userId, agentId, tier);

    if (!subscription) {
      return NextResponse.json(
        { error: 'Failed to create subscription or already subscribed' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        subscription,
        message: 'Successfully subscribed to agent',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Subscription creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/marketplace/subscribe
 * Get user's agent subscriptions
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

    const { data: subscriptions, error } = await supabase
      .from('agent_subscriptions')
      .select('*, agents(*)')
      .eq('user_id', userId)
      .eq('status', 'Active');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        subscriptions,
        count: subscriptions?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Subscription fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}
