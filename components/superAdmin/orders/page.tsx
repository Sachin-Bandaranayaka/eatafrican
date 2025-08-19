// src/app/super-admin/orders/page.tsx
"use client";

import React, { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import { orderStatuses } from './components/data';
import { CalendarPopup } from './components/Calendar';
import { NewOrdersView } from './components/NewOrdersView';
import { ProcessingOrdersView } from './components/ProcessingOrdersView';
import { PlaceholderView } from './components/PlaceholderView';

export const SuperAdminOrders = () => {
    const [orderStatus, setOrderStatus] = useState('NEW ORDERS');
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedDateRange, setSelectedDateRange] = useState({ start: '1.10.2025', end: '5.10.2025' });

    const currentStatus = orderStatuses.find(s => s.name === orderStatus);

    const handleApplyDate = (range) => {
        if (range.start) {
            setSelectedDateRange(range);
        }
        setIsCalendarOpen(false);
    };

    const renderContent = () => {
        switch (orderStatus) {
            case 'NEW ORDERS':
                return <NewOrdersView />;
            case 'PROCESSING':
                return <ProcessingOrdersView />;
            case 'IN TRANSIT':
                return <PlaceholderView status="IN TRANSIT" />;
            case 'DELIVERED':
                return <PlaceholderView status="DELIVERED" />;
            case 'CANCELLED':
                return <PlaceholderView status="CANCELLED" />;
            default:
                return <NewOrdersView />;
        }
    };

    return (
        <div className="w-full md:w-4/6 max-w-6xl mx-auto md:px-6 bg-transparent">
            <div className="flex justify-between items-center mb-4">
                <div className="relative">
                    <button onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)} className={`flex items-center gap-2 bg-blue-500 text-white font-bold py-2 px-3 transition-all duration-200 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] ${isStatusDropdownOpen ? 'rounded-t-lg' : 'rounded-lg'}`}>
                        <span>{currentStatus?.name}</span>
                        <span className="bg-white text-blue-500 font-bold rounded-full px-2 py-0.5 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{currentStatus?.count}</span>
                        <ChevronDown size={16} />
                    </button>
                    {isStatusDropdownOpen && (
                        <div className="absolute top-full left-0 w-full bg-blue-500 text-white rounded-b-lg shadow-lg z-10">
                            {orderStatuses.filter(status => status.name !== orderStatus).map(status => (
                                <button key={status.name} onClick={() => { setOrderStatus(status.name); setIsStatusDropdownOpen(false); }} className="flex justify-between items-center w-full text-left px-3 py-2 font-bold hover:bg-blue-600 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">
                                    <span>{status.name}</span>
                                    <span className="bg-white text-blue-500 font-bold rounded-full px-2 py-0.5 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{status.count}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="flex items-center gap-2 bg-[#FFF2CE] text-black border-2 border-amber-400 font-bold py-1 px-3">
                        <div>
                            <span className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">THIS WEEK</span>
                            <p className="text-gray-500 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{selectedDateRange.start} - {selectedDateRange.end}</p>
                        </div>
                        <ChevronDown size={16} />
                    </button>
                    {isCalendarOpen && (
                        <CalendarPopup
                            onApply={handleApplyDate}
                            onCancel={() => setIsCalendarOpen(false)}
                        />
                    )}
                </div>
            </div>
            {renderContent()}
        </div>
    );
};

// If this is a page in the Next.js App Router, it should have a default export.
// And if the app expects a named export, we provide that as well.
const SuperAdminOrdersPage = SuperAdminOrders;
export default SuperAdminOrdersPage;
