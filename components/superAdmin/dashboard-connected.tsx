"use client";

import React, { useState, useEffect } from 'react';

// A reusable card component for displaying information blocks
const InfoCard = ({ title, data, children, onSeeMore }: { 
    title: string, 
    data?: { label: string, value: string | number }[], 
    children?: React.ReactNode,
    onSeeMore?: () => void 
}) => (
    <div className="bg-white/80 border-2 border-amber-400 rounded-lg p-2 md:p-4 flex flex-col">
        <h3 className="text-[9px] md:text-[15px] font-bold text-gray-800">{title}</h3>
        <div className="mt-2 flex-1">
            {data && data.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-[7px] md:text-[12px] text-black">
                    <span>{item.label}</span>
                    <span className="font-bold">{item.value}</span>
                </div>
            ))}
            {children}
        </div>
        {onSeeMore && (
            <div className="mt-2 md:mt-4">
                <button 
                    onClick={onSeeMore}
                    className="bg-red-900 text-white text-[7px] md:text-[12px] font-bold py-1 px-3 rounded-lg hover:bg-red-800 transition-colors"
                >
                    SEE MORE
                </button>
            </div>
        )}
    </div>
);

// Component for the Activity Log view
const ActivityLog = ({ logs }: { logs: any[] }) => {
    return (
        <div className="bg-white/80 border-2 border-amber-400 rounded-lg p-3 md:p-6 w-full md:w-1/2">
            <h3 className="text-[12px] md:text-[15px] font-bold text-gray-800 mb-4">Recent Activity</h3>
            {logs.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent activity</p>
            ) : (
                <ul className="space-y-1 md:space-y-3">
                    {logs.slice(0, 10).map((log, index) => (
                        <li key={index} className="text-[7px] md:text-[12px] text-gray-800 font-medium">
                            {log.message} - {new Date(log.created_at).toLocaleString()}
                        </li>
                    ))}
                </ul>
            )}
            <div className='mb-32'></div>
        </div>
    );
};

export const SuperAdminDashboardConnected = () => {
    const [activeTab, setActiveTab] = useState('OVERVIEW');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>({
        orders: { completed: 0, processing: 0, inTransit: 0, cancelled: 0 },
        earnings: { today: 0, thisMonth: 0 },
        restaurants: { active: {}, inactive: 0, unapproved: 0 },
        drivers: { active: {}, unapproved: 0 },
        customers: { total: 0 }
    });
    const [activityLogs, setActivityLogs] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            
            if (!token) {
                console.error('No auth token found');
                return;
            }

            // Fetch all data in parallel
            const [ordersRes, restaurantsRes, driversRes, customersRes, logsRes] = await Promise.all([
                fetch('/api/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/admin/restaurants', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/admin/drivers', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/admin/customers', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/admin/activity-logs?limit=20', { headers: { 'Authorization': `Bearer ${token}` } }).catch(() => null)
            ]);

            // Process orders
            if (ordersRes.ok) {
                const ordersData = await ordersRes.json();
                const orders = ordersData.data || ordersData.orders || [];
                
                const orderStats = {
                    completed: orders.filter((o: any) => o.status === 'delivered').length,
                    processing: orders.filter((o: any) => ['confirmed', 'preparing'].includes(o.status)).length,
                    inTransit: orders.filter((o: any) => ['ready_for_pickup', 'picked_up', 'out_for_delivery'].includes(o.status)).length,
                    cancelled: orders.filter((o: any) => o.status === 'cancelled').length
                };

                // Calculate earnings
                const today = new Date().toISOString().split('T')[0];
                const thisMonth = new Date().toISOString().slice(0, 7);
                
                const todayEarnings = orders
                    .filter((o: any) => o.created_at?.startsWith(today) && o.status === 'delivered')
                    .reduce((sum: number, o: any) => sum + (parseFloat(o.total_amount) || 0), 0);
                
                const monthEarnings = orders
                    .filter((o: any) => o.created_at?.startsWith(thisMonth) && o.status === 'delivered')
                    .reduce((sum: number, o: any) => sum + (parseFloat(o.total_amount) || 0), 0);

                setStats((prev: any) => ({
                    ...prev,
                    orders: orderStats,
                    earnings: { today: todayEarnings, thisMonth: monthEarnings }
                }));
            }

            // Process restaurants
            if (restaurantsRes.ok) {
                const restaurantsData = await restaurantsRes.json();
                const restaurants = restaurantsData.data || restaurantsData.restaurants || [];
                
                const activeByCity: any = {};
                restaurants.forEach((r: any) => {
                    if (r.status === 'active') {
                        const city = r.region || r.city || 'Other';
                        activeByCity[city] = (activeByCity[city] || 0) + 1;
                    }
                });

                setStats((prev: any) => ({
                    ...prev,
                    restaurants: {
                        active: activeByCity,
                        inactive: restaurants.filter((r: any) => r.status === 'inactive' || r.status === 'suspended').length,
                        unapproved: restaurants.filter((r: any) => r.status === 'pending').length
                    }
                }));
            }

            // Process drivers
            if (driversRes.ok) {
                const driversData = await driversRes.json();
                const drivers = driversData.data || driversData.drivers || [];
                
                const activeByCity: any = {};
                drivers.forEach((d: any) => {
                    if (d.status === 'active') {
                        const city = d.pickup_zone || 'Other';
                        activeByCity[city] = (activeByCity[city] || 0) + 1;
                    }
                });

                setStats((prev: any) => ({
                    ...prev,
                    drivers: {
                        active: activeByCity,
                        unapproved: drivers.filter((d: any) => d.status === 'pending').length
                    }
                }));
            }

            // Process customers
            if (customersRes.ok) {
                const customersData = await customersRes.json();
                const customers = customersData.data || customersData.customers || [];
                
                setStats((prev: any) => ({
                    ...prev,
                    customers: { total: customers.length }
                }));
            }

            // Process activity logs
            if (logsRes && logsRes.ok) {
                const logsData = await logsRes.json();
                setActivityLogs(logsData.logs || logsData.data || []);
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Prepare data for cards
    const ordersToday = [
        { label: 'Completed', value: stats.orders.completed },
        { label: 'Processing', value: stats.orders.processing },
        { label: 'In Transit', value: stats.orders.inTransit },
        { label: 'Cancelled', value: stats.orders.cancelled },
    ];

    const earnings = [
        { label: 'Today', value: `CHF ${stats.earnings.today.toFixed(2)}` },
        { label: 'This month', value: `CHF ${stats.earnings.thisMonth.toFixed(2)}` },
    ];

    const activeDriversData = Object.entries(stats.drivers.active).map(([city, count]) => ({
        label: city,
        value: count as number
    }));

    const activeRestaurantsData = Object.entries(stats.restaurants.active).map(([city, count]) => ({
        label: city,
        value: count as number
    }));

    return (
        <div className="flex flex-col items-center w-full md:p-6 bg-transparent">
            {/* Tab Navigation */}
            <div className="flex flex-row space-x-2 md:space-x-4 mb-4 md:mb-6">
                <button
                    onClick={() => setActiveTab('OVERVIEW')}
                    className={`px-3 md:px-6 py-1 md:py-2 text-[9px] md:text-[15px] font-bold rounded-lg transition-colors ${
                        activeTab === 'OVERVIEW'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/80 text-gray-800 hover:bg-white'
                    }`}
                >
                    OVERVIEW
                </button>
                <button
                    onClick={() => setActiveTab('ACTIVITY LOG')}
                    className={`px-3 md:px-6 py-1 md:py-2 text-[9px] md:text-[15px] font-bold rounded-lg transition-colors ${
                        activeTab === 'ACTIVITY LOG'
                            ? 'bg-gray-600 text-white'
                            : 'bg-white/80 text-gray-800 hover:bg-white'
                    }`}
                >
                    ACTIVITY LOG
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'OVERVIEW' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 w-full max-w-7xl">
                    {/* Column 1 */}
                    <div className="space-y-3 md:space-y-6">
                        <InfoCard title="Total Orders Today" data={ordersToday} />
                        <InfoCard title="Active Restaurants" data={activeRestaurantsData} />
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-3 md:space-y-6">
                        <InfoCard title="Earnings" data={earnings} />
                        <InfoCard title="Inactive Restaurants">
                            <p className="text-gray-600 text-[7px] md:text-[12px]">
                                {stats.restaurants.inactive} restaurants
                            </p>
                        </InfoCard>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-3 md:space-y-6">
                        <InfoCard title="Active Drivers" data={activeDriversData} />
                        <InfoCard title="Unapproved Drivers">
                            <p className="text-gray-600 text-[7px] md:text-[12px]">
                                {stats.drivers.unapproved} pending approval
                            </p>
                        </InfoCard>
                        <InfoCard title="Unapproved Restaurants">
                            <p className="text-gray-600 text-[7px] md:text-[12px]">
                                {stats.restaurants.unapproved} pending approval
                            </p>
                        </InfoCard>
                        <InfoCard title="Registered Customer Accounts">
                            <p className="text-gray-600 text-[7px] md:text-[12px]">
                                Total: {stats.customers.total}
                            </p>
                        </InfoCard>
                    </div>
                </div>
            ) : (
                <ActivityLog logs={activityLogs} />
            )}
        </div>
    );
};
