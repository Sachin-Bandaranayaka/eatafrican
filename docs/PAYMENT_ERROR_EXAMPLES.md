# Payment Error Handling Examples

This document provides practical examples of how the payment error handling system works in different scenarios.

## Example 1: Card Declined Error

### Scenario
User attempts to pay with a declined card (test card: 4000 0000 0000 0002)

### Flow
1. User enters card details and clicks "Pay"
2. Stripe declines the card
3. System catches the error
4. Displays user-friendly message: "Your card was declined. Please try a different payment method."
5. Shows suggested action: "Contact your bank or try another card"
6. Displays "Try Again" button
7. User can retry with a different card

### Code Flow
```typescript
// Payment attempt
const { error } = await stripe.confirmPayment({ ... });

// Error handling
if (error) {
  const errorInfo = getPaymentErrorDetails(error);
  // errorInfo.code = 'card_declined'
  // errorInfo.userMessage = 'Your card was declined...'
  // errorInfo.retryable = true
  
  setErrorMessage(errorInfo.userMessage);
  logPaymentError(error, { orderId, amount, attemptNumber: 1 });
}
```

### User Experience
```
❌ Payment Failed
Your card was declined. Please try a different payment method.

Suggestion: Contact your bank or try another card

[Try Again]
```

## Example 2: Network Timeout

### Scenario
User has slow internet connection, payment request times out

### Flow
1. User clicks "Pay"
2. Network request takes longer than 30 seconds
3. System detects timeout
4. Displays timeout error message
5. Suggests checking connection
6. Allows retry with exponential backoff

### Code Flow
```typescript
try {
  // Wrap with timeout
  const result = await withTimeout(
    stripe.confirmPayment({ ... }),
    30000
  );
} catch (err) {
  if (isNetworkTimeout(err)) {
    const errorInfo = getPaymentErrorDetails({
      code: 'network_timeout',
      message: 'Request timed out'
    });
    // Shows timeout-specific message
  }
}
```

### User Experience
```
❌ Payment Failed
The payment request timed out. Please check your connection and try again.

Suggestion: Check your connection and try again

[Try Again]

⏱️ Retrying in 2s...
```

## Example 3: Insufficient Funds

### Scenario
User's card has insufficient funds (test card: 4000 0000 0000 9995)

### Flow
1. User attempts payment
2. Card is declined due to insufficient funds
3. System shows specific error message
4. Suggests using different card or adding funds
5. User can retry immediately

### Code Flow
```typescript
const errorInfo = getPaymentErrorDetails({
  code: 'insufficient_funds',
  message: 'Insufficient funds'
});

// errorInfo.userMessage = 'Your card has insufficient funds...'
// errorInfo.suggestedAction = 'Add funds to your account or use another card'
// errorInfo.retryable = true
```

### User Experience
```
❌ Payment Failed
Your card has insufficient funds. Please use a different card.

Suggestion: Add funds to your account or use another card

[Try Again]
```

## Example 4: 3D Secure Authentication

### Scenario
User's card requires 3D Secure authentication (test card: 4000 0027 6000 3184)

### Flow
1. User enters card details
2. Stripe triggers 3D Secure challenge
3. User completes authentication in modal
4. Payment proceeds after successful authentication
5. If authentication fails, shows retry option

### Code Flow
```typescript
const { error, paymentIntent } = await stripe.confirmPayment({
  elements,
  confirmParams: { return_url: '...' },
  redirect: 'if_required'
});

if (paymentIntent?.status === 'requires_action') {
  // 3D Secure challenge triggered automatically
  setErrorMessage('Additional authentication is required...');
}
```

### User Experience
```
🔐 Authentication Required
Additional authentication is required to complete this payment.

[3D Secure Modal Opens]

✅ Authentication Successful
Processing payment...
```

## Example 5: Multiple Retry Attempts with Backoff

### Scenario
User experiences intermittent network issues, requires multiple retries

### Flow
1. First attempt fails (network error)
2. User clicks "Try Again"
3. System waits 1 second (attempt 1)
4. Second attempt fails
5. User clicks "Try Again"
6. System waits 2 seconds (attempt 2)
7. Third attempt succeeds

### Code Flow
```typescript
// Attempt 1
setAttemptNumber(1);
const delay1 = getRetryDelay(1); // ~1000ms

// Attempt 2
setAttemptNumber(2);
const delay2 = getRetryDelay(2); // ~2000ms

// Attempt 3
setAttemptNumber(3);
const delay3 = getRetryDelay(3); // ~4000ms
```

### User Experience
```
Attempt 1:
❌ Payment Failed
Unable to connect to payment service. Please check your internet connection.
[Try Again]

Attempt 2:
⏱️ Retrying in 2s...
❌ Payment Failed
[Try Again]

Attempt 3:
⏱️ Retrying in 4s...
✅ Payment Successful!
```

## Example 6: React Error Boundary Catch

### Scenario
Unexpected JavaScript error occurs during payment processing

### Flow
1. User clicks "Pay"
2. Unexpected error thrown in component
3. Error Boundary catches the error
4. Displays fallback UI
5. Logs error details
6. Provides reset option

### Code Flow
```typescript
// Error Boundary catches error
componentDidCatch(error, errorInfo) {
  console.error('Payment Error Boundary caught:', {
    error: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack
  });
  
  this.logErrorToService(error, errorInfo);
}
```

### User Experience
```
⚠️ Payment System Error
We encountered an unexpected error while processing your payment.
Please try again or contact support if the problem persists.

What happened?
An unexpected error occurred

[Try Again] [Back to Restaurants]

--- Development Only ---
Error Details:
TypeError: Cannot read property 'confirmPayment' of undefined
  at CheckoutForm.handleSubmit (stripe-payment-form.tsx:45)
  ...
```

## Example 7: Rate Limit Error

### Scenario
User makes too many payment attempts in short time

### Flow
1. User attempts payment multiple times quickly
2. Stripe rate limits the requests
3. System detects rate limit error
4. Shows specific message with wait time
5. Prevents further attempts for cooldown period

### Code Flow
```typescript
const errorInfo = getPaymentErrorDetails({
  code: 'rate_limit_error',
  message: 'Too many requests'
});

// errorInfo.userMessage = 'Too many payment attempts...'
// errorInfo.suggestedAction = 'Wait 1-2 minutes before retrying'

// Longer backoff for rate limits
const delay = getRetryDelay(5); // ~16 seconds
```

### User Experience
```
❌ Payment Failed
Too many payment attempts. Please wait a moment and try again.

Suggestion: Wait 1-2 minutes before retrying

⏱️ Retrying in 16s...
```

## Example 8: Processing Payment Status

### Scenario
Payment takes longer to process (e.g., bank verification)

### Flow
1. User submits payment
2. Payment status is "processing"
3. System polls for status updates
4. Shows processing indicator
5. Updates when payment completes

### Code Flow
```typescript
if (paymentIntent?.status === 'processing') {
  setErrorMessage('Your payment is being processed...');
  
  // Poll for status
  setTimeout(() => {
    checkPaymentStatus(paymentIntent.id);
  }, 3000);
}

async function checkPaymentStatus(id) {
  const { paymentIntent } = await stripe.retrievePaymentIntent(id);
  
  if (paymentIntent?.status === 'succeeded') {
    onSuccess();
  } else if (paymentIntent?.status === 'processing') {
    // Check again
    setTimeout(() => checkPaymentStatus(id), 3000);
  }
}
```

### User Experience
```
⏳ Processing Payment
Your payment is being processed. This may take a few moments...

[Animated spinner]

Checking status... (3s intervals)

✅ Payment Successful!
```

## Testing These Scenarios

### Using Stripe Test Cards

```bash
# Card Declined
Card: 4000 0000 0000 0002
Expiry: Any future date
CVC: Any 3 digits

# Insufficient Funds
Card: 4000 0000 0000 9995
Expiry: Any future date
CVC: Any 3 digits

# 3D Secure Required
Card: 4000 0027 6000 3184
Expiry: Any future date
CVC: Any 3 digits

# Success
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
```

### Simulating Network Issues

```javascript
// In browser console, throttle network
// Chrome DevTools > Network > Throttling > Slow 3G

// Or use timeout simulation
const simulateTimeout = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Request timeout'));
    }, 100);
  });
};
```

### Viewing Error Logs

```javascript
// In browser console
const errors = JSON.parse(localStorage.getItem('payment_errors') || '[]');
console.table(errors);
```

## Error Recovery Patterns

### Pattern 1: Immediate Retry
For transient errors (network glitches), allow immediate retry:
```typescript
if (isNetworkTimeout(error)) {
  // Allow immediate retry
  setCanRetry(true);
}
```

### Pattern 2: Delayed Retry
For rate limits or processing errors, enforce delay:
```typescript
if (error.code === 'rate_limit_error') {
  const delay = getRetryDelay(attemptNumber);
  setRetryCountdown(Math.ceil(delay / 1000));
}
```

### Pattern 3: No Retry
For permanent errors, don't allow retry:
```typescript
if (error.code === 'amount_too_small') {
  setCanRetry(false);
  // Show contact support message
}
```

## Monitoring Error Patterns

### Key Metrics

```javascript
// Track error frequency
const errorCounts = {
  card_declined: 45,
  insufficient_funds: 23,
  network_timeout: 12,
  authentication_required: 8,
  // ...
};

// Track retry success rate
const retryStats = {
  totalRetries: 100,
  successfulRetries: 78,
  successRate: 0.78
};

// Track average attempts
const avgAttempts = 1.3; // Most succeed on first try
```

### Alert Conditions

```javascript
// Alert if error rate spikes
if (errorRate > 0.15) { // 15% error rate
  sendAlert('High payment error rate detected');
}

// Alert if timeout rate is high
if (timeoutRate > 0.05) { // 5% timeout rate
  sendAlert('Network timeout rate elevated');
}
```
