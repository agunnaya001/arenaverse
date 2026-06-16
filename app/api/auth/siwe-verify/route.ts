import { NextRequest } from 'next/server';
import { SIWEVerifySchema } from '@/lib/validation/schemas';
import { registerSIWESession } from '@/lib/auth/siwe';
import {
  successResponse,
  validationError,
  unauthorizedError,
  serverError,
} from '@/lib/utils/api-response';

/**
 * POST /api/auth/siwe-verify
 * Verify SIWE signature and create session
 * Request: { message, signature, nonce }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request payload
    const validatedData = SIWEVerifySchema.safeParse(body);
    if (!validatedData.success) {
      return validationError(validatedData.error.errors);
    }

    const { message, signature, nonce } = validatedData.data;

    // Verify and register session
    const result = await registerSIWESession(
      message,
      signature,
      nonce
    );

    if (!result || !result.verified) {
      return unauthorizedError('Invalid message or signature verification failed');
    }

    return successResponse(
      {
        authenticated: true,
        address: result.address,
        sessionId: result.sessionId,
      },
      200
    );
  } catch (error) {
    console.error('[API] SIWE verification error:', error);
    return serverError('SIWE verification failed', error instanceof Error ? error : undefined);
  }
}
