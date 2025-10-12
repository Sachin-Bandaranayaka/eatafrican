/**
 * Payment Error Handling Utilities
 * Provides user-friendly error messages and retry logic for payment failures
 */

export interface PaymentError {
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
  suggestedAction?: string;
}

/**
 * Maps Stripe error codes to user-friendly messages
 */
export function getPaymentErrorDetails(error: any): PaymentError {
  const errorCode = error?.code || error?.type || 'unknown_error';
  const errorMessage = error?.message || 'An unknown error occurred';

  // Map common Stripe error codes to user-friendly messages
  const errorMap: Record<string, Omit<PaymentError, 'code' | 'message'>> = {
    // Card errors
    card_declined: {
      userMessage: 'Your card was declined. Please try a different payment method.',
      retryable: true,
      suggestedAction: 'Contact your bank or try another card',
    },
    insufficient_funds: {
      userMessage: 'Your card has insufficient funds. Please use a different card.',
      retryable: true,
      suggestedAction: 'Add funds to your account or use another card',
    },
    expired_card: {
      userMessage: 'Your card has expired. Please use a different card.',
      retryable: true,
      suggestedAction: 'Update your card details or use another card',
    },
    incorrect_cvc: {
      userMessage: 'The security code (CVC) you entered is incorrect.',
      retryable: true,
      suggestedAction: 'Check the 3-digit code on the back of your card',
    },
    incorrect_number: {
      userMessage: 'The card number you entered is incorrect.',
      retryable: true,
      suggestedAction: 'Double-check your card number',
    },
    invalid_expiry_month: {
      userMessage: 'The expiration month is invalid.',
      retryable: true,
      suggestedAction: 'Check the expiration date on your card',
    },
    invalid_expiry_year: {
      userMessage: 'The expiration year is invalid.',
      retryable: true,
      suggestedAction: 'Check the expiration date on your card',
    },
    processing_error: {
      userMessage: 'An error occurred while processing your card. Please try again.',
      retryable: true,
      suggestedAction: 'Wait a moment and try again',
    },

    // Authentication errors
    authentication_required: {
      userMessage: 'Additional authentication is required to complete this payment.',
      retryable: true,
      suggestedAction: 'Complete the authentication challenge',
    },
    payment_intent_authentication_failure: {
      userMessage: 'Payment authentication failed. Please try again.',
      retryable: true,
      suggestedAction: 'Retry the payment and complete authentication',
    },

    // Network and API errors
    api_connection_error: {
      userMessage: 'Unable to connect to the payment service. Please check your internet connection.',
      retryable: true,
      suggestedAction: 'Check your connection and try again',
    },
    api_error: {
      userMessage: 'A payment service error occurred. Please try again.',
      retryable: true,
      suggestedAction: 'Wait a moment and try again',
    },
    rate_limit_error: {
      userMessage: 'Too many payment attempts. Please wait a moment and try again.',
      retryable: true,
      suggestedAction: 'Wait 1-2 minutes before retrying',
    },

    // Validation errors
    invalid_request_error: {
      userMessage: 'Invalid payment information. Please check your details.',
      retryable: true,
      suggestedAction: 'Verify all payment details are correct',
    },
    amount_too_small: {
      userMessage: 'The payment amount is too small.',
      retryable: false,
      suggestedAction: 'Contact support for assistance',
    },
    amount_too_large: {
      userMessage: 'The payment amount exceeds the maximum allowed.',
      retryable: false,
      suggestedAction: 'Contact support for assistance',
    },

    // Generic errors
    unknown_error: {
      userMessage: 'An unexpected error occurred. Please try again.',
      retryable: true,
      suggestedAction: 'Try again or contact support',
    },
  };

  const errorDetails = errorMap[errorCode] || errorMap.unknown_error;

  return {
    code: errorCode,
    message: errorMessage,
    ...errorDetails,
  };
}

/**
 * Determines if an error is retryable
 */
export function isRetryableError(error: any): boolean {
  const errorDetails = getPaymentErrorDetails(error);
  return errorDetails.retryable;
}

/**
 * Logs payment errors for debugging and monitoring
 */
export function logPaymentError(
  error: any,
  context: {
    orderId?: string;
    amount?: number;
    currency?: string;
    paymentIntentId?: string;
    attemptNumber?: number;
  }
) {
  const errorDetails = getPaymentErrorDetails(error);
  
  const logData = {
    timestamp: new Date().toISOString(),
    error: {
      code: errorDetails.code,
      message: errorDetails.message,
      userMessage: errorDetails.userMessage,
      retryable: errorDetails.retryable,
    },
    context,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Payment Error:', logData);
  }

  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Sentry, LogRocket, or custom logging service
    // logToExternalService(logData);
    console.error('Payment Error (Production):', {
      code: errorDetails.code,
      orderId: context.orderId,
      timestamp: logData.timestamp,
    });
  }

  // Store in localStorage for debugging (optional)
  try {
    const recentErrors = JSON.parse(localStorage.getItem('payment_errors') || '[]');
    recentErrors.push(logData);
    // Keep only last 10 errors
    if (recentErrors.length > 10) {
      recentErrors.shift();
    }
    localStorage.setItem('payment_errors', JSON.stringify(recentErrors));
  } catch (e) {
    // Ignore localStorage errors
  }
}

/**
 * Implements exponential backoff for retry attempts
 */
export function getRetryDelay(attemptNumber: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, 16s
  const baseDelay = 1000;
  const maxDelay = 16000;
  const delay = Math.min(baseDelay * Math.pow(2, attemptNumber - 1), maxDelay);
  
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * 500;
  
  return delay + jitter;
}

/**
 * Checks if a network timeout occurred
 */
export function isNetworkTimeout(error: any): boolean {
  const message = error?.message?.toLowerCase() || '';
  return (
    message.includes('timeout') ||
    message.includes('network') ||
    message.includes('fetch') ||
    error?.code === 'ECONNABORTED' ||
    error?.code === 'ETIMEDOUT'
  );
}

/**
 * Creates a timeout promise for network requests
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error('Request timeout - please check your connection')),
        timeoutMs
      )
    ),
  ]);
}
