import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib/supabase/client';
import { checkRateLimit } from '@/lib/middleware/rate-limit';

/**
 * GET /api/quest/progress
 * Get user's quest progress
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

    const { data: progress } = await supabase
      .from('quest_progress')
      .select('*, quests(*)')
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    return NextResponse.json(progress, { status: 200 });
  } catch (error) {
    console.error('[v0] Quest progress fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quest progress' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/quest/progress
 * Start a new quest
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
    const { questId } = body;

    if (!questId) {
      return NextResponse.json(
        { error: 'Missing quest ID' },
        { status: 400 }
      );
    }

    // Check if user already has this quest in progress
    const { data: existing } = await supabase
      .from('quest_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('quest_id', questId)
      .eq('completed_at', null)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Quest already in progress' },
        { status: 400 }
      );
    }

    // Create quest progress
    const { data: progress, error } = await supabaseAdmin
      .from('quest_progress')
      .insert({
        user_id: userId,
        quest_id: questId,
        progress: 0,
      })
      .select();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to start quest' },
        { status: 500 }
      );
    }

    return NextResponse.json(progress?.[0], { status: 201 });
  } catch (error) {
    console.error('[v0] Quest start failed:', error);
    return NextResponse.json(
      { error: 'Failed to start quest' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/quest/progress
 * Update quest progress
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { progressId, progress, completed } = body;

    if (!progressId) {
      return NextResponse.json(
        { error: 'Missing progress ID' },
        { status: 400 }
      );
    }

    const updates: any = { progress };
    if (completed) {
      updates.completed_at = new Date().toISOString();
    }

    const { data: updated, error } = await supabaseAdmin
      .from('quest_progress')
      .update(updates)
      .eq('id', progressId)
      .eq('user_id', userId)
      .select();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update quest progress' },
        { status: 500 }
      );
    }

    return NextResponse.json(updated?.[0], { status: 200 });
  } catch (error) {
    console.error('[v0] Quest update failed:', error);
    return NextResponse.json(
      { error: 'Failed to update quest progress' },
      { status: 500 }
    );
  }
}
