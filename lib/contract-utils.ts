import { CONTRACTS, ARENA_CHAMPION_ABI, ARENA_BATTLE_ABI, ARENA_PVP_ABI, ARENA_MARKETPLACE_ABI } from './contracts';
import { getContract } from 'viem';

/**
 * Get contract instances for reading data from the blockchain
 */
export function getReadableContract(address: string, abi: any[], publicClient: any) {
  if (!publicClient) return null;
  return getContract({
    address: address as `0x${string}`,
    abi,
    client: publicClient,
  });
}

/**
 * Format token display
 */
export function formatTokenDisplay(amount: string, decimals: number = 4): string {
  if (!amount || amount === '0') return '0.0000';
  const num = parseFloat(amount);
  return num.toFixed(decimals);
}

/**
 * Parse token input to bigint
 */
export function parseTokenInput(input: string, decimals: number = 18): bigint {
  try {
    const [integer = '0', fraction = ''] = input.split('.');
    const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
    const fullNumber = integer + paddedFraction;
    return BigInt(fullNumber);
  } catch {
    return BigInt(0);
  }
}

/**
 * Safe contract call wrapper
 */
export async function safeContractCall<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error('[v0] Contract call failed:', error);
    return fallback;
  }
}
