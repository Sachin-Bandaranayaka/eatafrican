# Backend Core Utilities and Middleware

This directory contains the core utilities, middleware, types, and validation schemas for the food delivery backend API.

## Directory Structure

```
lib/
├── types/           # TypeScript type definitions
├── validation/      # Zod validation schemas
├── middleware/      # API middleware (auth, error handling, rate limiting)
└── utils/          # Utility functions (distance, formatting)
```

## Types (`lib/types/`)

Comprehensive TypeScript interfaces for all data models:

- **User Types**: `User`, `AuthUser`, `JWTPayload`, `UserRole`, `UserStatus`
- **Restaurant Types**: `Restaurant`, `RestaurantStatus`
- **Menu Types**: `MenuItem`, `MenuCategory`, `MenuItemStatus`
- **Order Types**: `Order`, `OrderItem`, `OrderStatus`, `PaymentStatus`
- **Driver Types**: `Driver`, `DriverStatus`
- **Loyalty Types**: `LoyaltyPoints`, `LoyaltyTransaction`
- **Voucher Types**: `Voucher`, `VoucherDiscountType`
- **Other Types**: `Favorite`, `Notification`, `ActivityLog`, `ErrorResponse`

### Usage Example

```typescript
import { User, Restaurant, Order } from '@/lib/types';

const user: User = {
  id: '123',
  email: 'user@example.com',
  role: 'customer',
  // ...
};
```

## Validation (`lib/validation/`)

Zod schemas for request/response validation:

### Available Schemas

- **Authentication**: `registerSchema`, `loginSchema`, `resetPasswordSchema`
- **Restaurant**: `createRestaurantSchema`, `updateRestaurantSchema`, `restaurantQuerySchema`
- **Menu**: `createMenuItemSchema`, `updateMenuItemSchema`, `menuQuerySchema`
- **Order**: `createOrderSchema`, `updateOrderStatusSchema`, `orderQuerySchema`
- **Driver**: `createDriverSchema`, `updateDriverSchema`, `driverOrderQuerySchema`
- **Customer**: `updateCustomerSchema`, `addFavoriteSchema`, `redeemLoyaltySchema`
- **Admin**: `adminRestaurantQuerySchema`, `approveRestaurantSchema`, `analyticsQuerySchema`
- **File Upload**: `fileUploadSchema`

### Usage Example

```typescript
import { createOrderSchema } from '@/lib/validation';

// Validate request body
const validatedData = createOrderSchema.parse(requestBody);
```

## Middleware (`lib/middleware/`)

### Authentication Middleware

Handles JWT validation and role-based access control.

#### Functions

- `validateAuth(req)` - Validates JWT and returns user or null
- `requireAuth()` - Requires authentication, throws error if not authenticated
- `requireRole(roles)` - Requires specific user roles
- `requireRestaurantOwnership(req, restaurantId)` - Validates restaurant ownership
- `requireDriverAccess(req, driverId)` - Validates driver access
- `requireCustomerAccess(req, customerId)` - Validates customer access
- `optionalAuth(req)` - Returns user if authenticated, null otherwise

#### Usage Example

```typescript
import { requireAuth, requireRole } from '@/lib/middleware';

// In API route
export async function GET(req: NextRequest) {
  const user = await requireAuth()(req);
  // User is authenticated
}

// Require specific role
export async function POST(req: NextRequest) {
  const user = await requireRole(['super_admin'])(req);
  // User is super admin
}
```

### Error Handling Middleware

Centralized error handling with standardized responses.

#### Error Classes

- `AppError` - Base application error
- `ValidationError` - Validation failures (400)
- `NotFoundError` - Resource not found (404)
- `DuplicateError` - Duplicate entry (409)
- `BusinessLogicError` - Business logic errors (422)
- `AuthError` - Authentication errors (401/403)

#### Functions

- `handleError(error)` - Converts errors to standardized JSON responses
- `asyncHandler(handler)` - Wraps async handlers with error handling

#### Usage Example

```typescript
import { asyncHandler, NotFoundError, ValidationError } from '@/lib/middleware';

export const GET = asyncHandler(async (req: Request) => {
  const data = await fetchData();
  
  if (!data) {
    throw new NotFoundError('Data not found');
  }
  
  return NextResponse.json(data);
});
```

### Rate Limiting Middleware

Prevents abuse by limiting request rates.

#### Functions

- `rateLimit(options)` - Creates rate limiter with custom options

#### Predefined Configurations

- `RateLimitConfig.auth` - 5 requests per 15 minutes (authentication)
- `RateLimitConfig.standard` - 100 requests per 15 minutes
- `RateLimitConfig.read` - 200 requests per 15 minutes
- `RateLimitConfig.write` - 50 requests per 15 minutes
- `RateLimitConfig.upload` - 10 requests per hour

#### Usage Example

```typescript
import { rateLimit, RateLimitConfig } from '@/lib/middleware';

export async function POST(req: NextRequest) {
  // Apply rate limiting
  await rateLimit(RateLimitConfig.auth)(req);
  
  // Process request
  // ...
}
```

## Utilities (`lib/utils/`)

### Distance Utilities

Functions for distance calculation and delivery fee computation.

#### Functions

- `calculateDistance(lat1, lon1, lat2, lon2)` - Haversine distance in km
- `estimateTravelTime(distanceKm)` - Estimate travel time in minutes
- `formatDistanceString(distanceKm, fromLocation?)` - Format for display
- `calculateDeliveryFee(distanceKm)` - Calculate delivery fee
- `isWithinDeliveryRadius(distanceKm, maxRadiusKm?)` - Check delivery availability
- `getBoundingBox(centerLat, centerLon, radiusKm)` - Get bounding box for queries

#### Usage Example

```typescript
import { calculateDistance, calculateDeliveryFee, formatDistanceString } from '@/lib/utils';

const distance = calculateDistance(47.5596, 7.5886, 47.3769, 8.5417);
// 75.3 km

const fee = calculateDeliveryFee(distance);
// Fr. 117.95

const formatted = formatDistanceString(distance, 'Basel');
// "75.3 km, 151 min from Basel"
```

### Formatting Utilities

Functions for formatting currency, dates, and other data.

#### Functions

- `formatCurrency(amount, language?)` - Format as Swiss Francs
- `formatPrice(amount)` - Shorter price format
- `parseCurrency(currencyString)` - Parse currency to number
- `formatDate(date, language?)` - Format date (DD.MM.YYYY)
- `formatTime(date)` - Format time (HH:mm)
- `formatDateTime(date, language?)` - Format date and time
- `formatRelativeTime(date, language?)` - Relative time (e.g., "2 hours ago")
- `formatPhoneNumber(phone)` - Format Swiss phone numbers
- `generateOrderNumber()` - Generate unique order number
- `formatPercentage(value)` - Format as percentage
- `truncateText(text, maxLength)` - Truncate with ellipsis
- `formatFileSize(bytes)` - Format file size
- `capitalizeWords(text)` - Capitalize each word

#### Usage Example

```typescript
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';

const price = formatCurrency(24.50);
// "Fr. 24.50.-"

const date = formatDate(new Date(), 'de');
// "24.01.2024"

const relative = formatRelativeTime(new Date(Date.now() - 3600000), 'en');
// "1 hour ago"
```

## Complete API Route Example

Here's a complete example showing how to use all components together:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { 
  asyncHandler, 
  requireAuth, 
  rateLimit, 
  RateLimitConfig,
  NotFoundError 
} from '@/lib/middleware';
import { createOrderSchema } from '@/lib/validation';
import { calculateDeliveryFee, formatCurrency } from '@/lib/utils';
import { Order } from '@/lib/types';

export const POST = asyncHandler(async (req: NextRequest) => {
  // Apply rate limiting
  await rateLimit(RateLimitConfig.write)(req);
  
  // Require authentication
  const user = await requireAuth()(req);
  
  // Parse and validate request body
  const body = await req.json();
  const validatedData = createOrderSchema.parse(body);
  
  // Calculate delivery fee
  const deliveryFee = calculateDeliveryFee(10); // 10 km
  
  // Create order
  const order: Order = {
    // ... order data
    deliveryFee,
    totalAmount: validatedData.subtotal + deliveryFee,
  };
  
  // Return formatted response
  return NextResponse.json({
    order,
    formattedTotal: formatCurrency(order.totalAmount),
  }, { status: 201 });
});
```

## Testing

All utilities and middleware should be tested with unit tests. Example test structure:

```typescript
import { describe, it, expect } from 'vitest';
import { calculateDistance, formatCurrency } from '@/lib/utils';

describe('Distance Utils', () => {
  it('should calculate distance correctly', () => {
    const distance = calculateDistance(47.5596, 7.5886, 47.3769, 8.5417);
    expect(distance).toBeCloseTo(75.3, 1);
  });
});

describe('Formatting Utils', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(24.50)).toBe('Fr. 24.50.-');
  });
});
```

## Environment Variables Required

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Notes

- Rate limiting uses in-memory storage. For production, consider Redis.
- Geocoding is not implemented. Integrate with Google Maps API or similar.
- All currency is in Swiss Francs (CHF).
- Date/time formats follow European conventions.
- Multi-language support for EN, DE, FR, IT.
