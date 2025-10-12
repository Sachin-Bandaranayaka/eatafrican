# Order Creation with Payment Integration

This document describes the updated order creation flow that integrates with Stripe payment processing.

## Overview

The order creation flow has been enhanced to support Stripe payment integration while maintaining backward compatibility with the legacy flow (orders without payment).

## Flow Diagram

```
┌─────────────┐
│   Customer  │
└──────┬──────┘
       │
       │ 1. Clicks Checkout
       ▼
┌─────────────────────────────────────┐
│  Create Payment Intent              │
│  POST /api/checkout/create-payment- │
│       intent                        │
│  - amount, currency                 │
│  - customerEmail                    │
└──────┬──────────────────────────────┘
       │
       │ Returns: clientSecret, paymentIntentId
       ▼
┌─────────────────────────────────────┐
│  Create Order                       │
│  POST /api/orders                   │
│  - restaurantId, items              │
│  - deliveryAddress, etc.            │
│  - paymentIntentId (links to Stripe)│
└──────┬──────────────────────────────┘
       │
       │ Order created with:
       │ - payment_status='pending'
       │ - payment_reference=paymentIntentId
       │ - payment_method='stripe'
       ▼
┌─────────────────────────────────────┐
│  Display Payment Form               │
│  (Stripe Elements)                  │
└──────┬──────────────────────────────┘
       │
       │ Customer enters card details
       ▼
┌─────────────────────────────────────┐
│  Submit Payment                     │
│  stripe.confirmPayment()            │
└──────┬──────────────────────────────┘
       │
       ├─── Success ───┐
       │               │
       │               ▼
       │        ┌─────────────────────┐
       │        │  Webhook Handler    │
       │        │  payment_intent.    │
       │        │  succeeded          │
       │        └──────┬──────────────┘
       │               │
       │               │ Updates order:
       │               │ - payment_status='completed'
       │               │ - status='confirmed'
       │               ▼
       │        ┌─────────────────────┐
       │        │  Order Confirmed    │
       │        └─────────────────────┘
       │
       └─── Failure ───┐
                       │
                       ▼
                ┌─────────────────────┐
                │  Show Error         │
                │  Allow Retry        │
                └─────────────────────┘
```

## API Endpoints

### 1. Create Payment Intent

**Endpoint:** `POST /api/checkout/create-payment-intent`

**Request Body:**
```json
{
  "amount": 50.00,
  "currency": "chf",
  "customerEmail": "customer@example.com",
  "orderId": "optional-order-id"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### 2. Create Order

**Endpoint:** `POST /api/orders`

**Request Body:**
```json
{
  "restaurantId": "uuid",
  "items": [
    {
      "menuItemId": "uuid",
      "quantity": 2,
      "specialInstructions": "Extra spicy"
    }
  ],
  "deliveryAddress": "Teststrasse 123",
  "deliveryCity": "Basel",
  "deliveryPostalCode": "4000",
  "customerEmail": "customer@example.com",
  "customerPhone": "+41791234567",
  "customerFirstName": "John",
  "customerLastName": "Doe",
  "scheduledDeliveryTime": "2025-10-10T14:00:00Z",
  "paymentIntentId": "pi_xxx"  // Optional - links to Stripe payment
}
```

**Response:**
```json
{
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-1234567890-ABC123",
    "status": "new",
    "paymentStatus": "pending",
    "subtotal": 45.00,
    "deliveryFee": 6.00,
    "taxAmount": 4.13,
    "totalAmount": 55.13
  }
}
```

### 3. Update Order Payment Status

**Endpoint:** `PATCH /api/orders`

**Request Body:**
```json
{
  "orderId": "uuid",
  "paymentIntentId": "pi_xxx",
  "paymentStatus": "completed"
}
```

**Response:**
```json
{
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-1234567890-ABC123",
    "status": "confirmed",
    "paymentStatus": "completed",
    "paymentReference": "pi_xxx"
  }
}
```

## Database Schema

### Orders Table

The following fields are used for payment integration:

- `payment_status`: enum ('pending', 'completed', 'failed', 'refunded')
- `payment_method`: string ('stripe', 'cash', etc.)
- `payment_reference`: string (Stripe Payment Intent ID)

## Payment Status Flow

```
pending → completed (via webhook after successful payment)
pending → failed (via webhook after failed payment)
completed → refunded (manual refund process)
```

## Order Status Flow

```
new → confirmed (automatically when payment_status becomes 'completed')
confirmed → preparing → ready_for_pickup → assigned → in_transit → delivered
```

## Implementation Details

### Order Creation with Payment

1. **Payment Intent First**: Create the payment intent before the order
2. **Link Order to Payment**: Pass `paymentIntentId` when creating the order
3. **Store Reference**: Order stores the payment intent ID in `payment_reference`
4. **Initial Status**: Order is created with `payment_status='pending'`
5. **Webhook Updates**: Webhook handler updates status after payment confirmation

### Backward Compatibility

Orders can still be created without a payment intent ID for:
- Cash on delivery
- Testing purposes
- Legacy integrations

Simply omit the `paymentIntentId` field when creating the order.

### Error Handling

#### Order Creation Fails After Payment Intent

If order creation fails after the payment intent is created:
1. Payment intent remains in Stripe (not charged yet)
2. Customer can retry order creation
3. Same payment intent can be reused
4. If customer abandons, payment intent expires after 24 hours

#### Payment Fails After Order Creation

If payment fails after the order is created:
1. Order remains with `payment_status='pending'`
2. Customer can retry payment with the same order
3. Webhook updates order to `payment_status='failed'`
4. Order can be cancelled or customer can retry

#### Webhook Processing Fails

If webhook processing fails:
1. Stripe automatically retries webhooks
2. Order may temporarily show incorrect status
3. Eventually consistent when webhook succeeds
4. Manual reconciliation available for edge cases

## Testing

### Test Script

Run the test script to verify the order creation flow:

```bash
node scripts/test-order-with-payment.js
```

This tests:
1. Creating payment intent
2. Creating order with payment intent ID
3. Updating order after payment confirmation
4. Creating order without payment intent (legacy flow)

### Manual Testing

1. **Successful Payment Flow**:
   - Add items to cart
   - Go to checkout
   - Enter test card: 4242 4242 4242 4242
   - Verify order created with `payment_status='pending'`
   - Verify webhook updates to `payment_status='completed'`
   - Verify order status changes to `confirmed`

2. **Failed Payment Flow**:
   - Use declined card: 4000 0000 0000 0002
   - Verify error message displayed
   - Verify order remains `payment_status='pending'`
   - Verify customer can retry

3. **3D Secure Flow**:
   - Use 3D Secure card: 4000 0027 6000 3184
   - Complete authentication
   - Verify payment succeeds after auth

## Security Considerations

1. **Never Store Card Details**: Card data is handled entirely by Stripe
2. **Server-Side Validation**: All amounts validated on server
3. **Webhook Verification**: Webhook signatures verified before processing
4. **HTTPS Only**: All payment communication over HTTPS
5. **PCI Compliance**: Using Stripe Elements ensures PCI compliance

## Monitoring

Monitor the following:
- Payment intent creation success rate
- Order creation success rate
- Payment confirmation rate
- Webhook delivery success rate
- Time between order creation and payment confirmation

## Future Enhancements

1. **Idempotency**: Add idempotency keys to prevent duplicate orders
2. **Payment Retry**: Automatic retry logic for failed payments
3. **Partial Refunds**: Support for partial order refunds
4. **Multiple Payment Methods**: Support for Apple Pay, Google Pay, etc.
5. **Saved Payment Methods**: Store customer payment methods for faster checkout
