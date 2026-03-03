"use client";
import { useState, useEffect } from "react";
import RestaurantInfo from "./RestaurantInfo";
import OpeningHours from "./OpeningHours";

// Interface for component props
interface MyRestaurantViewProps {
    restaurantId: string;
    myRestaurantTab: string;
    setMyRestaurantTab: (tab: string) => void;
}

// Main component for managing restaurant information and opening hours
const MyRestaurantViewConnected = ({ restaurantId, myRestaurantTab, setMyRestaurantTab }: MyRestaurantViewProps) => {
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Fetch restaurant data when restaurantId changes
    useEffect(() => {
        if (restaurantId) {
            fetchRestaurant();
        }
    }, [restaurantId]);

    // Function to fetch restaurant details from API
    const fetchRestaurant = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            const response = await fetch(`/api/restaurants/${restaurantId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setRestaurant(data.restaurant || data);
            }
        } catch (error) {
            console.error('Error fetching restaurant:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`relative w-full z-50 ${
            (myRestaurantTab === 'RESTAURANT INFO' || myRestaurantTab === 'RESTAURANT_INFORMATION') ? 'p-0 sm:p-2' : 'p-2'
        }`}>
            {/* Restaurant Information Tab */}
            {(myRestaurantTab === 'RESTAURANT INFO' || myRestaurantTab === 'RESTAURANT_INFORMATION') && (
                <RestaurantInfo restaurant={restaurant} loading={loading} />
            )}
            
            {/* Opening Hours Tab */}
            {(myRestaurantTab === 'OPENING HOURS' || myRestaurantTab === 'OPENING_HOURS') && (
                <OpeningHours />
            )}
        </div>
    );
};

export default MyRestaurantViewConnected;
