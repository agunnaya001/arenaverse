import { NextRequest, NextResponse } from 'next/server';
import { generateSIWEMessage } from '@/lib/auth/siwe';

/**
 * GET /api/auth/siwe-message
 * Generate a SIWE message for wallet signing
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const chainId = searchParams.get('chainId');

    if (!address || !chainId) {
      return NextResponse.json(
        { error: 'Missing required parameters: address, chainId' },
        { status: 400 }
      );
    }

    const { message, nonce } = await generateSIWEMessage(address, parseInt(chainId));

    return NextResponse.json({ message, nonce }, { status: 200 });
  } catch (error) {
    console.error('[v0] SIWE message generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate SIWE message' },
      { status: 500 }
    );
  }
}
