'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Home } from 'lucide-react';

interface RestaurantHeaderProps {
    country: string;
    location: string;
}

// Helper to get flag image source based on country string
const getFlagSrc = (country: string): string[] => {
    const flags = [];
    if (country.includes('ETHIOPIA') || country.includes('ERITREA')) {
        flags.push('/images/flags/ethiopia.png', '/images/flags/eritrea.png');
    }
    if (country.includes('KENYA')) {
        flags.push('/images/flags/kenya.png');
    }
    if (country.includes('NIGERIA') || country.includes('GHANA')) {
        flags.push('/images/flags/nigeria.png', '/images/flags/ghana.png');
    }
    return flags.slice(0, 2); // Max 2 flags
};

// Helper to format title
const formatTitle = (country: string, location: string): string => {
    // Basic formatting, can be improved
    const countryPart = country.replace(', ', ' & ');
    return `${countryPart.toUpperCase()} RESTAURANTS IN ${location.toUpperCase()}`;
};

export default function RestaurantHeader({ country, location }: RestaurantHeaderProps) {
    const flags = getFlagSrc(country);
    const title = formatTitle(country, location);

    const buttonStyle = "bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-1 px-3 rounded-full border border-amber-400 transition duration-200 flex items-center gap-1";

    return (
        <div className="bg-amber-800/90 rounded-lg p-3 mb-4 flex flex-col md:flex-row justify-between items-center gap-3">
            {/* Left: Flags & Title */}
            <div className="flex items-center gap-2">
                {flags.map((flag, index) => (
                    <div key={index} className="relative w-6 h-4">
                        <Image src={flag} alt={`Flag ${index + 1}`} fill className="object-cover rounded-sm" />
                    </div>
                ))}
                <h1 className="text-white text-sm md:text-base font-bold whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                    {title}
                </h1>
            </div>

            {/* Right: Buttons */}
            <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
                <button className={buttonStyle}>
                    SORT BY <ChevronDown size={14} />
                </button>
                <Link href="/">
                    <button className={buttonStyle}>
                        CHANGE COUNTRY SPECIALTY / LOCATION
                    </button>
                </Link>
                <Link href="/">
                    <button className={`${buttonStyle} px-2`} aria-label="Home">
                        <Home size={16} />
                    </button>
                </Link>
            </div>
        </div>
    );
} 