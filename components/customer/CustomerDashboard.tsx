"use client";

import { useState, useEffect } from 'react';
import { User, Package, Heart, Gift, Settings, MapPin, LogOut, Star, Clock, ChevronRight } from 'lucide-react';
import OrderHistory from './OrderHistory';
import ProfileSettings from './ProfileSettings';
import SavedAddresses from './SavedAddresses';
import FavoriteItems from './FavoriteItems';
import LoyaltyPoints from './LoyaltyPoints';

interface CustomerDashboardProps {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
    };
    onLogout: () => void;
}

type DashboardView = 'orders' | 'profile' | 'addresses' | 'favorites' | 'loyalty';

export default function CustomerDashboard({ user, onLogout }: CustomerDashboardProps) {
    const [currentView, setCurrentView] = useState<DashboardView>('orders');
    const [stats, setStats] = useState({
        totalOrders: 0,
        loyaltyPoints: 0,
        savedAddresses: 0,
        favorites: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, [user.id]);

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            };

            const [ordersRes, loyaltyRes, addressesRes, favoritesRes] = await Promise.all([
                fetch(`/api/customers/${user.id}/orders`, { headers }),
                fetch(`/api/customers/${user.id}/loyalty`, { headers }),
                fetch(`/api/customers/${user.id}/addresses`, { headers }),
                fetch(`/api/customers/${user.id}/favorites`, { headers })
            ]);

            const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] };
            const loyaltyData = loyaltyRes.ok ? await loyaltyRes.json() : { loyaltyPoints: { currentBalance: 0 } };
            const addressesData = addressesRes.ok ? await addressesRes.json() : { addresses: [] };
            const favoritesData = favoritesRes.ok ? await favoritesRes.json() : { favorites: [] };

            setStats({
                totalOrders: ordersData.orders?.length || 0,
                loyaltyPoints: loyaltyData.loyaltyPoints?.currentBalance || 0,
                savedAddresses: addressesData.addresses?.length || 0,
                favorites: favoritesData.favorites?.length || 0
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const menuItems = [
        { id: 'orders', label: 'Order History', icon: Package, count: stats.totalOrders },
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: stats.savedAddresses },
        { id: 'favorites', label: 'Favorites', icon: Heart, count: stats.favorites },
        { id: 'loyalty', label: 'Loyalty Points', icon: Gift, count: stats.loyaltyPoints },
    ];

    const renderContent = () => {
        switch (currentView) {
            case 'orders':
                return <OrderHistory userId={user.id} />;
            case 'profile':
                return <ProfileSettings user={user} />;
            case 'addresses':
                return <SavedAddresses userId={user.id} />;
            case 'favorites':
                return <FavoriteItems userId={user.id} />;
            case 'loyalty':
                return <LoyaltyPoints userId={user.id} />;
            default:
                return <OrderHistory userId={user.id} />;
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-10 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-900 to-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Welcome back, {user.firstName}!
                                </h1>
                                <p className="text-gray-500">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>

                    {/* Quick Stats */}
                    {!loading && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-amber-50 rounded-lg p-4 text-center">
                                <Package className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                                <p className="text-sm text-gray-500">Total Orders</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <Gift className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-800">{stats.loyaltyPoints}</p>
                                <p className="text-sm text-gray-500">Loyalty Points</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-800">{stats.savedAddresses}</p>
                                <p className="text-sm text-gray-500">Saved Addresses</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4 text-center">
                                <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-800">{stats.favorites}</p>
                                <p className="text-sm text-gray-500">Favorites</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <nav className="p-2">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setCurrentView(item.id as DashboardView)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                                            currentView === item.id
                                                ? 'bg-red-900 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon size={20} />
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                        {item.count !== undefined && (
                                            <span className={`text-sm px-2 py-0.5 rounded-full ${
                                                currentView === item.id
                                                    ? 'bg-white/20'
                                                    : 'bg-gray-200'
                                            }`}>
                                                {item.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
