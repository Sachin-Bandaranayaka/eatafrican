"use client";
import { ChevronDown } from "lucide-react";

interface HeaderProps {
    currentView: string;
    setCurrentView: (view: string) => void;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (isOpen: boolean) => void;
}

const Header = ({ currentView, setCurrentView, isDropdownOpen, setIsDropdownOpen }: HeaderProps) => {
    return (
        <header className="flex flex-row justify-between z-50">
            {/* Left side content */}
            <div className="flex items-start">
                <div
                    className="relative rounded-xl"
                    style={{
                        backgroundImage: 'url("/images/Restaurant Info_Bckimg.png")',
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        border: "2px solid #f1c232",
                    }}
                >
                    {/* Dark Overlay */}
                    <div
                        className="absolute inset-0 rounded-xl"
                        style={{
                            backgroundColor: "white",
                            opacity: '80%',
                            zIndex: 1,
                        }}
                    ></div>
                    {/* Content (Menu Icon and Restaurant Info) */}
                    <div className="relative z-10 flex flex-row w-full p-[8%] mr-10">
                        {/* Dashboard Info */}
                        <div className="pt-[1%] pb-[1%] pl-0 text-white flex flex-col space-y-0 w-full">
                            <div className="relative z-10 ml-2">
                                <h1 className="text-[#274e13] text-[8px] md:text-[13px] font-bold lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">
                                    Hallo Restaurant 89
                                </h1>
                                <h1 className="text-[#274e13] text-[8px] md:text-[13px] font-bold lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">
                                    Welcome to your Dashboard
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Right side content */}
            <div className="flex flex-col  md:items-end space-y-3 z-50">
                <div className="flex flex-wrap justify-center md:justify-end gap-2 z-50">
                    <div className="relative z-50">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="bg-green-900 text-white rounded-[9px] w-36 py-1.5 px-1 md:px-3 text-[5px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] font-semibold transition duration-200 whitespace-nowrap flex items-center justify-between"
                        >
                            <span>{currentView}</span>
                            <ChevronDown style={{ strokeWidth: 6 }} size={12} />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 -mt-2 pt-2 w-36 bg-green-900 text-white rounded-bl-[9px] rounded-br-[9px] shadow-lg z-50">
                                {['ORDERS', 'MENU', 'EARNINGS', 'MY RESTAURANT', 'TEAM MANAGEMENT', 'ACCOUNT'].map(view => (
                                    <button
                                        key={view}
                                        onClick={() => {
                                            setCurrentView(view);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-2 py-1 text-[5px] md:text-[12px] font-semibold hover:bg-gray-600"
                                    >
                                        {view}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;