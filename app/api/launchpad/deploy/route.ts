import { NextRequest, NextResponse } from 'next/server';
import {
  createDeployment,
  updateDeploymentSuccess,
  updateDeploymentFailed,
  estimateDeploymentGas,
  getUserDeployments,
} from '@/lib/launchpad/deployment';

/**
 * POST /api/launchpad/deploy
 * Create a deployment record (actual deployment handled separately via webhook)
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
    const { contractType, contractName, contractCode, chainId } = body;

    if (!contractType || !contractName || !contractCode || !chainId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate contract type
    const validTypes = ['ERC20', 'ERC721', 'ERC1155', 'DAO', 'Staking'];
    if (!validTypes.includes(contractType)) {
      return NextResponse.json(
        { error: 'Invalid contract type' },
        { status: 400 }
      );
    }

    // Get gas estimate
    const gasEstimate = estimateDeploymentGas(contractType);

    // Create deployment record
    const deployment = await createDeployment(
      userId,
      contractType,
      contractName,
      contractCode,
      chainId
    );

    if (!deployment) {
      return NextResponse.json(
        { error: 'Failed to create deployment record' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        deployment: {
          id: deployment.id,
          status: deployment.status,
          contractName: deployment.contract_name,
          contractType: deployment.contract_type,
          createdAt: deployment.created_at,
        },
        gasEstimate,
        message: 'Deployment queued. Monitor status for updates.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Deployment creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create deployment' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/launchpad/deploy
 * Get user's deployments
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
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');

    const deployments = await getUserDeployments(userId, limit, offset);

    return NextResponse.json(
      {
        success: true,
        deployments,
        pagination: {
          offset,
          limit,
          total: deployments.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Deployment fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deployments' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/launchpad/deploy
 * Webhook endpoint for deployment updates
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify this is coming from authorized source
    const authToken = request.headers.get('x-deployment-token');
    if (authToken !== process.env.DEPLOYMENT_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      deploymentId,
      status,
      contractAddress,
      transactionHash,
      gasUsed,
      deploymentCost,
      error,
    } = body;

    if (!deploymentId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (status === 'Deployed' || status === 'Verified') {
      if (!contractAddress || !transactionHash) {
        return NextResponse.json(
          { error: 'Missing contract details for successful deployment' },
          { status: 400 }
        );
      }

      const success = await updateDeploymentSuccess(
        deploymentId,
        contractAddress,
        transactionHash,
        gasUsed,
        deploymentCost
      );

      if (!success) {
        return NextResponse.json(
          { error: 'Failed to update deployment' },
          { status: 500 }
        );
      }
    } else if (status === 'Failed') {
      const success = await updateDeploymentFailed(deploymentId, error || 'Unknown error');

      if (!success) {
        return NextResponse.json(
          { error: 'Failed to update deployment' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: true, message: 'Deployment updated' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Deployment update failed:', error);
    return NextResponse.json(
      { error: 'Failed to update deployment' },
      { status: 500 }
    );
  }
}
