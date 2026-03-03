"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import DriverPortalAuth from '@/components/driverPortalAuth';
import DriverPortal from '@/components/driverPortal';
import CustomDropdown from '../../app/components/DropDown';
import {
    DRIVER_PORTAL_ORDER_ID_QUERY_KEY,
    DRIVER_PORTAL_SECTION_QUERY_KEY,
    DriverPortalSection,
    getDriverPortalSection,
} from '@/components/driverPortal/sectionContract';

export default function DriverPortalPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const section = getDriverPortalSection(searchParams.get(DRIVER_PORTAL_SECTION_QUERY_KEY));
    const orderId = searchParams.get(DRIVER_PORTAL_ORDER_ID_QUERY_KEY) ?? undefined;
    const currentLanguage = (() => {
        const value = (searchParams.get('lang') ?? 'en').toLowerCase();
        return value === 'fr' || value === 'es' ? value : 'en';
    })();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        try {
            const token = localStorage.getItem('accessToken');
            const userStr = localStorage.getItem('user');

            if (!token || !userStr) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            const user = JSON.parse(userStr);
            
            if (user.role !== 'driver') {
                alert('Access denied. Drivers only.');
                router.push('/');
                return;
            }

            setIsAuthenticated(true);
            setLoading(false);
        } catch (error) {
            console.error('Auth check error:', error);
            setIsAuthenticated(false);
            setLoading(false);
        }
    };

    const handleLoginSuccess = () => {
        checkAuth();
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
    };

    const handleLanguageChange = (nextLanguage: string) => {
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.set('lang', nextLanguage);
        const query = nextParams.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="relative w-full min-h-screen bg-black text-white overflow-hidden font-sans p-2 sm:p-8">
                {/* Language Selector */}
                <div className="absolute top-3 left-0 z-20 ml-1 origin-top scale-90 sm:scale-100">
                    <LanguageSelector
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                    />
                </div>

                {/* Portal and Login Information */}
                <div className="absolute top-2 left-0.5 z-20">
                    <div
                        className="text-white text-[9px] sm:text-xs font-bold mt-16 sm:mt-20 px-3 sm:px-6 py-1 sm:py-2 border inline-block whitespace-nowrap"
                        style={{ backgroundColor: '#2F6B2F', borderColor: '#2F6B2F' }}
                    >
                        EAT AFRICAN DRIVER PORTAL
                    </div>
                    <div className="flex items-center gap-1 font-bold text-[10px] sm:text-xs mt-6 sm:mt-8 ml-8 sm:ml-10 pl-2 sm:pl-4">
                        <span className="relative w-6 h-6 sm:w-[30px] sm:h-[30px]">
                            <Image src="/images/folk_link.png" alt="Fork Link" fill className="object-contain" />
                        </span>
                        <span style={{ color: '#F2C94C' }}>Login</span>
                    </div>
                </div>

                {/* Top Right Buttons */}
                <div className="absolute top-3 sm:top-4 right-4 sm:right-12 z-20 w-fit flex items-center space-x-3 sm:space-x-6 origin-top-right scale-90 sm:scale-100">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center space-x-2 hover:text-yellow-500 transition group"
                    >
                        <span className="text-[10px] sm:text-xs font-bold group-hover:text-yellow-500" style={{ color: '#F2C94C' }}>
                            BACK TO HOME
                        </span>
                        <div className="relative w-7 h-7 sm:w-8 sm:h-8">
                            <Image src="/images/folk_link.png" alt="Home" fill className="object-contain" />
                        </div>
                    </button>
                    <button className="relative w-7 h-7 sm:w-8 sm:h-8 hover:scale-110 transition">
                        <Image src="/images/cart_icon.png" alt="Cart" fill className="object-contain" />
                    </button>
                </div>

                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/eatafricanbck1 (1).png"
                        alt="Background"
                        fill
                        className="object-cover opacity-60 transition-opacity duration-500"
                        priority
                    />
                    {/* Overlay gradient for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <DriverPortalAuth onLoginSuccess={handleLoginSuccess} />
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-screen bg-black text-white overflow-hidden font-sans p-2 sm:p-8">
            {/* Language Selector */}
            <div className="absolute top-3 left-0 z-20 ml-1 origin-top scale-90 sm:scale-100">
                <LanguageSelector
                    currentLanguage={currentLanguage}
                    onLanguageChange={handleLanguageChange}
                />
            </div>

            {/* Portal and Login Information */}
            <div className="absolute top-2 left-0.5 z-20">
                <div
                    className="text-white text-[9px] sm:text-xs font-bold mt-16 sm:mt-20 px-3 sm:px-6 py-1 sm:py-2 border inline-block whitespace-nowrap"
                    style={{ backgroundColor: '#2F6B2F', borderColor: '#2F6B2F' }}
                >
                    EAT AFRICAN DRIVER PORTAL
                </div>
                {/* Dropdown Menu */}
                <PortalDropdown />
            </div>

            {/* Top Right Buttons */}
            <div className="absolute top-3 sm:top-4 right-4 sm:right-12 z-50 w-fit flex items-center space-x-3 sm:space-x-6 origin-top-right scale-90 sm:scale-100">
                <button
                    onClick={handleLogout}
                    className="group flex items-center pointer-events-auto"
                >
                    <span className="relative text-[10px] sm:text-xs font-bold text-yellow-500 pr-2 sm:pr-4 pb-0.5 sm:pb-1">
                        LOGOUT
                        <span
                            className="absolute bottom-0 h-[1.5px] bg-white transition-all
                                       group-hover:bg-yellow-500"
                            style={{ left: '-1rem', width: 'calc(100% + 2rem)' }}
                        />
                    </span>
                    <span className="relative w-8 h-8 sm:w-10 sm:h-10 -ml-2 sm:-ml-3">
                        <Image
                            src="/images/UserIcon (1).png"
                            alt="Profile"
                            fill
                            className="object-contain"
                        />
                    </span>
                </button>
                <button className="relative w-7 h-7 sm:w-8 sm:h-8 hover:scale-110 transition">
                    <Image src="/images/cart_icon.png" alt="Cart" fill className="object-contain" />
                </button>
            </div>

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/eatafricanbck1 (1).png"
                    alt="Background"
                    fill
                    className="object-cover opacity-60 transition-opacity duration-500"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            </div>

            <div
                className="relative z-10"
                data-driver-portal-section={section}
                data-driver-portal-order-id={orderId ?? ''}
            >
                <DriverPortal onClose={handleLogout} />
            </div>
        </div>
    );
}

function LanguageSelector({
    currentLanguage,
    onLanguageChange,
}: {
    currentLanguage: 'en' | 'fr' | 'es';
    onLanguageChange: (nextLanguage: string) => void;
}) {
    const selectRef = useRef<HTMLSelectElement>(null);

    const openSelect = () => {
        const select = selectRef.current;
        if (!select) return;

        const picker = select as HTMLSelectElement & { showPicker?: () => void };
        if (typeof picker.showPicker === 'function') {
            picker.showPicker();
            return;
        }

        select.focus();
        select.click();
    };

    return (
        <div className="relative">
            <select
                ref={selectRef}
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-black text-white font-bold px-1 py-3 sm:py-4 pl-6 sm:pl-8 pr-6 sm:pr-8 rounded text-[10px] sm:text-xs appearance-none cursor-pointer"
            >
                <option value="en">EN</option>
                <option value="fr">FR</option>
                <option value="es">ES</option>
            </select>
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    openSelect();
                }}
                onClick={openSelect}
                className="absolute right-0 top-0 z-10 h-full w-6 sm:w-8"
                aria-label="Open language selector"
            >
                <ChevronDown size={14} strokeWidth={4} className="mx-auto w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] text-white" />
            </button>
        </div>
    );
}

// Portal Dropdown Component - Navigation menu for driver portal sections
function PortalDropdown() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const section = getDriverPortalSection(searchParams.get(DRIVER_PORTAL_SECTION_QUERY_KEY));
    const sectionItems: { section: DriverPortalSection; label: string }[] = [
        { section: "overview", label: "OVERVIEW" },
        { section: "new-deliveries", label: "NEW" },
        { section: "scheduled", label: "SCHEDULED" },
        { section: "history", label: "HISTORY" },
        { section: "earnings", label: "EARNINGS" },
        { section: "account", label: "ACCOUNT" },
    ];
    const activeLabel = sectionItems.find((item) => item.section === section)?.label ?? "OVERVIEW";

    const navigateToSection = (nextSection: DriverPortalSection) => {
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.set(DRIVER_PORTAL_SECTION_QUERY_KEY, nextSection);

        if (nextSection !== "new-deliveries") {
            nextParams.delete(DRIVER_PORTAL_ORDER_ID_QUERY_KEY);
        }

        const query = nextParams.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    };

    const handleOptionSelect = (selectedLabel: string) => {
        const selectedItem = sectionItems.find((item) => item.label === selectedLabel);
        if (!selectedItem) return;
        navigateToSection(selectedItem.section);
    };

    return (
        <div className="mt-2">
            <CustomDropdown
                options={sectionItems.map((item) => item.label)}
                defaultOption={activeLabel}
                backgroundColor="#14532d"
                textColor="#FFFFFF"
                width="160px"
                mobileWidth="112px"
                onOptionSelect={handleOptionSelect}
            />
        </div>
    );
}








