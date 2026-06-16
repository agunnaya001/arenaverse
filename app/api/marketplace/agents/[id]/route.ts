import { NextRequest, NextResponse } from 'next/server';
import { getAgent, getAgentAnalytics, addAgentReview } from '@/lib/marketplace/agent-marketplace';

/**
 * GET /api/marketplace/agents/[id]
 * Get agent details and reviews
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await getAgent(params.id);

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    const analytics = await getAgentAnalytics(params.id);

    return NextResponse.json(
      {
        success: true,
        agent,
        analytics,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Agent fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/marketplace/agents/[id]/review
 * Add review to agent
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { rating, review } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const agentReview = await addAgentReview(
      userId,
      params.id,
      rating,
      review
    );

    if (!agentReview) {
      return NextResponse.json(
        { error: 'Failed to add review' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        review: agentReview,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Review creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    );
  }
}
