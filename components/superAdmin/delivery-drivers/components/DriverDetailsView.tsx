// src/app/super-admin/delivery-drivers/components/DriverDetailsView.tsx
"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DriverInfoView } from './DriverInfoView';
import { DriverActivityLogView } from './DriverActivityLogView';
import { Driver } from './data';

interface DriverDetailsViewProps {
    driver: Driver;
    onBack: () => void;
}

export const DriverDetailsView: React.FC<DriverDetailsViewProps> = ({ driver, onBack }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedView, setSelectedView] = useState('DRIVER INFO');
    const viewOptions = ['DRIVER INFO', 'ACTIVITY LOG'];

    const renderSelectedView = () => {
        switch (selectedView) {
            case 'DRIVER INFO': return <DriverInfoView driver={driver} />;
            case 'ACTIVITY LOG': return <DriverActivityLogView driver={driver} />;
            default: return <DriverInfoView driver={driver} />;
        }
    };

    return (
        <div className="relative bg-white/80 border-2 border-amber-400 rounded-lg p-2 md:p-4 min-h-[550px]">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h2 className="font-bold text-black text-[9px] md:text-[15px]">{driver.name}</h2>
                    <p className="text-gray-600 text-[7px] md:text-[12px]">{driver.fullAddress.city}</p>
                </div>
                <div className="relative inline-block z-20">
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center justify-between w-48 gap-2 bg-green-500 text-white font-bold py-1 px-3 rounded-lg text-[7px] md:text-[12px]">
                        {selectedView} <ChevronDown size={16} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 w-full min-w-full bg-white rounded-b-lg shadow-lg z-30">
                            {viewOptions.filter(opt => opt !== selectedView).map(option => (
                                <button key={option} onClick={() => { setSelectedView(option); setIsDropdownOpen(false); }} className="block w-full text-left px-3 py-2 text-black font-bold hover:bg-gray-100 text-[7px] md:text-[12px]">{option}</button>
                            ))}
                        </div>
                    )}
                </div>
                <button onClick={onBack} className="bg-red-800 text-white font-bold py-1 px-4 rounded-lg text-[7px] md:text-[12px]">OVERVIEW</button>
            </div>
            <div>{renderSelectedView()}</div>
        </div>
    );
};
