// src/app/super-admin/delivery-drivers/components/StatusFilter.tsx
"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface StatusFilterProps {
    status: string;
    onStatusChange: (status: string) => void;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({ status, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const statuses = ['ACTIVE', 'INACTIVE', 'NEW REGISTRATION'];

    return (
        <div className="relative z-10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full md:w-48 bg-green-500 text-white font-bold py-1 px-3 transition-all duration-200 text-[7px] md:text-[12px] ${isOpen ? 'rounded-t-lg' : 'rounded-lg'}`}
            >
                <span>{status}</span>
                <ChevronDown size={16} />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 w-full bg-white border border-gray-300 rounded-b-lg shadow-lg z-20">
                    {statuses.filter(s => s !== status).map(s => (
                        <button
                            key={s}
                            onClick={() => { onStatusChange(s); setIsOpen(false); }}
                            className="block w-full text-left px-3 py-2 font-bold text-black hover:bg-gray-100 text-[7px] md:text-[12px]"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
