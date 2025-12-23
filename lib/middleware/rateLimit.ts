import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter
// In production, use Redis or similar for distributed rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
    windowMs: number;  // Time window in milliseconds
    maxRequests: number;  // Max requests per window
}

const defaultConfig: RateLimitConfig = {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 100  // 100 requests per minute
};

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
        if (now > value.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}, 60 * 1000);  // Clean up every minute

export function rateLimit(config: Partial<RateLimitConfig> = {}) {
    const { windowMs, maxRequests } = { ...defaultConfig, ...config };

    return async function rateLimitMiddleware(
        request: NextRequest
    ): Promise<NextResponse | null> {
        // Get client identifier (IP address or user ID)
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
        const authHeader = request.headers.get('authorization');
        
        // Use user ID if authenticated, otherwise use IP
        let identifier = ip;
        if (authHeader) {
            // Extract user ID from token if available
            const token = authHeader.replace('Bearer ', '');
            identifier = `user:${token.substring(0, 20)}`;  // Use part of token as identifier
        }

        const key = `${request.nextUrl.pathname}:${identifier}`;
        const now = Date.now();

        // Get or create rate limit entry
        let entry = rateLimitMap.get(key);
        
        if (!entry || now > entry.resetTime) {
            entry = {
                count: 0,
                resetTime: now + windowMs
            };
        }

        entry.count++;
        rateLimitMap.set(key, entry);

        // Check if rate limit exceeded
        if (entry.count > maxRequests) {
            const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
            
            return NextResponse.json(
                {
                    error: {
                        code: 'RATE_LIMIT_EXCEEDED',
                        message: 'Too many requests. Please try again later.',
                        retryAfter
                    }
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(retryAfter),
                        'X-RateLimit-Limit': String(maxRequests),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': String(entry.resetTime)
                    }
                }
            );
        }

        // Add rate limit headers to response
        const remaining = maxRequests - entry.count;
        
        // Return null to indicate request should proceed
        // Headers will be added by the route handler
        return null;
    };
}

// Pre-configured rate limiters for different endpoints
export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    maxRequests: 10  // 10 login attempts per 15 minutes
});

export const apiRateLimit = rateLimit({
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 100  // 100 requests per minute
});

export const uploadRateLimit = rateLimit({
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 10  // 10 uploads per minute
});

// Helper to apply rate limiting in API routes
export async function withRateLimit(
    request: NextRequest,
    handler: () => Promise<NextResponse>,
    config?: Partial<RateLimitConfig>
): Promise<NextResponse> {
    const limiter = rateLimit(config);
    const rateLimitResponse = await limiter(request);
    
    if (rateLimitResponse) {
        return rateLimitResponse;
    }
    
    return handler();
}
