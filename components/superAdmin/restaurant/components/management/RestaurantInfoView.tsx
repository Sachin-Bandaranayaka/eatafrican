// src/app/super-admin/restaurant/components/management/RestaurantInfoView.tsx
"use client";

import React from 'react';
import { Restaurant } from '../data';

interface RestaurantInfoViewProps {
    restaurant: Restaurant;
}

export const RestaurantInfoView: React.FC<RestaurantInfoViewProps> = ({ restaurant }) => {
    const InfoField = ({ label, value }: { label?: string; value: string; }) => (
        <div>
            {label && <p className="text-[9px] md:text-[13px] text-black font-bold">{label}</p>}
            <p className="text-[7px] md:text-[12px] ml-2 text-gray-600">{value}</p>
        </div>
    );

    const ImagePlaceholder = ({ label }: { label: string }) => (
        <div>
            <h3 className="text-[9px] md:text-[15px] text-green-800 font-bold mb-1">{label}</h3>
            <div className="w-32 h-20 bg-gray-600 rounded-md flex items-center justify-center">
                <span className="text-gray-500 text-[7px] md:text-[12px]">No Image</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                <div className="space-y-6">
                    <ImagePlaceholder label="Restaurant's Logo" />
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-[9px] md:text-[15px] text-green-800 font-bold mb-2">Restaurant's Manager</h3>
                        <div className='flex flex-row gap-8'>
                            <InfoField label="Firstname" value={restaurant.manager.firstName} />
                            <InfoField label="Last Name" value={restaurant.manager.lastName} />
                        </div>
                        <div className='flex flex-row gap-8 mt-2'>
                            <InfoField label="E-Mail" value={restaurant.manager.email} />
                            <InfoField label="Telephone" value={restaurant.manager.phone} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[9px] md:text-[15px] text-green-800 font-bold mb-1">Type of Restaurant</h3>
                        <InfoField value={restaurant.type} />
                    </div>
                    <div>
                        <ImagePlaceholder label="Proof of Ownership/Authorization" />
                    </div>
                    <div className="pt-2">
                        <h3 className='text-[9px] md:text-[15px] text-green-800 font-bold mb-1'>Registration Date</h3>
                        <InfoField value={restaurant.registrationDate} />
                    </div>
                </div>

                <div className="space-y-4">
                     <div>
                        <h3 className="text-[9px] md:text-[15px] text-green-800 font-bold mb-2">Restaurant's Address</h3>
                        <div className='flex flex-row gap-8'>
                            <InfoField label="Postal Code" value={restaurant.fullAddress.postalCode} />
                            <InfoField label="City" value={restaurant.fullAddress.city} />
                        </div>
                        <InfoField label="Street and House Number" value={restaurant.fullAddress.street} />
                    </div>
                    <div>
                        <h3 className="text-[9px] md:text-[15px] text-green-800 font-bold mb-1">Restaurant's Offering</h3>
                        <InfoField label="Country Speciality" value={restaurant.offering} />
                    </div>
                    <div>
                        <ImagePlaceholder label="ID/Passport Verification" />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button className="bg-amber-500 text-white font-bold py-1 px-4 rounded-lg text-[7px] md:text-[12px]">DEACTIVATE</button>
                        <button className="bg-amber-500 text-white font-bold py-1 px-4 rounded-lg text-[7px] md:text-[12px]">DELETE</button>
                    </div>
                </div>
            </div>
        </div>
    );
};