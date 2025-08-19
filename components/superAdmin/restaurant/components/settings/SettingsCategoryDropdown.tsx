// src/app/super-admin/restaurant/components/settings/SettingsCategoryDropdown.tsx
"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const SettingsCategoryDropdown = ({ selected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const options = ['COUNTRY SPECIALTY', 'MENU CATEGORY', 'LOCATIONS'];
    return (
        <div className='flex flex-row items-center justify-center'>
            <div className="relative inline-block z-20 ">

                <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-1 px-3 rounded-lg text-[7px] md:text-[12px]">{selected} <ChevronDown size={16} /></button>

                {isOpen && (
                    <div className="absolute top-full left-0 mt-0 w-auto min-w-full bg-green-500 rounded-lg shadow-lg z-30">
                        {options.filter(opt => opt !== selected).map(option => (
                            <button key={option} onClick={() => { onSelect(option); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-white font-bold hover:bg-green-400 text-[7px] md:text-[12px]">{option}</button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};