// src/app/super-admin/restaurant/components/management/RestaurantMenuView.tsx
"use client";

import React from 'react';
import { Restaurant } from '../data';

interface RestaurantMenuViewProps {
    restaurant: Restaurant;
    selectedCategory: string; // Now receives selectedCategory as a prop
}

export const RestaurantMenuView: React.FC<RestaurantMenuViewProps> = ({ restaurant, selectedCategory }) => {
    // The component uses the prop directly to determine which items to show.
    const menuItems = restaurant.menu?.[selectedCategory] || [];
    
    return (
        <div>
            {/* The dropdown has been removed from this component */}
            <div className="overflow-x-auto mt-4">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#FFE59E]">
                            <th className="p-3 font-bold text-green-800 uppercase text-[7px] md:text-[15px]">Image</th>
                            <th className="p-3 font-bold text-green-800 uppercase text-[7px] md:text-[15px]">Name, Description</th>
                            <th className="p-3 font-bold text-green-800 uppercase text-[7px] md:text-[15px]">Price</th>
                            <th className="p-3 font-bold text-green-800 uppercase text-[7px] md:text-[15px]">Quantity/Threshold</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuItems.length > 0 ? (
                            menuItems.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-2"><div className="w-24 h-16 bg-gray-600 rounded-md"></div></td>
                                    <td className="p-2 align-top">
                                        <p className="font-bold text-black text-[9px] md:text-[15px]">{item.name}</p>
                                        <p className="text-gray-600 text-[7px] md:text-[12px]">{item.description}</p>
                                    </td>
                                    <td className="p-2 align-top text-black font-semibold text-[7px] md:text-[12px]">{item.price}</td>
                                    <td className="p-2 align-top text-black font-semibold text-[7px] md:text-[12px]">{`${item.quantity}/${item.threshold}`}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-4 text-center text-gray-500 text-[7px] md:text-[12px]">
                                    No items in this category.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};