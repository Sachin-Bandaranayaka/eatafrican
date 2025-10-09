"use client";

import React, { useState, useEffect } from 'react';
import { RestaurantDetailsView } from './RestaurantDetailsView';
import { AllRestaurantsViewConnected } from './AllRestaurantsView-connected';
import { Restaurant } from '../data';

export const RestaurantManagementControllerConnected = () => {
    const [currentView, setCurrentView] = useState('list');
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [statusFilter, setStatusFilter] = useState('NEW REGISTRATION'); // Default to show pending restaurants
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch restaurants from API
    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            // Try both token names (different login components use different names)
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');

            if (!token) {
                setError('Not authenticated. Please login again.');
                return;
            }

            const response = await fetch('/api/admin/restaurants', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch restaurants');
            }

            const data = await response.json();
            console.log('API Response:', data); // Debug log
            // The API returns paginated data with 'data' property
            setRestaurants(data.data || data.restaurants || []);
        } catch (err: any) {
            console.error('Error fetching restaurants:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectRestaurant = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setCurrentView('details');
    };

    const handleBackToList = () => {
        setSelectedRestaurant(null);
        setCurrentView('list');
        // Refresh the list
        fetchRestaurants();
    };

    const handleApprove = async (restaurantId: string) => {
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');

            const response = await fetch(`/api/admin/restaurants/${restaurantId}/approve`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: 'active',
                    notes: 'Restaurant approved by admin'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to approve restaurant');
            }

            // Refresh the list
            await fetchRestaurants();
            alert('Restaurant approved successfully!');
        } catch (err: any) {
            console.error('Error approving restaurant:', err);
            alert('Failed to approve restaurant: ' + err.message);
        }
    };

    const handleReject = async (restaurantId: string) => {
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');

            const response = await fetch(`/api/admin/restaurants/${restaurantId}/approve`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: 'suspended',
                    notes: 'Restaurant rejected by admin'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to reject restaurant');
            }

            // Refresh the list
            await fetchRestaurants();
            alert('Restaurant rejected successfully!');
        } catch (err: any) {
            console.error('Error rejecting restaurant:', err);
            alert('Failed to reject restaurant: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[550px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading restaurants...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[550px]">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <button
                        onClick={fetchRestaurants}
                        className="bg-red-900 text-white px-4 py-2 rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (currentView === 'details' && selectedRestaurant) {
        return <RestaurantDetailsView restaurant={selectedRestaurant} onBack={handleBackToList} />;
    }

    // Transform API data to match the expected format
    console.log('Raw restaurants data:', restaurants); // Debug
    console.log('Total restaurants:', restaurants.length); // Debug
    
    const transformedData = restaurants.reduce((acc: any[], restaurant: any) => {
        const region = restaurant.region || restaurant.city || 'OTHER';
        const regionUpper = region.toUpperCase();

        // Map database status to UI status
        let uiStatus = 'ACTIVE';
        if (restaurant.status === 'pending') {
            uiStatus = 'NEW';
        } else if (restaurant.status === 'suspended' || restaurant.status === 'inactive') {
            uiStatus = 'INACTIVE';
        }
        
        console.log(`Restaurant: ${restaurant.name}, DB Status: ${restaurant.status}, UI Status: ${uiStatus}`); // Debug

        const transformedRestaurant = {
            id: restaurant.id,
            name: restaurant.name,
            address: `${restaurant.address}, ${restaurant.city}`,
            registrationDate: new Date(restaurant.created_at).toLocaleDateString('de-CH'),
            status: uiStatus,
            dbStatus: restaurant.status, // Keep original status for API calls
            manager: {
                firstName: restaurant.owner?.first_name || 'N/A',
                lastName: restaurant.owner?.last_name || 'N/A',
                email: restaurant.email,
                phone: restaurant.phone
            },
            fullAddress: {
                postalCode: restaurant.postal_code,
                city: restaurant.city,
                street: restaurant.address
            },
            type: 'Restaurant',
            offering: restaurant.cuisine_types?.join(', ') || 'N/A',
            logoUrl: restaurant.logo_url || '/placeholder.png',
            proofUrl: '/placeholder.png',
            idUrl: '/placeholder.png',
            menu: {}, // Will be populated when viewing details
            activityLog: []
        };

        // Find or create region group
        let regionGroup = acc.find(r => r.region === regionUpper);
        if (!regionGroup) {
            regionGroup = { region: regionUpper, restaurants: [] };
            acc.push(regionGroup);
        }

        regionGroup.restaurants.push(transformedRestaurant);
        return acc;
    }, []);

    // Filter by status
    console.log('Status filter:', statusFilter); // Debug
    console.log('Transformed data before filter:', transformedData); // Debug
    
    const filteredData = transformedData
        .map(region => ({
            ...region,
            restaurants: region.restaurants.filter((r: any) =>
                statusFilter === 'NEW REGISTRATION'
                    ? r.status === 'NEW'
                    : r.status === statusFilter
            )
        }))
        .filter(region => region.restaurants.length > 0);
    
    console.log('Filtered data:', filteredData); // Debug

    return (
        <AllRestaurantsViewConnected
            restaurants={filteredData}
            onSelectRestaurant={handleSelectRestaurant}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            onApprove={handleApprove}
            onReject={handleReject}
        />
    );
};
