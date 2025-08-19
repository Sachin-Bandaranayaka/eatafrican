// src/app/super-admin/restaurant/components/management/RestaurantManagementController.tsx
"use client";

import React, { useState } from 'react';
import { RestaurantDetailsView } from './RestaurantDetailsView';
import { AllRestaurantsView } from './AllRestaurantsView';
import { allRestaurantData, Restaurant } from '../data';

export const RestaurantManagementController = () => {
    const [currentView, setCurrentView] = useState('list');
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [statusFilter, setStatusFilter] = useState('ACTIVE');

    const handleSelectRestaurant = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setCurrentView('details');
    };
    
    const handleBackToList = () => {
        setSelectedRestaurant(null);
        setCurrentView('list');
    };

    if (currentView === 'details' && selectedRestaurant) {
        return <RestaurantDetailsView restaurant={selectedRestaurant} onBack={handleBackToList} />;
    }

    const filteredData = allRestaurantData
        .map(region => ({
            ...region,
            restaurants: region.restaurants.filter(r =>
                statusFilter === 'NEW REGISTRATION'
                    ? r.status === 'NEW' // Assuming 'NEW' is a possible status for new registrations
                    : r.status === statusFilter
            )
        }))
        .filter(region => region.restaurants.length > 0);

    return <AllRestaurantsView
        restaurants={filteredData}
        onSelectRestaurant={handleSelectRestaurant}
        status={statusFilter}
        onStatusChange={setStatusFilter}
    />;
};