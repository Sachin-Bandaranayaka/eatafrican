"use client";
import { useState, useEffect } from "react";

interface MyRestaurantViewProps {
    restaurantId: string;
}

const MyRestaurantViewConnected = ({ restaurantId }: MyRestaurantViewProps) => {
    const [myRestaurantTab, setMyRestaurantTab] = useState('RESTAURANT_INFORMATION');
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (restaurantId) {
            fetchRestaurant();
        }
    }, [restaurantId]);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="flex items-center justify-center w-full py-10">
                <p className="text-gray-500">Restaurant not found</p>
            </div>
        );
    }

    return (
        <div className="relative w-full p-2 z-50">
            <div className="flex flex-col w-5/6">
                <div className="flex flex-row gap-1 w-1/2">
                    <button
                        onClick={() => setMyRestaurantTab('RESTAURANT_INFORMATION')}
                        className={`flex p-1 px-2 text-white text-[9px] md:text-[12px] ${myRestaurantTab === 'RESTAURANT_INFORMATION' ? 'bg-blue-900' : 'bg-blue-500'}`}
                    >
                        RESTAURANT INFORMATION
                    </button>
                    <button
                        onClick={() => setMyRestaurantTab('OPENING_TIME')}
                        className={`flex p-1 px-2.5 text-white text-[9px] md:text-[12px] ${myRestaurantTab === 'OPENING_TIME' ? 'bg-blue-900' : 'bg-blue-500'}`}
                    >
                        OPENING TIME
                    </button>
                </div>
            </div>
            {myRestaurantTab === 'RESTAURANT_INFORMATION' && (
                <div className="p-6 bg-transparent rounded-lg max-w-4xl mx-auto max-h-[65vh] overflow-y-auto">
                    <div className="flex flex-row gap-x-12">
                        <div className="flex flex-col space-y-2 w-[30%]">
                            <h3 className="font-bold text-gray-800">Restaurant's Logo</h3>
                            {restaurant.logoUrl ? (
                                <img src={restaurant.logoUrl} alt="Logo" className="w-32 h-32 rounded-md object-cover" />
                            ) : (
                                <div className="w-32 h-32 bg-gray-400 rounded-md"></div>
                            )}
                            <button
                                onClick={() => window.location.href = `/restaurant-owner/settings`}
                                className="bg-[#ff9920] text-black font-bold py-1 px-4 rounded-md text-sm hover:bg-amber-500"
                            >
                                CHANGE
                            </button>
                        </div>
                        <div className="flex flex-col space-y-4 w-[60%]">
                            <div className="space-y-2">
                                <h3 className="font-bold text-gray-800 mb-2">Restaurant Information</h3>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-bold">Name:</span> {restaurant.name}</p>
                                    <p><span className="font-bold">Email:</span> {restaurant.email}</p>
                                    <p><span className="font-bold">Phone:</span> {restaurant.phone}</p>
                                    <p><span className="font-bold">Address:</span> {restaurant.address}</p>
                                    <p><span className="font-bold">City:</span> {restaurant.city}</p>
                                    <p><span className="font-bold">Postal Code:</span> {restaurant.postalCode}</p>
                                    <p><span className="font-bold">Status:</span> <span className={`font-bold ${restaurant.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>{restaurant.status?.toUpperCase()}</span></p>
                                </div>
                                <button
                                    onClick={() => window.location.href = `/restaurant-owner/settings`}
                                    className="bg-[#ff9920] text-black font-bold py-1 px-4 rounded-md text-sm hover:bg-amber-500 mt-2"
                                >
                                    EDIT SETTINGS
                                </button>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-gray-800 mb-1">Restaurant's Offering</h3>
                                <div className="text-sm">
                                    <p><span className="font-bold">Cuisine Types:</span> {restaurant.cuisineTypes?.join(', ') || 'N/A'}</p>
                                    <p><span className="font-bold">Description:</span> {restaurant.description || 'N/A'}</p>
                                    <p><span className="font-bold">Min Order Amount:</span> CHF {restaurant.minOrderAmount || restaurant.minPrice || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {myRestaurantTab === 'OPENING_TIME' && (
                <div className="p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Opening Hours</h3>
                    {restaurant.openingHours ? (
                        <div className="space-y-2 text-sm">
                            {Object.entries(restaurant.openingHours).map(([day, hours]: [string, any]) => (
                                <div key={day} className="flex justify-between items-center border-b pb-2">
                                    <span className="font-bold capitalize">{day}:</span>
                                    <span>{hours.open} - {hours.close}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No opening hours set</p>
                    )}
                    <button
                        onClick={() => window.location.href = `/restaurant-owner/settings`}
                        className="bg-[#ff9920] text-black font-bold py-1 px-4 rounded-md text-sm hover:bg-amber-500 mt-4"
                    >
                        EDIT OPENING HOURS
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyRestaurantViewConnected;
