// src/app/super-admin/restaurant/components/MainNavigation.tsx
"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface MainNavigationProps {
    currentPage: string;
    onPageChange: (page: string) => void;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ currentPage, onPageChange }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const getButtonClasses = (pageName: string) => `bg-blue-600 text-white font-bold rounded-lg w-full text-center px-4 py-2 hover:bg-blue-700 transition-colors text-[7px] md:text-[12px] ${currentPage === pageName ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`;

    return (
        <div className="w-full md:w-48">
            <div className="hidden md:flex flex-col gap-2">
                <button onClick={() => onPageChange('management')} className={getButtonClasses('management')}>RESTAURANT MANAGEMENT</button>
                <button onClick={() => onPageChange('settings')} className={getButtonClasses('settings')}>RESTAURANT SETTINGS</button>
            </div>
            <div className="relative md:hidden">
                <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className={`${getButtonClasses(currentPage)} flex items-center justify-between`}>
                    {currentPage === 'management' ? 'RESTAURANT MANAGEMENT' : 'RESTAURANT SETTINGS'}
                    <ChevronDown size={20} />
                </button>
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-lg shadow-lg z-30 border">
                        {currentPage === 'settings' && <button onClick={() => { onPageChange('management'); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-black font-bold hover:bg-gray-100 text-[7px] md:text-[12px]">RESTAURANT MANAGEMENT</button>}
                        {currentPage === 'management' && <button onClick={() => { onPageChange('settings'); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-black font-bold hover:bg-gray-100 text-[7px] md:text-[12px]">RESTAURANT SETTINGS</button>}
                    </div>
                )}
            </div>
        </div>
    );
};