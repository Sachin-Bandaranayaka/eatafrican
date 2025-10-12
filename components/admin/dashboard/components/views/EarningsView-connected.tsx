"use client";
import { useState, useEffect } from "react";

interface EarningsViewProps {
    restaurantId: string;
}

const EarningsViewConnected = ({ restaurantId }: EarningsViewProps) => {
    const [earnings, setEarnings] = useState({
        today: 0,
        thisWeek: 0,
        thisMonth: 0
    });
    const [sales, setSales] = useState({
        today: 0,
        thisWeek: 0,
        thisMonth: 0
    });
    const [loading, setLoading] = useState(true);
    const COMMISSION_RATE = 0.08; // 8% commission

    useEffect(() => {
        if (restaurantId) {
            fetchEarnings();
        }
    }, [restaurantId]);

    const fetchEarnings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');

            // Fetch orders for the restaurant
            const response = await fetch(`/api/restaurants/${restaurantId}/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const orders = data.orders || [];

                // Calculate earnings based on delivered orders
                const deliveredOrders = orders.filter((o: any) => o.status === 'delivered');

                const now = new Date();
                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

                let todaySales = 0, weekSales = 0, monthSales = 0;

                deliveredOrders.forEach((order: any) => {
                    const orderDate = new Date(order.actualDeliveryTime || order.createdAt);
                    const amount = order.subtotal || order.totalAmount || 0;

                    if (orderDate >= todayStart) {
                        todaySales += amount;
                    }
                    if (orderDate >= weekStart) {
                        weekSales += amount;
                    }
                    if (orderDate >= monthStart) {
                        monthSales += amount;
                    }
                });

                // Calculate restaurant's earnings (92% of sales)
                const restaurantPercentage = 1 - COMMISSION_RATE;

                setSales({
                    today: todaySales,
                    thisWeek: weekSales,
                    thisMonth: monthSales
                });

                setEarnings({
                    today: todaySales * restaurantPercentage,
                    thisWeek: weekSales * restaurantPercentage,
                    thisMonth: monthSales * restaurantPercentage
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
            <div className="flex items-center justify-center w-full py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    return (
        <div className="font-sans text-gray-800 mx-3 z-50">
            <h2 className="text-[17px] font-bold text-[#274e13] mb-8">EARNINGS</h2>
            <div className="flex flex-row gap-8 w-[100%] justify-start">
                <div className="w-[40%]">
                    <h3 className="flex flex-row justify-end text-red-600 font-bold mb-3 text-[14px] ml-24">YOUR EARNINGS</h3>
                    <div className="space-y-2 text-[12px]">
                        <div className="flex justify-between">
                            <span>Today</span>
                            <span className="font-semibold">CHF {earnings.today.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>This Week</span>
                            <span className="font-semibold">CHF {earnings.thisWeek.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>This Month</span>
                            <span className="font-semibold">CHF {earnings.thisMonth.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div className="w-[15%] flex flex-col items-end">
                    <h3 className="text-red-600 font-bold mb-3 text-[14px]">TOTAL SALES</h3>
                    <div className="space-y-2 text-sm text-[12px]">
                        <div className="flex justify-between">
                            <span className="font-semibold">CHF {sales.today.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">CHF {sales.thisWeek.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">CHF {sales.thisMonth.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-yellow-200 p-2 text-[14px] w-[40%] -mt-2">
                    <h3 className="font-bold mb-2 text-black">EARNINGS CALCULATION</h3>
                    <p className="text-[12px]">eatafrican.ch Commission Rate: {(COMMISSION_RATE * 100).toFixed(0)}%</p>
                    <p className="text-[12px]">Restaurant's Percentage: {((1 - COMMISSION_RATE) * 100).toFixed(0)}%</p>
                    <p className="text-[12px]">Restaurant's Earning: {((1 - COMMISSION_RATE) * 100).toFixed(0)}% of TOTAL SALES</p>
                </div>
            </div>
            <div className="pt-6 border-t border-gray-200 text-sm mt-6">
                <p className="mb-2 text-gray-600">
                    <span className="font-bold">Note:</span> Payouts are processed weekly. Contact support for payout schedule details.
                </p>
            </div>
        </div>
    );
};

export default EarningsViewConnected;
