# Payment Error Handling and Recovery

This document describes the comprehensive error handling and recovery system implemented for Stripe payment processing.

## Overview

The payment error handling system provides:

1. **Error Boundary** - Catches and handles React component errors
2. **Retry Logic** - Automatic and manual retry with exponential backoff
3. **User-Friendly Messages** - Clear, actionable error messages for common card errors
4. **Network Timeout Handling** - Graceful handling of slow or failed connections
5. **Error Logging** - Comprehensive logging for debugging and monitoring

## Components

### 1. Payment Error Boundary

**File**: `components/payment-error-boundary.tsx`

A React Error Boundary that wraps the payment form to catch and handle unexpected errors.

**Features**:
- Catches all React component errors during payment processing
- Displays user-friendly error messages
- Provides retry functionality
- Logs errors for debugging
- Shows detailed error information in development mode

**Usage**:
```tsx
<PaymentErrorBoundary onReset={handleReset}>
  <StripePaymentForm {...props} />
</PaymentErrorBoundary>
```

### 2. Payment Error Utilities

**File**: `lib/utils/payment-errors.ts`

Utility functions for handling payment errors.

#### Key Functions

##### `getPaymentErrorDetails(error)`
Maps Stripe error codes to user-friendly messages.

**Supported Error Codes**:
- `card_declined` - Card was declined by issuer
- `insufficient_funds` - Card has insufficient funds
- `expired_card` - Card has expired
- `incorrect_cvc` - Invalid security code
- `incorrect_number` - Invalid card number
- `authentication_required` - 3D Secure authentication needed
- `api_connection_error` - Network connection failed
- `rate_limit_error` - Too many requests
- And many more...

**Returns**:
```typescript
{
  code: string;           // Original error code
  message: string;        // Technical error message
  userMessage: string;    // User-friendly message
  retryable: boolean;     // Whether error can be retried
  suggestedAction?: string; // Suggested action for user
}
```

##### `isRetryableError(error)`
Determines if an error can be retried.

##### `getRetryDelay(attemptNumber)`
Calculates retry delay with exponential backoff.

**Backoff Strategy**:
- Attempt 1: ~1 second
- Attempt 2: ~2 seconds
- Attempt 3: ~4 seconds
- Attempt 4: ~8 seconds
- Attempt 5+: ~16 seconds (max)
- Includes random jitter to prevent thundering herd

##### `isNetworkTimeout(error)`
Detects network timeout errors.

##### `withTimeout(promise, timeoutMs)`
Wraps a promise with a timeout.

**Default Timeout**: 30 seconds

##### `logPaymentError(error, context)`
Logs payment errors with context for debugging.

**Logged Information**:
- Error code and message
- User-friendly message
- Order ID and payment intent ID
- Attempt number
- Timestamp
- User agent and URL

### 3. Enhanced Payment Form

**File**: `components/stripe-payment-form.tsx`

The payment form now includes comprehensive error handling.

**Features**:

#### Error Display
- Shows user-friendly error messages
- Displays suggested actions
- Indicates if error is retryable

#### Retry Logic
- Manual retry button for retryable errors
- Automatic retry with exponential backoff
- Countdown timer showing retry delay
- Prevents multiple simultaneous retries

#### Network Timeout Handling
- 30-second timeout for payment confirmation
- Detects and handles network timeouts
- Provides clear timeout error messages

#### Payment Status Polling
- Polls payment status for "processing" payments
- Automatically checks status every 3 seconds
- Handles long-running payment confirmations

#### Loading States
- Processing indicator during payment
- Retry countdown display
- Disabled buttons during processing

## Error Types and Handling

### Card Errors (Retryable)

| Error Code | User Message | Suggested Action |
|------------|--------------|------------------|
| `card_declined` | Your card was declined | Contact your bank or try another card |
| `insufficient_funds` | Card has insufficient funds | Add funds or use another card |
| `expired_card` | Card has expired | Update card details or use another card |
| `incorrect_cvc` | Security code is incorrect | Check the 3-digit code on back of card |
| `incorrect_number` | Card number is incorrect | Double-check your card number |

### Authentication Errors (Retryable)

| Error Code | User Message | Suggested Action |
|------------|--------------|------------------|
| `authentication_required` | Additional authentication required | Complete the authentication challenge |
| `payment_intent_authentication_failure` | Authentication failed | Retry and complete authentication |

### Network Errors (Retryable)

| Error Code | User Message | Suggested Action |
|------------|--------------|------------------|
| `api_connection_error` | Unable to connect to payment service | Check your connection and try again |
| `network_timeout` | Request timed out | Check your connection and try again |
| `rate_limit_error` | Too many payment attempts | Wait 1-2 minutes before retrying |

### Validation Errors (Non-Retryable)

| Error Code | User Message | Suggested Action |
|------------|--------------|------------------|
| `amount_too_small` | Payment amount is too small | Contact support |
| `amount_too_large` | Payment amount exceeds maximum | Contact support |

## Usage Examples

### Testing Error Handling

Use these test cards to simulate different error scenarios:

```typescript
// Success
4242 4242 4242 4242

// Card Declined
4000 0000 0000 0002

// Insufficient Funds
4000 0000 0000 9995

// 3D Secure Required
4000 0027 6000 3184

// Expired Card
4000 0000 0000 0069

// Incorrect CVC
Use any card with CVC 000
```

### Manual Retry

Users can manually retry failed payments by clicking the "Try Again" button:

```tsx
{canRetry && (
  <Button onClick={handleRetry}>
    Try Again
  </Button>
)}
```

### Automatic Retry with Backoff

The system automatically implements exponential backoff:

```typescript
const delay = getRetryDelay(attemptNumber);
await new Promise(resolve => setTimeout(resolve, delay));
```

### Network Timeout Protection

All payment confirmations are wrapped with a timeout:

```typescript
const result = await withTimeout(
  stripe.confirmPayment({ ... }),
  30000 // 30 second timeout
);
```

## Error Logging

### Development Mode

In development, errors are logged to the console with full details:

```javascript
console.error('Payment Error:', {
  timestamp: '2025-01-10T12:00:00.000Z',
  error: {
    code: 'card_declined',
    message: 'Your card was declined',
    userMessage: 'Your card was declined. Please try a different payment method.',
    retryable: true
  },
  context: {
    orderId: 'order_123',
    amount: 50.00,
    currency: 'chf',
    attemptNumber: 1
  }
});
```

### Production Mode

In production, errors are logged with minimal information and can be sent to external services:

```javascript
// Example integration with Sentry
Sentry.captureException(error, {
  contexts: {
    payment: {
      orderId: context.orderId,
      amount: context.amount,
      attemptNumber: context.attemptNumber
    }
  }
});
```

### Local Storage

Recent errors are stored in localStorage for debugging:

```javascript
const recentErrors = JSON.parse(localStorage.getItem('payment_errors') || '[]');
// Contains last 10 payment errors
```

## Best Practices

### 1. Always Use Error Boundary

Wrap payment forms with the error boundary:

```tsx
<PaymentErrorBoundary onReset={handleReset}>
  <StripePaymentForm {...props} />
</PaymentErrorBoundary>
```

### 2. Provide Context to Error Handlers

Pass order and payment information for better logging:

```tsx
<StripePaymentForm
  orderId={orderId}
  paymentIntentId={paymentIntentId}
  {...otherProps}
/>
```

### 3. Handle Timeouts

Always wrap network requests with timeouts:

```typescript
const result = await withTimeout(apiCall(), 30000);
```

### 4. Show Clear Error Messages

Use the user-friendly messages from `getPaymentErrorDetails`:

```typescript
const errorInfo = getPaymentErrorDetails(error);
setErrorMessage(errorInfo.userMessage);
```

### 5. Implement Retry Logic

Allow users to retry retryable errors:

```typescript
if (errorInfo.retryable) {
  // Show retry button
  // Implement exponential backoff
}
```

### 6. Log All Errors

Always log errors with context:

```typescript
logPaymentError(error, {
  orderId,
  amount,
  currency,
  attemptNumber
});
```

## Testing

Run the test suite to verify error handling:

```bash
npm test lib/utils/__tests__/payment-errors.test.ts
```

### Test Coverage

- ✅ User-friendly error messages for all error codes
- ✅ Retry logic with exponential backoff
- ✅ Network timeout detection
- ✅ Timeout wrapper functionality
- ✅ Error logging

## Monitoring

### Key Metrics to Track

1. **Payment Success Rate**: Percentage of successful payments
2. **Error Rate by Type**: Frequency of each error code
3. **Retry Success Rate**: Percentage of successful retries
4. **Average Retry Attempts**: Average number of retries before success
5. **Timeout Rate**: Frequency of network timeouts

### Recommended Alerts

- Payment success rate drops below 95%
- Error rate exceeds 10%
- Timeout rate exceeds 5%
- Multiple consecutive failures for same user

## Future Enhancements

1. **Smart Retry**: Skip retry for errors that are unlikely to succeed
2. **Error Analytics Dashboard**: Visualize error trends
3. **A/B Testing**: Test different error messages and retry strategies
4. **Predictive Retry**: Use ML to predict retry success probability
5. **User Feedback**: Collect feedback on error messages

## Support

For issues or questions about payment error handling:

1. Check the error logs in localStorage
2. Review the console output in development mode
3. Check Stripe Dashboard for payment intent details
4. Contact support with order ID and error code
