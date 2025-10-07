# Formatting Utilities

This module provides utilities for formatting currency, dates, times, and other data types according to Swiss standards and multi-language requirements.

## Currency Formatting

### `formatCurrency(amount: number, language?: Language): string`

Formats a number as Swiss Francs with the standard format: `Fr. XX.XX.-`

**Examples:**
```typescript
formatCurrency(24.50)    // "Fr. 24.50.-"
formatCurrency(100)      // "Fr. 100.00.-"
formatCurrency(1234.56)  // "Fr. 1234.56.-"
```

### `formatPrice(amount: number): string`

Formats a number as Swiss Francs without the trailing `.-` suffix.

**Examples:**
```typescript
formatPrice(24.50)  // "Fr. 24.50"
formatPrice(100)    // "Fr. 100.00"
```

### `parseCurrency(currencyString: string): number`

Parses a currency string back to a number.

**Examples:**
```typescript
parseCurrency("Fr. 24.50.-")  // 24.50
parseCurrency("Fr. 100.00")   // 100.00
parseCurrency("24.50")        // 24.50
```

## Date Formatting

### `formatDate(date: Date | string, language?: Language): string`

Formats a date in European format: `DD.MM.YYYY`

**Examples:**
```typescript
formatDate(new Date('2024-01-24'))  // "24.01.2024"
formatDate('2024-12-31')            // "31.12.2024"
formatDate('2024-03-05')            // "05.03.2024" (with zero padding)
```

**Features:**
- Automatically pads single-digit days and months with zeros
- Accepts both Date objects and ISO date strings
- Consistent European date format across all languages

## Time Formatting

### `formatTime(date: Date | string): string`

Formats time in 24-hour format: `HH:mm`

**Examples:**
```typescript
formatTime(new Date('2024-01-24T15:30:00'))  // "15:30"
formatTime('2024-01-24T09:05:00')            // "09:05"
formatTime('2024-01-24T00:00:00')            // "00:00" (midnight)
formatTime('2024-01-24T23:59:00')            // "23:59"
```

**Features:**
- 24-hour format (no AM/PM)
- Automatically pads single-digit hours and minutes with zeros
- Accepts both Date objects and ISO datetime strings

### `formatDateTime(date: Date | string, language?: Language): string`

Combines date and time formatting: `DD.MM.YYYY, HH:mm`

**Examples:**
```typescript
formatDateTime(new Date('2024-01-24T15:30:00'))  // "24.01.2024, 15:30"
formatDateTime('2024-12-31T23:59:00')            // "31.12.2024, 23:59"
```

## Relative Time Formatting

### `formatRelativeTime(date: Date | string, language: Language): string`

Formats time relative to now in the user's language.

**Examples:**
```typescript
// English
formatRelativeTime(now, 'en')                    // "just now"
formatRelativeTime(30MinutesAgo, 'en')          // "30 minutes ago"
formatRelativeTime(2HoursAgo, 'en')             // "2 hours ago"
formatRelativeTime(in15Minutes, 'en')           // "in 15 minutes"

// German
formatRelativeTime(30MinutesAgo, 'de')          // "vor 30 Minuten"
formatRelativeTime(in15Minutes, 'de')           // "in 15 Minuten"

// French
formatRelativeTime(30MinutesAgo, 'fr')          // "il y a 30 minutes"
formatRelativeTime(in15Minutes, 'fr')           // "dans 15 minutes"

// Italian
formatRelativeTime(30MinutesAgo, 'it')          // "30 minuti fa"
formatRelativeTime(in15Minutes, 'it')           // "tra 15 minuti"
```

## Other Formatting Utilities

### `formatPhoneNumber(phone: string): string`

Formats Swiss phone numbers with proper spacing.

**Examples:**
```typescript
formatPhoneNumber('+41791234567')      // "+41 79 123 45 67"
formatPhoneNumber('+41-79-123-45-67')  // "+41 79 123 45 67"
```

### `generateOrderNumber(): string`

Generates a unique order number with format: `ORD-YYYYMMDD-XXX`

**Examples:**
```typescript
generateOrderNumber()  // "ORD-20240124-001"
generateOrderNumber()  // "ORD-20240124-742"
```

### `formatPercentage(value: number): string`

Formats a decimal as a percentage.

**Examples:**
```typescript
formatPercentage(0.15)   // "15%"
formatPercentage(0.5)    // "50%"
formatPercentage(0.075)  // "8%"
```

### `formatFileSize(bytes: number): string`

Formats file size in human-readable format.

**Examples:**
```typescript
formatFileSize(1024)      // "1 KB"
formatFileSize(1048576)   // "1 MB"
formatFileSize(5242880)   // "5 MB"
```

### `truncateText(text: string, maxLength: number): string`

Truncates text with ellipsis if it exceeds max length.

**Examples:**
```typescript
truncateText('This is a very long text', 10)  // "This is..."
truncateText('Short', 10)                     // "Short"
```

### `capitalizeWords(text: string): string`

Capitalizes the first letter of each word.

**Examples:**
```typescript
capitalizeWords('hello world')   // "Hello World"
capitalizeWords('HELLO WORLD')   // "Hello World"
```

## Usage in API Routes

### Order Creation Example
```typescript
import { formatCurrency, formatDateTime, generateOrderNumber } from '@/lib/utils/formatting';

// Generate order number
const orderNumber = generateOrderNumber();

// Format order details for response
const orderResponse = {
  orderNumber,
  totalAmount: formatCurrency(order.totalAmount),
  scheduledDeliveryTime: formatDateTime(order.scheduledDeliveryTime),
};
```

### Restaurant Listing Example
```typescript
import { formatPrice, formatDate } from '@/lib/utils/formatting';

const restaurants = await getRestaurants();
const formattedRestaurants = restaurants.map(restaurant => ({
  ...restaurant,
  minOrderAmount: formatPrice(restaurant.minOrderAmount),
  createdAt: formatDate(restaurant.createdAt),
}));
```

### Notification Example
```typescript
import { formatDateTime, formatRelativeTime } from '@/lib/utils/formatting';
import { detectLanguage } from '@/lib/utils/language';

const userLanguage = detectLanguage(acceptLanguageHeader, user.language);

const notification = {
  title: 'Order Delivered',
  message: `Your order was delivered at ${formatDateTime(deliveryTime, userLanguage)}`,
  timestamp: formatRelativeTime(deliveryTime, userLanguage),
};
```

## Requirements Satisfied

This module satisfies the following requirements:

- **11.4**: Format prices as Swiss Francs (Fr. XX.XX.-)
- **11.5**: Format dates in European format (DD.MM.YYYY)
- **11.6**: Format times in 24-hour format (HH:mm)
- **11.7**: Multi-language support for relative time formatting

## Testing

Run the verification script to test all formatting utilities:

```bash
npx tsx lib/utils/__tests__/formatting.verify.ts
```

All formatting functions include proper type safety and handle edge cases like:
- Zero values
- Single-digit numbers (with zero padding)
- Midnight and noon times
- Invalid input handling
- Multi-language support where applicable
