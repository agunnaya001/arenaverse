import { NextRequest, NextResponse } from 'next/server';
import { createTournament, joinTournament, getTournaments } from '@/lib/ecosystem/ecosystem';

/**
 * POST /api/ecosystem/tournaments
 * Create a new tournament (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const adminAddress = request.headers.get('x-wallet-address');
    const { isAdmin } = await import('@/lib/contracts');

    if (!adminAddress || !isAdmin(adminAddress)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      prizePool,
      maxParticipants,
      entryFee,
      startDate,
      endDate,
    } = body;

    if (!name || !prizePool || !maxParticipants) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const tournament = await createTournament(
      name,
      description,
      prizePool,
      maxParticipants,
      entryFee,
      startDate,
      endDate
    );

    if (!tournament) {
      return NextResponse.json(
        { error: 'Failed to create tournament' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, tournament },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Tournament creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create tournament' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ecosystem/tournaments
 * Get tournaments
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const tournaments = await getTournaments(status || undefined);

    return NextResponse.json(
      { success: true, tournaments, count: tournaments.length },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Tournament fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tournaments' },
      { status: 500 }
    );
  }
}
