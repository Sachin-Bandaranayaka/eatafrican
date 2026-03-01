"use client";

import { USE_MOCK_DATA, mockDriver } from "./mockData";
import HandButton from "@/app/components/HandButton";

export default function Overview() {
    // Use mock data if enabled
    const driver = USE_MOCK_DATA ? mockDriver : {
        name: "Driver",
        rating: 0,
        totalDeliveries: 0,
        earnings: {
            today: 0,
            thisWeek: 0,
            thisMonth: 0,
        },
    };

    return (
        <section className="flex justify-center w-full pt-28">
            <div className="flex gap-4 w-full max-w-4xl">
                {/* Left Container - Deliveries */}
                <div
                    style={{ backgroundColor: '#E8D7B4' }}
                    className="flex-1 min-h-40 shadow-lg flex flex-col"
                >
                    <div className="p-4 flex-1">
                        <h3 className="text-xs font-bold text-green-700 mb-2">Deliveries</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-black">Rating:</span>
                                <span className="text-xs font-bold text-black">⭐ {driver.rating}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-black">Total Deliveries:</span>
                                <span className="text-xs font-bold text-black">{driver.totalDeliveries}</span>
                            </div>
                        </div>
                    </div>

                    <HandButton />
                </div>

                {/* Right Container - Earnings Today */}
                <div
                    style={{ backgroundColor: '#E8D7B4' }}
                    className="flex-1 min-h-40 shadow-lg flex flex-col"
                >
                    <div className="p-4 flex-1">
                        <h3 className="text-xs font-bold text-green-700 mb-2">Earnings Today</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-black">Today:</span>
                                <span className="text-xs font-bold text-black">CHF {driver.earnings.today.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-black">This Week:</span>
                                <span className="text-xs font-bold text-black">CHF {driver.earnings.thisWeek.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-black">This Month:</span>
                                <span className="text-xs font-bold text-black">CHF {driver.earnings.thisMonth.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <HandButton />
                </div>
            </div>
        </section>
    );
}
