import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, ARENA_COIN_ABI, FIGHTER_NFT_ABI, BATTLE_ABI } from '../lib/contracts';
import { parseEther } from 'viem';

// ---- ArenaCoin Hooks ----

export function useArenaBalance(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.ARENA_COIN,
    abi: ARENA_COIN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useAllowance(owner?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.ARENA_COIN,
    abi: ARENA_COIN_ABI,
    functionName: 'allowance',
    args: owner ? [owner, CONTRACT_ADDRESSES.BATTLE] : undefined,
    query: { enabled: !!owner },
  });
}

export function useApprove() {
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = async (amount: string) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.ARENA_COIN,
      abi: ARENA_COIN_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESSES.BATTLE, parseEther(amount)],
    });
  };

  return { approve, isPending, isConfirming, isSuccess, hash };
}

// ---- ArenaFighterNFT Hooks ----

export function usePlayerFighters(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.FIGHTER_NFT,
    abi: FIGHTER_NFT_ABI,
    functionName: 'getTokensByOwner',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useFighterStats(tokenId?: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.FIGHTER_NFT,
    abi: FIGHTER_NFT_ABI,
    functionName: 'getFighterStats',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: tokenId !== undefined },
  });
}

export function useMintFighter() {
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // class_: 0=Warrior, 1=Mage, 2=Rogue
  // tokenURI_: metadata URI (using a placeholder for now)
  const mint = async (address: `0x${string}`, classId: number) => {
    const classNames = ['Warrior', 'Mage', 'Rogue'];
    const tokenURI = `data:application/json;base64,${btoa(JSON.stringify({
      name: `Arena ${classNames[classId]}`,
      description: `A ${classNames[classId]} fighter in the Arena Battle game`,
      image: `/images/${classNames[classId].toLowerCase()}.png`,
      attributes: [{ trait_type: 'Class', value: classNames[classId] }],
    }))}`;

    return writeContractAsync({
      address: CONTRACT_ADDRESSES.FIGHTER_NFT,
      abi: FIGHTER_NFT_ABI,
      functionName: 'mint',
      args: [address, classId, tokenURI],
    });
  };

  return { mint, isPending, isConfirming, isSuccess, hash };
}

// ---- ArenaBattle Hooks ----

export function useBattle() {
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const battle = async (fighterId: bigint) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.BATTLE,
      abi: BATTLE_ABI,
      functionName: 'battle',
      args: [fighterId],
    });
  };

  return { battle, isPending, isConfirming, isSuccess, hash };
}

export function useCancelBattle() {
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const cancelBattle = async () => {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.BATTLE,
      abi: BATTLE_ABI,
      functionName: 'cancelBattle',
      args: [],
    });
  };

  return { cancelBattle, isPending, isConfirming, isSuccess, hash };
}

export function usePendingBattle() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.BATTLE,
    abi: BATTLE_ABI,
    functionName: 'getPendingBattle',
    args: [],
  });
}

export function useOnChainPlayerStats(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.BATTLE,
    abi: BATTLE_ABI,
    functionName: 'getPlayerStats',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}
