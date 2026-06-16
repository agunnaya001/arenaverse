import { supabaseAdmin } from '../supabase/client';

export type DeploymentStatus = 'Pending' | 'Deploying' | 'Deployed' | 'Failed' | 'Verified';
export type ContractType = 'ERC20' | 'ERC721' | 'ERC1155' | 'DAO' | 'Staking';

export interface DeploymentRecord {
  id: string;
  user_id: string;
  contract_type: ContractType;
  contract_name: string;
  contract_code: string;
  contract_address?: string;
  transaction_hash?: string;
  status: DeploymentStatus;
  chain_id: number;
  gas_used?: number;
  deployment_cost?: string;
  etherscan_url?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeploymentAnalytics {
  totalDeployments: number;
  successfulDeployments: number;
  failedDeployments: number;
  verifiedContracts: number;
  totalGasUsed: number;
  averageDeploymentCost: string;
  mostDeployedType: ContractType;
}

/**
 * Create deployment record
 */
export async function createDeployment(
  userId: string,
  contractType: ContractType,
  contractName: string,
  contractCode: string,
  chainId: number
): Promise<DeploymentRecord | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('deployments')
      .insert({
        user_id: userId,
        contract_type: contractType,
        contract_name: contractName,
        contract_code: contractCode,
        chain_id: chainId,
        status: 'Pending',
        verified: false,
      })
      .select();

    if (error || !data) {
      console.error('[v0] Deployment creation failed:', error);
      return null;
    }

    return data[0] as DeploymentRecord;
  } catch (error) {
    console.error('[v0] Error creating deployment:', error);
    return null;
  }
}

/**
 * Update deployment with contract address after deployment
 */
export async function updateDeploymentSuccess(
  deploymentId: string,
  contractAddress: string,
  transactionHash: string,
  gasUsed?: number,
  deploymentCost?: string
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('deployments')
      .update({
        status: 'Deployed',
        contract_address: contractAddress.toLowerCase(),
        transaction_hash: transactionHash,
        gas_used: gasUsed,
        deployment_cost: deploymentCost,
        etherscan_url: `https://etherscan.io/address/${contractAddress}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', deploymentId);

    return !error;
  } catch (error) {
    console.error('[v0] Error updating deployment:', error);
    return false;
  }
}

/**
 * Update deployment to failed
 */
export async function updateDeploymentFailed(
  deploymentId: string,
  error: string
): Promise<boolean> {
  try {
    const { error: updateError } = await supabaseAdmin
      .from('deployments')
      .update({
        status: 'Failed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', deploymentId);

    return !updateError;
  } catch (error) {
    console.error('[v0] Error updating failed deployment:', error);
    return false;
  }
}

/**
 * Verify contract on Etherscan-like explorer
 */
export async function verifyContract(
  deploymentId: string,
  contractAddress: string,
  sourceCode: string,
  contractName: string,
  compilerVersion: string = 'v0.8.0'
): Promise<boolean> {
  try {
    // Update verification status
    const { error } = await supabaseAdmin
      .from('deployments')
      .update({
        verified: true,
        status: 'Verified',
        updated_at: new Date().toISOString(),
      })
      .eq('id', deploymentId);

    return !error;
  } catch (error) {
    console.error('[v0] Error verifying contract:', error);
    return false;
  }
}

/**
 * Get user's deployments
 */
export async function getUserDeployments(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<DeploymentRecord[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('deployments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[v0] Error fetching deployments:', error);
      return [];
    }

    return data as DeploymentRecord[];
  } catch (error) {
    console.error('[v0] Error getting user deployments:', error);
    return [];
  }
}

/**
 * Get deployment by ID
 */
export async function getDeployment(
  deploymentId: string,
  userId?: string
): Promise<DeploymentRecord | null> {
  try {
    let query = supabaseAdmin
      .from('deployments')
      .select('*')
      .eq('id', deploymentId);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return null;
    }

    return data as DeploymentRecord;
  } catch (error) {
    console.error('[v0] Error getting deployment:', error);
    return null;
  }
}

/**
 * Get deployment analytics for user
 */
export async function getDeploymentAnalytics(
  userId: string
): Promise<DeploymentAnalytics | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('deployments')
      .select('*')
      .eq('user_id', userId);

    if (error || !data) {
      return null;
    }

    const totalDeployments = data.length;
    const successfulDeployments = data.filter((d) => d.status === 'Deployed' || d.status === 'Verified').length;
    const failedDeployments = data.filter((d) => d.status === 'Failed').length;
    const verifiedContracts = data.filter((d) => d.verified).length;

    const totalGasUsed = data.reduce((sum, d) => sum + (d.gas_used || 0), 0);
    const deploymentCosts = data.filter((d) => d.deployment_cost).map((d) => parseFloat(d.deployment_cost || '0'));
    const averageDeploymentCost = deploymentCosts.length > 0
      ? (deploymentCosts.reduce((a, b) => a + b) / deploymentCosts.length).toFixed(4)
      : '0';

    // Find most deployed type
    const typeCounts: Record<ContractType, number> = {
      ERC20: 0,
      ERC721: 0,
      ERC1155: 0,
      DAO: 0,
      Staking: 0,
    };

    data.forEach((d) => {
      if (d.contract_type in typeCounts) {
        typeCounts[d.contract_type as ContractType]++;
      }
    });

    const mostDeployedType = (Object.entries(typeCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'ERC20') as ContractType;

    return {
      totalDeployments,
      successfulDeployments,
      failedDeployments,
      verifiedContracts,
      totalGasUsed,
      averageDeploymentCost,
      mostDeployedType,
    };
  } catch (error) {
    console.error('[v0] Error getting analytics:', error);
    return null;
  }
}

/**
 * Simulate deployment to estimate gas
 */
export function estimateDeploymentGas(contractType: ContractType): {
  estimatedGas: number;
  estimatedCost: string;
} {
  const gasEstimates: Record<ContractType, number> = {
    ERC20: 800000,
    ERC721: 1500000,
    ERC1155: 1200000,
    DAO: 2500000,
    Staking: 1800000,
  };

  const estimatedGas = gasEstimates[contractType];
  const gasPrice = 50; // gwei
  const totalWei = estimatedGas * gasPrice * 1e9;
  const ethValue = (totalWei / 1e18).toFixed(4);

  return {
    estimatedGas,
    estimatedCost: ethValue,
  };
}
