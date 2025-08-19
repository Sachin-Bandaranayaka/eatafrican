"use client";

import React, { useState } from 'react';
import { MainNavigation } from './components/MainNavigation';
import { RestaurantManagementController } from './components/management/RestaurantManagementController';
import { RestaurantSettingsController } from './components/settings/RestaurantSettingsController';

export const SuperAdminRestaurant = () => {
    const [activePage, setActivePage] = useState('management');

    return (
        <div className="w-full lg:w-5/6 max-w-7xl mx-auto px-2 md:px-6 bg-transparent">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="flex-shrink-0 z-40">
                    <MainNavigation currentPage={activePage} onPageChange={setActivePage} />
                </div>
                <div className="flex-1">
                    {activePage === 'management' ? <RestaurantManagementController /> : <RestaurantSettingsController />}
                </div>
            </div>
        </div>
    );
};