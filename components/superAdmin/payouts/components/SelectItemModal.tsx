// src/app/super-admin/payouts/components/SelectItemModal.tsx
"use client";

import React, { useState } from 'react';
import { payoutsData } from './data';

export const SelectItemForPayoutsModal = ({ category, onShowResults, onCancel }) => {
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedItem, setSelectedItem] = useState('');
    const dataForCategory = payoutsData[category] || [];
    const availableItems = dataForCategory.find(r => r.region === selectedLocation)?.items || [];

    const handleLocationChange = (region) => {
        setSelectedLocation(region);
        setSelectedItem('');
    };
    
    const handleShowResults = () => {
        if (selectedLocation && selectedItem) {
            onShowResults({ location: selectedLocation, item: selectedItem });
        } else {
            alert("Please select a location and an item.");
        }
    };

    return (
        <div className="absolute inset-0 flex justify-start items-start p-2">
            <div className="bg-[#FACB9F] rounded-lg p-3 md:p-6 w-3/4 md:w-4/6 max-w-2xl shadow-lg">
                <h3 className="font-bold text-red-600 mb-4 text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">SELECT A {category.slice(0, -1)} TO SEE PAYOUTS</h3>
                <div className="grid grid-cols-2 md:gap-6">
                    <div>
                        <h4 className="font-bold text-black mb-2 text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">LOCATION</h4>
                        <div className="space-y-2">
                            {dataForCategory.map(group => (
                                <label key={group.region} className="custom-radio2 flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="location" value={group.region} checked={selectedLocation === group.region} onChange={() => handleLocationChange(group.region)} className="form-radio h-4 w-4 text-amber-600" />
                                    <span className="font-semibold text-black text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{group.region}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-black mb-2 text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">{category.slice(0, -1)}</h4>
                        <div className="space-y-2">
                            {selectedLocation ? (availableItems.length > 0 ? (availableItems.map(item => (
                                <label key={item.name} className="custom-radio2 flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="item" value={item.name} checked={selectedItem === item.name} onChange={() => setSelectedItem(item.name)} className="form-radio h-4 w-4 text-amber-600"/>
                                    <span className="font-semibold text-black text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{item.name}</span>
                                </label>
                            ))) : (<p className="text-gray-500 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">No items.</p>)) : (<p className="text-gray-500 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">Select a location.</p>)}
                        </div>
                    </div>
                </div>
                <div className="flex justify-start gap-6 md:gap-10 mt-3 md:mt-6">
                    <button onClick={handleShowResults} className="bg-red-900 text-white font-bold py-1 px-3 md:px-6 rounded-lg text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">SHOW RESULTS</button>
                    <button onClick={onCancel} className="md:ml-28 bg-red-900 text-white font-bold py-1 px-3 md:px-6 rounded-lg text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">CANCEL</button>
                </div>
            </div>
        </div>
    );
};
