import { NextRequest, NextResponse } from 'next/server';
import { postActivity, getActivityFeed, getUserFriends, sendFriendRequest, acceptFriendRequest } from '@/lib/ecosystem/ecosystem';

/**
 * POST /api/ecosystem/social
 * Post activity or create friend request
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 401 });
    }

    const body = await request.json();
    const { action, activityType, activityData, visibility, friendId } = body;

    // Create friend request
    if (action === 'friend_request' && friendId) {
      const success = await sendFriendRequest(userId, friendId);

      if (!success) {
        return NextResponse.json(
          { error: 'Failed to send friend request' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: true, message: 'Friend request sent' },
        { status: 201 }
      );
    }

    // Accept friend request
    if (action === 'accept_friend' && friendId) {
      const success = await acceptFriendRequest(userId, friendId);

      if (!success) {
        return NextResponse.json(
          { error: 'Failed to accept friend request' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: true, message: 'Friend request accepted' },
        { status: 200 }
      );
    }

    // Post activity
    if (activityType) {
      const activity = await postActivity(
        userId,
        activityType,
        activityData,
        visibility || 'Public'
      );

      if (!activity) {
        return NextResponse.json(
          { error: 'Failed to post activity' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, activity },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[v0] Social action failed:', error);
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ecosystem/social
 * Get activity feed and friends
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'feed' or 'friends'

    if (type === 'friends') {
      const friends = await getUserFriends(userId || '');
      return NextResponse.json(
        { success: true, friends, count: friends.length },
        { status: 200 }
      );
    }

    // Default: activity feed
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');

    const feed = await getActivityFeed(limit, offset);

    return NextResponse.json(
      { success: true, feed, pagination: { offset, limit } },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Social fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social data' },
      { status: 500 }
    );
  }
}
