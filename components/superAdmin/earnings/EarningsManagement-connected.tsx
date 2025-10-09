"use client";

import React, { useState, useEffect } from 'react';

export const EarningsManagementConnected = () => {
    const [earnings, setEarnings] = useState<any>({
        today: 0,
        week: 0,
        month: 0,
        year: 0,
        byRestaurant: [],
        byDriver: [],
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('month');

    useEffect(() => {
        fetchEarnings();
    }, [period]);

    const fetchEarnings = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            
            // Fetch orders to calculate earnings
            const response = await fetch('/api/admin/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                const orders = data.data || data.orders || [];
                
                // Calculate earnings
                const now = new Date();
                const today = now.toISOString().split('T')[0];
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
                const yearStart = new Date(now.getFullYear(), 0, 1).toISOString();

                const deliveredOrders = orders.filter((o: any) => o.status === 'delivered');

                const todayEarnings = deliveredOrders
                    .filter((o: any) => o.created_at?.startsWith(today))
                    .reduce((sum: number, o: any) => sum + parseFloat(o.total_amount || 0), 0);

                const weekEarnings = deliveredOrders
                    .filter((o: any) => o.created_at >= weekAgo)
                    .reduce((sum: number, o: any) => sum + parseFloat(o.total_amount || 0), 0);

                const monthEarnings = deliveredOrders
                    .filter((o: any) => o.created_at >= monthStart)
                    .reduce((sum: number, o: any) => sum + parseFloat(o.total_amount || 0), 0);

                const yearEarnings = deliveredOrders
                    .filter((o: any) => o.created_at >= yearStart)
                    .reduce((sum: number, o: any) => sum + parseFloat(o.total_amount || 0), 0);

                // Group by restaurant
                const byRestaurant: any = {};
                deliveredOrders.forEach((o: any) => {
                    const restName = o.restaurant?.name || 'Unknown';
                    if (!byRestaurant[restName]) {
                        byRestaurant[restName] = { name: restName, total: 0, orders: 0 };
                    }
                    byRestaurant[restName].total += parseFloat(o.total_amount || 0);
                    byRestaurant[restName].orders += 1;
                });

                setEarnings({
                    today: todayEarnings,
                    week: weekEarnings,
                    month: monthEarnings,
                    year: yearEarnings,
                    byRestaurant: Object.values(byRestaurant).sort((a: any, b: any) => b.total - a.total),
                    recentOrders: deliveredOrders.slice(0, 10)
                });
            }
        } catch (error) {
            console.error('Error fetching earnings:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading earnings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <div className="bg-white/90 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Earnings & Payouts</h2>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Today</p>
                        <p className="text-2xl font-bold text-blue-600">CHF {earnings.today.toFixed(2)}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">This Week</p>
                        <p className="text-2xl font-bold text-green-600">CHF {earnings.week.toFixed(2)}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">This Month</p>
                        <p className="text-2xl font-bold text-purple-600">CHF {earnings.month.toFixed(2)}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">This Year</p>
                        <p className="text-2xl font-bold text-orange-600">CHF {earnings.year.toFixed(2)}</p>
                    </div>
                </div>

                {/* Earnings by Restaurant */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Earnings by Restaurant</h3>
                    {earnings.byRestaurant.length === 0 ? (
                        <p className="text-gray-500">No earnings data available</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Restaurant</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Orders</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Total Earnings</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Avg Order</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {earnings.byRestaurant.map((rest: any, index: number) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900">{rest.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{rest.orders}</td>
                                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                CHF {rest.total.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                CHF {(rest.total / rest.orders).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Recent Completed Orders */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Completed Orders</h3>
                    {earnings.recentOrders.length === 0 ? (
                        <p className="text-gray-500">No completed orders yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Order ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Restaurant</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Customer</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {earnings.recentOrders.map((order: any) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900">#{order.id.slice(0, 8)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{order.restaurant?.name || 'N/A'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {order.customer?.first_name} {order.customer?.last_name}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                CHF {order.total_amount}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
