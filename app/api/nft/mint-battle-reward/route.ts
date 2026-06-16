import { NextRequest } from 'next/server';
import { generateBattleNFT, mintBattleRewardNFT } from '@/lib/nft/nft-generator';
import { successResponse, validationError, serverError } from '@/lib/utils/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, battleId, difficulty } = body;

    if (!walletAddress || !battleId) {
      return validationError([{ message: 'Wallet address and battle ID are required' }]);
    }

    // Generate a battle reward NFT
    const battleRewardData = generateBattleNFT({
      difficulty: difficulty || 3,
    });

    // Mint the reward NFT
    const result = await mintBattleRewardNFT(walletAddress, battleId, battleRewardData);

    if (!result.success) {
      return serverError(result.error);
    }

    return successResponse(
      {
        success: true,
        tokenId: result.tokenId,
        reward: battleRewardData,
      },
      200
    );
  } catch (error) {
    console.error('[API] Battle reward minting error:', error);
    return serverError('Failed to mint battle reward NFT');
  }
}
