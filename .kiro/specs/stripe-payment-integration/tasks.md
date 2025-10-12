# Implementation Plan

- [x] 1. Set up Stripe configuration and environment
  - Install Stripe npm packages (@stripe/stripe-js, stripe)
  - Add Stripe API keys to .env file
  - Update next.config.mjs to expose public key
  - Create Stripe client initialization module
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Implement Stripe service layer
- [x] 2.1 Create Stripe client module
  - Write lib/stripe/client.ts with Stripe initialization
  - Export stripe instance and publishable key
  - Add error handling for missing API keys
  - _Requirements: 1.1, 1.2, 10.4_

- [x] 2.2 Create payment intent service
  - Write lib/stripe/payment-intent.ts with createPaymentIntent function
  - Implement retrievePaymentIntent function
  - Add TypeScript interfaces for payment intent parameters
  - Handle amount conversion to cents
  - _Requirements: 2.3, 2.4, 10.5_

- [x] 2.3 Create webhook verification service
  - Write lib/stripe/webhook.ts with constructWebhookEvent function
  - Implement webhook signature verification
  - Add isTestModeEvent helper function
  - _Requirements: 6.1, 6.2, 10.2_

- [x] 3. Implement payment intent creation API endpoint
  - Create app/api/checkout/create-payment-intent/route.ts
  - Implement POST handler with request validation
  - Integrate with payment intent service
  - Add authentication support (optional auth)
  - Return client secret to frontend
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 8.1_

- [x] 4. Implement webhook handler API endpoint
  - Create app/api/checkout/webhooks/route.ts
  - Implement POST handler with signature verification
  - Handle payment_intent.succeeded event
  - Handle payment_intent.payment_failed event
  - Handle payment_intent.canceled event
  - Update order payment_status in database
  - Disable body parsing for webhook route
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 5. Create Stripe payment form component
  - Create components/stripe-payment-form.tsx
  - Implement Stripe Elements integration
  - Add PaymentElement component
  - Implement form submission with confirmPayment
  - Add loading and error states
  - Display test mode indicator
  - Handle 3D Secure authentication flows
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.6, 9.1_

- [x] 6. Create checkout page
  - Create app/checkout/page.tsx
  - Integrate with cart context to get items and total
  - Call create-payment-intent API on page load
  - Display order summary with subtotal, delivery fee, and total
  - Render StripePaymentForm with client secret
  - Handle payment success and redirect
  - Handle payment errors and display messages
  - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3, 4.4, 4.5, 7.1, 7.2_

- [x] 7. Update order creation flow
  - Modify app/api/orders/route.ts to support payment integration
  - Create order with payment_status='pending' before payment
  - Store payment_reference after payment confirmation
  - Update order status to 'confirmed' after successful payment
  - Handle order creation failures after payment
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 8. Create payment success page
  - Create app/checkout/success/page.tsx
  - Display order confirmation details
  - Show order number and payment status
  - Clear cart after successful payment
  - Add link to view order details
  - _Requirements: 7.1, 7.3_

- [x] 9. Update cart component for checkout flow
  - Modify components/cart-connected.tsx
  - Replace direct order creation with redirect to checkout page
  - Update "Place Order" button to navigate to /checkout
  - Pass delivery information to checkout page via state or context
  - _Requirements: 2.1, 4.1_

- [x] 10. Implement error handling and recovery
  - Add error boundary for payment form
  - Implement retry logic for failed payments
  - Add user-friendly error messages for common card errors
  - Handle network timeouts gracefully
  - Log payment errors for debugging
  - _Requirements: 4.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 11. Add payment status tracking
  - Create payment status display component
  - Show payment status in order history
  - Add payment status indicators (pending, completed, failed)
  - Display payment method and reference in order details
  - _Requirements: 7.2, 7.3, 7.4_

- [ ] 12. Configure webhook endpoint for testing
  - Install Stripe CLI for local development
  - Set up webhook forwarding to localhost
  - Test webhook events locally
  - Document webhook setup process
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ]* 13. Write integration tests
  - Test successful payment flow end-to-end
  - Test failed payment scenarios
  - Test 3D Secure authentication flow
  - Test webhook processing
  - Test guest checkout flow
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ]* 14. Add payment analytics and monitoring
  - Log payment intent creations
  - Log webhook events
  - Track payment success/failure rates
  - Add error alerting for payment failures
  - _Requirements: 8.5_
