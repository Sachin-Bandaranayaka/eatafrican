"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Heart, Search, ChevronDown, Plus, Minus, Share, Share2, X } from "lucide-react";
import RestaurantList from "./restaurant-list";
import { useCart } from "@/lib/cart-context";

function ItemQuantitySelector({ quantity, setQuantity }: { quantity: number; setQuantity: (q: number) => void }) {
    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 rounded-full bg-amber-300 hover:bg-amber-400 transition"
                aria-label="Decrease quantity"
            >
                <Minus size={12} className="xs:size-16" />
            </button>
            <span className="w-6 text-center font-semibold text-xs xs:text-base">{quantity}</span>
            <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 rounded-full bg-amber-300 hover:bg-amber-400 transition"
                aria-label="Increase quantity"
            >
                <Plus size={12} className="xs:size-16" />
            </button>
        </div>
    );
}

export default function UserDashboardComponent({ onClose }: { onClose: () => void }) {
    const { addItem } = useCart();
    const [currentView, setCurrentView] = useState('orders');
    const [showRestaurantList, setShowRestaurantList] = useState(false);
    const [showArrow, setShowArrow] = useState(false);
    const dashboardRef = useRef(null);

    // Data states
    const [orders, setOrders] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loyaltyPoints, setLoyaltyPoints] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Account management states
    const [personalInfoState, setPersonalInfoState] = useState('initial');
    const [deliveryAddressState, setDeliveryAddressState] = useState('initial');
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [accountStatus, setAccountStatus] = useState('active');

    // Loyalty states
    const [redeemedState, setRedeemedState] = useState<Record<number, boolean>>({});
    const [isRewardActive, setIsRewardActive] = useState(false);
    const [isLinkCopied, setIsLinkCopied] = useState(false);

    // Get user ID from localStorage or auth context
    const getUserId = () => {
        // You should get this from your auth context
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            return user.id;
        }
        return null;
    };

    // Fetch user data
    useEffect(() => {
        const userId = getUserId();
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('accessToken');
                const headers = {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                };

                // Fetch all user data in parallel
                const [ordersRes, favoritesRes, loyaltyRes, userRes] = await Promise.all([
                    fetch(`/api/customers/${userId}/orders`, { headers }),
                    fetch(`/api/customers/${userId}/favorites`, { headers }),
                    fetch(`/api/customers/${userId}/loyalty`, { headers }),
                    fetch(`/api/customers/${userId}`, { headers })
                ]);

                if (ordersRes.ok) {
                    const data = await ordersRes.json();
                    setOrders(data.orders || []);
                }

                if (favoritesRes.ok) {
                    const data = await favoritesRes.json();
                    setFavorites(data.favorites || []);
                }

                if (loyaltyRes.ok) {
                    const data = await loyaltyRes.json();
                    setLoyaltyPoints(data.loyaltyPoints);
                }

                if (userRes.ok) {
                    const data = await userRes.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleRemoveFavorite = async (menuItemId: string) => {
        const userId = getUserId();
        if (!userId) return;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`/api/customers/${userId}/favorites/${menuItemId}`, {
                method: 'DELETE',
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (response.ok) {
                setFavorites(favorites.filter(fav => fav.menuItemId !== menuItemId));
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    const handleAddToCart = (favorite: any, quantity: number) => {
        addItem({
            id: `${favorite.menuItemId}-${Date.now()}`,
            menuItemId: favorite.menuItemId,
            name: favorite.menuItem.name,
            description: favorite.menuItem.description,
            price: favorite.menuItem.price,
            quantity,
            image: favorite.menuItem.imageUrl,
            restaurantId: favorite.menuItem.restaurantId,
            restaurantName: favorite.restaurant?.name || 'Restaurant',
        });
    };

    const handleRedeem = async (points: number) => {
        const userId = getUserId();
        if (!userId) return;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`/api/customers/${userId}/loyalty/redeem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({ points })
            });

            if (response.ok) {
                const data = await response.json();
                setRedeemedState(prevState => ({ ...prevState, [points]: true }));
                setIsRewardActive(true);
                // Refresh loyalty points
                const loyaltyRes = await fetch(`/api/customers/${userId}/loyalty`, {
                    headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
                });
                if (loyaltyRes.ok) {
                    const loyaltyData = await loyaltyRes.json();
                    setLoyaltyPoints(loyaltyData.loyaltyPoints);
                }
                alert(`Voucher code: ${data.voucherCode}`);
            }
        } catch (error) {
            console.error('Error redeeming points:', error);
        }
    };

    const handleCopyLink = () => {
        if (loyaltyPoints?.referralCode) {
            navigator.clipboard.writeText(`eatafrican.ch?ref=${loyaltyPoints.referralCode}`);
            setIsLinkCopied(true);
            setTimeout(() => setIsLinkCopied(false), 2000);
        }
    };

    const rewards = [
        { discount: "10% DISCOUNT", points: 100 },
        { discount: "20% DISCOUNT", points: 200 },
        { discount: "50% DISCOUNT", points: 500 },
    ];

    useEffect(() => {
        const checkOverflow = () => {
            if (dashboardRef.current) {
                const isOverflowing = (dashboardRef.current as HTMLDivElement).scrollHeight > window.innerHeight;
                setShowArrow(isOverflowing);
            }
        };
        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [showRestaurantList, currentView, accountStatus]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col">
                <div
                    ref={dashboardRef}
                    className="z-0 w-[100%] bg-transparent xs:p-6 flex flex-col md:flex-row space-y-4 xs:space-y-6 md:space-y-0 md:space-x-6 font-sans text-gray-900 -mt-[80%] md:mt-0 ml-3"
                >
                    {showRestaurantList ? (
                        <RestaurantList />
                    ) : (
                        <main className="md:w-[95%] p-2 md:p-0 flex flex-col space-y-4 xs:space-y-6">
                            {/* Dashboard header */}
                            <header className="flex flex-row justify-between items-center mr-2">
                                <div className="flex items-start">
                                    <div
                                        className="relative rounded-xl"
                                        style={{
                                            backgroundImage: 'url("/images/Restaurant Info_Bckimg.png")',
                                            backgroundSize: "cover",
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            border: "2px solid #f1c232",
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0 rounded-xl"
                                            style={{
                                                backgroundColor: "#f1c232ff",
                                                opacity: '80%',
                                                zIndex: 1,
                                            }}
                                        ></div>
                                        <div className="relative z-10 flex flex-row w-full p-[8%] mr-10">
                                            <div className="pt-[1%] pb-[1%] pl-0 text-white flex flex-col space-y-0 w-full">
                                                <div className="relative z-10 ml-2">
                                                    <h1 className="text-[#274e13] text-[8px] md:text-[13px] font-bold lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">
                                                        Hello {user?.firstName || 'User'}
                                                    </h1>
                                                    <h1 className="text-[#274e13] text-[8px] md:text-[13px] font-bold lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">
                                                        Welcome to your dashboard
                                                    </h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation buttons */}
                                <div className="flex flex-col items-center -mr-3 md:-mr-10 md:items-end space-y-3">
                                    <div className="flex flex-wrap justify-center md:justify-end gap-2">
                                        <button
                                            onClick={() => setCurrentView('orders')}
                                            className={`${currentView === 'orders' ? 'bg-amber-900' : 'bg-red-900'} text-white rounded-[9px] w-12 md:w-20 border-2 border-white py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold hover:bg-amber-900 transition duration-200 whitespace-nowrap`}
                                        >
                                            ORDERS
                                        </button>
                                        <button
                                            onClick={() => setCurrentView('favourites')}
                                            className={`${currentView === 'favourites' ? 'bg-amber-900' : 'bg-red-900'} text-white rounded-[9px] w-12 md:w-20 border-2 border-white py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold hover:bg-amber-900 transition duration-200 whitespace-nowrap`}
                                        >
                                            FAVOURITES
                                        </button>
                                        <button
                                            onClick={() => setCurrentView('loyalty')}
                                            className={`${currentView === 'loyalty' ? 'bg-amber-900' : 'bg-red-900'} text-white rounded-[9px] w-12 md:w-auto border-2 border-white py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold hover:bg-amber-900 transition duration-200 whitespace-nowrap`}
                                        >
                                            LOYALTY POINTS
                                        </button>
                                        <button
                                            onClick={() => setCurrentView('account')}
                                            className={`${currentView === 'account' ? 'bg-amber-900' : 'bg-red-900'} text-white rounded-[9px] w-12 md:w-20 border-2 border-white py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] font-semibold hover:bg-amber-900 transition duration-200 whitespace-nowrap`}
                                        >
                                            ACCOUNT
                                        </button>
                                    </div>
                                </div>
                            </header>

                            {/* Orders View */}
                            {currentView === 'orders' && (
                                <section className="flex flex-col w-[102%] space-y-3 z-10">
                                    {orders.length === 0 ? (
                                        <p className="text-center text-white py-10">No orders yet</p>
                                    ) : (
                                        orders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="flex flex-col shadow-md overflow-hidden border-2 border-[#f1c232] relative -mt-2"
                                                style={{
                                                    backgroundImage: 'url("/images/Box_Restaurant_BckgImg01.png")',
                                                    backgroundSize: "contain",
                                                    backgroundPosition: "center",
                                                    borderRadius: "10px",
                                                }}
                                            >
                                                <div
                                                    className="absolute inset-0"
                                                    style={{
                                                        backgroundColor: "#783f04ff",
                                                        opacity: '70%',
                                                        zIndex: 1,
                                                        borderRadius: "8px"
                                                    }}
                                                ></div>
                                                <div className="relative z-10 w-auto">
                                                    <div className="flex flex-row w-auto">
                                                        <div className="m-[1%] p-2 w-3/4 h-auto flex flex-col justify-between text-gray-500 text-[10px] xs:text-sm rounded-[10px] xs:mr-4">
                                                            <div className="flex flex-row mb-2 items-baseline">
                                                                <h3 className="text-[9px] md:text-[15px] font-bold text-white">
                                                                    Order #{order.id.slice(0, 8)}
                                                                </h3>
                                                                <h3 className="text-[7px] md:text-[14px] text-white ml-4">
                                                                    {order.status}
                                                                </h3>
                                                            </div>
                                                            <p className="text-[10px] md:text-[12px] font-base text-white">
                                                                {order.restaurant?.name}
                                                            </p>
                                                            <p className="text-[10px] md:text-[12px] text-white">
                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                            </p>
                                                            <p className="text-[10px] md:text-[12px] text-white">
                                                                {order.orderItems?.length || 0} items
                                                            </p>
                                                        </div>
                                                        <div className="p-[1%] flex flex-col justify-between items-end w-1/4">
                                                            <div className="flex items-end mb-1">
                                                                <span className="text-[9px] md:text-[15px] xs:text-sm sm:text-lg font-bold text-white">
                                                                    Fr. {order.totalAmount.toFixed(2)}.-
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </section>
                            )}

                            {/* Favorites View */}
                            {currentView === 'favourites' && (
                                <section className="flex flex-col w-[102%] space-y-3 z-10">
                                    {favorites.length === 0 ? (
                                        <p className="text-center text-white py-10">No favorites yet</p>
                                    ) : (
                                        favorites.map((favorite) => (
                                            <div
                                                key={favorite.id}
                                                className="flex flex-col shadow-md overflow-hidden border-2 border-[#f1c232] relative -mt-2"
                                                style={{
                                                    backgroundImage: 'url("/images/Box_Restaurant_BckgImg01.png")',
                                                    backgroundSize: "contain",
                                                    backgroundPosition: "center",
                                                    borderRadius: "10px",
                                                }}
                                            >
                                                <div
                                                    className="absolute inset-0"
                                                    style={{
                                                        backgroundColor: "#783f04ff",
                                                        opacity: '70%',
                                                        zIndex: 1,
                                                        borderRadius: "8px"
                                                    }}
                                                ></div>
                                                <div className="relative z-10 w-auto">
                                                    <div className="flex flex-row w-auto">
                                                        <div className="m-[1%] w-1/2 h-auto bg-gray-200 flex items-start justify-start text-gray-500 text-[10px] xs:text-sm font-semibold rounded-[10px] border border-amber-400 xs:mr-4">
                                                            {favorite.menuItem?.imageUrl && (
                                                                <img 
                                                                    src={favorite.menuItem.imageUrl} 
                                                                    alt={favorite.menuItem.name}
                                                                    className="w-full h-full object-cover rounded-[10px]"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="p-[1%] w-1/2 flex flex-col justify-around">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <h3 className="text-[10px] md:text-[15px] font-bold text-[#ebeb48]">
                                                                    {favorite.menuItem?.name}
                                                                </h3>
                                                            </div>

                                                            <div className="flex flex-col w-[100%] items-between justify-between">
                                                                <div className="w-full flex flex-row items-between justify-between">
                                                                    <p className="text-[9px] md:text-[14px] mb-1 text-[#ebeb48] w-1/3">Restaurant</p>
                                                                    <p className="text-[9px] md:text-[14px] mb-1 text-white w-2/3">{favorite.restaurant?.name}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between md:mt-[1%] space-x-4">
                                                                <div className="flex items-center space-x-6 xs:space-x-4">
                                                                    <button 
                                                                        onClick={() => handleAddToCart(favorite, 1)}
                                                                        className="bg-[#670402] text-white py-[3%] px-3 border border-amber-400 rounded-[10px] font-semibold transition duration-200 whitespace-nowrap text-[8px] md:text-[10px]"
                                                                    >
                                                                        ADD TO CART
                                                                    </button>
                                                                    <span className="text-[8px] md:text-[15px] xs:text-sm sm:text-lg text-white">
                                                                        Fr. {favorite.menuItem?.price.toFixed(2)}.-
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center space-x-4">
                                                                    <button 
                                                                        onClick={() => handleRemoveFavorite(favorite.menuItemId)}
                                                                        className="relative p-0 text-green-600 hover:text-green-800 transition rounded-lg"
                                                                    >
                                                                        <img
                                                                            src="/images/recycleBin.png"
                                                                            alt="Remove favorite"
                                                                            style={{ width: 20, height: 20 }}
                                                                            className="w-auto h-auto md:w-14 md:h-14"
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </section>
                            )}

                            {/* Loyalty Points View */}
                            {currentView === 'loyalty' && loyaltyPoints && (
                                <section className="flex flex-col w-[102%] space-y-3 z-10">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border-2 border-[#f1c232]">
                                        <h2 className="text-2xl font-bold text-white mb-4">Your Loyalty Points</h2>
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-amber-900/50 rounded-lg p-4">
                                                <p className="text-white text-sm">Current Balance</p>
                                                <p className="text-3xl font-bold text-[#ebeb48]">{loyaltyPoints.currentBalance}</p>
                                            </div>
                                            <div className="bg-amber-900/50 rounded-lg p-4">
                                                <p className="text-white text-sm">Lifetime Points</p>
                                                <p className="text-3xl font-bold text-[#ebeb48]">{loyaltyPoints.lifetimePoints}</p>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-xl font-bold text-white mb-3">Redeem Rewards</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {rewards.map((reward) => (
                                                    <div key={reward.points} className="bg-white/10 rounded-lg p-4 border border-amber-400">
                                                        <p className="text-[#ebeb48] font-bold text-lg">{reward.discount}</p>
                                                        <p className="text-white text-sm mb-3">{reward.points} points</p>
                                                        <button
                                                            onClick={() => handleRedeem(reward.points)}
                                                            disabled={loyaltyPoints.currentBalance < reward.points || redeemedState[reward.points]}
                                                            className={`w-full py-2 rounded-full text-sm font-bold ${
                                                                loyaltyPoints.currentBalance >= reward.points && !redeemedState[reward.points]
                                                                    ? 'bg-red-900 text-white hover:bg-red-800'
                                                                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            {redeemedState[reward.points] ? 'REDEEMED' : 'REDEEM'}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {loyaltyPoints.referralCode && (
                                            <div className="bg-white/10 rounded-lg p-4 border border-amber-400">
                                                <h3 className="text-xl font-bold text-white mb-2">Refer a Friend</h3>
                                                <p className="text-white text-sm mb-3">Share your referral code and earn points!</p>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={`eatafrican.ch?ref=${loyaltyPoints.referralCode}`}
                                                        readOnly
                                                        className="flex-1 p-2 rounded bg-white/20 text-white border border-amber-400"
                                                    />
                                                    <button
                                                        onClick={handleCopyLink}
                                                        className="bg-red-900 text-white px-4 py-2 rounded font-bold hover:bg-red-800"
                                                    >
                                                        {isLinkCopied ? 'COPIED!' : 'COPY'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* Account View - Simplified */}
                            {currentView === 'account' && user && (
                                <section className="flex flex-col w-[102%] space-y-3 z-10">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border-2 border-[#f1c232]">
                                        <h2 className="text-2xl font-bold text-white mb-4">Account Information</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-white text-sm">Name</label>
                                                <p className="text-[#ebeb48] text-lg">{user.firstName} {user.lastName}</p>
                                            </div>
                                            <div>
                                                <label className="text-white text-sm">Email</label>
                                                <p className="text-[#ebeb48] text-lg">{user.email}</p>
                                            </div>
                                            <div>
                                                <label className="text-white text-sm">Phone</label>
                                                <p className="text-[#ebeb48] text-lg">{user.phone || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <label className="text-white text-sm">Language</label>
                                                <p className="text-[#ebeb48] text-lg">{user.languagePreference || 'English'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </main>
                    )}
                </div>
            </div>
        </>
    );
}
