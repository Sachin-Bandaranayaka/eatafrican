"use client";

import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { USE_MOCK_DATA, mockDriver, mockEarningsHistory } from "./mockData";

// This component is for the date input fields
const DateInput = ({ onClick }: { onClick?: () => void }) => (
    <div
        onClick={onClick}
        className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-1.5 cursor-pointer hover:bg-gray-50 w-40"
    >
        <Calendar size={16} className="text-gray-500 mr-2" />
        <span className="text-[10px] text-gray-700">20/08/2017</span>
    </div>
);

// This component represents the calendar popup
const CalendarPopup = ({ onApply, onCancel }: { onApply?: () => void; onCancel?: () => void }) => (
    <div className="absolute top-full left-1/2 -translate-x-1/4 mt-2 w-[300px] bg-white shadow-2xl p-4 z-10 border border-gray-200">
        <div className="grid grid-cols-2 gap-4">
            {/* Month 1: August */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <button className="hover:bg-gray-100 rounded-full p-1"><ChevronLeft size={18} /></button>
                    <span className="font-bold text-[10px]">AUG 2017</span>
                    <span className="w-6"></span>
                </div>
                <div className="grid grid-cols-7 text-center text-[10px] text-gray-500">
                    {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => <div key={day} className="py-1">{day}</div>)}
                    <div className="text-gray-400 py-1">30</div><div className="text-gray-400 py-1">31</div><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div>
                    <div>6</div><div>7</div><div>8</div><div>9</div><div>10</div><div>11</div><div>12</div>
                    <div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div><div>19</div>
                    <div className="bg-green-600 text-white rounded-full">20</div><div>21</div><div>22</div><div>23</div><div>24</div><div>25</div><div>26</div>
                    <div>27</div><div>28</div><div>29</div><div>30</div><div>31</div><div className="text-gray-400 py-1">1</div><div className="text-gray-400 py-1">2</div>
                    <div className="text-gray-400 py-1">3</div><div className="text-gray-400 py-1">4</div><div className="text-gray-400 py-1">5</div><div className="text-gray-400 py-1">6</div><div className="text-gray-400 py-1">7</div><div className="text-gray-400 py-1">8</div><div className="text-gray-400 py-1">9</div>
                </div>
            </div>
            {/* Month 2: September */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="w-6"></span>
                    <span className="font-bold text-[10px]">SEP 2017</span>
                    <button className="hover:bg-gray-100 rounded-full p-1"><ChevronRight size={18} /></button>
                </div>
                <div className="grid grid-cols-7 text-center text-[10px] text-gray-500">
                    {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => <div key={day}>{day}</div>)}
                    <div className="text-gray-400">27</div><div className="text-gray-400">28</div><div className="text-gray-400">29</div><div className="text-gray-400">30</div><div className="text-gray-400">31</div><div>1</div><div>2</div>
                    <div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div>
                    <div>10</div><div>11</div><div>12</div><div>13</div><div>14</div><div>15</div><div>16</div>
                    <div>17</div><div>18</div><div>19</div><div>20</div><div>21</div><div>22</div><div>23</div>
                    <div>24</div><div>25</div><div>26</div><div>27</div><div>28</div><div>29</div><div>30</div>
                </div>
            </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
            <button onClick={onApply} className="bg-green-600 text-white font-bold py-1 px-6 rounded-md text-[10px] hover:bg-green-700">Apply</button>
            <button onClick={onCancel} className="bg-red-600 text-white font-bold py-1 px-6 rounded-md text-[10px] hover:bg-red-700">Cancel</button>
        </div>
    </div>
);

export default function EarningsSection() {
    const [showCalendar, setShowCalendar] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Use mock data if enabled
    const earnings = USE_MOCK_DATA ? mockDriver.earnings : {
        today: 1500,
        thisWeek: 6500,
        thisMonth: 10500,
        pendingPayout: 0,
        nextPayoutDate: new Date().toISOString(),
    };

    const earningsHistory = USE_MOCK_DATA ? mockEarningsHistory : [];

    const handleApplyDate = () => {
        setShowCalendar(false);
        setShowHistory(true);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const formatCurrency = (amount: number) => {
        return amount.toFixed(2);
    };

    return (

        <section className="flex justify-center w-full pt-32">
            <div
                style={{ backgroundColor: '#E8D7B4' }}
                className="w-full max-w-[768px] min-h-[60vh] shadow-lg flex text-black text-xs opacity-70 mb-4"
            >
                <div className="flex-1 p-6 font-sans text-gray-800">
                    <h2 className="text-[14px] font-bold text-[#9a0000] mb-4">EARNINGS</h2>

                    {/* Upper table — now uses same grid cols as lower table */}
                    <div className="grid grid-cols-2 gap-2 font-bold text-[#9a0000] mb-2 text-[10px]">
                        <div>Time Period</div>
                        <div className="-ml-[45%]">Amount</div>
                    </div>
                    <div className="space-y-2 text-[10px] font-semibold">
                        <div className="grid grid-cols-2 gap-2">
                            <div>Today</div>
                            <div className="-ml-[45%]">Fr. {formatCurrency(earnings.today)}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>This Week</div>
                            <div className="-ml-[45%]">Fr. {formatCurrency(earnings.thisWeek)}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>This Month</div>
                            <div className="-ml-[45%]">Fr. {formatCurrency(earnings.thisMonth)}</div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 text-[10px]">
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold">
                            <div className="font-bold">Date of next Payout:</div>
                            <div className="-ml-[45%]">{formatDate(earnings.nextPayoutDate)}</div>
                        </div>
                        <div className="relative flex flex-row gap-4 items-center mt-2">
                            <p className="font-bold mb-2">Select Dates to see payout history</p>
                            <div className="flex space-x-0 ml-2">
                                <DateInput onClick={() => setShowCalendar(!showCalendar)} />
                                <DateInput onClick={() => setShowCalendar(!showCalendar)} />
                            </div>
                            {showCalendar && <CalendarPopup onApply={handleApplyDate} onCancel={() => setShowCalendar(false)} />}
                        </div>

                        {showHistory && (
                            <div className="mt-4">
                                <div className="grid grid-cols-2 gap-2 font-bold text-[#9a0000] mb-2 text-[10px]">
                                    <div>Date</div>
                                    <div className="-ml-[45%]">Total Payout</div>
                                </div>
                                <div className="space-y-2 text-[10px] font-semibold">
                                    {earningsHistory.map((item, index) => (
                                        <div key={index} className="grid grid-cols-2 gap-2">
                                            <div>{formatDate(item.date)}</div>
                                            <div className="-ml-[45%]">Fr. {formatCurrency(item.amount)}</div>
                                        </div>
                                    ))}
                                </div>
                                <button className="bg-red-900 text-[10px] text-white font-bold py-1 px-4 rounded-lg hover:bg-opacity-90 shadow-lg mt-6 mb-4">
                                    DOWNLOAD PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}