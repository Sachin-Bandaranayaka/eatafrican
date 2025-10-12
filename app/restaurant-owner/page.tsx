"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RestaurantOwnerDashboard from '@/components/restaurantOwnerDashboard';

export default function RestaurantOwnerPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            const userStr = localStorage.getItem('user');

            if (!token || !userStr) {
                alert('Please login first');
                router.push('/');
                return;
            }

            const userData = JSON.parse(userStr);

            if (userData.role !== 'restaurant_owner') {
                alert('Access denied. Restaurant owners only.');
                router.push('/');
                return;
            }

            setUser(userData);
            await fetchRestaurant(token, userData.id);
        } catch (error) {
            console.error('Auth error:', error);
            alert('Authentication error');
            router.push('/');
        }
    };

    const fetchRestaurant = async (token: string, ownerId: string) => {
        try {
            const response = await fetch(`/api/restaurants?ownerId=${ownerId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch restaurant');
            }

            const data = await response.json();

            if (data.restaurants && data.restaurants.length > 0) {
                const restaurantData = data.restaurants[0];

                // Fetch full restaurant details
                const detailsResponse = await fetch(`/api/restaurants/${restaurantData.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (detailsResponse.ok) {
                    const detailsData = await detailsResponse.json();
                    setRestaurant(detailsData.restaurant || detailsData);
                } else {
                    setRestaurant(restaurantData);
                }
            }
        } catch (error) {
            console.error('Error fetching restaurant:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">No Restaurant Found</h1>
                    <p className="text-gray-600 mb-4">
                        You don't have a restaurant registered yet. Please register your restaurant first.
                    </p>
                    <button
                        onClick={() => router.push('/partner-restaurant')}
                        className="bg-red-900 text-white px-6 py-2 rounded-lg font-bold"
                    >
                        Register Restaurant
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 pt-20">
            <RestaurantOwnerDashboard
                restaurantId={restaurant.id}
                onLogout={handleLogout}
            />
        </div>
    );
}
