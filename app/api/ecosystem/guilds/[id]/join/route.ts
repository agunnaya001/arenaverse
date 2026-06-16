import { NextRequest, NextResponse } from 'next/server';
import { joinGuild } from '@/lib/ecosystem/ecosystem';

/**
 * POST /api/ecosystem/guilds/[id]/join
 * Join a guild
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 401 });
    }

    const success = await joinGuild(userId, params.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to join guild' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Successfully joined guild' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Guild join failed:', error);
    return NextResponse.json(
      { error: 'Failed to join guild' },
      { status: 500 }
    );
  }
}
