"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import RestaurantOwnerDashboard from '@/components/restaurantOwnerDashboard';

export default function RestaurantOwnerPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('ORDERS');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [myRestaurantTab, setMyRestaurantTab] = useState('RESTAURANT_INFORMATION');
    const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
    const [menuTab, setMenuTab] = useState('MEALS');
    const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);

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
        <div className="relative w-full min-h-screen bg-black text-white overflow-hidden font-sans p-8">
            {/* Language Selector */}
            <div className="absolute top-3 left-0 z-20 ml-10">
                <div className="flex items-center">
                    <select className="bg-black text-white font-bold px-1 py-4 pl-8 rounded text-xs appearance-none">
                        <option value="en">EN</option>
                        <option value="fr">FR</option>
                        <option value="es">ES</option>
                    </select>
                    <ChevronDown size={18} strokeWidth={4} className="text-white ml-1" />
                </div>
            </div>

            {/* Portal and Login Information */}
            <div className="absolute top-2 left-0.5 z-20">
                 <div
       className="text-white text-sm font-bold mt-20 px-2 py-2 border w-68"
       style={{ backgroundColor: '#2F6B2F', borderColor: '#2F6B2F' }}
     >
       EAT AFRICAN RESTAURANTS PORTAL
     </div>

                <div className="flex items-center gap-1 font-bold text-xs mt-8 ml-2 pl-4">
                    <div className="relative">
                        <button
   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
   style={{ backgroundColor: '#2F6B2F' }}
   className="text-white px-3 py-1 rounded flex items-center justify-between w-32"
 >
   <span className="truncate whitespace-nowrap overflow-hidden">
     {currentView}
   </span>
   <ChevronDown size={18} strokeWidth={4} />
 </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 -mt-2 pt-2 w-36 bg-green-900 text-white rounded-bl-[9px] rounded-br-[9px] shadow-lg z-50">
                                {['ORDERS', 'MENU', 'EARNINGS', 'MY RESTAURANT', 'TEAM MANAGEMENT', 'ACCOUNT'].map(view => (
                                    <button
                                        key={view}
                                        onClick={() => {
                                            setCurrentView(view);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-2 h-8 text-[12px] font-semibold hover:bg-gray-600 flex items-center"
                                    >
                                        {view}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                   {currentView === 'MY RESTAURANT' && (
                        <div className="relative ml-4">
                            <button
                                onClick={() => setIsSubDropdownOpen(!isSubDropdownOpen)}
                                style={{ backgroundColor: '#ff9920' }}
                                className="text-black px-3 py-1 rounded flex items-center justify-between w-40"
                            >
                                <span className="truncate">{myRestaurantTab === 'RESTAURANT_INFORMATION' ? 'RESTAURANT INFO' : 'OPENING TIME'}</span>
                                <ChevronDown size={18} strokeWidth={4} className="ml-2" />
                            </button>
                            {isSubDropdownOpen && (
                                <div className="absolute top-full left-0 -mt-2 pt-2 w-36 text-black rounded-bl-[9px] rounded-br-[9px] shadow-lg z-50" style={{ backgroundColor: '#ff9920' }}>
                                    {['RESTAURANT_INFORMATION', 'OPENING_TIME'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => {
                                                setMyRestaurantTab(tab);
                                                setIsSubDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-2 h-8 text-[12px] font-semibold hover:bg-orange-300 flex items-center"
                                        >
                                            {tab === 'RESTAURANT_INFORMATION' ? 'RESTAURANT INFO' : 'OPENING TIME'}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    
                    )}

                    {currentView === 'MENU' && (
                        <div className="relative ml-4">
                            <button
                                onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                                style={{ backgroundColor: '#ff9920' }}
                                className="text-black px-3 py-1 rounded flex items-center justify-between w-32"
                            >
                                <span className="truncate">{menuTab}</span>
                                <ChevronDown size={18} strokeWidth={4} className="ml-2" />
                            </button>
                            {isMenuDropdownOpen && (
                                <div className="absolute top-full left-0 -mt-2 pt-2 w-36 text-black rounded-bl-[9px] rounded-br-[9px] shadow-lg z-50" style={{ backgroundColor: '#ff9920' }}>
                                    {['MEALS', 'DRINKS', 'SPECIAL DEALS'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => {
                                                setMenuTab(tab);
                                                setIsMenuDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-2 h-8 text-[12px] font-semibold hover:bg-orange-300 flex items-center"
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Top Right Buttons */}
            <div className="absolute top-4 right-12 z-20 w-fit flex items-center space-x-6">
                <button
                    onClick={handleLogout}
                    className="group flex items-center"
                >
                    <span className="relative text-xs font-bold text-yellow-500 pr-4 pb-1">
                        LOGOUT
                        <span
                            className="absolute bottom-0 h-[1.5px] bg-white transition-all
                                       group-hover:bg-yellow-500"
                            style={{ left: '-1rem', width: 'calc(100% + 2rem)' }}
                        />
                    </span>

                    <span className="relative w-10 h-10 -ml-3">
                        <Image
                            src="/images/UserIcon (1).png"
                            alt="Profile"
                            fill
                            className="object-contain"
                        />
                    </span>
                </button>

                <button className="relative w-8 h-8 hover:scale-110 transition">
                    <Image src="/images/cart_icon.png" alt="Cart" fill className="object-contain" />
                </button>
            </div>

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/eatafricanbck1.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            </div>

            <div className="relative z-10">
                <RestaurantOwnerDashboard
                    restaurantId={restaurant.id}
                    onLogout={handleLogout}
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    myRestaurantTab={myRestaurantTab}
                    setMyRestaurantTab={setMyRestaurantTab}
                    menuTab={menuTab}
                    setMenuTab={setMenuTab}
                />
            </div>
        </div>
    );
}

