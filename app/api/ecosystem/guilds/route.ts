import { NextRequest, NextResponse } from 'next/server';
import { createGuild, joinGuild, getGuilds } from '@/lib/ecosystem/ecosystem';

/**
 * POST /api/ecosystem/guilds
 * Create a new guild
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Guild name is required' },
        { status: 400 }
      );
    }

    const guild = await createGuild(userId, name, description || '');

    if (!guild) {
      return NextResponse.json(
        { error: 'Failed to create guild' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, guild }, { status: 201 });
  } catch (error) {
    console.error('[v0] Guild creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create guild' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ecosystem/guilds
 * Get available guilds
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');

    const guilds = await getGuilds(limit, offset);

    return NextResponse.json(
      {
        success: true,
        guilds,
        pagination: { offset, limit, total: guilds.length },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Guild fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guilds' },
      { status: 500 }
    );
  }
}
