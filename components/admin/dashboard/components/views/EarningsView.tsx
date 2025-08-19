"use client";
import { useState } from "react";
import { DateInput, CalendarPopup } from "../common/Calendar";

const EarningsView = () => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const handleApplyDate = () => {
        setShowCalendar(false);
        setShowHistory(true);
    };

    return (
        <div className=" font-sans text-gray-800 mx-3 z-50">
            <h2 className="text-[17px] font-bold text-[#274e13] mb-8">EARNINGS</h2>
            <div className="flex flex-row gap-8 w-[100%] justify-start">
                <div className="w-[40%]">
                    <h3 className="flex flex-row justify-end text-red-600 font-bold mb-3 text-[14px] ml-24">YOUR EARNINGS</h3>
                    <div className="space-y-2 text-[12px]">
                        <div className="flex justify-between"><span>Today</span><span className="font-semibold">1500</span></div>
                        <div className="flex justify-between"><span>This Week</span><span className="font-semibold">6500</span></div>
                        <div className="flex justify-between"><span>This Month</span><span className="font-semibold">10500</span></div>
                    </div>
                </div>
                <div className="w-[15%] flex flex-col items-end">
                    <h3 className="text-red-600 font-bold mb-3 text-[14px]">TOTAL SALES</h3>
                    <div className="space-y-2 text-sm text-[12px]">
                        <div className="flex justify-between"><span className="font-semibold">2700</span></div>
                        <div className="flex justify-between"><span className="font-semibold">9500</span></div>
                        <div className="flex justify-between"><span className="font-semibold">40500</span></div>
                    </div>
                </div>
                <div className="bg-yellow-200 p-2 text-[14px] w-[40%] -mt-2">
                    <h3 className="font-bold mb-2 text-black">EARNINGS CALCULATION</h3>
                    <p className="text-[12px]">eatafrican.ch Commission Rate: 8%</p>
                    <p className="text-[12px]">Restaurant's Percentage : 100% - 8% = 92%</p>
                    <p className="text-[12px]">Restaurant's Earning: 92% / 100% * TOTAL SALES</p>
                </div>
            </div>
            <div className="pt-6 border-t border-gray-200 text-sm mb-[72%]">
                <p className="mb-2">
                    <span className="font-bold">Date of next Payout:</span> [Tomorrows Date], [Time]
                </p>
                <div className="relative flex flex-row gap-4">
                    <p className="font-bold mb-2">Select Dates to see payout history</p>
                    <div className="flex space-x-4">
                        <DateInput onClick={() => setShowCalendar(true)} />
                        <DateInput onClick={() => setShowCalendar(true)} />
                    </div>
                    {showCalendar && <CalendarPopup onApply={handleApplyDate} onCancel={() => setShowCalendar(false)} />}
                </div>
            </div>
            {showHistory && (
                <div className="-mt-[70%]">
                    <div className="grid grid-cols-2 gap-4 font-bold text-red-600 mb-2">
                        <div>Date</div>
                        <div>Total Payout</div>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-4"><div>August 17, 2024</div><div>19000</div></div>
                        <div className="grid grid-cols-2 gap-4"><div>August 18, 2024</div><div>15000</div></div>
                        <div className="grid grid-cols-2 gap-4"><div>August 19, 2024</div><div>16000</div></div>
                        <div className="grid grid-cols-2 gap-4"><div>August 20, 2024</div><div>17000</div></div>
                    </div>
                    <button className="bg-red-900 text-[13px] text-white font-bold py-1 px-4 rounded-lg hover:bg-opacity-90 shadow-lg mt-6 mb-4">
                        DOWNLOAD PDF
                    </button>
                </div>
            )}
        </div>
    );
};

export default EarningsView;