import { NextRequest, NextResponse } from 'next/server';
import { registerSIWESession } from '@/lib/auth/siwe';

/**
 * POST /api/auth/siwe-verify
 * Verify SIWE signature and create session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, message, signature, nonce, chainId } = body;

    if (!address || !message || !signature || !nonce || !chainId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await registerSIWESession(
      address,
      message,
      signature,
      nonce,
      chainId
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to verify signature' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        userId: result.userId,
        token: result.token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] SIWE verification failed:', error);
    return NextResponse.json(
      { error: 'Failed to verify SIWE signature' },
      { status: 500 }
    );
  }
}
