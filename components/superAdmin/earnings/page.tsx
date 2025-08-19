// src/app/super-admin/earnings/page.tsx
"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { earningsCategories } from './components/data';
import { CalendarPopup } from './components/Calendar';
import { AllItemsEarningsView } from './components/AllItemsEarningsView';
import { SelectItemModal } from './components/SelectItemModal';
import { SingleItemEarningsView } from './components/SingleItemEarningsView';

export const SuperAdminEarnings = () => {
    const [view, setView] = useState('default'); // 'default', 'selecting', 'results'
    const [selectedItem, setSelectedItem] = useState(null);
    const [category, setCategory] = useState('RESTAURANT');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedDateRange, setSelectedDateRange] = useState({ start: '10.06.2025', end: '10.06.2025' });

    const handleApplyDate = (range) => {
        if (range.start) setSelectedDateRange(range);
        setIsCalendarOpen(false);
    };

    const handleShowResults = (selection) => {
        setSelectedItem(selection);
        setView('results');
    };

    const renderContent = () => {
        if (view === 'results') {
            return <SingleItemEarningsView item={selectedItem} onBack={() => setView('default')} />;
        }
        return (
            <div className="relative">
                <AllItemsEarningsView category={category} onSelectItem={() => setView('selecting')} />
                {view === 'selecting' && (
                    <SelectItemModal
                        category={category}
                        onShowResults={handleShowResults}
                        onCancel={() => setView('default')}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="w-full md:w-4/6 max-w-6xl mx-auto md:px-6 bg-transparent">
            <div className="flex justify-between items-center mb-4">
                <div className="relative">
                    <button onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)} className={`flex items-center gap-2 bg-blue-500 text-white font-bold py-2 px-3 transition-all duration-200 text-[7px] md:text-[12px] ${isCategoryDropdownOpen ? 'rounded-t-lg' : 'rounded-lg'}`}>
                        <span>{category}S</span>
                        <ChevronDown size={16} />
                    </button>
                    {isCategoryDropdownOpen && (
                        <div className="absolute top-full left-0 w-full bg-blue-500 text-white rounded-b-lg shadow-lg z-10">
                            {earningsCategories.filter(c => c !== category).map(cat => (
                                <button key={cat} onClick={() => { setCategory(cat); setIsCategoryDropdownOpen(false); }} className="block w-full text-left px-3 py-2 font-bold hover:bg-blue-600 text-[7px] md:text-[12px]">
                                    {cat}S
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="relative">
                    <button onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="flex items-center gap-2 bg-[#FFF2CE] text-black border-2 border-amber-400 font-bold py-1 px-3">
                        <div>
                            <span className="text-[9px] md:text-[15px]">TODAY</span>
                            <p className="text-gray-500 text-[7px] md:text-[12px]">{selectedDateRange.start}</p>
                        </div>
                        <ChevronDown size={16} />
                    </button>
                    {isCalendarOpen && <CalendarPopup onApply={handleApplyDate} onCancel={() => setIsCalendarOpen(false)} />}
                </div>
            </div>
            {renderContent()}
        </div>
    );
};

export default SuperAdminEarnings;
