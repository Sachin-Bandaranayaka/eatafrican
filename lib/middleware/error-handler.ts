import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AuthError } from './auth';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 'RESOURCE_NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class DuplicateError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 'DUPLICATE_ENTRY', 409);
    this.name = 'DuplicateError';
  }
}

export class BusinessLogicError extends AppError {
  constructor(message: string, code: string) {
    super(message, code, 422);
    this.name = 'BusinessLogicError';
  }
}

/**
 * Centralized error handler for API routes
 */
export function handleError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        },
      },
      { status: 400 }
    );
  }

  // Handle authentication errors
  if (error instanceof AuthError) {
    return NextResponse.json(
      {
        error: {
          code: error.statusCode === 401 ? 'AUTH_UNAUTHORIZED' : 'AUTH_FORBIDDEN',
          message: error.message,
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle application errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle unknown errors
  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    },
    { status: 500 }
  );
}

/**
 * Async error wrapper for API route handlers
 */
export function asyncHandler<T>(
  handler: (req: Request, context?: any) => Promise<T>
) {
  return async (req: Request, context?: any): Promise<NextResponse> => {
    try {
      const result = await handler(req, context);
      return result as unknown as NextResponse;
    } catch (error) {
      return handleError(error);
    }
  };
}

/**
 * Error codes for common scenarios
 */
export const ErrorCodes = {
  // Authentication
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  // Resources
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',

  // Orders
  ORDER_INVALID_STATUS: 'ORDER_INVALID_STATUS',
  RESTAURANT_CLOSED: 'RESTAURANT_CLOSED',
  DELIVERY_UNAVAILABLE: 'DELIVERY_UNAVAILABLE',

  // Vouchers
  VOUCHER_INVALID: 'VOUCHER_INVALID',
  VOUCHER_EXPIRED: 'VOUCHER_EXPIRED',
  VOUCHER_USAGE_LIMIT: 'VOUCHER_USAGE_LIMIT',

  // Loyalty
  INSUFFICIENT_POINTS: 'INSUFFICIENT_POINTS',

  // File Upload
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_TYPE_NOT_ALLOWED: 'FILE_TYPE_NOT_ALLOWED',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // Payment (for future use)
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYMENT_WEBHOOK_INVALID: 'PAYMENT_WEBHOOK_INVALID',

  // General
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;
