'use client';

import { CreditCard, FileText } from 'lucide-react';
import { PaymentStatusBadge, PaymentStatus } from './payment-status-badge';

interface PaymentInfoDisplayProps {
  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
  paymentReference?: string | null;
  showDetails?: boolean;
  className?: string;
}

const paymentMethodLabels: Record<string, string> = {
  stripe: 'Credit/Debit Card (Stripe)',
  card: 'Credit/Debit Card',
  cash: 'Cash on Delivery',
  paypal: 'PayPal',
};

export function PaymentInfoDisplay({
  paymentStatus,
  paymentMethod,
  paymentReference,
  showDetails = true,
  className = '',
}: PaymentInfoDisplayProps) {
  const methodLabel = paymentMethod 
    ? paymentMethodLabels[paymentMethod.toLowerCase()] || paymentMethod
    : 'Not specified';

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Payment Status Badge */}
      <div>
        <PaymentStatusBadge status={paymentStatus} />
      </div>

      {/* Payment Details */}
      {showDetails && (
        <div className="space-y-2 text-sm">
          {/* Payment Method */}
          {paymentMethod && (
            <div className="flex items-start gap-2">
              <CreditCard size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-gray-600 font-medium">Payment Method:</span>
                <span className="ml-2 text-gray-900">{methodLabel}</span>
              </div>
            </div>
          )}

          {/* Payment Reference */}
          {paymentReference && (
            <div className="flex items-start gap-2">
              <FileText size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="break-all">
                <span className="text-gray-600 font-medium">Payment Reference:</span>
                <span className="ml-2 text-gray-900 font-mono text-xs">
                  {paymentReference}
                </span>
              </div>
            </div>
          )}

          {/* Status Description */}
          {paymentStatus === 'pending' && (
            <div className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded border border-yellow-200">
              Payment is being processed. This may take a few moments.
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-xs text-red-700 bg-red-50 p-2 rounded border border-red-200">
              Payment could not be processed. Please contact support if you believe this is an error.
            </div>
          )}

          {paymentStatus === 'refunded' && (
            <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border border-gray-200">
              This payment has been refunded. The amount will be returned to your original payment method.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
