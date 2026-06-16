export interface TokenomicsAllocation {
  name: string;
  percentage: number;
  amount: number;
  description?: string;
  vesting?: VestingSchedule;
}

export interface VestingSchedule {
  cliffMonths: number;
  vestingMonths: number;
  initialPercentage: number;
}

export interface Tokenomics {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: number;
  decimals: number;
  allocations: TokenomicsAllocation[];
  launchPrice: number;
  initialMarketCap: number;
  roadmap?: RoadmapPhase[];
}

export interface RoadmapPhase {
  name: string;
  date: string;
  description: string;
  milestones?: string[];
}

export interface TokenDistribution {
  category: string;
  amount: number;
  percentage: number;
  lockedUntil?: string;
  vestingSchedule?: VestingSchedule;
}

/**
 * Create tokenomics distribution
 */
export function createTokenomics(
  tokenName: string,
  tokenSymbol: string,
  totalSupply: number,
  decimals: number = 18,
  launchPrice: number = 0.01
): Tokenomics {
  return {
    tokenName,
    tokenSymbol,
    totalSupply,
    decimals,
    allocations: [],
    launchPrice,
    initialMarketCap: totalSupply * launchPrice,
  };
}

/**
 * Add allocation to tokenomics
 */
export function addAllocation(
  tokenomics: Tokenomics,
  name: string,
  percentage: number,
  description?: string,
  vesting?: VestingSchedule
): Tokenomics {
  const amount = (tokenomics.totalSupply * percentage) / 100;

  return {
    ...tokenomics,
    allocations: [
      ...tokenomics.allocations,
      {
        name,
        percentage,
        amount,
        description,
        vesting,
      },
    ],
  };
}

/**
 * Validate tokenomics allocations sum to 100%
 */
export function validateTokenomics(
  tokenomics: Tokenomics
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!tokenomics.tokenName) {
    errors.push('Token name is required');
  }

  if (!tokenomics.tokenSymbol) {
    errors.push('Token symbol is required');
  }

  if (tokenomics.totalSupply <= 0) {
    errors.push('Total supply must be greater than 0');
  }

  const totalPercentage = tokenomics.allocations.reduce(
    (sum, alloc) => sum + alloc.percentage,
    0
  );

  if (Math.abs(totalPercentage - 100) > 0.01) {
    errors.push(`Allocations total ${totalPercentage}%, must equal 100%`);
  }

  tokenomics.allocations.forEach((alloc, idx) => {
    if (alloc.percentage < 0 || alloc.percentage > 100) {
      errors.push(`Allocation ${idx}: percentage must be between 0 and 100`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate vesting schedule
 */
export function calculateVestingSchedule(
  amount: number,
  vesting: VestingSchedule
): { month: number; amount: number; cumulative: number }[] {
  const schedule: { month: number; amount: number; cumulative: number }[] = [];

  const cliffAmount = (amount * vesting.initialPercentage) / 100;
  const remainingAmount = amount - cliffAmount;
  const monthlyVesting = remainingAmount / vesting.vestingMonths;

  let cumulativeAmount = 0;

  // Cliff release
  if (vesting.cliffMonths > 0) {
    cumulativeAmount += cliffAmount;
    schedule.push({
      month: vesting.cliffMonths,
      amount: cliffAmount,
      cumulative: cumulativeAmount,
    });
  }

  // Linear vesting
  for (let i = 1; i <= vesting.vestingMonths; i++) {
    cumulativeAmount += monthlyVesting;
    schedule.push({
      month: vesting.cliffMonths + i,
      amount: monthlyVesting,
      cumulative: cumulativeAmount,
    });
  }

  return schedule;
}

/**
 * Project token price based on burn/supply mechanics
 */
export function projectTokenPrice(
  initialSupply: number,
  initialPrice: number,
  params: {
    monthlyBurnPercentage?: number;
    months?: number;
    demandGrowth?: number; // Monthly growth percentage
  }
): { month: number; supply: number; marketCap: number; price: number }[] {
  const projections: { month: number; supply: number; marketCap: number; price: number }[] = [];

  let currentSupply = initialSupply;
  let currentPrice = initialPrice;
  const monthlyBurn = params.monthlyBurnPercentage || 0;
  const months = params.months || 12;
  const demandGrowth = (params.demandGrowth || 0) / 100;

  for (let month = 0; month <= months; month++) {
    const marketCap = currentSupply * currentPrice;

    projections.push({
      month,
      supply: currentSupply,
      marketCap,
      price: currentPrice,
    });

    // Apply burn
    if (monthlyBurn > 0) {
      currentSupply = currentSupply * (1 - monthlyBurn / 100);
    }

    // Apply demand growth
    if (demandGrowth > 0) {
      currentPrice = currentPrice * (1 + demandGrowth);
    }
  }

  return projections;
}

/**
 * Analyze token distribution health
 */
export function analyzeDistribution(
  tokenomics: Tokenomics
): {
  concentration: number; // Highest allocation %
  diversity: number; // Number of meaningful allocations
  recommendation: string;
} {
  const sorted = [...tokenomics.allocations].sort((a, b) => b.percentage - a.percentage);
  const concentration = sorted[0]?.percentage || 0;

  // Count allocations > 5%
  const diversity = tokenomics.allocations.filter((a) => a.percentage > 5).length;

  let recommendation = 'Balanced distribution';
  if (concentration > 50) {
    recommendation = 'Highly concentrated - consider diversifying';
  } else if (concentration > 40) {
    recommendation = 'Moderately concentrated - could improve diversity';
  }

  return {
    concentration,
    diversity,
    recommendation,
  };
}

/**
 * Generate tokenomics report
 */
export function generateTokenomicsReport(
  tokenomics: Tokenomics
): string {
  const validation = validateTokenomics(tokenomics);

  let report = `# Tokenomics Report: ${tokenomics.tokenName} (${tokenomics.tokenSymbol})\n\n`;

  report += `## Overview\n`;
  report += `- Total Supply: ${tokenomics.totalSupply.toLocaleString()} ${tokenomics.tokenSymbol}\n`;
  report += `- Decimals: ${tokenomics.decimals}\n`;
  report += `- Launch Price: $${tokenomics.launchPrice}\n`;
  report += `- Initial Market Cap: $${tokenomics.initialMarketCap.toLocaleString()}\n\n`;

  report += `## Token Allocations\n`;
  report += `| Allocation | Percentage | Amount | Description |\n`;
  report += `|---|---|---|---|\n`;

  tokenomics.allocations.forEach((alloc) => {
    const desc = alloc.description || 'N/A';
    report += `| ${alloc.name} | ${alloc.percentage.toFixed(2)}% | ${alloc.amount.toLocaleString()} | ${desc} |\n`;
  });

  if (tokenomics.roadmap) {
    report += `\n## Roadmap\n`;
    tokenomics.roadmap.forEach((phase) => {
      report += `### ${phase.name} (${phase.date})\n`;
      report += `${phase.description}\n`;
      if (phase.milestones) {
        report += `Milestones:\n`;
        phase.milestones.forEach((m) => {
          report += `- ${m}\n`;
        });
      }
    });
  }

  report += `\n## Validation\n`;
  report += `Status: ${validation.valid ? '✓ Valid' : '✗ Invalid'}\n`;
  if (!validation.valid) {
    report += `Errors:\n`;
    validation.errors.forEach((e) => {
      report += `- ${e}\n`;
    });
  }

  return report;
}

/**
 * Calculate utility token metrics
 */
export function calculateUtilityMetrics(
  tokenomics: Tokenomics,
  estimatedUsers: number,
  dailyActiveUsers: number
): {
  tokensPerUser: number;
  dailyActiveTokens: number;
  utilizationRate: number;
  projectedDailyVolume: number;
} {
  const tokensPerUser = tokenomics.totalSupply / estimatedUsers;
  const dailyActiveTokens = (dailyActiveUsers / estimatedUsers) * tokenomics.totalSupply;
  const utilizationRate = (dailyActiveUsers / estimatedUsers) * 100;

  // Assume 10% of daily active tokens are traded
  const projectedDailyVolume = dailyActiveTokens * 0.1 * tokenomics.launchPrice;

  return {
    tokensPerUser,
    dailyActiveTokens,
    utilizationRate,
    projectedDailyVolume,
  };
}
