'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Web3Provider, wagmiConfig } from '@/lib/web3-context';
import { ReactNode, useMemo } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  // Create queryClient inside a client component to avoid serialization issues
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
