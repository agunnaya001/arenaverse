import { NextRequest, NextResponse } from 'next/server';
import { executeAgent } from '@/lib/marketplace/agent-marketplace';
import { checkRateLimit } from '@/lib/middleware/rate-limit';

/**
 * POST /api/marketplace/execute
 * Execute an agent with custom payload
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

    // Check rate limit
    const rateLimit = await checkRateLimit(userId, '/api/marketplace/execute');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many execution requests' },
        { status: 429, headers: { 'Retry-After': Math.ceil((rateLimit.resetTime.getTime() - Date.now()) / 1000).toString() } }
      );
    }

    const body = await request.json();
    const { agentId, payload } = body;

    if (!agentId) {
      return NextResponse.json(
        { error: 'Missing agent ID' },
        { status: 400 }
      );
    }

    const execution = await executeAgent(userId, agentId, payload || {});

    if (!execution) {
      return NextResponse.json(
        { error: 'Failed to execute agent' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        execution: {
          id: execution.id,
          status: execution.status,
          executionTime: execution.execution_time_ms,
          response: execution.webhook_response,
          error: execution.error_message,
        },
      },
      { status: execution.status === 'Success' ? 200 : 400 }
    );
  } catch (error) {
    console.error('[v0] Agent execution failed:', error);
    return NextResponse.json(
      { error: 'Failed to execute agent' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/marketplace/execute
 * Get execution history
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

    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');

    const { supabase } = await import('@/lib/supabase/client');

    let query = supabase
      .from('agent_executions')
      .select('*')
      .eq('user_id', userId);

    if (agentId) {
      query = query.eq('agent_id', agentId);
    }

    const { data: executions, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch executions' },
        { status: 500 }
      );
    }

    // Calculate stats
    const successful = executions?.filter((e) => e.status === 'Success').length || 0;
    const failed = executions?.filter((e) => e.status === 'Failed').length || 0;
    const avgTime = executions && executions.length > 0
      ? executions.reduce((sum, e) => sum + (e.execution_time_ms || 0), 0) / executions.length
      : 0;

    return NextResponse.json(
      {
        success: true,
        executions,
        stats: {
          total: executions?.length || 0,
          successful,
          failed,
          avgExecutionTime: Math.round(avgTime),
          successRate: executions && executions.length > 0
            ? ((successful / executions.length) * 100).toFixed(2)
            : 0,
        },
        pagination: {
          offset,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Execution history fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch execution history' },
      { status: 500 }
    );
  }
}
