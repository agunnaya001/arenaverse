import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../supabase/client';

interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
}

const DEFAULT_LIMITS: Record<string, RateLimitConfig> = {
  '/api/battle': { maxRequests: 10, windowSeconds: 60 },
  '/api/quest': { maxRequests: 20, windowSeconds: 60 },
  '/api/claim-reward': { maxRequests: 5, windowSeconds: 60 },
  '/api/stake': { maxRequests: 3, windowSeconds: 60 },
  default: { maxRequests: 100, windowSeconds: 60 },
};

/**
 * Check if user has exceeded rate limit
 */
export async function checkRateLimit(
  userId: string,
  endpoint: string
): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
  const config = DEFAULT_LIMITS[endpoint] || DEFAULT_LIMITS.default;
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowSeconds * 1000);

  try {
    // Get current window record
    const { data: existing } = await supabaseAdmin
      .from('rate_limits')
      .select('request_count, window_start')
      .eq('user_id', userId)
      .eq('endpoint', endpoint)
      .gte('window_start', windowStart.toISOString())
      .single();

    let count = existing?.request_count || 0;
    const currentWindowStart = existing?.window_start || now.toISOString();

    if (count >= config.maxRequests) {
      const resetTime = new Date(new Date(currentWindowStart).getTime() + config.windowSeconds * 1000);
      return {
        allowed: false,
        remaining: 0,
        resetTime,
      };
    }

    // Increment counter
    const { error } = await supabaseAdmin
      .from('rate_limits')
      .upsert({
        user_id: userId,
        endpoint,
        request_count: count + 1,
        window_start: currentWindowStart,
      });

    if (error) {
      console.error('[v0] Rate limit tracking failed:', error);
    }

    const resetTime = new Date(new Date(currentWindowStart).getTime() + config.windowSeconds * 1000);
    return {
      allowed: true,
      remaining: config.maxRequests - count - 1,
      resetTime,
    };
  } catch (error) {
    console.error('[v0] Rate limit check failed:', error);
    // Fail open - allow request if rate limit check fails
    return {
      allowed: true,
      remaining: -1,
      resetTime: new Date(),
    };
  }
}

/**
 * Middleware to apply rate limiting
 */
export async function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  endpoint: string
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Get user ID from auth header or session
    const userId = extractUserId(req);
    if (!userId) {
      return handler(req);
    }

    const { allowed, remaining, resetTime } = await checkRateLimit(userId, endpoint);

    if (!allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((resetTime.getTime() - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((resetTime.getTime() - Date.now()) / 1000).toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetTime.toISOString(),
          },
        }
      );
    }

    const response = await handler(req);

    // Add rate limit headers
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', resetTime.toISOString());

    return response;
  };
}

/**
 * Extract user ID from request
 */
function extractUserId(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7); // Remove 'Bearer ' prefix
  }

  const cookie = request.cookies.get('user_id')?.value;
  return cookie || null;
}
