"use client";

import React from 'react';
import { StatusFilter } from './StatusFilter';
import { Restaurant } from '../data';

interface AllRestaurantsViewProps {
    restaurants: { region: string; restaurants: any[] }[];
    onSelectRestaurant: (restaurant: Restaurant) => void;
    status: string;
    onStatusChange: (status: string) => void;
    onApprove?: (restaurantId: string) => void;
    onReject?: (restaurantId: string) => void;
}

export const AllRestaurantsViewConnected: React.FC<AllRestaurantsViewProps> = ({ 
    restaurants, 
    onSelectRestaurant, 
    status, 
    onStatusChange,
    onApprove,
    onReject
}) => {
    const showActions = status === 'NEW REGISTRATION';

    return (
        <div className="relative bg-white/80 border-2 border-amber-400 rounded-lg p-2 md:p-4 min-h-[550px]">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2">
                <h2 className="font-bold text-black text-[9px] md:text-[15px]">All Restaurants</h2>
                <StatusFilter status={status} onStatusChange={onStatusChange} />
            </div>
            
            {restaurants.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-sm">
                        {status === 'NEW REGISTRATION' 
                            ? 'No pending restaurant registrations' 
                            : `No ${status.toLowerCase()} restaurants found`}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#FFE59E]">
                                <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">ALL REGIONS</th>
                                <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">RESTAURANT NAME</th>
                                <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">ADDRESS</th>
                                <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">REGISTRATION DATE</th>
                                {showActions && (
                                    <th className="p-3 font-bold text-black uppercase text-[7px] md:text-[15px]">ACTIONS</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {restaurants.map((group) => (
                                <React.Fragment key={group.region}>
                                    <tr>
                                        <td className="pl-4 pt-2 font-bold text-black text-[9px] md:text-[15px]">{group.region}</td>
                                        <td colSpan={showActions ? 4 : 3}></td>
                                    </tr>
                                    {group.restaurants.map((restaurant, index) => (
                                        <tr key={restaurant.id || index} className="hover:bg-gray-100/50">
                                            <td></td>
                                            <td 
                                                className="py-1 pl-4 md:pl-0 text-black font-semibold text-[7px] md:text-[12px] cursor-pointer hover:text-blue-600" 
                                                onClick={() => onSelectRestaurant(restaurant)}
                                            >
                                                {restaurant.name}
                                            </td>
                                            <td className="py-1 text-black font-semibold text-[7px] md:text-[12px]">
                                                {restaurant.address}
                                            </td>
                                            <td className="py-1 text-black font-semibold text-[7px] md:text-[12px]">
                                                {restaurant.registrationDate}
                                            </td>
                                            {showActions && (
                                                <td className="py-1 px-2">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => onApprove && onApprove(restaurant.id)}
                                                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-[7px] md:text-[10px]"
                                                            title="Approve Restaurant"
                                                        >
                                                            APPROVE
                                                        </button>
                                                        <button
                                                            onClick={() => onReject && onReject(restaurant.id)}
                                                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-[7px] md:text-[10px]"
                                                            title="Reject Restaurant"
                                                        >
                                                            REJECT
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
