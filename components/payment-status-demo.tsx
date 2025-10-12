'use client';

import { PaymentStatusBadge, PaymentStatus } from './payment-status-badge';
import { PaymentInfoDisplay } from './payment-info-display';

/**
 * Demo component showcasing payment status tracking components
 * This demonstrates all payment status states and how they appear in the UI
 */
export function PaymentStatusDemo() {
  const paymentStatuses: PaymentStatus[] = ['pending', 'completed', 'failed', 'refunded'];

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Payment Status Tracking Components</h1>
        <p className="text-gray-600">
          Demonstration of payment status badges and information displays
        </p>
      </div>

      {/* Payment Status Badges */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Payment Status Badges</h2>
        <div className="space-y-4">
          {paymentStatuses.map((status) => (
            <div key={status} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-gray-700 capitalize">
                {status}:
              </div>
              <PaymentStatusBadge status={status} />
            </div>
          ))}
        </div>
      </section>

      {/* Payment Info Display - Completed */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Payment Info Display - Completed</h2>
        <PaymentInfoDisplay
          paymentStatus="completed"
          paymentMethod="stripe"
          paymentReference="pi_3QRxyz123456789ABCDEF"
          showDetails={true}
        />
      </section>

      {/* Payment Info Display - Pending */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Payment Info Display - Pending</h2>
        <PaymentInfoDisplay
          paymentStatus="pending"
          paymentMethod="stripe"
          paymentReference="pi_3QRabc987654321GHIJKL"
          showDetails={true}
        />
      </section>

      {/* Payment Info Display - Failed */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Payment Info Display - Failed</h2>
        <PaymentInfoDisplay
          paymentStatus="failed"
          paymentMethod="stripe"
          paymentReference="pi_3QRdef456789012MNOPQR"
          showDetails={true}
        />
      </section>

      {/* Payment Info Display - Refunded */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Payment Info Display - Refunded</h2>
        <PaymentInfoDisplay
          paymentStatus="refunded"
          paymentMethod="stripe"
          paymentReference="pi_3QRstu789012345STUVWX"
          showDetails={true}
        />
      </section>

      {/* Compact View (without details) */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Compact View (Badge Only)</h2>
        <div className="space-y-3">
          {paymentStatuses.map((status) => (
            <PaymentInfoDisplay
              key={status}
              paymentStatus={status}
              paymentMethod="stripe"
              showDetails={false}
            />
          ))}
        </div>
      </section>

      {/* Usage Examples */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Usage Examples</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">1. Order History List</h3>
            <p className="text-gray-600">
              Use <code className="bg-gray-200 px-1 rounded">PaymentStatusBadge</code> to show
              payment status in order cards or lists.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2. Order Details Page</h3>
            <p className="text-gray-600">
              Use <code className="bg-gray-200 px-1 rounded">PaymentInfoDisplay</code> with{' '}
              <code className="bg-gray-200 px-1 rounded">showDetails=true</code> to display
              complete payment information including method and reference.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">3. Admin Dashboard</h3>
            <p className="text-gray-600">
              Use <code className="bg-gray-200 px-1 rounded">OrderTableWithPayment</code> to
              display orders with payment status in a table format.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
