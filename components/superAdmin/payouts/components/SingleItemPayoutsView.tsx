// src/app/super-admin/payouts/components/SingleItemPayoutsView.tsx
"use client";

import React from 'react';
import { dailyPayoutsData } from './data';

export const SingleItemPayoutsView = ({ item, onBack }) => {
    return (
        <div className="relative bg-white/80 border-2 border-amber-400 rounded-lg p-2 md:p-4 min-h-[550px]">
             <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800 text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">{item.item}, {item.location}</h2>
                <button onClick={onBack} className="bg-red-900 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-800 transition-colors text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">OVERVIEW</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#FFE59E]">
                            <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">PAYOUT DATE</th>
                            <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dailyPayoutsData.map((payout, index) => (
                           <tr key={index}>
                               <td className="p-2 text-black font-semibold text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{payout.date}</td>
                               <td className="p-2 text-black font-semibold text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{payout.total}</td>
                           </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
