"use client";
import { useState, useEffect } from "react";
import RegularButton from "@/app/components/RegularButton";

interface RestaurantInfoProps {
    restaurant?: any;
    loading?: boolean;
}

// Restaurant Information Component
const RestaurantInfo = ({ restaurant: propRestaurant, loading: propLoading }: RestaurantInfoProps) => {
    const [restaurant, setRestaurant] = useState<any>(propRestaurant || null);
    const [loading, setLoading] = useState<boolean>(propLoading !== undefined ? propLoading : true);
    const [restaurantId, setRestaurantId] = useState<string>("");

    useEffect(() => {
        if (propRestaurant !== undefined) {
            setRestaurant(propRestaurant);
        }
        if (propLoading !== undefined) {
            setLoading(propLoading);
        }
    }, [propRestaurant, propLoading]);

    useEffect(() => {
        // Get restaurant ID from localStorage or URL params
        if (!propRestaurant && !restaurant) {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userData = JSON.parse(userStr);
                fetchRestaurantData(userData.id);
            }
        }
    }, []);

    const fetchRestaurantData = async (ownerId: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            const response = await fetch(`/api/restaurants?ownerId=${ownerId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.restaurants && data.restaurants.length > 0) {
                    const restaurantData = data.restaurants[0];
                    setRestaurantId(restaurantData.id);
                    
                    // Fetch full details
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
        <div
            style={{ backgroundColor: '#E8D7B4' }}
            className="w-full max-w-[900px] min-h-[30rem] shadow-lg text-black opacity-70 mb-4 ml-auto mr-0 max-h-[95vh] overflow-y-auto mt-20 p-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                {/* Left Column - Contact and Location Information */}
                <div className="space-y-6">
                    {/* Restaurant Manager Information Section */}
                    <div>
                        <h3 className="text-sm font-bold text-green-800 mb-2">Restaurant's Manager</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold mb-1 text-brand-red-bright">Firstname</label>
                                <input
                                    type="text"
                                    className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-xs"
                                    defaultValue={restaurant.managerFirstName || ''}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1 text-brand-red-bright">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full px-1 py-1 bg-white border-2 border-amber-800 rounded-md text-xs"
                                    defaultValue={restaurant.managerLastName || ''}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1 text-brand-red-bright">E-Mail Address</label>
                                <input
                                    type="email"
                                    className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-xs"
                                    defaultValue={restaurant.email || ''}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1 text-secondary" >Telephone Number</label>
                                <input
                                    type="tel"
                                    className="w-full px-1 py-1 bg-white border-2 border-amber-800 rounded-md text-xs"
                                    defaultValue={restaurant.phone || ''}
                                />
                            </div>
                        </div>
                        <RegularButton 
                            text="CHANGE" 
                            fillColor="#264e19" 
                            borderColor="#264e19" 
                            fontColor="#ffffff"
                            className="mt-4"
                        />
                    </div>

                    {/* Restaurant Location Information Section */}
                    <div>
                        <h3 className="text-sm font-bold text-green-800 mb-2">Restaurant's Location</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold mb-1" style={{ color: '#8B1A1A' }}>Postal Code</label>
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-xs"
                                        defaultValue={restaurant.postalCode || ''}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1" style={{ color: '#8B1A1A' }}>City</label>
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-xs"
                                        defaultValue={restaurant.city || ''}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1" style={{ color: '#8B1A1A' }}>Street and House Number</label>
                                <input
                                    type="text"
                                    className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-xs"
                                    defaultValue={restaurant.address || ''}
                                />
                            </div>
                        </div>
                        <RegularButton 
                            text="CHANGE" 
                            fillColor="#264e19" 
                            borderColor="#264e19" 
                            fontColor="#ffffff"
                            className="mt-4"
                        />
                    </div>

                    {/* Restaurant Offering Section */}
                    <div>
                        <h3 className="text-sm font-bold text-green-800 mb-4">Restaurant's Offering</h3>
                        <div>
                            <label className="block text-xs font-bold mb-1" style={{ color: '#8B1A1A' }}>Country Specialty</label>
                            <select className="w-40 px-3 py-1 bg-white border-2 border-amber-800 rounded-md text-xs">
                                <option value="Kenyan">Kenyan</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Right Column - Branding and Type Information */}
                <div className="space-y-6">
                    {/* Restaurant Logo Section */}
                    <div className="flex flex-col items-start">
                        <h3 className="text-sm font-bold text-green-800 mb-4">Restaurant's Logo</h3>
                        <div className="w-64 h-40 bg-gray-600 rounded-md flex items-center justify-center">
                            {restaurant.logoUrl ? (
                                <img src={restaurant.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-md" />
                            ) : (
                                <span className="text-white text-xs">No Logo</span>
                            )}
                        </div>
                        <RegularButton 
                            text="CHANGE" 
                            fillColor="#264e19" 
                            borderColor="#264e19" 
                            fontColor="#ffffff"
                            className="mt-4"
                        />
                    </div>

                    {/* Restaurant Type Section */}
                    <div>
                        <div className="flex items-center gap-12">
                            <h3 className="text-sm font-bold text-green-800">Restaurant Type</h3>
                            <select className="w-32 px-3 py-1 bg-white border-2 border-amber-800 rounded-md text-xs">
                                <option value="Physical">Physical</option>
                                <option value="Online">Online</option>
                            </select>
                        </div>
                        <RegularButton 
                            text="CHANGE" 
                            fillColor="#264e19" 
                            borderColor="#264e19" 
                            fontColor="#ffffff"
                            className="mt-4"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantInfo;
