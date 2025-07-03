"use client";

import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// This component is for the date input fields
const DateInput = ({ onClick }) => (
    <div
        onClick={onClick}
        className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-1.5 cursor-pointer hover:bg-gray-50 w-40"
    >
        <Calendar size={16} className="text-gray-500 mr-2" />
        <span className="text-sm text-gray-700">20/08/2017</span>
    </div>
);

// This component represents the calendar popup
const CalendarPopup = ({ onApply, onCancel }) => (
    <div className="absolute top-full left-1/2 -translate-x-1/4 mt-2 w-[300px] bg-white shadow-2xl p-4 z-10 border border-gray-200">
        <div className="grid grid-cols-2 gap-4">
            {/* Month 1: August */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <button className="hover:bg-gray-100 rounded-full p-1"><ChevronLeft size={18} /></button>
                    <span className="font-bold text-sm">AUG 2017</span>
                    <span className="w-6"></span>
                </div>
                <div className="grid grid-cols-7 text-center text-xs text-gray-500">
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
                    <span className="font-bold text-sm">SEP 2017</span>
                    <button className="hover:bg-gray-100 rounded-full p-1"><ChevronRight size={18} /></button>
                </div>
                <div className="grid grid-cols-7 text-center text-xs text-gray-500">
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
            <button onClick={onApply} className="bg-green-600 text-white font-bold py-1 px-6 rounded-md text-[13px] hover:bg-green-700">Apply</button>
            <button onClick={onCancel} className="bg-red-600 text-white font-bold py-1 px-6 rounded-md text-[13px] hover:bg-red-700">Cancel</button>
        </div>
    </div>
);

export default function EarningsSection() {
    const [showCalendar, setShowCalendar] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const handleApplyDate = () => {
        setShowCalendar(false);
        setShowHistory(true);
    };

    return (

        <section className="flex flex-col space-y-3 z-10">
            <div className="flex flex-col w-full h-[80vh] mb-12 shadow-md overflow-hidden border-2 border-[#f1c232] relative -mt-2 rounded-[8px]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: "white",
                        opacity: '70%',
                        zIndex: 1,
                        borderRadius: "8px"
                    }}
                ></div>
                <div className="font-sans text-gray-800 mx-3 z-50">
                    <h2 className="text-[17px] font-bold text-[#274e13] mb-8">EARNINGS</h2>
                    <div className="flex flex-row gap-0 w-[100%] justify-start">
                        <div className="w-[34%]">
                            <h3 className="flex flex-row text-red-600 font-bold mb-3 text-[14px]">Time Period</h3>
                            <div className="space-y-2 text-[12px]">
                                <div className="flex justify-between"><span>Today</span></div>
                                <div className="flex justify-between"><span>This Week</span></div>
                                <div className="flex justify-between"><span>This Month</span></div>
                            </div>
                        </div>
                        <div className="w-[15%] flex flex-col items-start">
                            <h3 className="text-red-600 font-bold mb-3 text-[14px]">Amount</h3>
                            <div className="space-y-2 text-sm text-[12px]">
                                <div className="flex justify-between"><span className="font-semibold">1500</span></div>
                                <div className="flex justify-between"><span className="font-semibold">6500</span></div>
                                <div className="flex justify-between"><span className="font-semibold">10500</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-gray-200 text-sm">
                        <div className="flex items-center gap-[15%] ">
                            <span className="font-bold">Date of next Payout:</span>
                            <span className="font-bold">[Tomorrows Date], [Time]</span>
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
                                <div className="grid grid-cols-2 gap-2 font-bold text-red-600 mb-2">
                                    <div>Date</div>
                                    <div className="-ml-[35%] ">Total Payout</div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="grid grid-cols-2 gap-4"><div>August 17, 2024</div><div className="-ml-[35%] ">19000</div></div>
                                    <div className="grid grid-cols-2 gap-4"><div>August 18, 2024</div><div className="-ml-[35%] ">15000</div></div>
                                    <div className="grid grid-cols-2 gap-4"><div>August 19, 2024</div><div className="-ml-[35%] ">16000</div></div>
                                    <div className="grid grid-cols-2 gap-4"><div>August 20, 2024</div><div className="-ml-[35%] ">17000</div></div>
                                </div>
                                <button className="bg-red-900 text-[13px] text-white font-bold py-1 px-4 rounded-lg hover:bg-opacity-90 shadow-lg mt-6 mb-4">
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