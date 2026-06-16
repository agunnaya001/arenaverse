import { NextRequest, NextResponse } from 'next/server';
import { createReferral, getReferralStats } from '@/lib/ecosystem/ecosystem';

/**
 * POST /api/ecosystem/referrals
 * Create a referral code/link
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 401 });
    }

    const body = await request.json();
    const { referredId, rewardAmount } = body;

    if (!referredId) {
      return NextResponse.json(
        { error: 'Referred user ID is required' },
        { status: 400 }
      );
    }

    const referral = await createReferral(
      userId,
      referredId,
      rewardAmount || 100
    );

    if (!referral) {
      return NextResponse.json(
        { error: 'Failed to create referral' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, referral },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Referral creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create referral' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ecosystem/referrals
 * Get referral statistics
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 401 });
    }

    const stats = await getReferralStats(userId);

    if (!stats) {
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, stats },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Referral stats fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral stats' },
      { status: 500 }
    );
  }
}
