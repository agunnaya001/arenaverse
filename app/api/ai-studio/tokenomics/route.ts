import { NextRequest, NextResponse } from 'next/server';
import {
  createTokenomics,
  addAllocation,
  validateTokenomics,
  calculateVestingSchedule,
  projectTokenPrice,
  analyzeDistribution,
  generateTokenomicsReport,
  calculateUtilityMetrics,
} from '@/lib/ai/tokenomics';

/**
 * POST /api/ai-studio/tokenomics
 * Create and validate tokenomics model
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
      tokenName,
      tokenSymbol,
      totalSupply,
      decimals,
      launchPrice,
      allocations,
      roadmap,
    } = body;

    if (!tokenName || !tokenSymbol || !totalSupply) {
      return NextResponse.json(
        { error: 'Missing required fields: tokenName, tokenSymbol, totalSupply' },
        { status: 400 }
      );
    }

    // Create tokenomics
    let tokenomics = createTokenomics(
      tokenName,
      tokenSymbol,
      totalSupply,
      decimals || 18,
      launchPrice || 0.01
    );

    // Add allocations
    if (allocations && Array.isArray(allocations)) {
      allocations.forEach((alloc: any) => {
        tokenomics = addAllocation(
          tokenomics,
          alloc.name,
          alloc.percentage,
          alloc.description,
          alloc.vesting
        );
      });
    }

    // Add roadmap
    if (roadmap) {
      tokenomics.roadmap = roadmap;
    }

    // Validate
    const validation = validateTokenomics(tokenomics);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid tokenomics', errors: validation.errors },
        { status: 400 }
      );
    }

    // Analyze distribution
    const analysis = analyzeDistribution(tokenomics);

    // Calculate vesting schedules
    const vestingSchedules: any = {};
    tokenomics.allocations.forEach((alloc) => {
      if (alloc.vesting) {
        vestingSchedules[alloc.name] = calculateVestingSchedule(alloc.amount, alloc.vesting);
      }
    });

    return NextResponse.json(
      {
        success: true,
        tokenomics,
        validation: {
          valid: validation.valid,
          errors: validation.errors,
        },
        analysis,
        vestingSchedules: Object.keys(vestingSchedules).length > 0 ? vestingSchedules : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Tokenomics creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create tokenomics' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai-studio/tokenomics/analyze
 * Analyze tokenomics metrics
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

    // Price projection
    const hasProjection = searchParams.has('projection');
    if (hasProjection) {
      const initialSupply = parseInt(searchParams.get('initialSupply') || '1000000');
      const initialPrice = parseFloat(searchParams.get('initialPrice') || '0.01');
      const monthlyBurn = parseFloat(searchParams.get('monthlyBurn') || '0');
      const months = parseInt(searchParams.get('months') || '12');
      const demandGrowth = parseFloat(searchParams.get('demandGrowth') || '5');

      const projection = projectTokenPrice(initialSupply, initialPrice, {
        monthlyBurnPercentage: monthlyBurn,
        months,
        demandGrowth,
      });

      return NextResponse.json(
        {
          success: true,
          projection,
        },
        { status: 200 }
      );
    }

    // Utility metrics
    const hasUtility = searchParams.has('utility');
    if (hasUtility) {
      const totalSupply = parseInt(searchParams.get('totalSupply') || '1000000');
      const estimatedUsers = parseInt(searchParams.get('estimatedUsers') || '10000');
      const dailyActiveUsers = parseInt(searchParams.get('dailyActiveUsers') || '2000');
      const launchPrice = parseFloat(searchParams.get('launchPrice') || '0.01');

      const metrics = calculateUtilityMetrics(
        {
          tokenName: 'Token',
          tokenSymbol: 'TKN',
          totalSupply,
          decimals: 18,
          allocations: [],
          launchPrice,
          initialMarketCap: totalSupply * launchPrice,
        },
        estimatedUsers,
        dailyActiveUsers
      );

      return NextResponse.json(
        {
          success: true,
          metrics,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Specify ?projection or ?utility for analysis' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[v0] Tokenomics analysis failed:', error);
    return NextResponse.json(
      { error: 'Failed to analyze tokenomics' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/ai-studio/tokenomics/report
 * Generate tokenomics report
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
    const { tokenomics } = body;

    if (!tokenomics) {
      return NextResponse.json(
        { error: 'Missing tokenomics object' },
        { status: 400 }
      );
    }

    const report = generateTokenomicsReport(tokenomics);

    return NextResponse.json(
      {
        success: true,
        report,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Tokenomics report generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
