// src/app/super-admin/restaurant/components/management/ActivityLogView.tsx
"use client";

import React from 'react';
import { Restaurant } from '../data';

interface ActivityLogViewProps {
    restaurant: Restaurant;
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ restaurant }) => {
    const logData = restaurant.activityLog || [];
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead><tr className="bg-[#FFE59E]"><th className="p-3 font-bold text-black uppercase w-1/2 text-[7px] md:text-[15px]">Date, Time</th><th className="p-3 font-bold text-black uppercase w-1/2 text-[7px] md:text-[15px]">Activity</th></tr></thead>
                <tbody>
                    {logData.map((log, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-2 text-black font-semibold text-[7px] md:text-[12px]">{log.dateTime}</td>
                            <td className="p-2 text-black font-semibold text-[7px] md:text-[12px]">{log.activity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};