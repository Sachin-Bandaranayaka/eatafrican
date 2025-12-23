"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Store, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

interface AnalyticsData {
    revenue: {
        total: number;
        change: number;
        byDay: Array<{ date: string; amount: number }>;
    };
    orders: {
        total: number;
        change: number;
        byStatus: Record<string, number>;
        byDay: Array<{ date: string; count: number }>;
    };
    customers: {
        total: number;
        newThisMonth: number;
        returning: number;
    };
    restaurants: {
        total: number;
        active: number;
        pending: number;
    };
    topRestaurants: Array<{
        id: string;
        name: string;
        orders: number;
        revenue: number;
    }>;
    topItems: Array<{
        id: string;
        name: string;
        restaurant: string;
        orders: number;
    }>;
}

export function AnalyticsDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30'); // days

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`/api/admin/analytics?days=${dateRange}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const result = await response.json();
                setData(result);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12 text-gray-500">
                Failed to load analytics data
            </div>
        );
    }

    const StatCard = ({ title, value, change, icon: Icon, prefix = '', suffix = '' }: any) => (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-800">
                        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
                    </p>
                    {change !== undefined && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${
                            change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {change >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                            <span>{Math.abs(change)}% vs last period</span>
                        </div>
                    )}
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                    <Icon className="w-6 h-6 text-red-900" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Analytics Dashboard</h2>
                    <p className="text-gray-500">Overview of your platform performance</p>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-400" />
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-red-900"
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                        <option value="365">Last year</option>
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={data.revenue.total.toFixed(2)}
                    change={data.revenue.change}
                    icon={DollarSign}
                    prefix="CHF "
                />
                <StatCard
                    title="Total Orders"
                    value={data.orders.total}
                    change={data.orders.change}
                    icon={ShoppingBag}
                />
                <StatCard
                    title="Total Customers"
                    value={data.customers.total}
                    icon={Users}
                />
                <StatCard
                    title="Active Restaurants"
                    value={data.restaurants.active}
                    icon={Store}
                />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Revenue Trend</h3>
                    <div className="h-64 flex items-end gap-1">
                        {data.revenue.byDay.slice(-14).map((day, i) => {
                            const maxRevenue = Math.max(...data.revenue.byDay.map(d => d.amount));
                            const height = maxRevenue > 0 ? (day.amount / maxRevenue) * 100 : 0;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center">
                                    <div
                                        className="w-full bg-gradient-to-t from-red-900 to-red-600 rounded-t transition-all hover:from-red-800 hover:to-red-500"
                                        style={{ height: `${Math.max(height, 2)}%` }}
                                        title={`CHF ${day.amount.toFixed(2)}`}
                                    />
                                    <span className="text-xs text-gray-400 mt-1 rotate-45 origin-left">
                                        {new Date(day.date).getDate()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Orders Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Orders Trend</h3>
                    <div className="h-64 flex items-end gap-1">
                        {data.orders.byDay.slice(-14).map((day, i) => {
                            const maxOrders = Math.max(...data.orders.byDay.map(d => d.count));
                            const height = maxOrders > 0 ? (day.count / maxOrders) * 100 : 0;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center">
                                    <div
                                        className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t transition-all hover:from-amber-500 hover:to-amber-300"
                                        style={{ height: `${Math.max(height, 2)}%` }}
                                        title={`${day.count} orders`}
                                    />
                                    <span className="text-xs text-gray-400 mt-1 rotate-45 origin-left">
                                        {new Date(day.date).getDate()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Order Status & Customer Stats */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Order Status */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Orders by Status</h3>
                    <div className="space-y-3">
                        {Object.entries(data.orders.byStatus).map(([status, count]) => {
                            const total = Object.values(data.orders.byStatus).reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? (count / total) * 100 : 0;
                            const colors: Record<string, string> = {
                                delivered: 'bg-green-500',
                                in_transit: 'bg-blue-500',
                                preparing: 'bg-amber-500',
                                new: 'bg-purple-500',
                                cancelled: 'bg-red-500'
                            };
                            return (
                                <div key={status}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 capitalize">{status.replace('_', ' ')}</span>
                                        <span className="text-gray-800 font-medium">{count}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${colors[status] || 'bg-gray-400'} transition-all`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Customer Stats */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Customer Insights</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">New This Month</span>
                            <span className="font-bold text-green-600">+{data.customers.newThisMonth}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Returning Customers</span>
                            <span className="font-bold text-blue-600">{data.customers.returning}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Total Registered</span>
                            <span className="font-bold text-gray-800">{data.customers.total}</span>
                        </div>
                    </div>
                </div>

                {/* Restaurant Stats */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Restaurant Status</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <span className="text-gray-600">Active</span>
                            <span className="font-bold text-green-600">{data.restaurants.active}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                            <span className="text-gray-600">Pending Approval</span>
                            <span className="font-bold text-amber-600">{data.restaurants.pending}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Total</span>
                            <span className="font-bold text-gray-800">{data.restaurants.total}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Performers */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Restaurants */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Top Restaurants</h3>
                    <div className="space-y-3">
                        {data.topRestaurants.map((restaurant, i) => (
                            <div key={restaurant.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                <span className="w-8 h-8 bg-red-900 text-white rounded-full flex items-center justify-center font-bold">
                                    {i + 1}
                                </span>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{restaurant.name}</p>
                                    <p className="text-sm text-gray-500">{restaurant.orders} orders</p>
                                </div>
                                <span className="font-bold text-green-600">
                                    CHF {restaurant.revenue.toFixed(2)}
                                </span>
                            </div>
                        ))}
                        {data.topRestaurants.length === 0 && (
                            <p className="text-center text-gray-400 py-4">No data available</p>
                        )}
                    </div>
                </div>

                {/* Top Items */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Popular Items</h3>
                    <div className="space-y-3">
                        {data.topItems.map((item, i) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                <span className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                                    {i + 1}
                                </span>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.restaurant}</p>
                                </div>
                                <span className="font-bold text-gray-600">
                                    {item.orders} sold
                                </span>
                            </div>
                        ))}
                        {data.topItems.length === 0 && (
                            <p className="text-center text-gray-400 py-4">No data available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
