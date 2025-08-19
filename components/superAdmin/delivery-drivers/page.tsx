// src/app/super-admin/delivery-drivers/page.tsx
"use client";

import React from 'react';
import { DriverManagementController } from './components/DriverManagementController';

// --- FIX ---
// Changed from a default export to a named export to match what your app expects.
export const SuperAdminDeliveryDrivers = () => {
    return (
        <div className="w-full md:w-5/6 max-w-7xl mx-auto md:px-6 bg-transparent">
            <DriverManagementController />
        </div>
    );
};