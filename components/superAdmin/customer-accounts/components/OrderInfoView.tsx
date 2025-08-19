// src/app/super-admin/customer-accounts/components/OrderInfoView.tsx
"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Customer, Order } from './data';

interface OrderInfoViewProps {
    customer: Customer;
    order: Order;
    onBackToOrders: () => void;
    onBackToOverview: () => void;
}

const InfoRow = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
    <div className="flex justify-between py-1">
        <p className="font-bold text-black text-[9px] md:text-[15px]">{label}</p>
        <p className="text-black font-semibold text-[7px] md:text-[12px]">{value}</p>
    </div>
);

export const OrderInfoView: React.FC<OrderInfoViewProps> = ({ customer, order, onBackToOrders, onBackToOverview }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="relative bg-white/80 border-2 border-amber-400 rounded-lg p-2 md:p-4 min-h-[550px]">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h2 className="font-bold text-black text-[9px] md:text-[15px]">{customer.name}</h2>
                    <p className="text-gray-600 text-[7px] md:text-[12px]">{customer.address.city}</p>
                </div>
                <h3 className="font-bold text-black text-[9px] md:text-[15px]">
                    Order Nr, {order.orderNr}, {order.restaurantName}
                </h3>
                
                <div className="relative">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                        className="flex items-center justify-between w-48 bg-red-800 text-white font-bold py-1 px-4 rounded-lg text-[7px] md:text-[12px]"
                    >
                        <span>BACK TO ORDERS</span>
                        <ChevronDown size={16} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-1 w-full bg-white rounded-lg shadow-lg z-10 border">
                            <button 
                                onClick={() => { onBackToOrders(); setIsDropdownOpen(false); }} 
                                className="block w-full text-left px-3 py-2 text-black font-bold hover:bg-gray-100 text-[7px] md:text-[12px]"
                            >
                                BACK TO ORDERS
                            </button>
                            <button 
                                onClick={() => { onBackToOverview(); setIsDropdownOpen(false); }} 
                                className="block w-full text-left px-3 py-2 text-black font-bold hover:bg-gray-100 text-[7px] md:text-[12px]"
                            >
                                OVERVIEW
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-md mx-auto">
                <InfoRow
                    label="Meals"
                    value={
                        <div className="text-right">
                            {(order.meals || []).map((meal, i) => <div key={i}>{meal}</div>)}
                        </div>
                    }
                />
                 <InfoRow label="Total Spent" value={order.totalSpent} />
                 <InfoRow label="Delivery Date" value={order.deliveryDate} />
                 <InfoRow label="Delivery Status" value={order.deliveryStatus} />
            </div>
        </div>
    );
};
