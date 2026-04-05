"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import RestaurantOwnerDashboard from '@/components/restaurantOwnerDashboard';
import NotificationPanel from '@/components/NotificationPanel';
import CustomDropdown from '@/app/components/DropDown';

export default function RestaurantOwnerPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const languageSelectorRef = useRef<HTMLDivElement>(null);
    const languageOptions = ['EN', 'FR', 'ES'] as const;
    const [selectedLanguage, setSelectedLanguage] = useState<(typeof languageOptions)[number]>('EN');
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('ORDERS');
    const [myRestaurantTab, setMyRestaurantTab] = useState('RESTAURANT INFO');
    const [menuTab, setMenuTab] = useState('Main Dishes');
    const [orderStatusTab, setOrderStatusTab] = useState('ALL');
    const viewParam = searchParams.get('view');
    const requestedMenuTabParam = searchParams.get('menuTab');

    useEffect(() => {
        if (viewParam) {
            const allowedViews = ['ONBOARDING', 'OVERVIEW', 'MY RESTAURANT', 'MENU', 'ORDERS', 'PAYMENTS', 'SETTINGS'];
            if (allowedViews.includes(viewParam)) {
                setCurrentView(viewParam);
            }
        }

        if (requestedMenuTabParam) {
            const allowedMenuTabs = ['Main Dishes', 'DRINKS', 'SPECIAL DEALS'];
            if (allowedMenuTabs.includes(requestedMenuTabParam)) {
                setMenuTab(requestedMenuTabParam);
            }
        }
    }, [viewParam, requestedMenuTabParam]);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (!languageSelectorRef.current?.contains(event.target as Node)) {
                setIsLanguageDropdownOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsLanguageDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
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
            const normalizedLanguage = (userData.language ?? 'en').toUpperCase();
            if (normalizedLanguage === 'FR' || normalizedLanguage === 'ES') {
                setSelectedLanguage(normalizedLanguage);
            } else {
                setSelectedLanguage('EN');
            }
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
        <div className={`relative w-full min-h-screen bg-black text-white font-sans ${
            currentView === 'PAYMENTS' ? 'p-2 sm:p-8' : 'p-4 sm:p-8'
        } ${
            currentView === 'MENU'
                ? 'overflow-x-hidden sm:overflow-x-visible overflow-y-hidden'
                : currentView === 'ORDERS'
                    ? 'overflow-x-hidden overflow-y-hidden'
                    : 'overflow-hidden'
        }`}>
            {/* Language Selector and Notification */}
            <div className="absolute top-3 left-0 z-50 ml-1 flex items-center gap-2 sm:gap-4 origin-top scale-90 sm:scale-100">
                <div ref={languageSelectorRef} className="relative pointer-events-auto">
                    <button
                        type="button"
                        onClick={() => setIsLanguageDropdownOpen((open) => !open)}
                        className="relative bg-black text-white font-bold px-1 py-3 sm:py-4 pl-6 sm:pl-8 pr-6 sm:pr-8 rounded text-[10px] sm:text-xs cursor-pointer focus:outline-none focus:ring-0"
                        aria-label="Open language selector"
                    >
                        {selectedLanguage}
                        <ChevronDown
                            size={16}
                            strokeWidth={4}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 text-white transform transition-transform duration-300 ${
                                isLanguageDropdownOpen ? 'rotate-180' : 'rotate-0'
                            }`}
                        />
                    </button>
                    {isLanguageDropdownOpen && (
                        <div className="absolute left-0 mt-1 w-full rounded bg-black/95 border border-white/20 shadow-lg z-[60] overflow-hidden">
                            {languageOptions.map((language) => (
                                <button
                                    key={language}
                                    type="button"
                                    onClick={() => {
                                        setSelectedLanguage(language);
                                        setIsLanguageDropdownOpen(false);
                                    }}
                                    className="w-full px-3 py-2 text-left text-xs font-bold text-white hover:bg-white/10"
                                >
                                    {language}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="ml-8 sm:ml-32">
                    <NotificationPanel />
                </div>
            </div>

            {/* Portal and Login Information */}
            <div className="absolute top-2 -left-1 sm:left-0.5 z-20 origin-top-left scale-90 sm:scale-100">
                <div
                    className="text-white text-[9px] sm:text-xs font-bold mt-[3.75rem] sm:mt-20 px-[14px] sm:px-8 py-[5px] sm:py-2 border inline-block whitespace-nowrap"
                    style={{ backgroundColor: '#2F6B2F', borderColor: '#2F6B2F' }}
                >
                    EAT AFRICAN RESTAURANTS PORTAL
                </div>
                <div className="ml-4">
                    <div className="flex flex-row items-center -ml-2 gap-1 sm:gap-0">
                        <CustomDropdown
                            options={['ONBOARDING', 'OVERVIEW', 'MY RESTAURANT', 'MENU', 'ORDERS', 'PAYMENTS', 'SETTINGS']}
                            defaultOption={currentView}
                            backgroundColor="#2F6B2F"
                            onOptionSelect={(option) => setCurrentView(option)}
                        />
                        {currentView === 'MY RESTAURANT' && (
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
            <div className="absolute top-4 right-4 sm:right-12 z-50 w-fit flex items-center space-x-3 sm:space-x-6 origin-top-right scale-90 sm:scale-100">
                <button
                    onClick={handleLogout}
                    className="group flex items-center pointer-events-auto"
                >
                    <span className="relative text-[10px] sm:text-xs font-bold text-yellow-500 pr-3 sm:pr-4 pb-1">
                        LOGOUT
                        <span
                            className="absolute bottom-0 h-[1.5px] bg-white transition-all
                                       group-hover:bg-yellow-500"
                            style={{ left: '-1rem', width: 'calc(100% + 2rem)' }}
                        />
                    </span>
                    <span className="relative w-8 h-8 sm:w-10 sm:h-10 -ml-2 sm:-ml-3">
                        <Image
                            src="/images/UserIcon (1).png"
                            alt="Profile"
                            fill
                            className="object-contain"
                        />
                    </span>
                </button>
                <button className="relative w-7 h-7 sm:w-8 sm:h-8 hover:scale-110 transition pointer-events-auto">
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

            <div className={`relative z-10 origin-top ${
                (currentView === 'MY RESTAURANT' || currentView === 'MENU' || currentView === 'ORDERS') ? 'scale-100' : 'scale-90 sm:scale-100'
            }`}>
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












