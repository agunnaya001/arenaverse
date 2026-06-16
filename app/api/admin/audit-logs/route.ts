import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { isAdmin } from '@/lib/contracts';

/**
 * GET /api/admin/audit-logs
 * Get admin audit logs (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const adminAddress = request.headers.get('x-wallet-address');

    if (!adminAddress || !isAdmin(adminAddress)) {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);
    const offset = parseInt(searchParams.get('offset') || '0');

    const { data: logs, error } = await supabaseAdmin
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch audit logs' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        logs,
        pagination: {
          offset,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Audit log fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/audit-logs
 * Create an audit log entry
 */
export async function POST(request: NextRequest) {
  try {
    const adminId = request.headers.get('x-user-id');
    const adminAddress = request.headers.get('x-wallet-address');

    if (!adminAddress || !isAdmin(adminAddress)) {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 403 }
      );
    }

    if (!adminId) {
      return NextResponse.json(
        { error: 'Missing admin user ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action, targetUserId, details } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Missing action' },
        { status: 400 }
      );
    }

    const { data: log, error } = await supabaseAdmin
      .from('audit_logs')
      .insert({
        admin_id: adminId,
        action,
        target_user_id: targetUserId,
        details,
        ip_address: request.ip,
        user_agent: request.headers.get('user-agent'),
      })
      .select();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create audit log' },
        { status: 500 }
      );
    }

    return NextResponse.json(log?.[0], { status: 201 });
  } catch (error) {
    console.error('[v0] Audit log creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}
