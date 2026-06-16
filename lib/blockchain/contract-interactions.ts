import { ethers } from 'ethers';
import { CONTRACTS, BASE_RPC } from '@/lib/contracts';

/**
 * Minimal ABIs for contract interactions
 */
export const CONTRACT_ABIS = {
  ERC20: [
    'function name() public view returns (string)',
    'function symbol() public view returns (string)',
    'function decimals() public view returns (uint8)',
    'function totalSupply() public view returns (uint256)',
    'function balanceOf(address account) public view returns (uint256)',
    'function transfer(address to, uint256 amount) public returns (bool)',
    'function approve(address spender, uint256 amount) public returns (bool)',
    'function transferFrom(address from, address to, uint256 amount) public returns (bool)',
    'function allowance(address owner, address spender) public view returns (uint256)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event Approval(address indexed owner, address indexed spender, uint256 value)',
  ],

  ERC721: [
    'function name() public view returns (string)',
    'function symbol() public view returns (string)',
    'function balanceOf(address owner) public view returns (uint256)',
    'function ownerOf(uint256 tokenId) public view returns (address)',
    'function approve(address to, uint256 tokenId) public',
    'function transferFrom(address from, address to, uint256 tokenId) public',
    'function safeTransferFrom(address from, address to, uint256 tokenId) public',
    'function tokenURI(uint256 tokenId) public view returns (string)',
    'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
    'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
  ],

  ERC1155: [
    'function balanceOf(address account, uint256 id) public view returns (uint256)',
    'function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) public view returns (uint256[] memory)',
    'function setApprovalForAll(address operator, bool approved) public',
    'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) public',
    'function safeBatchTransferFrom(address from, address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data) public',
    'function uri(uint256 id) public view returns (string)',
    'event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)',
    'event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)',
  ],

  ARENA_TOKEN: [
    'function name() public view returns (string)',
    'function symbol() public view returns (string)',
    'function decimals() public view returns (uint8)',
    'function totalSupply() public view returns (uint256)',
    'function balanceOf(address account) public view returns (uint256)',
    'function transfer(address to, uint256 amount) public returns (bool)',
    'function approve(address spender, uint256 amount) public returns (bool)',
    'function transferFrom(address from, address to, uint256 amount) public returns (bool)',
    'function mint(address to, uint256 amount) public',
    'function burn(uint256 amount) public',
  ],

  ARENA_CHAMPION: [
    'function balanceOf(address owner) public view returns (uint256)',
    'function ownerOf(uint256 tokenId) public view returns (address)',
    'function mint(address to, string memory uri) public returns (uint256)',
    'function tokenURI(uint256 tokenId) public view returns (string)',
    'function transferFrom(address from, address to, uint256 tokenId) public',
  ],
};

/**
 * Initialize a provider for reading data
 */
export function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(BASE_RPC);
}

/**
 * Get a read-only contract instance
 */
export function getContract(
  address: string,
  abi: string[],
  provider?: ethers.JsonRpcProvider
): ethers.Contract {
  const prov = provider || getProvider();
  return new ethers.Contract(address, abi, prov);
}

/**
 * Get a signer contract instance (for writes)
 */
export async function getSignerContract(
  address: string,
  abi: string[],
  signer: ethers.Signer
): Promise<ethers.Contract> {
  return new ethers.Contract(address, abi, signer);
}

/**
 * ARENA Token read functions
 */
export const ArenaTokenReads = {
  async getName(): Promise<string> {
    const contract = getContract(CONTRACTS.ARENA_TOKEN, CONTRACT_ABIS.ERC20);
    return contract.name();
  },

  async getSymbol(): Promise<string> {
    const contract = getContract(CONTRACTS.ARENA_TOKEN, CONTRACT_ABIS.ERC20);
    return contract.symbol();
  },

  async getDecimals(): Promise<number> {
    const contract = getContract(CONTRACTS.ARENA_TOKEN, CONTRACT_ABIS.ERC20);
    return contract.decimals();
  },

  async getTotalSupply(): Promise<bigint> {
    const contract = getContract(CONTRACTS.ARENA_TOKEN, CONTRACT_ABIS.ARENA_TOKEN);
    return contract.totalSupply();
  },

  async getBalance(address: string): Promise<bigint> {
    const contract = getContract(CONTRACTS.ARENA_TOKEN, CONTRACT_ABIS.ERC20);
    return contract.balanceOf(address);
  },

  async getAllowance(owner: string, spender: string): Promise<bigint> {
    const contract = getContract(CONTRACTS.ARENA_TOKEN, CONTRACT_ABIS.ERC20);
    return contract.allowance(owner, spender);
  },
};

/**
 * ARENA Token write functions
 */
export const ArenaTokenWrites = {
  async transfer(
    signer: ethers.Signer,
    to: string,
    amount: bigint
  ): Promise<ethers.ContractTransactionResponse | null> {
    try {
      const contract = await getSignerContract(CONTRACTS.ARENA_TOKEN, CONTRACT_ABIS.ERC20, signer);
      return contract.transfer(to, amount);
    } catch (error) {
      console.error('Transfer failed:', error);
      throw error;
    }
  },

  async approve(
    signer: ethers.Signer,
    spender: string,
    amount: bigint
  ): Promise<ethers.ContractTransactionResponse | null> {
    try {
      const contract = await getSignerContract(CONTRACTS.ARENA_TOKEN, CONTRACT_ABIS.ERC20, signer);
      return contract.approve(spender, amount);
    } catch (error) {
      console.error('Approve failed:', error);
      throw error;
    }
  },

  async mint(
    signer: ethers.Signer,
    to: string,
    amount: bigint
  ): Promise<ethers.ContractTransactionResponse | null> {
    try {
      const contract = await getSignerContract(CONTRACTS.ARENA_TOKEN, CONTRACT_ABIS.ARENA_TOKEN, signer);
      return contract.mint(to, amount);
    } catch (error) {
      console.error('Mint failed:', error);
      throw error;
    }
  },

  async burn(
    signer: ethers.Signer,
    amount: bigint
  ): Promise<ethers.ContractTransactionResponse | null> {
    try {
      const contract = await getSignerContract(CONTRACTS.ARENA_TOKEN, CONTRACT_ABIS.ARENA_TOKEN, signer);
      return contract.burn(amount);
    } catch (error) {
      console.error('Burn failed:', error);
      throw error;
    }
  },
};

/**
 * ARENA Champion (ERC721) read functions
 */
export const ArenaChampionReads = {
  async getName(): Promise<string> {
    const contract = getContract(CONTRACTS.ARENA_CHAMPION, CONTRACT_ABIS.ERC721);
    return contract.name();
  },

  async getBalance(address: string): Promise<bigint> {
    const contract = getContract(CONTRACTS.ARENA_CHAMPION, CONTRACT_ABIS.ERC721);
    return contract.balanceOf(address);
  },

  async getOwner(tokenId: bigint): Promise<string> {
    const contract = getContract(CONTRACTS.ARENA_CHAMPION, CONTRACT_ABIS.ERC721);
    return contract.ownerOf(tokenId);
  },

  async getTokenURI(tokenId: bigint): Promise<string> {
    const contract = getContract(CONTRACTS.ARENA_CHAMPION, CONTRACT_ABIS.ERC721);
    return contract.tokenURI(tokenId);
  },
};

/**
 * ARENA Champion write functions
 */
export const ArenaChampionWrites = {
  async mint(
    signer: ethers.Signer,
    to: string,
    uri: string
  ): Promise<ethers.ContractTransactionResponse | null> {
    try {
      const contract = await getSignerContract(CONTRACTS.ARENA_CHAMPION, CONTRACT_ABIS.ARENA_CHAMPION, signer);
      return contract.mint(to, uri);
    } catch (error) {
      console.error('Mint failed:', error);
      throw error;
    }
  },

  async transfer(
    signer: ethers.Signer,
    to: string,
    tokenId: bigint
  ): Promise<ethers.ContractTransactionResponse | null> {
    try {
      const contract = await getSignerContract(CONTRACTS.ARENA_CHAMPION, CONTRACT_ABIS.ERC721, signer);
      const from = await signer.getAddress();
      return contract.transferFrom(from, to, tokenId);
    } catch (error) {
      console.error('Transfer failed:', error);
      throw error;
    }
  },
};

/**
 * Marketplace read functions
 */
export const MarketplaceReads = {
  async getListings(): Promise<any[]> {
    // Implementation depends on marketplace contract design
    return [];
  },

  async getListingPrice(tokenId: bigint): Promise<bigint> {
    // Implementation depends on marketplace contract design
    return BigInt(0);
  },
};

/**
 * Marketplace write functions
 */
export const MarketplaceWrites = {
  async listNFT(
    signer: ethers.Signer,
    tokenId: bigint,
    price: bigint
  ): Promise<ethers.ContractTransactionResponse | null> {
    try {
      // Implementation depends on marketplace contract design
      return null;
    } catch (error) {
      console.error('List NFT failed:', error);
      throw error;
    }
  },

  async buyNFT(
    signer: ethers.Signer,
    tokenId: bigint
  ): Promise<ethers.ContractTransactionResponse | null> {
    try {
      // Implementation depends on marketplace contract design
      return null;
    } catch (error) {
      console.error('Buy NFT failed:', error);
      throw error;
    }
  },
};

/**
 * Estimate gas for common transactions
 */
export async function estimateGas(
  operation: 'transfer' | 'approve' | 'mint',
  signer: ethers.Signer,
  params: any
): Promise<bigint> {
  try {
    const provider = getProvider();
    const gasPrice = await provider.getGasPrice();
    
    // Rough estimates - these should be refined based on actual contract size
    const gasEstimates: Record<string, bigint> = {
      transfer: BigInt(65000),
      approve: BigInt(46000),
      mint: BigInt(150000),
    };

    return gasEstimates[operation] || BigInt(100000);
  } catch (error) {
    console.error('Gas estimation failed:', error);
    return BigInt(100000); // Fallback estimate
  }
}

/**
 * Get transaction receipt
 */
export async function getTransactionReceipt(
  txHash: string
): Promise<ethers.TransactionReceipt | null> {
  const provider = getProvider();
  return provider.getTransactionReceipt(txHash);
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
  txHash: string,
  confirmations: number = 1
): Promise<ethers.TransactionReceipt | null> {
  const provider = getProvider();
  return provider.waitForTransaction(txHash, confirmations);
}
