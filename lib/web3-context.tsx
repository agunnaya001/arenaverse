'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { BASE_CHAIN, CONTRACTS, ARENA_TOKEN_ABI, formatAddress, formatTokenAmount } from './contracts';

// Ethereum types
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

interface Web3ContextType {
  address: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  chainId: number | null;
  ethBalance: string;
  arenaBalance: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
  formatAddress: (address: string) => string;
  sendTransaction: (to: string, data: string, value?: string) => Promise<string>;
  readContract: (address: string, abi: readonly unknown[], functionName: string, args?: unknown[]) => Promise<unknown>;
  writeContract: (address: string, abi: readonly unknown[], functionName: string, args?: unknown[], value?: bigint) => Promise<string>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [ethBalance, setEthBalance] = useState('0');
  const [arenaBalance, setArenaBalance] = useState('0');

  const isConnected = !!address;

  // Fetch balances
  const fetchBalances = useCallback(async (userAddress: string) => {
    if (!window.ethereum) return;

    try {
      // Fetch ETH balance
      const ethBalanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [userAddress, 'latest'],
      }) as string;
      const ethBalanceBigInt = BigInt(ethBalanceHex);
      setEthBalance(formatTokenAmount(ethBalanceBigInt));

      // Fetch ARENA token balance
      const balanceOfSelector = '0x70a08231';
      const paddedAddress = userAddress.slice(2).padStart(64, '0');
      const data = balanceOfSelector + paddedAddress;

      const arenaBalanceHex = await window.ethereum.request({
        method: 'eth_call',
        params: [
          {
            to: CONTRACTS.ArenaToken,
            data,
          },
          'latest',
        ],
      }) as string;
      const arenaBalanceBigInt = BigInt(arenaBalanceHex || '0x0');
      setArenaBalance(formatTokenAmount(arenaBalanceBigInt));
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    if (!window.ethereum) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        await fetchBalances(accounts[0]);
      }

      const currentChainId = await window.ethereum.request({
        method: 'eth_chainId',
      }) as string;
      setChainId(parseInt(currentChainId, 16));
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [fetchBalances]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setEthBalance('0');
    setArenaBalance('0');
  }, []);

  // Switch to Base network
  const switchToBase = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BASE_CHAIN.id.toString(16)}` }],
      });
    } catch (switchError: unknown) {
      // Chain not added, add it
      if ((switchError as { code?: number })?.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${BASE_CHAIN.id.toString(16)}`,
              chainName: BASE_CHAIN.name,
              nativeCurrency: BASE_CHAIN.nativeCurrency,
              rpcUrls: BASE_CHAIN.rpcUrls.default.http,
              blockExplorerUrls: [BASE_CHAIN.blockExplorers.default.url],
            },
          ],
        });
      }
    }
  }, []);

  // Send transaction
  const sendTransaction = useCallback(
    async (to: string, data: string, value?: string): Promise<string> => {
      if (!window.ethereum || !address) throw new Error('Wallet not connected');

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: address,
            to,
            data,
            value: value ? `0x${BigInt(value).toString(16)}` : undefined,
          },
        ],
      }) as string;

      return txHash;
    },
    [address]
  );

  // Read from contract
  const readContract = useCallback(
    async (
      contractAddress: string,
      abi: readonly unknown[],
      functionName: string,
      args: unknown[] = []
    ): Promise<unknown> => {
      if (!window.ethereum) throw new Error('No Ethereum provider');

      // Find function in ABI
      const func = abi.find(
        (item: unknown) =>
          typeof item === 'object' &&
          item !== null &&
          'name' in item &&
          (item as { name: string }).name === functionName
      ) as { name: string; inputs: { type: string }[] } | undefined;

      if (!func) throw new Error(`Function ${functionName} not found in ABI`);

      // Encode function call
      const selector = encodeFunctionSelector(functionName, func.inputs.map((i) => i.type));
      const encodedArgs = encodeArguments(args);
      const data = selector + encodedArgs;

      const result = await window.ethereum.request({
        method: 'eth_call',
        params: [{ to: contractAddress, data }, 'latest'],
      });

      return result;
    },
    []
  );

  // Write to contract
  const writeContract = useCallback(
    async (
      contractAddress: string,
      abi: readonly unknown[],
      functionName: string,
      args: unknown[] = [],
      value?: bigint
    ): Promise<string> => {
      if (!window.ethereum || !address) throw new Error('Wallet not connected');

      // Find function in ABI
      const func = abi.find(
        (item: unknown) =>
          typeof item === 'object' &&
          item !== null &&
          'name' in item &&
          (item as { name: string }).name === functionName
      ) as { name: string; inputs: { type: string }[] } | undefined;

      if (!func) throw new Error(`Function ${functionName} not found in ABI`);

      // Encode function call
      const selector = encodeFunctionSelector(functionName, func.inputs.map((i) => i.type));
      const encodedArgs = encodeArguments(args);
      const data = selector + encodedArgs;

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: address,
            to: contractAddress,
            data,
            value: value ? `0x${value.toString(16)}` : undefined,
          },
        ],
      }) as string;

      // Refresh balances after transaction
      setTimeout(() => fetchBalances(address), 5000);

      return txHash;
    },
    [address, fetchBalances]
  );

  // Listen for account and chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accountsArray = accounts as string[];
      if (accountsArray.length === 0) {
        disconnect();
      } else {
        setAddress(accountsArray[0]);
        fetchBalances(accountsArray[0]);
      }
    };

    const handleChainChanged = (chainIdHex: unknown) => {
      setChainId(parseInt(chainIdHex as string, 16));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Check if already connected
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        const accountsArray = accounts as string[];
        if (accountsArray.length > 0) {
          setAddress(accountsArray[0]);
          fetchBalances(accountsArray[0]);
        }
      })
      .catch(console.error);

    window.ethereum
      .request({ method: 'eth_chainId' })
      .then((chainIdHex) => {
        setChainId(parseInt(chainIdHex as string, 16));
      })
      .catch(console.error);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [disconnect, fetchBalances]);

  return (
    <Web3Context.Provider
      value={{
        address,
        isConnecting,
        isConnected,
        chainId,
        ethBalance,
        arenaBalance,
        connect,
        disconnect,
        switchToBase,
        formatAddress,
        sendTransaction,
        readContract,
        writeContract,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

// Helper function to encode function selector
function encodeFunctionSelector(name: string, types: string[]): string {
  const signature = `${name}(${types.join(',')})`;
  // Simple keccak256 implementation for function selector
  // In production, use a proper library like ethers.js or viem
  const hash = simpleKeccak256(signature);
  return '0x' + hash.slice(0, 8);
}

// Helper function to encode arguments
function encodeArguments(args: unknown[]): string {
  return args
    .map((arg) => {
      if (typeof arg === 'string' && arg.startsWith('0x')) {
        return arg.slice(2).padStart(64, '0');
      }
      if (typeof arg === 'bigint' || typeof arg === 'number') {
        return BigInt(arg).toString(16).padStart(64, '0');
      }
      return '';
    })
    .join('');
}

// Simple hash function for demonstration
// In production, use a proper keccak256 implementation
function simpleKeccak256(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}
