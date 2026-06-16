import { NextRequest, NextResponse } from 'next/server';
import { searchAgents, createAgent, getAgent } from '@/lib/marketplace/agent-marketplace';

/**
 * GET /api/marketplace/agents
 * Search and list agents
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');

    const agents = await searchAgents(query || undefined, category as any, limit, offset);

    return NextResponse.json(
      {
        success: true,
        agents,
        pagination: {
          offset,
          limit,
          total: agents.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Agent search failed:', error);
    return NextResponse.json(
      { error: 'Failed to search agents' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/marketplace/agents
 * Create new agent
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
    const {
      name,
      description,
      category,
      webhookUrl,
      pricingTier,
      pricingAmount,
    } = body;

    if (!name || !description || !category || !webhookUrl || !pricingTier) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const agent = await createAgent(
      userId,
      name,
      description,
      category,
      webhookUrl,
      pricingTier,
      pricingAmount
    );

    if (!agent) {
      return NextResponse.json(
        { error: 'Failed to create agent' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        agent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Agent creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}
