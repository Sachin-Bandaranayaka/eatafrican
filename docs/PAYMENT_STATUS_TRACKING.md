# Payment Status Tracking

This document describes the payment status tracking implementation for the Stripe payment integration.

## Overview

The payment status tracking feature provides visual indicators and detailed information about payment states throughout the application. It includes reusable components for displaying payment status in order lists, order details, and admin dashboards.

## Components

### 1. PaymentStatusBadge

A compact badge component that displays the payment status with color-coded styling and optional icons.

**Location:** `components/payment-status-badge.tsx`

**Props:**
- `status`: `'pending' | 'completed' | 'failed' | 'refunded'` - The payment status
- `className?`: `string` - Additional CSS classes
- `showIcon?`: `boolean` - Whether to show the status icon (default: true)

**Usage:**
```tsx
import { PaymentStatusBadge } from '@/components/payment-status-badge';

<PaymentStatusBadge status="completed" />
<PaymentStatusBadge status="pending" showIcon={false} />
```

**Status Colors:**
- **Pending**: Yellow background with clock icon
- **Completed**: Green background with check circle icon
- **Failed**: Red background with X circle icon
- **Refunded**: Gray background with refresh icon

### 2. PaymentInfoDisplay

A comprehensive component that displays payment status along with payment method and reference information.

**Location:** `components/payment-info-display.tsx`

**Props:**
- `paymentStatus`: `PaymentStatus` - The payment status
- `paymentMethod?`: `string | null` - Payment method (e.g., 'stripe', 'card')
- `paymentReference?`: `string | null` - Payment reference/transaction ID
- `showDetails?`: `boolean` - Whether to show detailed information (default: true)
- `className?`: `string` - Additional CSS classes

**Usage:**
```tsx
import { PaymentInfoDisplay } from '@/components/payment-info-display';

<PaymentInfoDisplay
  paymentStatus="completed"
  paymentMethod="stripe"
  paymentReference="pi_3QRxyz123456789"
  showDetails={true}
/>
```

**Features:**
- Displays payment status badge
- Shows payment method with icon
- Displays payment reference (transaction ID)
- Provides contextual messages for each status
- Responsive design with proper text wrapping

### 3. OrderCardWithPayment

An enhanced order card component that includes payment status display.

**Location:** `components/order-card-with-payment.tsx`

**Props:**
- `orderId`: `string` - Order ID
- `orderNumber`: `string` - Order number
- `status`: `string` - Order status
- `title`: `string` - Order title/description
- `address`: `string` - Delivery address
- `date`: `string` - Order date
- `time`: `string` - Order time
- `orderItems`: `string` - Order items summary
- `price`: `number` - Total price
- `paymentStatus`: `PaymentStatus` - Payment status
- `paymentMethod?`: `string | null` - Payment method
- `paymentReference?`: `string | null` - Payment reference
- `onViewDetails?`: `() => void` - Callback for view details button
- `onViewMore?`: `() => void` - Callback for view more button
- `showPaymentDetails?`: `boolean` - Whether to show expanded payment details

**Usage:**
```tsx
import { OrderCardWithPayment } from '@/components/order-card-with-payment';

<OrderCardWithPayment
  orderId="123"
  orderNumber="ORD-5400"
  status="In Transit"
  title="Meal Name"
  address="Restaurant Address"
  date="26. June 2025"
  time="15.30"
  orderItems="1x Doro Wat, 2x Injera"
  price={45.0}
  paymentStatus="completed"
  paymentMethod="stripe"
  paymentReference="pi_3QRxyz123456789"
  onViewDetails={() => console.log('View details')}
/>
```

### 4. OrderDetailsView

A comprehensive order details view component with full payment information.

**Location:** `components/order-details-view.tsx`

**Props:**
- `orderNumber`: `string` - Order number
- `status`: `string` - Order status
- `customerName`: `string` - Customer name
- `customerEmail?`: `string` - Customer email
- `customerPhone?`: `string` - Customer phone
- `deliveryAddress`: `string` - Delivery address
- `deliveryCity`: `string` - Delivery city
- `deliveryPostalCode`: `string` - Postal code
- `scheduledDeliveryTime?`: `string` - Scheduled delivery time
- `actualDeliveryTime?`: `string` - Actual delivery time
- `items`: `OrderItem[]` - Order items
- `subtotal`: `number` - Subtotal amount
- `deliveryFee`: `number` - Delivery fee
- `discountAmount?`: `number` - Discount amount
- `taxAmount?`: `number` - Tax amount
- `totalAmount`: `number` - Total amount
- `paymentStatus`: `PaymentStatus` - Payment status
- `paymentMethod?`: `string | null` - Payment method
- `paymentReference?`: `string | null` - Payment reference
- `onClose?`: `() => void` - Callback for close button

**Usage:**
```tsx
import { OrderDetailsView } from '@/components/order-details-view';

<OrderDetailsView
  orderNumber="ORD-5400"
  status="Delivered"
  customerName="John Doe"
  customerEmail="john@example.com"
  deliveryAddress="123 Main St"
  deliveryCity="Basel"
  deliveryPostalCode="4000"
  items={orderItems}
  subtotal={45.0}
  deliveryFee={6.0}
  totalAmount={51.0}
  paymentStatus="completed"
  paymentMethod="stripe"
  paymentReference="pi_3QRxyz123456789"
  onClose={() => setShowDetails(false)}
/>
```

### 5. OrderTableWithPayment

An admin table component for displaying orders with payment status.

**Location:** `components/superAdmin/orders/components/OrderTableWithPayment.tsx`

**Props:**
- `orders`: `Order[]` - Array of orders
- `onOrderClick?`: `(orderNr: string) => void` - Callback when order is clicked

**Usage:**
```tsx
import { OrderTableWithPayment } from '@/components/superAdmin/orders/components/OrderTableWithPayment';

<OrderTableWithPayment
  orders={ordersWithPayment}
  onOrderClick={(orderNr) => console.log('Order clicked:', orderNr)}
/>
```

### 6. UserDashboardOrdersConnected

A connected component that fetches and displays customer orders with payment information.

**Location:** `components/userDashboard-orders-connected.tsx`

**Props:**
- `customerId`: `string` - Customer ID

**Usage:**
```tsx
import { UserDashboardOrdersConnected } from '@/components/userDashboard-orders-connected';

<UserDashboardOrdersConnected customerId={user.id} />
```

## API Updates

### Customer Orders API

**Endpoint:** `GET /api/customers/[id]/orders`

**Response includes:**
- `paymentStatus`: Payment status
- `paymentMethod`: Payment method (e.g., 'stripe')
- `paymentReference`: Payment reference/transaction ID

### Order Details API

**Endpoint:** `GET /api/orders/[id]`

**Response includes:**
- `paymentStatus`: Payment status
- `paymentMethod`: Payment method
- `paymentReference`: Payment reference/transaction ID

### Admin Orders API

**Endpoint:** `GET /api/admin/orders`

**Response includes:**
- `paymentStatus`: Payment status
- `paymentMethod`: Payment method
- `paymentReference`: Payment reference/transaction ID

## Payment Status States

### Pending
- **Description**: Payment is being processed
- **Color**: Yellow
- **Icon**: Clock
- **Use Case**: Order created, waiting for payment confirmation

### Completed
- **Description**: Payment successfully processed
- **Color**: Green
- **Icon**: Check Circle
- **Use Case**: Payment confirmed, order can proceed

### Failed
- **Description**: Payment could not be processed
- **Color**: Red
- **Icon**: X Circle
- **Use Case**: Payment declined or error occurred

### Refunded
- **Description**: Payment has been refunded
- **Color**: Gray
- **Icon**: Refresh
- **Use Case**: Order cancelled and payment returned

## Integration Examples

### 1. Order History Page

```tsx
import { OrderCardWithPayment } from '@/components/order-card-with-payment';

function OrderHistory({ orders }) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCardWithPayment
          key={order.id}
          orderId={order.id}
          orderNumber={order.orderNumber}
          status={order.status}
          title={order.restaurant.name}
          address={order.restaurant.address}
          date={formatDate(order.createdAt)}
          time={formatTime(order.createdAt)}
          orderItems={`Order #${order.orderNumber}`}
          price={order.totalAmount}
          paymentStatus={order.paymentStatus}
          paymentMethod={order.paymentMethod}
          paymentReference={order.paymentReference}
          onViewDetails={() => viewOrderDetails(order.id)}
        />
      ))}
    </div>
  );
}
```

### 2. Order Details Modal

```tsx
import { OrderDetailsView } from '@/components/order-details-view';

function OrderDetailsModal({ order, onClose }) {
  return (
    <OrderDetailsView
      orderNumber={order.orderNumber}
      status={order.status}
      customerName={order.customer.name}
      customerEmail={order.customer.email}
      deliveryAddress={order.deliveryAddress}
      deliveryCity={order.deliveryCity}
      deliveryPostalCode={order.deliveryPostalCode}
      items={order.items}
      subtotal={order.subtotal}
      deliveryFee={order.deliveryFee}
      totalAmount={order.totalAmount}
      paymentStatus={order.paymentStatus}
      paymentMethod={order.paymentMethod}
      paymentReference={order.paymentReference}
      onClose={onClose}
    />
  );
}
```

### 3. Admin Dashboard

```tsx
import { OrderTableWithPayment } from '@/components/superAdmin/orders/components/OrderTableWithPayment';

function AdminOrdersView({ orders }) {
  return (
    <OrderTableWithPayment
      orders={orders.map(order => ({
        orderNr: order.orderNumber,
        total: `Fr. ${order.totalAmount.toFixed(2)}`,
        address: order.deliveryAddress,
        schedule: formatDateTime(order.scheduledDeliveryTime),
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
      }))}
      onOrderClick={(orderNr) => viewOrderDetails(orderNr)}
    />
  );
}
```

## Testing

### Manual Testing

1. **View Order History**
   - Navigate to user dashboard
   - Check that payment status badges appear correctly
   - Verify colors match the status

2. **View Order Details**
   - Click on an order to view details
   - Verify payment information section displays
   - Check payment method and reference are shown

3. **Admin Dashboard**
   - Navigate to admin orders page
   - Verify payment status column appears
   - Check that status badges are visible in table

### Test Data

Use the following test payment references for different statuses:

```typescript
const testOrders = [
  {
    paymentStatus: 'completed',
    paymentMethod: 'stripe',
    paymentReference: 'pi_3QRxyz123456789',
  },
  {
    paymentStatus: 'pending',
    paymentMethod: 'stripe',
    paymentReference: 'pi_3QRabc987654321',
  },
  {
    paymentStatus: 'failed',
    paymentMethod: 'stripe',
    paymentReference: 'pi_3QRdef456789012',
  },
  {
    paymentStatus: 'refunded',
    paymentMethod: 'stripe',
    paymentReference: 'pi_3QRstu789012345',
  },
];
```

## Accessibility

All payment status components include:
- Semantic HTML elements
- Proper ARIA labels
- Color contrast ratios meeting WCAG AA standards
- Icon + text combinations (not relying on color alone)

## Browser Support

Components are tested and supported on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

1. **Real-time Updates**: Add WebSocket support for live payment status updates
2. **Payment History**: Add detailed payment history timeline
3. **Export Functionality**: Allow exporting payment reports
4. **Filters**: Add payment status filters in order lists
5. **Notifications**: Add push notifications for payment status changes
