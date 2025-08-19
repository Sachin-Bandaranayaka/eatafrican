// src/app/super-admin/delivery-backend/page.tsx
"use client";

import React from 'react';
import { deliveryRadiusData } from './components/data';
import { RadiusCard } from './components/RadiusCard';

export const SuperAdminDeliveryBackend = () => {
    return (
        <div className='flex flex-col justify-center items-center'>
            <div className="w-full md:w-4/5 bg-white/80 border-2 border-amber-400 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3">
                    {deliveryRadiusData.map((radiusItem) => (
                        <RadiusCard key={radiusItem.radius} data={radiusItem} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// If this is a page in the Next.js App Router, it should have a default export.
export default SuperAdminDeliveryBackend;
