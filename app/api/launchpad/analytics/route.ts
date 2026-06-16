import { NextRequest, NextResponse } from 'next/server';
import { getDeploymentAnalytics, getUserDeployments } from '@/lib/launchpad/deployment';

/**
 * GET /api/launchpad/analytics
 * Get deployment analytics and statistics
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

    const analytics = await getDeploymentAnalytics(userId);

    if (!analytics) {
      return NextResponse.json(
        { error: 'Failed to fetch analytics' },
        { status: 500 }
      );
    }

    // Get recent deployments for timeline
    const deployments = await getUserDeployments(userId, 10);

    // Calculate success rate
    const successRate =
      analytics.totalDeployments > 0
        ? ((analytics.successfulDeployments / analytics.totalDeployments) * 100).toFixed(2)
        : '0';

    // Calculate verification rate
    const verificationRate =
      analytics.totalDeployments > 0
        ? ((analytics.verifiedContracts / analytics.totalDeployments) * 100).toFixed(2)
        : '0';

    return NextResponse.json(
      {
        success: true,
        analytics: {
          ...analytics,
          successRate: parseFloat(successRate),
          verificationRate: parseFloat(verificationRate),
        },
        recentDeployments: deployments.map((d) => ({
          id: d.id,
          name: d.contract_name,
          type: d.contract_type,
          status: d.status,
          createdAt: d.created_at,
          contractAddress: d.contract_address,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Analytics fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
