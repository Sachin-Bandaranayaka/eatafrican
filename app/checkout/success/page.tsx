'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import Image from 'next/image';

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  restaurantName?: string;
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Clear the cart immediately on success page load
    clearCart();

    if (!orderId) {
      setError('No order ID provided');
      setLoading(false);
      return;
    }

    // Fetch order details
    fetchOrderDetails(orderId);
  }, [orderId, clearCart]);

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setOrderDetails({
        id: data.order.id,
        orderNumber: data.order.order_number || data.order.id.slice(0, 8).toUpperCase(),
        status: data.order.status,
        paymentStatus: data.order.payment_status,
        totalAmount: data.order.total_amount,
        createdAt: data.order.created_at,
        restaurantName: data.order.restaurant?.name,
      });
    } catch (err: any) {
      console.error('Error fetching order details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Order</h1>
          <p className="text-gray-600 mb-6">{error || 'Order details not found'}</p>
          <Link
            href="/"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">Thank you for your order</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Confirmation</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600 font-medium">Order Number</span>
              <span className="text-gray-900 font-bold text-lg">#{orderDetails.orderNumber}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600 font-medium">Payment Status</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                {orderDetails.paymentStatus === 'completed' ? 'Paid' : orderDetails.paymentStatus}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600 font-medium">Order Status</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 capitalize">
                {orderDetails.status}
              </span>
            </div>

            {orderDetails.restaurantName && (
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600 font-medium">Restaurant</span>
                <span className="text-gray-900 font-semibold">{orderDetails.restaurantName}</span>
              </div>
            )}

            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600 font-medium">Total Amount</span>
              <span className="text-gray-900 font-bold text-xl">Fr. {orderDetails.totalAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600 font-medium">Order Date</span>
              <span className="text-gray-900">
                {new Date(orderDetails.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">What happens next?</h3>
          <div className="space-y-3 text-gray-600">
            <p className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Your order has been successfully placed and payment confirmed</span>
            </p>
            <p className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>The restaurant will start preparing your order shortly</span>
            </p>
            <p className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>You&apos;ll receive updates on your order status</span>
            </p>
            <p className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>A driver will be assigned to deliver your order</span>
            </p>
          </div>
        </div>

        {/* Cultural Messages */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Enjoy your meal!</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 justify-center">
              <Image 
                src="/flags/ethiopia.png" 
                alt="Ethiopia" 
                width={36} 
                height={24} 
                className="rounded"
              />
              <span className="text-gray-700">ጣዕሙ ይውሰድ! (Enjoy your meal!)</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Image 
                src="/flags/nigeria.png" 
                alt="Nigeria" 
                width={36} 
                height={24} 
                className="rounded"
              />
              <span className="text-gray-700">Make you chop well-well!</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Image 
                src="/flags/ghana.png" 
                alt="Ghana" 
                width={36} 
                height={24} 
                className="rounded"
              />
              <span className="text-gray-700">Medi wo aduan!</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Image 
                src="/flags/kenya.png" 
                alt="Kenya" 
                width={36} 
                height={24} 
                className="rounded"
              />
              <span className="text-gray-700">Chakula Chema!</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/api/orders/${orderDetails.id}`}
            className="flex-1 bg-green-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            View Order Details
          </Link>
          <Link
            href="/restaurants"
            className="flex-1 bg-white text-green-600 border-2 border-green-600 text-center px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            Order Again
          </Link>
        </div>

        {/* Test Mode Indicator */}
        <div className="mt-6 text-center">
          <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-semibold">
            🧪 Test Mode - This was a test payment
          </span>
        </div>
      </div>
    </div>
  );
}
