// src/app/super-admin/customer-accounts/components/AllCustomersView.tsx
"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Customer } from './data';

interface AllCustomersViewProps {
    customers: { region: string; customers: Customer[] }[];
    onSelectCustomer: (customer: Customer) => void;
}

export const AllCustomersView: React.FC<AllCustomersViewProps> = ({ customers, onSelectCustomer }) => (
    <div className="relative bg-white/80 border-2 border-amber-400 rounded-lg p-2 md:p-4 min-h-[550px]">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2">
            <h2 className="font-bold text-black text-[9px] md:text-[15px]">Customer Accounts</h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-[#FFE59E]">
                        <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">
                            <div className="flex items-center gap-2">ALL REGIONS <ChevronDown size={16} /></div>
                        </th>
                        <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">TOTAL ORDERS</th>
                        <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">TOTAL SPENT</th>
                        <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">LAST LOGIN</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((group) => (
                        <React.Fragment key={group.region}>
                            <tr>
                                <td className="pl-4 pt-2 font-bold text-black text-[9px] md:text-[15px]">{group.region}</td>
                                <td colSpan={3}></td>
                            </tr>
                            {group.customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-100/50">
                                    <td
                                        className="py-1 pl-8 md:pl-12 text-black font-semibold text-[7px] md:text-[12px] cursor-pointer"
                                        onClick={() => onSelectCustomer(customer)}
                                    >
                                        {customer.name}
                                    </td>
                                    <td className="py-1 text-black font-semibold text-[7px] md:text-[12px]">{customer.totalOrders}</td>
                                    <td className="py-1 text-black font-semibold text-[7px] md:text-[12px]">{customer.totalSpent}</td>
                                    <td className="py-1 text-black font-semibold text-[7px] md:text-[12px]">{customer.lastLogin}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
