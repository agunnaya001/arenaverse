import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * GET /api/quest/list
 * Get available quests
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // Daily, Weekly, Campaign, Special
    const difficulty = searchParams.get('difficulty'); // Easy, Normal, Hard, Legendary

    let query = supabase
      .from('quests')
      .select('*')
      .eq('active', true);

    if (type) {
      query = query.eq('quest_type', type);
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    const { data: quests, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch quests' },
        { status: 500 }
      );
    }

    return NextResponse.json(quests, { status: 200 });
  } catch (error) {
    console.error('[v0] Quest fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quests' },
      { status: 500 }
    );
  }
}
