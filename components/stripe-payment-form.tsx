'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { PaymentErrorBoundary } from '@/components/payment-error-boundary';
import {
  getPaymentErrorDetails,
  isRetryableError,
  logPaymentError,
  getRetryDelay,
  isNetworkTimeout,
  withTimeout,
} from '@/lib/utils/payment-errors';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  orderId?: string;
  paymentIntentId?: string;
}

function CheckoutForm({ 
  amount, 
  onSuccess, 
  onError,
  orderId,
  paymentIntentId,
}: Omit<PaymentFormProps, 'clientSecret'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [attemptNumber, setAttemptNumber] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);

  // Countdown timer for retry delay
  useEffect(() => {
    if (retryCountdown > 0) {
      const timer = setTimeout(() => {
        setRetryCountdown(retryCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [retryCountdown]);

  const handlePaymentError = useCallback((error: any) => {
    const errorInfo = getPaymentErrorDetails(error);
    setErrorDetails(errorInfo);
    setErrorMessage(errorInfo.userMessage);
    
    // Log the error for debugging
    logPaymentError(error, {
      orderId,
      amount,
      currency: 'chf',
      paymentIntentId,
      attemptNumber: attemptNumber + 1,
    });

    // Notify parent component
    onError(errorInfo.userMessage);
  }, [orderId, amount, paymentIntentId, attemptNumber, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setErrorDetails(null);
    setAttemptNumber(prev => prev + 1);

    try {
      // Wrap payment confirmation with timeout (30 seconds)
      const result = await withTimeout(
        stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/checkout/success`,
          },
          redirect: 'if_required', // Only redirect if 3D Secure is required
        }),
        30000 // 30 second timeout
      );

      const { error, paymentIntent } = result;

      if (error) {
        // Payment failed - handle error
        handlePaymentError(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded
        onSuccess();
      } else if (paymentIntent && paymentIntent.status === 'processing') {
        // Payment is being processed
        setErrorMessage('Your payment is being processed. This may take a few moments...');
        
        // Poll for payment status
        setTimeout(() => {
          checkPaymentStatus(paymentIntent.id);
        }, 3000);
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        // Additional action required (e.g., 3D Secure)
        setErrorMessage('Additional authentication is required. Please complete the verification.');
      } else {
        // Unknown state
        handlePaymentError({
          code: 'unknown_state',
          message: `Payment is in an unexpected state: ${paymentIntent?.status}`,
        });
      }
    } catch (err: any) {
      // Handle network timeouts and other errors
      if (isNetworkTimeout(err)) {
        handlePaymentError({
          code: 'network_timeout',
          message: 'The payment request timed out. Please check your connection and try again.',
        });
      } else {
        handlePaymentError(err);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (paymentIntentId: string) => {
    if (!stripe) return;

    try {
      const { paymentIntent } = await stripe.retrievePaymentIntent(paymentIntentId);
      
      if (paymentIntent?.status === 'succeeded') {
        onSuccess();
      } else if (paymentIntent?.status === 'processing') {
        // Still processing, check again
        setTimeout(() => {
          checkPaymentStatus(paymentIntentId);
        }, 3000);
      } else {
        handlePaymentError({
          code: 'payment_failed',
          message: 'Payment processing failed',
        });
      }
    } catch (err) {
      handlePaymentError(err);
    }
  };

  const handleRetry = async () => {
    if (!errorDetails?.retryable) {
      return;
    }

    setIsRetrying(true);
    
    // Calculate retry delay with exponential backoff
    const delay = getRetryDelay(attemptNumber);
    const delaySeconds = Math.ceil(delay / 1000);
    setRetryCountdown(delaySeconds);

    // Wait for the delay
    await new Promise(resolve => setTimeout(resolve, delay));

    setIsRetrying(false);
    setRetryCountdown(0);
    setErrorMessage(null);
    setErrorDetails(null);
  };

  const canRetry = errorDetails?.retryable && !isProcessing && !isRetrying;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element - Stripe's pre-built payment form */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <PaymentElement 
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {/* Error Message Display with Retry Option */}
      {errorMessage && errorDetails && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment Failed</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{errorMessage}</p>
            
            {errorDetails.suggestedAction && (
              <p className="text-sm">
                <strong>Suggestion:</strong> {errorDetails.suggestedAction}
              </p>
            )}

            {canRetry && (
              <div className="flex gap-2 mt-3">
                <Button
                  type="button"
                  onClick={handleRetry}
                  variant="outline"
                  size="sm"
                  disabled={isRetrying}
                  className="bg-white hover:bg-gray-50"
                >
                  {isRetrying ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Retrying in {retryCountdown}s...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-3 w-3" />
                      Try Again
                    </>
                  )}
                </Button>
              </div>
            )}

            {!errorDetails.retryable && (
              <p className="text-sm mt-2">
                This error cannot be automatically retried. Please contact support if you need assistance.
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <Alert className="border-blue-200 bg-blue-50">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <AlertDescription className="text-blue-900">
            Processing your payment securely. Please do not close this window or press the back button.
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button with Loading State */}
      <Button
        type="submit"
        disabled={!stripe || isProcessing || isRetrying}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-bold disabled:opacity-50"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing Payment...
          </>
        ) : isRetrying ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Preparing Retry...
          </>
        ) : (
          `Pay Fr. ${amount.toFixed(2)}`
        )}
      </Button>

      {/* Attempt Counter (for debugging in development) */}
      {process.env.NODE_ENV === 'development' && attemptNumber > 0 && (
        <div className="text-xs text-gray-500 text-center">
          Attempt #{attemptNumber}
        </div>
      )}

      {/* Test Mode Indicator */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-md text-sm font-medium">
          <span className="text-lg">🧪</span>
          Test Mode - Use test card 4242 4242 4242 4242
        </span>
      </div>

      {/* Test Card Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 font-medium mb-2">Test Cards:</p>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Success: 4242 4242 4242 4242</li>
          <li>• Decline: 4000 0000 0000 0002</li>
          <li>• 3D Secure: 4000 0027 6000 3184</li>
          <li>• Insufficient Funds: 4000 0000 0000 9995</li>
        </ul>
        <p className="text-xs text-blue-700 mt-2">
          Use any future expiry date and any 3-digit CVC
        </p>
      </div>

      {/* Security Notice */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <CheckCircle className="h-3 w-3" />
        <span>Secure payment powered by Stripe</span>
      </div>
    </form>
  );
}

export function StripePaymentForm({ 
  clientSecret, 
  amount, 
  onSuccess, 
  onError,
  orderId,
  paymentIntentId,
}: PaymentFormProps) {
  const [mounted, setMounted] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Ensure component only renders on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReset = useCallback(() => {
    // Reset the form by changing the key
    setResetKey(prev => prev + 1);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Configure Stripe Elements appearance
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#16a34a', // Green color matching the design
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
      rules: {
        '.Input': {
          border: '1px solid #e5e7eb',
          boxShadow: 'none',
        },
        '.Input:focus': {
          border: '1px solid #16a34a',
          boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)',
        },
        '.Label': {
          fontWeight: '500',
          marginBottom: '8px',
        },
      },
    },
  };

  return (
    <PaymentErrorBoundary onReset={handleReset}>
      <Elements key={resetKey} stripe={stripePromise} options={options}>
        <CheckoutForm 
          amount={amount} 
          onSuccess={onSuccess} 
          onError={onError}
          orderId={orderId}
          paymentIntentId={paymentIntentId}
        />
      </Elements>
    </PaymentErrorBoundary>
  );
}
