import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: number;
}

/**
 * Success response wrapper
 */
export function successResponse<T>(data: T, statusCode: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: Date.now(),
    },
    { status: statusCode }
  );
}

/**
 * Error response wrapper
 */
export function errorResponse(
  code: string,
  message: string,
  statusCode: number = 400,
  details?: any
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
      timestamp: Date.now(),
    },
    { status: statusCode }
  );
}

/**
 * Validation error response
 */
export function validationError(errors: any[]): NextResponse<ApiResponse> {
  return errorResponse(
    'VALIDATION_ERROR',
    'Request validation failed',
    400,
    {
      errors: errors.map((e) => ({
        field: e.path?.join('.') || 'unknown',
        message: e.message,
      })),
    }
  );
}

/**
 * Not found error response
 */
export function notFoundError(resource: string): NextResponse<ApiResponse> {
  return errorResponse(
    'NOT_FOUND',
    `${resource} not found`,
    404
  );
}

/**
 * Unauthorized error response
 */
export function unauthorizedError(message: string = 'Unauthorized'): NextResponse<ApiResponse> {
  return errorResponse(
    'UNAUTHORIZED',
    message,
    401
  );
}

/**
 * Forbidden error response
 */
export function forbiddenError(message: string = 'Forbidden'): NextResponse<ApiResponse> {
  return errorResponse(
    'FORBIDDEN',
    message,
    403
  );
}

/**
 * Server error response
 */
export function serverError(
  message: string = 'Internal server error',
  error?: Error
): NextResponse<ApiResponse> {
  console.error('[API Error]', error || message);
  return errorResponse(
    'INTERNAL_SERVER_ERROR',
    message,
    500,
    process.env.NODE_ENV === 'development' ? { details: error?.message } : undefined
  );
}

/**
 * Rate limit error response
 */
export function rateLimitError(): NextResponse<ApiResponse> {
  return errorResponse(
    'RATE_LIMITED',
    'Too many requests. Please try again later.',
    429
  );
}

/**
 * Method not allowed error response
 */
export function methodNotAllowedError(allowedMethods: string[]): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'HTTP method not allowed',
      },
      timestamp: Date.now(),
    },
    {
      status: 405,
      headers: {
        'Allow': allowedMethods.join(', '),
      },
    }
  );
}

/**
 * Blockchain error response
 */
export function blockchainError(message: string, details?: any): NextResponse<ApiResponse> {
  return errorResponse(
    'BLOCKCHAIN_ERROR',
    message,
    400,
    details
  );
}

/**
 * Payment required error response
 */
export function paymentRequiredError(message: string = 'Insufficient balance'): NextResponse<ApiResponse> {
  return errorResponse(
    'PAYMENT_REQUIRED',
    message,
    402
  );
}
