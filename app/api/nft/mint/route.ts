import { NextRequest } from 'next/server';
import { generateChampionNFT, mintChampionNFT } from '@/lib/nft/nft-generator';
import { successResponse, validationError, serverError } from '@/lib/utils/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, name, class: champClass, level } = body;

    if (!walletAddress) {
      return validationError([{ message: 'Wallet address is required' }]);
    }

    // Generate a unique champion NFT
    const championData = generateChampionNFT({
      name,
      class: champClass,
      level,
    });

    // Mint the NFT to the database
    const result = await mintChampionNFT(walletAddress, championData);

    if (!result.success) {
      return serverError(result.error);
    }

    return successResponse(
      {
        success: true,
        tokenId: result.tokenId,
        metadata: championData,
      },
      200
    );
  } catch (error) {
    console.error('[API] NFT minting error:', error);
    return serverError('Failed to mint NFT');
  }
}
