// components/superAdmin/header.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

// Define the props for the Header component. It now expects to receive the
// current view and a function to call when the view should change.
interface HeaderProps {
    currentView: string;
    onViewChange: (view: string) => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
    // State for the dropdown visibility is still managed internally.
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // The list of available views.
    const views = ['DASHBOARD', 'ORDERS', 'EARNINGS', 'PAYOUTS', 'RESTAURANT', 'DELIVERY BACKEND' , 'DELIVERY DRIVERS', 'CUSTOMER ACCOUNT', 'ANALYTICS', 'VOUCHERS', 'SETTINGS'];

    return (
        <header className="flex flex-row justify-center z-50 mt-20 px-12">
            <div className="flex items-start">
                <div className="relative rounded-sm">

                    {/* light Overlay */}
                    <div
                        className="absolute inset-0 rounded-sm"
                        style={{
                            backgroundColor: "white",
                            opacity: '80%',
                            zIndex: 1,
                        }}
                    >
                    </div>

                    {/* Content (Info and Dropdown) */}
                    <div className="relative z-10 flex flex-row w-full items-center p-[1%] mr-10 px-1 md:px-6 py-2">
                        {/* Dashboard Info */}
                        <div className="pt-[1%] pb-[1%] pl-0 flex flex-col justify-center space-y-0 w-full">
                            <div className="relative z-10 md:ml-2">
                                <h1 className="text-black font-bold text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">
                                    EAT AFRICAN ADMIN PORTAL
                                </h1>
                            </div>
                        </div>

                        {/* Dropdown button list */}
                        <div className="relative z-10">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                // Increased width to w-48 to better fit longer item names
                                className={`bg-amber-500 text-white w-32 md:w-48 py-1.5 px-3 font-semibold transition-all duration-200 whitespace-nowrap flex items-center justify-between ${isDropdownOpen ? 'rounded-t-lg' : 'rounded-lg'} text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]`}
                            >
                                {/* Display the current view from props */}
                                <span>{currentView}</span>
                                <ChevronDown style={{ strokeWidth: 6 }} size={12} />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 w-32 md:w-48 bg-amber-500 text-white rounded-b-lg shadow-lg z-50">
                                    {views
                                        .filter(view => view !== currentView)
                                        .map(view => (
                                            <button
                                                key={view}
                                                onClick={() => {
                                                    // When a new view is clicked, call the function from props
                                                    onViewChange(view);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="block w-full text-left px-3 py-1.5 font-semibold hover:bg-amber-600 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]"
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