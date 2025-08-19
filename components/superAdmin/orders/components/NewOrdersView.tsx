// src/app/super-admin/orders/components/NewOrdersView.tsx
"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { restaurantData } from './data';

const SelectRestaurantModal = ({ onShowResults, onCancel }: { onShowResults: (location: string, restaurant: string) => void, onCancel: () => void }) => {
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedRestaurant, setSelectedRestaurant] = useState('');
    const availableRestaurants = restaurantData.find(r => r.region === selectedLocation)?.restaurants || [];

    const handleLocationChange = (region: string) => {
        setSelectedLocation(region);
        setSelectedRestaurant('');
    };

    const handleShowResults = () => {
        if (selectedLocation && selectedRestaurant) {
            onShowResults(selectedLocation, selectedRestaurant);
        } else {
            alert("Please select a location and a restaurant.");
        }
    };

    return (
        <div className="absolute inset-0 flex justify-start items-start p-2">
            <div className="bg-[#FACB9F] rounded-lg p-3 md:p-6 w-3/4 md:w-4/6 max-w-2xl shadow-lg">
                <h3 className="font-bold text-red-600 mb-4 text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">SELECT A RESTAURANT TO SEE ORDERS</h3>
                <div className="grid grid-cols-2 md:gap-6">
                    <div>
                        <h4 className="font-bold text-black mb-2 text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">LOCATION</h4>
                        <div className="space-y-2">
                            {restaurantData.map(group => (
                                <label key={group.region} className="custom-radio2 flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="location" value={group.region} checked={selectedLocation === group.region} onChange={() => handleLocationChange(group.region)} className="form-radio h-4 w-4 text-amber-600" />
                                    <span className="font-semibold text-black text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{group.region}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-black mb-2 text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">RESTAURANT</h4>
                        <div className="space-y-2">
                            {selectedLocation ? (availableRestaurants.length > 0 ? (availableRestaurants.map(restaurant => (
                                <label key={restaurant.name} className="custom-radio2 flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="restaurant" value={restaurant.name} checked={selectedRestaurant === restaurant.name} onChange={() => setSelectedRestaurant(restaurant.name)} className="form-radio h-4 w-4 text-amber-600" />
                                    <span className="font-semibold text-black text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{restaurant.name}</span>
                                </label>
                            ))) : (<p className="text-gray-500 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">No restaurants in this location.</p>)) : (<p className="text-gray-500 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">Please select a location first.</p>)}
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

export const NewOrdersView = () => {
    const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
    const [isSelectingRestaurant, setIsSelectingRestaurant] = useState(false);

    const handleShowResults = (location: string, restaurant: string) => {
        console.log("Showing results for:", location, restaurant);
        setIsSelectingRestaurant(false);
    };

    return (
        <div className="relative bg-white/80 border-2 border-amber-400 rounded-lg p-4 min-h-[550px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-green-800 text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">All Restaurants</h2>
                <button onClick={() => setIsSelectingRestaurant(true)} className="bg-red-900 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-800 transition-colors text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">SELECT RESTAURANT</button>
            </div>
            <div className="overflow-x-auto">
                <table className="md:w-5/6 text-left">
                    <thead>
                        <tr className="bg-[#FFE59E]">
                            <th className="p-3 font-bold text-black uppercase w-1/3 text-[7px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">
                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}>ALL REGIONS<ChevronDown size={20} /></div>
                            </th>
                            <th className="p-3 font-bold text-black uppercase w-1/3 text-[7px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">Restaurant</th>
                            <th className="p-3 font-bold text-black uppercase w-1/3 text-[7px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">Total Orders</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurantData.map((group) => (
                            <React.Fragment key={group.region}>
                                <tr><td className="pl-4 p-1 font-bold text-black text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">{group.region}</td></tr>
                                {group.restaurants.map((restaurant, rIndex) => (
                                    <tr key={`${group.region}-${rIndex}`}>
                                        <td></td>
                                        <td className="text-black font-semibold text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{restaurant.name}</td>
                                        <td className="text-black font-semibold text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">{restaurant.orders}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            {isSelectingRestaurant && <SelectRestaurantModal onShowResults={handleShowResults} onCancel={() => setIsSelectingRestaurant(false)} />}
        </div>
    );
};
