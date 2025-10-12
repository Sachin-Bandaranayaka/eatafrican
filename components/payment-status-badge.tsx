'use client';

import { CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
  showIcon?: boolean;
}

const statusConfig = {
  pending: {
    label: 'Payment Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: Clock,
  },
  completed: {
    label: 'Payment Completed',
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: CheckCircle,
  },
  failed: {
    label: 'Payment Failed',
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: XCircle,
  },
  refunded: {
    label: 'Refunded',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: RefreshCw,
  },
};

export function PaymentStatusBadge({ 
  status, 
  className = '', 
  showIcon = true 
}: PaymentStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color} ${className}`}
    >
      {showIcon && <Icon size={14} />}
      {config.label}
    </span>
  );
}
