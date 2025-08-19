// src/app/super-admin/customer-accounts/components/CustomerOrdersView.tsx
"use client";

import React from 'react';
import { Customer, Order } from './data';

interface CustomerOrdersViewProps {
    customer: Customer;
    onSelectOrder: (order: Order) => void;
}

export const CustomerOrdersView: React.FC<CustomerOrdersViewProps> = ({ customer, onSelectOrder }) => {
    const orders = customer.orders || [];

    return (
        <div className="overflow-x-auto">
             <p className="text-gray-600 text-[7px] md:text-[12px] mb-4">Click on order for more details</p>
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-[#FFE59E]">
                        <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">ORDER DETAILS</th>
                        <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">TOTAL SPENT</th>
                        <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">DELIVERY DATE</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? orders.map((order, index) => (
                        <tr key={index} className="hover:bg-gray-100/50 cursor-pointer" onClick={() => onSelectOrder(order)}>
                            <td className="p-2 text-black font-semibold text-[7px] md:text-[12px]">
                                Order Nr, {order.orderNr}, {order.restaurantName}
                            </td>
                            <td className="p-2 text-black font-semibold text-[7px] md:text-[12px]">{order.totalSpent}</td>
                            <td className="p-2 text-black font-semibold text-[7px] md:text-[12px]">{order.deliveryDate}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={3} className="p-4 text-center text-gray-500">No orders found for this customer.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
