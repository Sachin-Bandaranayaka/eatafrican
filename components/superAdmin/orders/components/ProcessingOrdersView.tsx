// src/app/super-admin/orders/components/ProcessingOrdersView.tsx
"use client";

import React from 'react';
import { processingOrdersData } from './data';
import { OrderTableWithPayment } from './OrderTableWithPayment';

export const ProcessingOrdersView = () => {
    // Add payment status to existing data
    const ordersWithPayment = processingOrdersData.map(order => ({
        ...order,
        paymentStatus: 'completed' as const, // Default to completed for processing orders
        paymentMethod: 'stripe',
    }));

    return (
        <div className="relative bg-white/80 border-2 border-amber-400 rounded-lg p-2 md:p-4 min-h-[550px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800 text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">African Restaurant 1, Basel</h2>
                <div className="flex gap-1 md:gap-2">
                    <button className="bg-red-900 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-800 transition-colors text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">OVERVIEW</button>
                    <button className="bg-red-900 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-800 transition-colors text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">SELECT RESTAURANT</button>
                </div>
            </div>
            <OrderTableWithPayment orders={ordersWithPayment} />
        </div>
    )
}
