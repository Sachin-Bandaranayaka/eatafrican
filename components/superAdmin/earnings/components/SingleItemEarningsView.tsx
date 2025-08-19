// src/app/super-admin/earnings/components/SingleItemEarningsView.tsx
"use client";

import React from 'react';
import { dailyEarningsData } from './data';

export const SingleItemEarningsView = ({ item, onBack }) => {
    return (
        <div className="relative bg-white/80 border-2 border-amber-400 rounded-lg p-2 md:p-4 min-h-[550px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800 text-[9px] md:text-[15px]">{item.item}, {item.location}</h2>
                <button onClick={onBack} className="bg-red-900 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-800 transition-colors text-[7px] md:text-[12px]">OVERVIEW</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#FFE59E]">
                            <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">TIME PERIOD</th>
                            <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dailyEarningsData.map((earning, index) => (
                            <tr key={index}>
                                <td className="p-2 text-black font-semibold text-[7px] md:text-[12px]">{earning.date}</td>
                                <td className="p-2 text-black font-semibold text-[7px] md:text-[12px]">{earning.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
