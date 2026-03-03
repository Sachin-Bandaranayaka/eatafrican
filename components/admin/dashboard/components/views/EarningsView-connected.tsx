"use client";
import { useState, useEffect } from "react";
import HandButton from "@/app/components/HandButton";

interface EarningsViewProps {
    restaurantId: string;
}

const EarningsViewConnected = ({ restaurantId }: EarningsViewProps) => {
    const COMMISSION_RATE = 0.08; // 8% commission
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
    const [deliveredOrders, setDeliveredOrders] = useState<any[]>([]);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isPayoutHistoryModalOpen, setIsPayoutHistoryModalOpen] = useState(false);
    const [selectedHistoryDate, setSelectedHistoryDate] = useState("");
    const [selectedPayoutDate, setSelectedPayoutDate] = useState("");
    const [selectedDateHistory, setSelectedDateHistory] = useState({
        sales: 0,
        earnings: 0,
        orders: 0
    });
    const [selectedPayoutHistory, setSelectedPayoutHistory] = useState({
        sales: 0,
        payout: 0,
        orders: 0
    });
    const [loading, setLoading] = useState(true);

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
                setDeliveredOrders(deliveredOrders);

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

    const getDateKey = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleHistoryDateChange = (dateValue: string) => {
        setSelectedHistoryDate(dateValue);

        if (!dateValue) {
            setSelectedDateHistory({ sales: 0, earnings: 0, orders: 0 });
            return;
        }

        const dateMetrics = getDateMetrics(dateValue);

        setSelectedDateHistory({
            sales: dateMetrics.sales,
            earnings: dateMetrics.sales * (1 - COMMISSION_RATE),
            orders: dateMetrics.orders
        });
    };

    const getDateMetrics = (dateValue: string) => {
        let dateSales = 0;
        let dateOrders = 0;

        deliveredOrders.forEach((order: any) => {
            const orderDate = new Date(order.actualDeliveryTime || order.createdAt);
            const orderDateKey = getDateKey(orderDate);

            if (orderDateKey === dateValue) {
                dateSales += Number(order.subtotal || order.totalAmount || 0);
                dateOrders += 1;
            }
        });

        return { sales: dateSales, orders: dateOrders };
    };

    const handlePayoutDateChange = (dateValue: string) => {
        setSelectedPayoutDate(dateValue);

        if (!dateValue) {
            setSelectedPayoutHistory({ sales: 0, payout: 0, orders: 0 });
            return;
        }

        const dateMetrics = getDateMetrics(dateValue);

        setSelectedPayoutHistory({
            sales: dateMetrics.sales,
            payout: dateMetrics.sales * (1 - COMMISSION_RATE),
            orders: dateMetrics.orders
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    return (
        <div className="flex justify-center w-full pt-32 sm:pt-24">
            <div
                style={{ backgroundColor: '#E8D7B4' }}
                className="w-full max-w-[768px] min-h-72 shadow-lg flex text-black text-[10px] sm:text-xs opacity-90 mb-4 pt-4 px-4 pb-20"
            >
                <div className="font-sans text-gray-800 mx-3 z-50 w-full">
                    <h2 className="text-[11px] sm:text-[14px] font-bold text-[#9a0000] mb-0 sm:mb-4">EARNINGS</h2>
                    <div className="flex flex-row gap-8 w-[100%] justify-start">
                        <div className="w-[60%] sm:w-[40%]">
                            <h3 className="flex flex-row justify-end text-[#9a0000] font-bold mb-3 text-[7px] sm:text-[10px] ml-24 whitespace-nowrap">YOUR EARNINGS</h3>
                            <div className="space-y-2 text-[8px] sm:text-[10px] font-semibold">
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
                                <div className="mt-3 -ml-4">
                                    <HandButton 
                                        text="See your earning history"
                                        onClick={() => setIsHistoryModalOpen(true)}
                                        className="text-[8px] sm:text-[10px] px-3 py-1"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-[15%] flex flex-col items-end">
                            <h3 className="text-[#9a0000] font-bold mb-3 text-[7px] sm:text-[10px] whitespace-nowrap">TOTAL SALES</h3>
                            <div className="space-y-2 text-[8px] sm:text-[10px] font-semibold">
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
                        <div style={{ backgroundColor: '#ffd96f' }} className="hidden sm:block p-2 text-[10px] font-semibold w-[40%] -mt-2">
                            <h3 className="font-bold mb-2 text-[#9a0000]">EARNINGS CALCULATION</h3>
                            <p className="text-[10px] font-normal mb-3">eatafrican.ch Commission Rate: {(COMMISSION_RATE * 100).toFixed(0)}%</p>
                            <p className="text-[10px] font-normal mb-3">Restaurant's Percentage: {((1 - COMMISSION_RATE) * 100).toFixed(0)}%</p>
                            <p className="text-[10px] font-normal">Restaurant's Earning: {((1 - COMMISSION_RATE) * 100).toFixed(0)}% of TOTAL SALES</p>
                        </div>
                    </div>

                    {/* PAYOUTS Table */}
                    <div className="mt-3 sm:mt-6 pt-3 sm:pt-6 border-t border-gray-200">
                        <h2 className="text-[11px] sm:text-[14px] font-bold text-[#9a0000] mb-0 sm:mb-4">PAYOUTS</h2>
                        <div className="flex flex-row gap-8 w-[100%] justify-start">
                            <div className="w-[60%] sm:w-[25%]">
                                <div className="space-y-3 text-[8px] sm:text-[10px] font-semibold">
                                    <div className="flex justify-between">
                                        <span className="invisible">.</span>
                                        <span className="font-semibold invisible">-</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Last Payout</span>
                                        <span className="font-semibold">-</span>
                                    </div>
                                    <div className="font-bold text-[8px] sm:text-[10px] whitespace-nowrap">Date of next payout :</div>
                                    <div className="mt-3 -ml-4">
                                        <HandButton
                                            text="See your payout history"
                                            onClick={() => setIsPayoutHistoryModalOpen(true)}
                                            className="text-[8px] sm:text-[10px] px-3 py-1"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-[15%] flex flex-col items-end pr-8">
                                <h3 className="text-[#9a0000] font-bold mb-3 text-[8px] sm:text-[12px] whitespace-nowrap">Amount</h3>
                                <div className="space-y-3 text-[8px] sm:text-[10px] font-semibold">
                                    <div className="flex justify-between">
                                        <span className="font-semibold invisible">-</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">-</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[25%] sm:w-[55%] flex flex-col items-start">
                                <h3 className="text-[#9a0000] font-bold mb-3 text-[8px] sm:text-[12px] whitespace-nowrap">Date</h3>
                                <div className="space-y-3 text-[8px] sm:text-[10px] font-semibold">
                                    <div className="flex justify-between">
                                        <span className="font-semibold invisible">-</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">-</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isHistoryModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
                    <div
                        style={{ backgroundColor: '#E8D7B4' }}
                        className="w-full max-w-[560px] shadow-lg p-6 text-black"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[14px] font-bold text-[#9a0000]">EARNING HISTORY</h3>
                            <button
                                type="button"
                                onClick={() => setIsHistoryModalOpen(false)}
                                className="text-[12px] font-semibold text-[#9a0000]"
                            >
                                Close
                            </button>
                        </div>

                        <p className="text-[12px] mb-3 font-semibold">Select a date to see earning history.</p>

                        <div className="mb-4">
                            <label htmlFor="earning-history-date" className="block text-[11px] font-bold mb-1 text-[#9a0000]">
                                Date
                            </label>
                            <input
                                id="earning-history-date"
                                type="date"
                                value={selectedHistoryDate}
                                onChange={(event) => handleHistoryDateChange(event.target.value)}
                                className="w-full rounded border border-gray-400 bg-white px-3 py-2 text-[12px]"
                            />
                        </div>

                        {selectedHistoryDate && (
                            <div className="space-y-2 text-[12px]">
                                <div className="flex justify-between font-semibold">
                                    <span>Orders Delivered</span>
                                    <span>{selectedDateHistory.orders}</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <span>Total Sales</span>
                                    <span>CHF {selectedDateHistory.sales.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-[#9a0000]">
                                    <span>Your Earnings</span>
                                    <span>CHF {selectedDateHistory.earnings.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isPayoutHistoryModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
                    <div
                        style={{ backgroundColor: '#E8D7B4' }}
                        className="w-full max-w-[560px] shadow-lg p-6 text-black"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[14px] font-bold text-[#9a0000]">PAYOUT HISTORY</h3>
                            <button
                                type="button"
                                onClick={() => setIsPayoutHistoryModalOpen(false)}
                                className="text-[12px] font-semibold text-[#9a0000]"
                            >
                                Close
                            </button>
                        </div>

                        <p className="text-[12px] mb-3 font-semibold">Select a date to see payout history.</p>

                        <div className="mb-4">
                            <label htmlFor="payout-history-date" className="block text-[11px] font-bold mb-1 text-[#9a0000]">
                                Date
                            </label>
                            <input
                                id="payout-history-date"
                                type="date"
                                value={selectedPayoutDate}
                                onChange={(event) => handlePayoutDateChange(event.target.value)}
                                className="w-full rounded border border-gray-400 bg-white px-3 py-2 text-[12px]"
                            />
                        </div>

                        {selectedPayoutDate && (
                            <div className="space-y-2 text-[12px]">
                                <div className="flex justify-between font-semibold">
                                    <span>Orders Delivered</span>
                                    <span>{selectedPayoutHistory.orders}</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <span>Total Sales</span>
                                    <span>CHF {selectedPayoutHistory.sales.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-[#9a0000]">
                                    <span>Payout Amount</span>
                                    <span>CHF {selectedPayoutHistory.payout.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EarningsViewConnected;
