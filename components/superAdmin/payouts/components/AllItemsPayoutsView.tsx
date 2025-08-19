// src/app/super-admin/payouts/components/AllItemsPayoutsView.tsx
"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { payoutsData } from './data';

export const AllItemsPayoutsView = ({ category, onSelectItem }) => {
    const data = payoutsData[category] || [];
    const itemHeader = category === 'RESTAURANTS' ? 'Restaurant' : category === 'DELIVERY DRIVERS' ? 'Driver' : 'Eat African';
    
    return (
        <div className="relative bg-white/80 border-2 border-amber-400 rounded-lg p-4 min-h-[550px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-green-800 text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">ALL {category}</h2>
                <button onClick={onSelectItem} className="bg-red-900 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-800 transition-colors text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">SELECT {category.slice(0, -1)}</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#FFE59E]">
                            <th className="p-3 font-bold text-black uppercase w-1/4 text-[7px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]"><div className="flex items-center gap-2">ALL REGIONS<ChevronDown size={20} /></div></th>
                            <th className="p-3 font-bold text-black uppercase w-1/4 text-[7px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">{itemHeader}</th>
                            <th className="p-3 font-bold text-black uppercase w-1/4 text-[7px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">LAST PAYOUT DATE</th>
                            <th className="p-3 font-bold text-black uppercase w-1/4 text-[7px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((group) => (
                            <React.Fragment key={group.region}>
                                <tr><td className="pl-4 pt-2 font-bold text-black text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">{group.region}</td></tr>
                                {group.items.map((item) => (
                                    <tr key={item.name}>
                                        <td></td>
                                        <td className="py-1 text-black font-semibold text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{item.name}</td>
                                        <td className="py-1 text-black font-semibold text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{item.lastPayout}</td>
                                        <td className="py-1 text-black font-semibold text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{item.total}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
