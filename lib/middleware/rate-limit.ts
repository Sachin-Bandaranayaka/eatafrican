import { NextRequest } from 'next/server';
import { AppError, ErrorCodes } from './error-handler';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore: RateLimitStore = {};

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

/**
 * Rate limiting middleware
 */
export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests } = options;

  return async (req: NextRequest): Promise<void> => {
    const identifier = getIdentifier(req);
    const now = Date.now();

    // Clean up expired entries
    cleanupExpiredEntries(now);

    // Get or create rate limit entry
    let entry = rateLimitStore[identifier];

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      entry = {
        count: 0,
        resetTime: now + windowMs,
      };
      rateLimitStore[identifier] = entry;
    }

    // Increment request count
    entry.count++;

    // Check if limit exceeded
    if (entry.count > maxRequests) {
      const resetIn = Math.ceil((entry.resetTime - now) / 1000);
      throw new AppError(
        `Rate limit exceeded. Try again in ${resetIn} seconds`,
        ErrorCodes.RATE_LIMIT_EXCEEDED,
        429,
        { resetIn }
      );
    }
  };
}

/**
 * Get unique identifier for rate limiting (IP address or user ID)
 */
function getIdentifier(req: NextRequest): string {
  // Try to get user ID from authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader) {
    // Use a hash of the token as identifier for authenticated users
    return `user:${authHeader.substring(0, 20)}`;
  }

  // Fall back to IP address
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
  return `ip:${ip}`;
}

/**
 * Clean up expired entries from store
 */
function cleanupExpiredEntries(now: number): void {
  const keys = Object.keys(rateLimitStore);
  for (const key of keys) {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  }
}

/**
 * Predefined rate limit configurations
 */
export const RateLimitConfig = {
  // Strict limits for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },

  // Standard limits for API endpoints
  standard: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },

  // Relaxed limits for read operations
  read: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 200,
  },

  // Strict limits for write operations
  write: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 50,
  },

  // Very strict limits for file uploads
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
  },
} as const;

/**
 * Clear rate limit for a specific identifier (useful for testing)
 */
export function clearRateLimit(identifier: string): void {
  delete rateLimitStore[identifier];
}

/**
 * Get current rate limit status for an identifier
 */
export function getRateLimitStatus(identifier: string): {
  count: number;
  remaining: number;
  resetTime: number;
} | null {
  const entry = rateLimitStore[identifier];
  if (!entry) {
    return null;
  }

  return {
    count: entry.count,
    remaining: Math.max(0, 100 - entry.count), // Assuming standard limit
    resetTime: entry.resetTime,
  };
}
