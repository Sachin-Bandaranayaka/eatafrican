"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RestaurantOwnerDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [restaurant, setRestaurant] = useState<any>(null);
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'orders'>('overview');

    useEffect(() => {
        console.log('RestaurantOwnerDashboard mounted');
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            const userStr = localStorage.getItem('user');

            console.log('Token:', token ? 'Found' : 'Not found');
            console.log('User string:', userStr);

            if (!token || !userStr) {
                console.log('Missing token or user, redirecting...');
                alert('Please login first');
                router.push('/');
                return;
            }

            const userData = JSON.parse(userStr);
            console.log('User data:', userData);
            
            if (userData.role !== 'restaurant_owner') {
                alert('Access denied. Restaurant owners only. Your role: ' + userData.role);
                router.push('/');
                return;
            }

            setUser(userData);
            await fetchRestaurant(token, userData.id);
        } catch (error) {
            console.error('Auth error:', error);
            alert('Authentication error: ' + error);
            router.push('/');
        }
    };

    const fetchRestaurant = async (token: string, ownerId: string) => {
        try {
            console.log('Fetching restaurant for owner:', ownerId);
            // Fetch restaurant owned by this user
            const response = await fetch(`/api/restaurants?ownerId=${ownerId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Restaurant API response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Restaurant API error:', errorData);
                throw new Error('Failed to fetch restaurant');
            }

            const data = await response.json();
            console.log('Restaurant API data:', data);
            
            if (data.restaurants && data.restaurants.length > 0) {
                const restaurantData = data.restaurants[0];
                
                // Fetch full restaurant details using the restaurant ID
                const detailsResponse = await fetch(`/api/restaurants/${restaurantData.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (detailsResponse.ok) {
                    const detailsData = await detailsResponse.json();
                    console.log('Full restaurant details:', detailsData);
                    setRestaurant(detailsData.restaurant || detailsData);
                    await fetchMenuItems(token, restaurantData.id);
                } else {
                    // Fallback to basic data
                    console.log('Restaurant found (basic):', restaurantData);
                    setRestaurant(restaurantData);
                    await fetchMenuItems(token, restaurantData.id);
                }
            } else {
                console.log('No restaurant found for this owner');
            }
        } catch (error) {
            console.error('Error fetching restaurant:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMenuItems = async (token: string, restaurantId: string) => {
        try {
            console.log('Fetching menu items for restaurant:', restaurantId);
            const response = await fetch(`/api/restaurants/${restaurantId}/menu`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Menu API response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Menu API data:', data);
                // API returns 'items', not 'menuItems'
                const items = data.items || data.menuItems || [];
                setMenuItems(items);
                console.log('Menu items set:', items.length);
            }
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const fetchOrders = async () => {
        if (!restaurant?.id) return;
        
        setOrdersLoading(true);
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            const response = await fetch(`/api/restaurants/${restaurant.id}/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setOrdersLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Refresh orders
                await fetchOrders();
                const statusMessage = newStatus === 'ready_for_pickup' 
                    ? 'Order marked as ready! Drivers can now see and accept this order.'
                    : 'Order status updated successfully';
                alert(statusMessage);
            } else {
                alert('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Error updating order status');
        }
    };

    useEffect(() => {
        if (activeTab === 'orders' && restaurant?.id) {
            fetchOrders();
        }
    }, [activeTab, restaurant?.id]);

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
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 pt-20">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{restaurant.name}</h1>
                            <p className="text-gray-600">
                                Status: <span className={`font-bold ${restaurant.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {restaurant.status.toUpperCase()}
                                </span>
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-lg mb-6">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-3 font-bold ${activeTab === 'overview' ? 'border-b-2 border-red-900 text-red-900' : 'text-gray-600'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`px-6 py-3 font-bold ${activeTab === 'menu' ? 'border-b-2 border-red-900 text-red-900' : 'text-gray-600'}`}
                        >
                            Menu Items ({menuItems.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-6 py-3 font-bold ${activeTab === 'orders' ? 'border-b-2 border-red-900 text-red-900' : 'text-gray-600'}`}
                        >
                            Orders
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold">Restaurant Information</h3>
                                        <button
                                            onClick={() => router.push('/restaurant-owner/settings')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold"
                                        >
                                            Edit Settings
                                        </button>
                                    </div>
                                    <div className="space-y-2 text-gray-700">
                                        <p><span className="font-bold">Name:</span> {restaurant.name}</p>
                                        <p><span className="font-bold">Email:</span> {restaurant.email}</p>
                                        <p><span className="font-bold">Phone:</span> {restaurant.phone}</p>
                                        <p><span className="font-bold">Address:</span> {restaurant.address}</p>
                                        <p><span className="font-bold">City:</span> {restaurant.city}</p>
                                        <p><span className="font-bold">Postal Code:</span> {restaurant.postalCode}</p>
                                        <p><span className="font-bold">Region:</span> {restaurant.region}</p>
                                        <p><span className="font-bold">Cuisine:</span> {restaurant.cuisineTypes?.join(', ') || 'N/A'}</p>
                                        <p><span className="font-bold">Description:</span> {restaurant.description}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600">Total Menu Items</p>
                                            <p className="text-2xl font-bold text-blue-600">{menuItems.length}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600">Min Order Amount</p>
                                            <p className="text-2xl font-bold text-green-600">CHF {restaurant.minOrderAmount || restaurant.minPrice || 24}</p>
                                        </div>
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600">Rating</p>
                                            <p className="text-2xl font-bold text-yellow-600">{restaurant.rating || 0} ⭐</p>
                                            <p className="text-xs text-gray-500">({restaurant.totalRatings || 0} reviews)</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6">
                                        <h3 className="text-lg font-bold mb-4">Opening Hours</h3>
                                        <div className="space-y-1 text-sm text-gray-700">
                                            {restaurant.openingHours && Object.entries(restaurant.openingHours).map(([day, hours]: [string, any]) => (
                                                <p key={day}>
                                                    <span className="font-bold capitalize">{day}:</span> {hours.open} - {hours.close}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'menu' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold">Menu Items</h3>
                                    <button
                                        onClick={() => router.push(`/restaurant-owner/menu/add?restaurantId=${restaurant.id}`)}
                                        className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-bold"
                                    >
                                        + Add Menu Item
                                    </button>
                                </div>

                                {menuItems.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 mb-4">No menu items yet</p>
                                        <button
                                            onClick={() => router.push(`/restaurant-owner/menu/add?restaurantId=${restaurant.id}`)}
                                            className="bg-red-900 text-white px-6 py-2 rounded-lg font-bold"
                                        >
                                            Add Your First Menu Item
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {menuItems.map((item) => (
                                            <div key={item.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                                {item.imageUrl && (
                                                    <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                                                )}
                                                <h4 className="font-bold text-lg mb-2">{item.name}</h4>
                                                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-bold text-red-900">CHF {item.price}</span>
                                                    <span className={`text-xs px-2 py-1 rounded ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {item.isAvailable ? 'Available' : 'Unavailable'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold">Orders</h3>
                                    <button
                                        onClick={fetchOrders}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold"
                                    >
                                        Refresh
                                    </button>
                                </div>

                                {ordersLoading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900 mx-auto mb-4"></div>
                                        <p className="text-gray-500">Loading orders...</p>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">No orders yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h4 className="font-bold text-lg">Order #{order.orderNumber}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(order.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-red-900">CHF {order.totalAmount}</p>
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                                            order.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                                                            order.status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                                                            order.status === 'ready_for_pickup' ? 'bg-purple-100 text-purple-800' :
                                                            order.status === 'assigned' ? 'bg-cyan-100 text-cyan-800' :
                                                            order.status === 'out_for_delivery' ? 'bg-indigo-100 text-indigo-800' :
                                                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {order.status.toUpperCase().replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-700">Delivery Address:</p>
                                                        <p className="text-sm text-gray-600">
                                                            {order.deliveryAddress}<br />
                                                            {order.deliveryCity}, {order.deliveryPostalCode}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-700">Scheduled Delivery:</p>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(order.scheduledDeliveryTime).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {order.items && order.items.length > 0 && (
                                                    <div className="mb-4">
                                                        <p className="text-sm font-bold text-gray-700 mb-2">Items:</p>
                                                        <div className="space-y-1">
                                                            {order.items.map((item: any, idx: number) => (
                                                                <p key={idx} className="text-sm text-gray-600">
                                                                    {item.quantity}x {item.menuItem?.name || 'Item'} - CHF {item.price}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex gap-2 flex-wrap">
                                                    {order.status === 'new' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold"
                                                        >
                                                            Confirm Order
                                                        </button>
                                                    )}
                                                    {order.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm font-bold"
                                                        >
                                                            Start Preparing
                                                        </button>
                                                    )}
                                                    {order.status === 'preparing' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'ready_for_pickup')}
                                                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-bold"
                                                        >
                                                            Mark as Ready
                                                        </button>
                                                    )}
                                                    {(order.status === 'new' || order.status === 'confirmed') && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-bold"
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
