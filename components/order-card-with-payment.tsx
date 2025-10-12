'use client';

import { PaymentStatusBadge, PaymentStatus } from './payment-status-badge';
import { PaymentInfoDisplay } from './payment-info-display';

interface OrderCardWithPaymentProps {
  orderId: string;
  orderNumber: string;
  status: string;
  title: string;
  address: string;
  date: string;
  time: string;
  orderItems: string;
  price: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
  paymentReference?: string | null;
  onViewDetails?: () => void;
  onViewMore?: () => void;
  showPaymentDetails?: boolean;
}

export function OrderCardWithPayment({
  orderId,
  orderNumber,
  status,
  title,
  address,
  date,
  time,
  orderItems,
  price,
  paymentStatus,
  paymentMethod,
  paymentReference,
  onViewDetails,
  onViewMore,
  showPaymentDetails = false,
}: OrderCardWithPaymentProps) {
  return (
    <div
      className="flex flex-col shadow-md overflow-hidden border-2 border-[#f1c232] relative -mt-2"
      style={{
        backgroundImage: 'url("/images/Box_Restaurant_BckgImg01.png")',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        borderRadius: '10px',
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: '#783f04ff',
          opacity: '70%',
          zIndex: 1,
          borderRadius: '8px',
        }}
      ></div>

      <div className="relative z-10 w-auto">
        <div className="flex flex-row w-auto">
          {/* Details */}
          <div className="m-[1%] p-2 w-3/4 h-auto flex flex-col justify-between text-gray-500 text-[10px] xs:text-sm rounded-[10px] xs:mr-4">
            <div className="flex flex-row mb-2 items-baseline gap-4">
              <h3 className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold text-white">
                {orderNumber}
              </h3>
              <h3 className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] text-white">
                {status}
              </h3>
            </div>

            {/* Payment Status Badge */}
            <div className="mb-2">
              <PaymentStatusBadge status={paymentStatus} />
            </div>

            <p className="text-[10px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] font-base text-white">
              {title}
            </p>
            <p className="text-[10px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] text-white">
              {address}
            </p>
            <p className="text-[10px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] text-white">
              {date}, {time}
            </p>
            <p className="text-[10px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] text-white">
              {orderItems}
            </p>

            {/* Payment Details (if expanded) */}
            {showPaymentDetails && (
              <div className="mt-3 bg-white/10 p-2 rounded">
                <p className="text-[9px] md:text-[11px] text-white/90 mb-1">
                  <span className="font-semibold">Payment Method:</span>{' '}
                  {paymentMethod || 'Not specified'}
                </p>
                {paymentReference && (
                  <p className="text-[9px] md:text-[11px] text-white/90 font-mono break-all">
                    <span className="font-semibold">Reference:</span> {paymentReference}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Price & View More Buttons */}
          <div className="p-[1%] flex flex-col justify-between items-end w-1/4">
            <div className="flex items-end mb-1">
              <span className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] xs:text-sm sm:text-lg font-bold text-white">
                Fr. {price.toFixed(2)}.-
              </span>
            </div>

            {/* Button Section */}
            <div className="flex flex-col items-end justify-end md:mt-[1%] space-y-2">
              {onViewDetails && (
                <button
                  onClick={onViewDetails}
                  className="relative p-0 font-bold text-red-900 hover:text-white transition rounded-lg text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]"
                >
                  View Details -&gt;
                </button>
              )}
              {onViewMore && (
                <button
                  onClick={onViewMore}
                  className="relative p-0 font-bold text-amber-400 hover:text-white transition rounded-lg text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]"
                >
                  View More -&gt;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
