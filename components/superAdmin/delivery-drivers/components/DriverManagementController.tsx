// src/app/super-admin/delivery-drivers/components/DriverManagementController.tsx
"use client";

import React, { useState } from 'react';
import { DriverDetailsView } from './DriverDetailsView';
import { AllDriversView } from './AllDriversView';
import { allDriverData, Driver } from './data';

export const DriverManagementController = () => {
    const [currentView, setCurrentView] = useState('list');
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [statusFilter, setStatusFilter] = useState('ACTIVE');

    const handleSelectDriver = (driver: Driver) => {
        setSelectedDriver(driver);
        setCurrentView('details');
    };

    const handleBackToList = () => {
        setSelectedDriver(null);
        setCurrentView('list');
    };

    if (currentView === 'details' && selectedDriver) {
        return <DriverDetailsView driver={selectedDriver} onBack={handleBackToList} />;
    }

    const filteredData = allDriverData
        .map(region => ({
            ...region,
            drivers: region.drivers.filter(d => d.status === statusFilter)
        }))
        .filter(region => region.drivers.length > 0);
    
    return <AllDriversView
        drivers={filteredData}
        onSelectDriver={handleSelectDriver}
        status={statusFilter}
        onStatusChange={setStatusFilter}
    />;
};
