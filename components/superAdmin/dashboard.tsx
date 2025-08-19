"use client";

import React, { useState } from 'react';

// A reusable card component for displaying information blocks
const InfoCard = ({ title, data, children }: { title: string, data?: { label: string, value: string | number }[], children?: React.ReactNode }) => (
    <div className="bg-white/80 border-2 border-amber-400 rounded-lg p-2 md:p-4 flex flex-col">
        <h3 className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold text-gray-800">{title}</h3>
        <div className="mt-2 flex-1">
            {data && data.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] text-black">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                </div>
            ))}
            {children}
        </div>
        <div className="mt-2 md:mt-4">
            <button className="bg-red-900 text-white text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] font-bold py-1 px-3 rounded-lg hover:bg-red-900 transition-colors">
                SEE MORE
            </button>
        </div>
    </div>
);

// Component for the Activity Log view
const ActivityLog = () => {
    const logData = [
        "Your account logged in on [Date, time]",
        "Your account logged in on [Date, time]",
        "A new Location 'Bern' was created by your Account on [Date, time]",
        "A new menu was created by your Account on [Date, time]",
        "A new Country Specialty 'Kenya' Main Dishes was created by your Account on [Date, time]",
        "A new Menu Category 'Main Dishes' was created by your Account on [Date,time]",
    ];

    return (
        <div className="bg-white/80 border-2 border-amber-400 rounded-lg p-3 md:p-6 w-full md:w-1/2">
            <ul className="space-y-1 md:space-y-3">
                {logData.map((log, index) => (
                    <li key={index} className="text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] text-gray-800 font-medium">{log}</li>
                ))}
            </ul>
            <div className='mb-32'></div>
        </div>
    );
};

// --- FIX ---
// Changed "export default function SuperAdminDashboard()" to a named export
// to match the import statement in `app/page.tsx`.
export const SuperAdminDashboard = () => {
    // State to manage which tab is currently active
    const [activeTab, setActiveTab] = useState('OVERVIEW');

    // Data for the info cards, mirroring the provided image
    const ordersToday = [
        { label: 'Completed', value: 0 },
        { label: 'Processing', value: 0 },
        { label: 'In Transit', value: 0 },
        { label: 'Cancelled', value: 0 },
    ];

    const earnings = [
        { label: 'Today', value: 0 },
        { label: 'This month', value: 0 },
    ];

    const activeDrivers = [
        { label: 'Basel', value: 0 },
        { label: 'Bern', value: 0 },
        { label: 'Luzern', value: 0 },
        { label: 'Olten', value: 0 },
        { label: 'Zürich', value: 0 },
    ];

    const activeRestaurants = activeDrivers; // Same data structure

    return (
        <div className="flex flex-col items-center w-full md:p-6 bg-transparent">
            {/* Header Buttons */}
            <div className="flex items-center gap-7 mb-6">
                <button
                    onClick={() => setActiveTab('OVERVIEW')}
                    className={`font-bold py-1 px-5 rounded-lg transition-colors ${activeTab === 'OVERVIEW' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'} text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]`}
                >
                    OVERVIEW
                </button>
                <button
                    onClick={() => setActiveTab('ACTIVITY LOG')}
                    className={`font-bold py-1 px-5 rounded-lg transition-colors ${activeTab === 'ACTIVITY LOG' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'} text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]`}
                >
                    ACTIVITY LOG
                </button>
            </div>

            {/* Conditional rendering based on the active tab */}
            {activeTab === 'OVERVIEW' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {/* Column 1 */}
                    <div className="space-y-3 md:space-y-6">
                        <InfoCard title="Total Orders Today" data={ordersToday} />
                        <InfoCard title="Active Restaurants" data={activeRestaurants} />
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-3 md:space-y-6">
                        <InfoCard title="Earnings" data={earnings} />
                        <InfoCard title="Inactive Restaurants">
                            <p className="text-gray-600 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">-</p>
                        </InfoCard>
                        <InfoCard title="Unapproved Restaurants">
                            <p className="text-gray-600 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">-</p>
                        </InfoCard>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-3 md:space-y-6">
                        <InfoCard title="Active Drivers" data={activeDrivers} />
                        <InfoCard title="Unapproved Drivers">
                            <p className="text-gray-600 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">-</p>
                        </InfoCard>
                        <InfoCard title="Registered Customer Accounts">
                            <div className="flex justify-between items-center text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] text-gray-600">
                                <span>Total</span>
                                <span>0</span>
                            </div>
                        </InfoCard>
                    </div>
                </div>
            ) : (
                <ActivityLog />
            )}
        </div>
    );
};
