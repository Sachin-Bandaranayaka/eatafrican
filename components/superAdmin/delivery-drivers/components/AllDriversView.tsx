// src/app/super-admin/delivery-drivers/components/AllDriversView.tsx
"use client";

import React from 'react';
import { StatusFilter } from './StatusFilter';
import { Driver } from './data';

interface AllDriversViewProps {
    drivers: { region: string; drivers: Driver[] }[];
    onSelectDriver: (driver: Driver) => void;
    status: string;
    onStatusChange: (status: string) => void;
}

export const AllDriversView: React.FC<AllDriversViewProps> = ({ drivers, onSelectDriver, status, onStatusChange }) => (
    <div className="relative bg-white/80 border-2 border-amber-400 rounded-lg p-2 md:p-4 min-h-[550px]">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2">
            <h2 className="font-bold text-black text-[9px] md:text-[15px]">Active Drivers</h2>
            <StatusFilter status={status} onStatusChange={onStatusChange} />
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-[#FFE59E]">
                        <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">ALL REGIONS</th>
                        <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">ADDRESS</th>
                        <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">REGISTRATION DATE</th>
                    </tr>
                </thead>
                <tbody>
                    {drivers.map((group) => (
                        <React.Fragment key={group.region}>
                            <tr>
                                <td className="pl-4 pt-2 font-bold text-black text-[9px] md:text-[15px]">{group.region}</td>
                                <td colSpan={2}></td>
                            </tr>
                            {group.drivers.map((driver) => (
                                <tr key={driver.id} className="hover:bg-gray-100/50">
                                    <td
                                        className="py-1 pl-8 md:pl-12 text-black font-semibold text-[7px] md:text-[12px] cursor-pointer"
                                        onClick={() => onSelectDriver(driver)}
                                    >
                                        {driver.name}
                                    </td>
                                    <td className="py-1 text-black font-semibold text-[7px] md:text-[12px]">{driver.address}</td>
                                    <td className="py-1 text-black font-semibold text-[7px] md:text-[12px]">{driver.registrationDate}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
