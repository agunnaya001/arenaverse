import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase/client';

/**
 * GET /api/player/profile
 * Get current player profile
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const walletAddress = request.headers.get('x-wallet-address');

    if (!userId && !walletAddress) {
      return NextResponse.json(
        { error: 'Missing user identification' },
        { status: 400 }
      );
    }

    const query = userId
      ? supabase.from('users').select('*').eq('id', userId)
      : supabase.from('users').select('*').eq('wallet_address', walletAddress?.toLowerCase());

    const { data: user, error } = await query.single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('[v0] Profile fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/player/profile
 * Update player profile
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
    const { username, avatar_url, bio } = body;

    // Validate updates
    const updates: any = {};
    if (username) updates.username = username;
    if (avatar_url) updates.avatar_url = avatar_url;
    if (bio !== undefined) updates.bio = bio;
    updates.updated_at = new Date().toISOString();

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(user?.[0], { status: 200 });
  } catch (error) {
    console.error('[v0] Profile update failed:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
