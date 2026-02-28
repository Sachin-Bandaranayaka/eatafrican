"use client";
import { ChevronDown } from "lucide-react";

interface HeaderProps {
    currentView: string;
    setCurrentView: (view: string) => void;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (isOpen: boolean) => void;
    onLogout?: () => void;
}

const Header = ({ currentView, setCurrentView, isDropdownOpen, setIsDropdownOpen, onLogout }: HeaderProps) => {
    return (
        <header className="flex flex-row justify-end z-50">
            {/* Right side content */}
            <div className="flex flex-col  md:items-end space-y-3 z-50">
                <div className="flex flex-wrap justify-center md:justify-end gap-2 z-50">
                    <div className="bg-green-900 text-white rounded-[9px] w-36 py-1.5 px-1 md:px-3 text-[5px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] font-semibold whitespace-nowrap flex items-center justify-center">
                        <span>{currentView}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;