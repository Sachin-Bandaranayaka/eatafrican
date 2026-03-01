"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import RestaurantOwnerDashboard from '@/components/restaurantOwnerDashboard';
import NotificationPanel from '@/components/NotificationPanel';
import CustomDropdown from '@/app/components/DropDown';

export default function RestaurantOwnerPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('ORDERS');
    const [myRestaurantTab, setMyRestaurantTab] = useState('RESTAURANT INFO');
    const [menuTab, setMenuTab] = useState('Main Dishes');
    const [orderStatusTab, setOrderStatusTab] = useState('ALL');

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
            {/* Language Selector and Notification */}
            <div className="absolute top-3 left-0 z-50 ml-10 flex items-center gap-4">
                <div className="flex items-center pointer-events-auto">
                    <select className="bg-black text-white font-bold px-1 py-4 pl-8 rounded text-xs appearance-none cursor-pointer">
                        <option value="en">EN</option>
                        <option value="fr">FR</option>
                        <option value="es">ES</option>
                    </select>
                    <ChevronDown size={18} strokeWidth={4} className="text-white ml-1" />
                </div>
                <NotificationPanel />
            </div>

            {/* Portal and Login Information */}
            <div className="absolute top-2 left-0.5 z-20">
                <div
                    className="text-white text-xs font-bold mt-20 px-2 py-2 border w-80 whitespace-nowrap"
                    style={{ backgroundColor: '#2F6B2F', borderColor: '#2F6B2F' }}
                >
                    EAT AFRICAN RESTAURANTS PORTAL
                </div>
                <div className="ml-4">
                    <div className="flex flex-row items-center -ml-2">
                        <CustomDropdown
                            options={['ONBOARDING', 'OVERVIEW', 'RESTAURANT INFO', 'MENU', 'ORDERS', 'PAYMENTS', 'OPENING HOURS', 'TEAM MANAGEMENT', 'ACCOUNT', 'SETTINGS']}
                            defaultOption={currentView}
                            backgroundColor="#2F6B2F"
                            onOptionSelect={(option) => setCurrentView(option)}
                        />
                        {currentView === 'RESTAURANT INFO' && (
                            <CustomDropdown
                                options={['RESTAURANT INFO', 'OPENING HOURS']}
                                defaultOption={myRestaurantTab}
                                backgroundColor="#ff9920"
                                textColor="#000000"
                                onOptionSelect={(option) => setMyRestaurantTab(option)}
                            />
                        )}
                        {currentView === 'MENU' && (
                            <CustomDropdown
                                options={['Main Dishes', 'DRINKS', 'SPECIAL DEALS']}
                                defaultOption={menuTab}
                                backgroundColor="#ff9920"
                                textColor="#000000"
                                onOptionSelect={(option) => setMenuTab(option)}
                            />
                        )}
                        {currentView === 'ORDERS' && (
                            <CustomDropdown
                                options={['ALL', 'NEW', 'PROCESSING', 'IN TRANSIT', 'CANCELLED', 'COMPLETED']}
                                defaultOption={orderStatusTab}
                                backgroundColor="#ff9920"
                                textColor="#000000"
                                onOptionSelect={(option) => setOrderStatusTab(option)}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Top Right Buttons */}
            <div className="absolute top-4 right-12 z-50 w-fit flex items-center space-x-6">
                <button
                    onClick={handleLogout}
                    className="group flex items-center pointer-events-auto"
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
                <button className="relative w-8 h-8 hover:scale-110 transition pointer-events-auto">
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
                    orderStatusTab={orderStatusTab}
                    setOrderStatusTab={setOrderStatusTab}
                />
            </div>
        </div>
    );
}
