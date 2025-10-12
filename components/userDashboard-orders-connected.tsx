'use client';

import { useState, useEffect } from 'react';
import { OrderCardWithPayment } from './order-card-with-payment';
import { OrderDetailsView } from './order-details-view';
import { PaymentStatus } from './payment-status-badge';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  restaurant: {
    id: string;
    name: string;
    address: string;
  };
  totalAmount: number;
  scheduledDeliveryTime?: string;
  actualDeliveryTime?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
  paymentReference?: string | null;
  createdAt: string;
}

interface OrderDetails extends Order {
  customer: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  subtotal: number;
  deliveryFee: number;
  discountAmount?: number;
  taxAmount?: number;
}

interface UserDashboardOrdersConnectedProps {
  customerId: string;
}

export function UserDashboardOrdersConnected({ customerId }: UserDashboardOrdersConnectedProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [customerId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/customers/${customerId}/orders`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setSelectedOrder(data);
      setShowDetails(true);
    } catch (err: any) {
      console.error('Error fetching order details:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-white">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (showDetails && selectedOrder) {
    return (
      <OrderDetailsView
        orderNumber={selectedOrder.orderNumber}
        status={selectedOrder.status}
        customerName={`${selectedOrder.customer.firstName || ''} ${selectedOrder.customer.lastName || ''}`.trim() || 'Guest'}
        customerEmail={selectedOrder.customer.email}
        customerPhone={selectedOrder.customer.phone}
        deliveryAddress={selectedOrder.deliveryAddress}
        deliveryCity={selectedOrder.deliveryCity}
        deliveryPostalCode={selectedOrder.deliveryPostalCode}
        scheduledDeliveryTime={selectedOrder.scheduledDeliveryTime}
        actualDeliveryTime={selectedOrder.actualDeliveryTime}
        items={selectedOrder.items}
        subtotal={selectedOrder.subtotal}
        deliveryFee={selectedOrder.deliveryFee}
        discountAmount={selectedOrder.discountAmount}
        taxAmount={selectedOrder.taxAmount}
        totalAmount={selectedOrder.totalAmount}
        paymentStatus={selectedOrder.paymentStatus}
        paymentMethod={selectedOrder.paymentMethod}
        paymentReference={selectedOrder.paymentReference}
        onClose={() => setShowDetails(false)}
      />
    );
  }

  return (
    <section className="flex flex-col w-[102%] space-y-3 z-10">
      {orders.length === 0 ? (
        <div className="text-center text-white p-8">
          <p>No orders found</p>
        </div>
      ) : (
        orders.map((order) => (
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
            onViewDetails={() => fetchOrderDetails(order.id)}
            showPaymentDetails={false}
          />
        ))
      )}
    </section>
  );
}
