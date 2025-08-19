// src/app/super-admin/customer-accounts/components/CustomerInfoView.tsx
"use client";

import React from 'react';
import { Customer } from './data';

interface CustomerInfoViewProps {
    customer: Customer;
}

const InfoField = ({ label, value }: { label: string; value: string; }) => (
    <div className='mb-2'>
        <p className="text-[9px] md:text-[13px] text-black font-bold">{label}</p>
        <div className="bg-white rounded-md p-2 text-[7px] md:text-[12px] text-gray-800">{value}</div>
    </div>
);

const StaticInfoField = ({ label, value }: { label: string; value: string | number; }) => (
     <div>
        <p className="text-[9px] md:text-[13px] text-black font-bold">{label}</p>
        <p className="text-[7px] md:text-[12px] text-gray-800 font-semibold">{value}</p>
    </div>
);


export const CustomerInfoView: React.FC<CustomerInfoViewProps> = ({ customer }) => {
    // Default to empty objects if data is missing to prevent errors
    const personalInfo = customer.personalInfo || {};
    const address = customer.address || {};
    const favorites = customer.favorites || {};

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Left Column */}
            <div className="space-y-4">
                <h3 className="text-[9px] md:text-[15px] text-black font-bold">Personal Information</h3>
                <InfoField label="Firstname" value={personalInfo.firstName || '-'} />
                <InfoField label="E-Mail Address" value={personalInfo.email || '-'} />

                <h3 className="text-[9px] md:text-[15px] text-black font-bold pt-4">Address</h3>
                <InfoField label="Postal Code" value={address.postalCode || '-'} />
                <InfoField label="Street and House Number" value={address.street || '-'} />
            </div>
            {/* Right Column */}
            <div className="space-y-4">
                <div className='h-[42px]'></div> {/* Spacer for alignment */}
                <InfoField label="Last Name" value={personalInfo.lastName || '-'} />
                <InfoField label="Telephone Number" value={personalInfo.phone || '-'} />
                <div className='h-[66px]'></div> {/* Spacer for alignment */}
                <InfoField label="City" value={address.city || '-'} />
            </div>
             {/* Bottom Section */}
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                 <StaticInfoField label="Registration Date" value={customer.lastLogin || '-'} />
                 <StaticInfoField label="Last Login" value={customer.lastLogin || '-'} />
                 <StaticInfoField label="Total Orders" value={customer.totalOrders || 0} />
                 <StaticInfoField label="Total Spent" value={customer.totalSpent || "0"} />
                 <StaticInfoField label="Favourite Restaurant" value={favorites.restaurant || '-'} />
                 <StaticInfoField label="Favourite Meal" value={favorites.meal || '-'} />
            </div>
        </div>
    );
};
