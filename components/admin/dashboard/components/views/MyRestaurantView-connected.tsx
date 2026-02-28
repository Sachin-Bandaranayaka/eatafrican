"use client";
import { useState, useEffect } from "react";

interface MyRestaurantViewProps {
    restaurantId: string;
    myRestaurantTab: string;
    setMyRestaurantTab: (tab: string) => void;
}

const MyRestaurantViewConnected = ({ restaurantId, myRestaurantTab, setMyRestaurantTab }: MyRestaurantViewProps) => {
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
            {myRestaurantTab === 'RESTAURANT_INFORMATION' && (
                <div
                    style={{ backgroundColor: '#E8D7B4' }}
                    className="w-full max-w-[900px] min-h-[30rem] shadow-lg text-black opacity-70 mb-4 ml-auto mr-0 max-h-[95vh] overflow-y-auto mt-20 p-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Restaurant's Manager */}
                            <div>
                                <h3 className="text-lg font-bold text-green-800 mb-4">Restaurant's Manager</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={{ color: '#8B1A1A' }}>Firstname</label>
                                        <input
                                            type="text"
                                            className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-sm"
                                            defaultValue={restaurant.managerFirstName || ''}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={{ color: '#8B1A1A' }}>Last Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-sm"
                                            defaultValue={restaurant.managerLastName || ''}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={{ color: '#8B1A1A' }}>E-Mail Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-sm"
                                            defaultValue={restaurant.email || ''}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={{ color: '#8B1A1A' }}>Telephone Number</label>
                                        <input
                                            type="tel"
                                            className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-sm"
                                            defaultValue={restaurant.phone || ''}
                                        />
                                    </div>
                                </div>
                                <button className="mt-4 bg-green-800 text-white uppercase text-sm font-bold py-2 px-4 rounded-full hover:bg-green-700">
                                    CHANGE
                                </button>
                            </div>

                            {/* Restaurant's Location */}
                            <div>
                                <h3 className="text-lg font-bold text-green-800 mb-4">Restaurant's Location</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1" style={{ color: '#8B1A1A' }}>Postal Code</label>
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-sm"
                                                defaultValue={restaurant.postalCode || ''}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1" style={{ color: '#8B1A1A' }}>City</label>
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-sm"
                                                defaultValue={restaurant.city || ''}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={{ color: '#8B1A1A' }}>Street and House Number</label>
                                        <input
                                            type="text"
                                            className="w-full px-2 py-1 bg-white border-2 border-amber-800 rounded-md text-sm"
                                            defaultValue={restaurant.address || ''}
                                        />
                                    </div>
                                </div>
                                <button className="mt-4 bg-green-800 text-white uppercase text-sm font-bold py-2 px-4 rounded-full hover:bg-green-700">
                                    CHANGE
                                </button>
                            </div>

                            {/* Restaurant Type */}
                            <div>
                                <h3 className="text-lg font-bold text-green-800 mb-4">Restaurant Type</h3>
                                <div className="flex justify-end">
                                    <select className="w-32 px-3 py-2 bg-white border-2 border-amber-800 rounded-md text-sm">
                                        <option value="Physical">Physical</option>
                                        <option value="Online">Online</option>
                                    </select>
                                </div>
                                <button className="mt-4 bg-green-800 text-white uppercase text-sm font-bold py-2 px-4 rounded-full hover:bg-green-700">
                                    CHANGE
                                </button>
                            </div>

                            {/* Restaurant's Offering */}
                            <div>
                                <h3 className="text-lg font-bold text-green-800 mb-4">Restaurant's Offering</h3>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: '#8B1A1A' }}>Country Specialty</label>
                                    <select className="w-40 px-3 py-2 bg-white border-2 border-amber-800 rounded-md text-sm">
                                        <option value="Kenyan">Kenyan</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col items-center">
                            <h3 className="text-lg font-bold text-green-800 mb-4 text-center">Restaurant's Logo</h3>
                            <div className="w-64 h-40 bg-gray-600 rounded-md flex items-center justify-center">
                                {restaurant.logoUrl ? (
                                    <img src={restaurant.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-md" />
                                ) : (
                                    <span className="text-white text-sm">No Logo</span>
                                )}
                            </div>
                            <button className="mt-4 bg-green-800 text-white uppercase text-sm font-bold py-2 px-4 rounded-full hover:bg-green-700">
                                CHANGE
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {myRestaurantTab === 'OPENING_TIME' && (
                <div
                    style={{ backgroundColor: '#E8D7B4' }}
                    className="w-full max-w-[900px] min-h-[30rem] shadow-lg text-black opacity-70 mb-4 ml-auto mr-0 max-h-[95vh] overflow-y-auto mt-20 p-6"
                >
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Left Side: Weekly Schedule */}
                        <div className="flex-1 space-y-4">
                            <div className="space-y-3">
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                    <div key={day} className="flex items-center justify-between">
                                        <span className="font-medium text-gray-800">{day}</span>
                                        <div className="flex items-center gap-3">
                                            <button className="bg-amber-800 text-white uppercase text-xs font-bold py-1 px-3 rounded-full hover:bg-amber-700">
                                                EDIT
                                            </button>
                                            <input type="checkbox" className="w-4 h-4 border-2 border-orange-500 rounded" />
                                            <span className="text-sm text-gray-700">Closed</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="bg-amber-800 text-white uppercase text-sm font-bold py-2 px-6 rounded-full hover:bg-amber-700 mt-6">
                                SUBMIT FOR REVIEW
                            </button>
                        </div>

                        {/* Right Side: Guideline */}
                        <div className="flex-1">
                            <h3 className="text-orange-600 font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="text-xl">ℹ️</span>
                                Opening Hours Guideline
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>• Set an opening time for each day or mark the day as Closed 😊</li>
                                <li>• Make sure opening time is earlier than closing time</li>
                                <li>• Restaurant must be opened a minimum of 6 hours</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyRestaurantViewConnected;
