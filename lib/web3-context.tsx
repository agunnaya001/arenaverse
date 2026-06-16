'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useAccount, useBalance, useConnect, useDisconnect, useSwitchChain, usePublicClient } from 'wagmi';
import { metaMask, walletConnect, coinbaseWallet } from '@wagmi/connectors';
import { base } from 'wagmi/chains';
import { createConfig, http } from '@wagmi/core';
import { CONTRACTS, BASE_CHAIN_ID, ADMIN_ADDRESSES, formatAddress } from './contracts';
import { ethers } from 'ethers';

export const BASE_CHAIN = base;

// Create Wagmi config
export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
    }),
    coinbaseWallet({
      appName: 'ArenaVerse',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

interface Web3ContextType {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  ethBalance: string;
  arenaBalance: string;
  isAdmin: boolean;
  connect: (connectorName?: string) => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
  formatAddress: (addr: string) => string;
  publicClient: any | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const { address, chainId, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address, chainId: base.id });
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const publicClient = usePublicClient({ chainId: base.id });

  const [arenaBalance, setArenaBalance] = useState<string>('0.0000');

  // Fetch ARENA token balance
  useEffect(() => {
    const fetchArenaBalance = async () => {
      if (!address || !publicClient) {
        setArenaBalance('0.0000');
        return;
      }

      try {
        const ARENA_TOKEN_ABI = [
          'function balanceOf(address owner) view returns (uint256)',
          'function decimals() view returns (uint8)',
        ] as const;

        const balance = await publicClient.readContract({
          address: CONTRACTS.ARENA_TOKEN as `0x${string}`,
          abi: ARENA_TOKEN_ABI,
          functionName: 'balanceOf',
          args: [address as `0x${string}`],
        });

        const decimals = await publicClient.readContract({
          address: CONTRACTS.ARENA_TOKEN as `0x${string}`,
          abi: ARENA_TOKEN_ABI,
          functionName: 'decimals',
        });

        const formatted = (Number(balance) / Math.pow(10, decimals)).toFixed(4);
        setArenaBalance(formatted);
      } catch (error) {
        console.error('[v0] Failed to fetch ARENA balance:', error);
        setArenaBalance('0.0000');
      }
    };

    fetchArenaBalance();
    const interval = setInterval(fetchArenaBalance, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [address, publicClient]);

  // Ensure user is on Base chain
  const switchToBase = useCallback(async () => {
    if (chainId !== base.id) {
      try {
        await switchChain({ chainId: base.id });
      } catch (error) {
        console.error('[v0] Failed to switch chain:', error);
      }
    }
  }, [chainId, switchChain]);

  const handleConnect = useCallback(
    async (connectorName?: string) => {
      const connector = connectorName
        ? connectors.find((c) => c.id === connectorName)
        : connectors[0];

      if (connector) {
        connect({ connector });
      }
    },
    [connect, connectors]
  );

  const isAdmin = address ? ADMIN_ADDRESSES.includes(address.toLowerCase()) : false;

  const ethBalanceFormatted = balanceData
    ? parseFloat(balanceData.formatted).toFixed(4)
    : '0.0000';

  return (
    <Web3Context.Provider
      value={{
        address: address || null,
        chainId: chainId || null,
        isConnected,
        isConnecting,
        ethBalance: ethBalanceFormatted,
        arenaBalance,
        isAdmin,
        connect: handleConnect,
        disconnect,
        switchToBase,
        formatAddress,
        publicClient,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
}
