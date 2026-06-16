import { generateChampionNFT, generateBattleNFT } from '@/lib/nft/nft-generator';

export const testData = {
  validWalletAddress: '0x1234567890123456789012345678901234567890',
  validBattleId: 'test-battle-' + Math.random().toString(36).slice(2, 11),
  
  // Test NFT generation
  generateTestChampion: () => generateChampionNFT({
    name: 'Test Champion',
    class: 'Warrior',
    level: 10,
  }),
  
  generateTestBattleReward: () => generateBattleNFT({
    difficulty: 3,
  }),
};

export const apiTestCases = {
  // Test successful contract generation
  contractGeneration: {
    valid: {
      type: 'ERC20',
      name: 'TestToken',
      description: 'Test token contract',
    },
    invalid: {
      type: '', // Missing type
      name: 'TestToken',
    },
  },

  // Test battle API
  battleAPI: {
    validBattle: {
      championId: 'test-champion-id',
      difficulty: 3,
    },
    validResult: {
      battleId: 'test-battle-id',
      result: 'Win',
      duration: 300,
      battleLog: ['turn 1', 'turn 2'],
    },
  },

  // Test NFT minting
  nftMinting: {
    validMint: {
      walletAddress: '0x1234567890123456789012345678901234567890',
      name: 'Test NFT',
      class: 'Warrior',
      level: 10,
    },
    validBattleReward: {
      walletAddress: '0x1234567890123456789012345678901234567890',
      battleId: 'test-battle-id',
      difficulty: 3,
    },
  },
};

export async function testAPIEndpoint(
  endpoint: string,
  method: 'GET' | 'POST' = 'POST',
  body?: any
) {
  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': testData.validWalletAddress,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function runBasicTests() {
  const results = {
    nftGeneration: { champion: false, battle: false },
    apiEndpoints: {},
  };

  // Test NFT generation
  try {
    const champion = testData.generateTestChampion();
    results.nftGeneration.champion = !!champion.name;
    
    const battle = testData.generateTestBattleReward();
    results.nftGeneration.battle = !!battle.name;
  } catch (error) {
    console.error('NFT generation test failed:', error);
  }

  return results;
}
