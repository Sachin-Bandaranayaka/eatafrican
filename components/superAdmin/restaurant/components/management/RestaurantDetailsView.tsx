// src/app/super-admin/restaurant/components/management/RestaurantDetailsView.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { RestaurantInfoView } from './RestaurantInfoView';
import { RestaurantMenuView } from './RestaurantMenuView';
import { ActivityLogView } from './ActivityLogView';
import { Restaurant } from '../data';

interface RestaurantDetailsViewProps {
    restaurant: Restaurant;
    onBack: () => void;
}

export const RestaurantDetailsView: React.FC<RestaurantDetailsViewProps> = ({ restaurant, onBack }) => {
    // State for the main view dropdown
    const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
    const [selectedView, setSelectedView] = useState('RESTAURANT INFO');
    const viewOptions = ['RESTAURANT INFO', 'RESTAURANT MENU', 'ACTIVITY LOG'];

    // State for the menu category dropdown (LIFTED FROM CHILD)
    const menuCategories = Object.keys(restaurant.menu || {});
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(menuCategories[0] || '');

    // Effect to reset the category when the view changes
    useEffect(() => {
        if (selectedView === 'RESTAURANT MENU') {
            const categories = Object.keys(restaurant.menu || {});
            setSelectedCategory(categories[0] || '');
        }
    }, [selectedView, restaurant.menu]);


    const renderSelectedView = () => {
        switch (selectedView) {
            case 'RESTAURANT INFO': return <RestaurantInfoView restaurant={restaurant} />;
            case 'RESTAURANT MENU': return <RestaurantMenuView restaurant={restaurant} selectedCategory={selectedCategory} />;
            case 'ACTIVITY LOG': return <ActivityLogView restaurant={restaurant} />;
            default: return <RestaurantInfoView restaurant={restaurant} />;
        }
    };

    return (
        <div className="relative bg-white/80 border-2 border-amber-400 rounded-lg p-2 md:p-4 min-h-[550px]">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                {/* Restaurant Name */}
                <div>
                    <h2 className="font-bold text-green-800 text-[9px] md:text-[15px]">{restaurant.name}</h2>
                    <p className="text-gray-600 text-[7px] md:text-[12px]">{restaurant.fullAddress.city}</p>
                </div>

                {/* Container for Dropdowns */}
                <div className="flex items-center gap-4">
                    {/* View Dropdown */}
                    <div className="relative inline-block z-30">
                        <button onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)} className="flex items-center justify-between w-48 gap-2 bg-green-300 text-black font-bold py-1 px-3 rounded-lg text-[7px] md:text-[12px]">{selectedView} <ChevronDown size={16} /></button>
                        {isViewDropdownOpen && (
                            <div className="absolute top-full left-0 w-full min-w-full bg-green-300 rounded-b-lg shadow-lg z-40 ">
                                {viewOptions.filter(opt => opt !== selectedView).map(option => (
                                    <button key={option} onClick={() => { setSelectedView(option); setIsViewDropdownOpen(false); }} className="block w-full text-left px-3 py-2 text-black font-bold hover:bg-gray-100 text-[7px] md:text-[12px]">{option}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Menu Category Dropdown - Conditionally Rendered */}
                    {selectedView === 'RESTAURANT MENU' && (
                        <div className="relative inline-block z-20">
                            <button onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)} className="flex items-center gap-2 bg-green-300 text-black font-bold py-1 px-3 rounded-lg text-[7px] md:text-[12px]">{selectedCategory || 'NO CATEGORIES'} <ChevronDown size={16} /></button>
                            {isCategoryDropdownOpen && (
                                <div className="absolute top-full left-0 mt-0 w-full bg-green-300 rounded-b-lg shadow-lg z-20">
                                    {menuCategories.filter(cat => cat !== selectedCategory).map(cat => (
                                        <button key={cat} onClick={() => { setSelectedCategory(cat); setIsCategoryDropdownOpen(false); }} className="block w-full text-left px-3 py-2 text-black font-bold hover:bg-gray-100 text-[7px] md:text-[12px]">{cat}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>


                {/* Overview Button */}
                <button onClick={onBack} className="bg-red-800 text-white font-bold py-1 px-4 rounded-lg text-[7px] md:text-[12px]">OVERVIEW</button>
            </div>

            {/* Content Area */}
            <div>{renderSelectedView()}</div>
        </div>
    );
};