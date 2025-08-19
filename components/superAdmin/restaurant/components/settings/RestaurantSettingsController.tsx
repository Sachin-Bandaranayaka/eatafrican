// src/app/super-admin/restaurant/components/settings/RestaurantSettingsController.tsx
"use client";

import React, { useState } from 'react';
import { initialSpecialities, initialMenuCategories, initialLocations } from '../data';
import { SettingsCategoryDropdown } from './SettingsCategoryDropdown';
import { GenericSettingsView } from './GenericSettingsView';

export const RestaurantSettingsController = () => {
    const [settingType, setSettingType] = useState('COUNTRY SPECIALTY');

    const renderSettingsContent = () => {
        switch (settingType) {
            case 'COUNTRY SPECIALTY':
                return <GenericSettingsView title="Speciality" initialItems={initialSpecialities} />;
            case 'MENU CATEGORY':
                return <GenericSettingsView title="Category" initialItems={initialMenuCategories} />;
            case 'LOCATIONS':
                return <GenericSettingsView title="Location" initialItems={initialLocations} />;
            default:
                return null;
        }
    };

    return (
        <div className="relative">
            <div className="relative bg-white/80 border-2 border-amber-400 rounded-lg p-4 min-h-[550px] z-10">
                <div className="mb-6">
                    <SettingsCategoryDropdown selected={settingType} onSelect={setSettingType} />
                </div>
                {renderSettingsContent()}
            </div>
        </div>
    );
};
