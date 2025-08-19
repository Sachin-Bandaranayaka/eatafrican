// src/app/super-admin/delivery-drivers/components/DriverInfoView.tsx
"use client";

import React from 'react';
import { Driver } from './data';

interface DriverInfoViewProps {
    driver: Driver;
}

const InfoField = ({ label, value }: { label: string; value: string; }) => (
    <div className='mb-2'>
        <p className="text-[9px] md:text-[13px] text-black font-bold">{label}</p>
        <div className="bg-white rounded-md p-2 text-[7px] md:text-[12px] text-gray-800">{value}</div>
    </div>
);

const ImagePlaceholder = ({ label }: { label: string; }) => (
    <div>
        <h3 className="text-[9px] md:text-[15px] text-black font-bold mb-1">{label}</h3>
        <div className="w-32 h-20 bg-gray-300 border border-gray-400 rounded-md flex items-center justify-center">
            <span className="text-gray-500 text-[7px] md:text-[12px]">No Image</span>
        </div>
    </div>
);

export const DriverInfoView: React.FC<DriverInfoViewProps> = ({ driver }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Left Column */}
            <div className="space-y-4">
                <ImagePlaceholder label="Profile Picture" />
                <InfoField label="Firstname" value={driver.personalInfo.firstName} />
                <InfoField label="E-Mail Address" value={driver.personalInfo.email} />
                <ImagePlaceholder label="Driver's License" />
                 <div className="flex gap-4 pt-4">
                    <button className="bg-orange-500 text-white font-bold py-1 px-4 rounded-lg text-[7px] md:text-[12px]">DEACTIVATE</button>
                    <button className="bg-orange-500 text-white font-bold py-1 px-4 rounded-lg text-[7px] md:text-[12px]">DELETE</button>
                </div>
            </div>
            {/* Right Column */}
            <div className="space-y-4">
                 <div className='w-full h-20'> {/* Empty div for alignment */} </div>
                <InfoField label="Last Name" value={driver.personalInfo.lastName} />
                <InfoField label="Telephone Number" value={driver.personalInfo.phone} />
                <div>
                     <p className="text-[9px] md:text-[13px] text-black font-bold mb-1">Address</p>
                     <div className='grid grid-cols-2 gap-2'>
                        <InfoField label="Postal Code" value={driver.fullAddress.postalCode} />
                        <InfoField label="City" value={driver.fullAddress.city} />
                     </div>
                     <InfoField label="Street and House Number" value={driver.fullAddress.street} />
                </div>
                 <InfoField label="Registration Date" value={driver.registrationDate} />
            </div>
        </div>
    );
};
