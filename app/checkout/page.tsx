'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { StripePaymentForm } from '@/components/stripe-payment-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart, getRestaurantId, deliveryInfo, clearDeliveryInfo } = useCart();
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderCreationError, setOrderCreationError] = useState<string | null>(null);

  // Calculate delivery fee based on postal code
  const calculateDeliveryFee = (postalCode: string): number => {
    const code = parseInt(postalCode);
    if (isNaN(code)) return 6.0;
    
    // Swiss postal code based delivery fee calculation
    if (code >= 4000 && code <= 4999) return 6.0;  // Basel area
    if (code >= 8000 && code <= 8999) return 8.0;  // Zurich area
    if (code >= 3000 && code <= 3999) return 7.0;  // Bern area
    if (code >= 1200 && code <= 1299) return 9.0;  // Geneva area
    return 10.0; // Other areas
  };

  // Calculate order totals
  const subtotal = getTotalPrice();
  const deliveryFee = deliveryInfo ? calculateDeliveryFee(deliveryInfo.postalCode) : 6.0;
  const taxRate = 0.081; // 8.1% VAT in Switzerland
  const taxAmount = (subtotal + deliveryFee) * taxRate;
  const total = subtotal + deliveryFee + taxAmount;

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      router.push('/restaurants');
      return;
    }

    // Redirect if delivery info is missing
    if (!deliveryInfo) {
      router.push('/restaurants');
      return;
    }

    // Initialize checkout
    initializeCheckout();
  }, []);

  const initializeCheckout = async () => {
    try {
      setLoading(true);
      setError(null);
      setOrderCreationError(null);

      const restaurantId = getRestaurantId();
      if (!restaurantId) {
        throw new Error('No restaurant selected');
      }

      // Step 1: Create payment intent first (before order)
      const paymentResponse = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'chf',
          customerEmail: 'customer@example.com',
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error?.message || 'Failed to create payment intent');
      }

      const paymentData = await paymentResponse.json();
      setClientSecret(paymentData.clientSecret);
      setPaymentIntentId(paymentData.paymentIntentId);

      // Step 2: Create the order with payment intent ID and delivery info from context
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          items: items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
          })),
          deliveryAddress: deliveryInfo!.street,
          deliveryCity: deliveryInfo!.city,
          deliveryPostalCode: deliveryInfo!.postalCode,
          customerEmail: 'customer@example.com',
          customerPhone: '+41 00 000 00 00',
          customerFirstName: 'Guest',
          customerLastName: 'Customer',
          scheduledDeliveryTime: new Date(deliveryInfo!.deliveryTime).toISOString(),
          voucherCode: deliveryInfo!.voucherCode,
          paymentIntentId: paymentData.paymentIntentId, // Link order to payment intent
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error?.message || 'Failed to create order');
      }

      const orderData = await orderResponse.json();
      setOrderId(orderData.order.id);

      // Step 3: Update payment intent metadata with order ID
      // This is handled by the webhook, but we could also update it here if needed
    } catch (err: any) {
      console.error('Checkout initialization error:', err);
      setError(err.message || 'Failed to initialize checkout');
      setOrderCreationError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Clear the cart and delivery info
    clearCart();
    clearDeliveryInfo();
    
    // Redirect to success page with order ID
    router.push(`/checkout/success?orderId=${orderId}`);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    
    // Scroll to top to show error
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-800 text-lg font-semibold">Preparing your checkout...</p>
        </div>
      </div>
    );
  }

  // Error state - order creation failed
  if (orderCreationError) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="text-base">
              {orderCreationError}
            </AlertDescription>
          </Alert>
          
          <div className="text-center">
            <Button
              onClick={() => router.push('/restaurants')}
              variant="outline"
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Restaurants
            </Button>
            <Button
              onClick={initializeCheckout}
              className="bg-green-600 hover:bg-green-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border-2 border-amber-200">
          <Link 
            href="/restaurants" 
            className="inline-flex items-center text-amber-800 hover:text-amber-900 mb-4 font-semibold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Restaurants
          </Link>
          <h1 className="text-3xl font-bold text-amber-900">Checkout</h1>
          <p className="text-gray-700 mt-2">Complete your order and payment</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-50/95 backdrop-blur-sm border-2 border-red-300">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary - Left Side */}
          <div className="lg:col-span-1">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-amber-200">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-amber-200">
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <ShoppingCart className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 border-b pb-4">
                  {items.map((item) => (
                    <div key={item.menuItemId} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">
                        Fr. {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Fr. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>Fr. {deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8.1%)</span>
                    <span>Fr. {taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-900">
                    <span>Total</span>
                    <span>Fr. {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Restaurant Info */}
                {items.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Restaurant:</span>{' '}
                      {items[0].restaurantName}
                    </p>
                  </div>
                )}

                {/* Delivery Info */}
                {deliveryInfo && (
                  <div className="border-t pt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-900">Delivery Details</p>
                    <p className="text-sm text-gray-600">
                      {deliveryInfo.street}
                    </p>
                    <p className="text-sm text-gray-600">
                      {deliveryInfo.postalCode} {deliveryInfo.city}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Delivery Time:</span>{' '}
                      {new Date(deliveryInfo.deliveryTime).toLocaleString()}
                    </p>
                    {deliveryInfo.voucherCode && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Voucher:</span>{' '}
                        {deliveryInfo.voucherCode}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Form - Right Side */}
          <div className="lg:col-span-2">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-amber-200">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-amber-200">
                <CardTitle className="text-amber-900">Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                {clientSecret ? (
                  <StripePaymentForm
                    clientSecret={clientSecret}
                    amount={total}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    orderId={orderId || undefined}
                    paymentIntentId={paymentIntentId || undefined}
                  />
                ) : (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
