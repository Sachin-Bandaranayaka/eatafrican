import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

if (!process.env.STRIPE_PUBLISHABLE_KEY) {
  throw new Error('STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
}

// Initialize Stripe with the secret key (server-side only)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Export the publishable key for client-side usage
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

// Helper to check if we're in test mode
export const isTestMode = () => {
  return process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ?? false;
};

// Log initialization status
if (process.env.NODE_ENV === 'development') {
  console.log('[Stripe] Initialized in', isTestMode() ? 'TEST' : 'LIVE', 'mode');
}
