"use client";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// Define the types for the props
interface HeaderProps {
    currentView: string;
    setCurrentView: Dispatch<SetStateAction<string>>;
    isDropdownOpen: boolean;
    setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Header({ currentView, setCurrentView, isDropdownOpen, setIsDropdownOpen }: HeaderProps) {
    const views = ['ORDERS', 'ACCOUNT', 'EARNINGS'];
    const [driverName, setDriverName] = useState('Driver');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.firstName) {
                setDriverName(user.firstName);
            }
        }
    }, []);

    return (
        <header className="flex flex-row justify-center z-50">
            <div className="flex items-start">
                <div className="relative rounded-xl">

                    {/* light Overlay */}
                    <div
                        className="absolute inset-0 rounded-lg"
                        style={{
                            backgroundColor: "white",
                            opacity: '80%',
                            zIndex: 1,
                        }}
                    >
                    </div>

                    {/* Content (Info and Dropdown) */}
                    <div className="relative z-10 flex flex-row w-full p-[1%] mr-10 px-6">
                        {/* Dashboard Info */}
                        <div className="pt-[1%] pb-[1%] pl-0 flex flex-col justify-center space-y-0 w-full">
                            <div className="relative z-10 ml-2">
                                <h1 className="text-black text-[8px] md:text-[13px] font-bold">
                                    hello, {driverName}
                                </h1>
                                <h1 className="text-black text-[8px] md:text-[13px] font-bold">
                                    Have a nice day!
                                </h1>
                                <h1 className="text-black text-[8px] md:text-[13px] font-bold">
                                    {/* Dynamically display current date and time */}
                                    {new Date().toLocaleString()}
                                </h1>
                            </div>
                        </div>

                        {/* Dropdown button list */}
                        <div className="relative z-10">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-green-900 text-white rounded-lg w-40 py-1.5 px-3 text-[12px] font-semibold transition duration-200 whitespace-nowrap flex items-center justify-between"
                            >
                                <span>{currentView}</span>
                                <ChevronDown style={{ strokeWidth: 6 }} size={12} />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 -mt-11 pt-2 w-40 bg-green-900 text-white rounded-bl-[9px] rounded-br-[9px] shadow-lg z-50">
                                    {views.map(view => (
                                        <button
                                            key={view}
                                            onClick={() => {
                                                setCurrentView(view);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 text-[12px] font-semibold hover:bg-gray-600"
                                        >
                                            {view}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}