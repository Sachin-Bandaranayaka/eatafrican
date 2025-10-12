'use client';

import React from 'react';
import { PaymentStatusBadge, PaymentStatus } from '@/components/payment-status-badge';

interface Order {
  orderNr: string;
  total: string;
  address: string;
  schedule: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
}

interface OrderTableWithPaymentProps {
  orders: Order[];
  onOrderClick?: (orderNr: string) => void;
}

export const OrderTableWithPayment: React.FC<OrderTableWithPaymentProps> = ({ 
  orders, 
  onOrderClick 
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-[#FFE59E]">
            <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">
              ORDER NR
            </th>
            <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">
              TOTAL
            </th>
            <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">
              PAYMENT STATUS
            </th>
            <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">
              DELIVERY ADDRESS
            </th>
            <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">
              DELIVERY SCHEDULE
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr 
              key={index}
              onClick={() => onOrderClick?.(order.orderNr)}
              className={onOrderClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            >
              <td className="p-2 text-black font-semibold text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">
                {order.orderNr}
              </td>
              <td className="p-2 text-black font-semibold text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">
                {order.total}
              </td>
              <td className="p-2">
                <PaymentStatusBadge 
                  status={order.paymentStatus} 
                  showIcon={false}
                  className="text-[7px] md:text-[10px] px-2 py-0.5"
                />
              </td>
              <td className="p-2 text-black font-semibold text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">
                {order.address}
              </td>
              <td className="p-2 text-black font-semibold text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">
                {order.schedule}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
