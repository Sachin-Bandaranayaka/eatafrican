"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocationContext } from "../lib/location-context";

type CountrySpecialty = "ETHIOPIA, ERITREA" | "KENYA" | "NIGERIA, GHANA";
type Location = "BERN" | "OLTEN" | "LUZERN" | "ZURICH";

interface LocationSelectionProps {
    onViewMenu: (restaurant: string) => void;
    isViewingMenu: boolean;
    selectedRestaurant: string | null;
    onChange: () => void;
}

export default function LocationSelectionMobile({ onViewMenu, isViewingMenu, selectedRestaurant, onChange }: LocationSelectionProps) {
    const { t } = useLocationContext();
    const [selectedCountry, setSelectedCountry] = useState<CountrySpecialty | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [showError, setShowError] = useState(false);
    const [selectedRestaurantInternal, setSelectedRestaurantInternal] = useState<string | null>(null);

    const countrySpecialties: CountrySpecialty[] = ["ETHIOPIA, ERITREA", "KENYA", "NIGERIA, GHANA"];
    const locations: { [key: string]: number } = {
        "BERN": 1,
        "OLTEN": 1,
        "LUZERN": 2,
        "ZURICH": 3
    };

    const handleCountrySelect = (country: CountrySpecialty) => {
        setSelectedCountry(country);
        setSelectedLocation(null);
        setSelectedRestaurantInternal(null);
        setShowError(false);
        onChange();
    };

    const handleLocationSelect = (location: Location) => {
        setSelectedLocation(location);
        setSelectedRestaurantInternal(null);
        setShowError(false);
        onChange();
    };

    const handleRestaurantSelect = (restaurant: string) => {
        setSelectedRestaurantInternal(restaurant);
        setShowError(false);
        onChange();
    };

    const handleViewMenuClick = () => {
        const restaurantToView = selectedRestaurantInternal;
        if (!restaurantToView) {
            setShowError(true);
        } else {
            // Update parent state to indicate VIEW MENU was clicked, but do not render ViewMenu
            onViewMenu(restaurantToView);
        }
    };

    const handleChange = () => {
        setShowError(false);
        onChange();
    };

    const handleHome = () => {
        window.location.href = "/";
    };

    const getCuisineType = (country: CountrySpecialty | null): string => {
        if (country === "ETHIOPIA, ERITREA") return "ETHIOPIAN, ERITREAN";
        if (country === "KENYA") return "KENYAN";
        if (country === "NIGERIA, GHANA") return "NIGERIAN, GHANA";
        return "";
    };

    return (
        <div className="bg-white/50 rounded-lg p-2 w-full max-w-full mx-auto relative shadow-lg ml-1">
            {/* Headings: COUNTRY SPECIALTY, LOCATION, RESTAURANT on same level */}
            <div className="flex justify-around mb-4 mt-1">
                <div className="bg-[#fff2cc] text-center py-0.5 px-2 rounded-r-xl z-20">
                    <h3 className="font-semibold text-black text-[8px] sm:text-xs uppercase">COUNTRY SPECIALTY</h3>
                </div>
                <div className="bg-[#fff2cc] text-center py-0.5 px-2 rounded-r-xl z-20">
                    <h3 className="font-semibold text-black text-[8px] sm:text-xs uppercase">SELECTED LOCATION</h3>
                </div>
                <div className="bg-[#fff2cc] text-center py-0.5 px-2 rounded-r-xl z-20">
                    <h3 className="font-semibold text-black text-[8px] sm:text-xs uppercase">SELECTED RESTAURANT</h3>
                </div>
            </div>

            {/* Sections: Country, Location, Restaurant on same horizontal level always */}
            <div className="flex justify-around gap-4">
                {/* Country Selection */}
                <div className="space-y-1 pl-1 mt-6 w-56">
                    {!isViewingMenu ? (
                        countrySpecialties.map((country) => {
                            const isVisible = !isViewingMenu || selectedCountry === country;
                            return (
                                <label key={country} className="custom-radio text-black flex items-center cursor-pointer gap-1 flex-wrap">
                                    <input
                                        type="radio"
                                        name="country"
                                        checked={selectedCountry === country}
                                        onChange={() => handleCountrySelect(country)}
                                        className="appearance-none mr-2"
                                    />
                                    <span className="text-[8px] sm:text-xs font-medium">{country}</span>
                                    <div className="flex items-center gap-1">
                                        {country === "ETHIOPIA, ERITREA" && (
                                            <>
                                                <Image src="/flags/ethiopia.png" alt="Ethiopia" width={12} height={8} className="sm:w-[16px] sm:h-[10px]" />
                                                <Image src="/flags/eritrea.png" alt="Eritrea" width={12} height={8} className="sm:w-[16px] sm:h-[10px]" />
                                            </>
                                        )}
                                        {country === "KENYA" && (
                                            <Image src="/flags/kenya.png" alt="Kenya" width={12} height={8} className="sm:w-[16px] sm:h-[10px]" />
                                        )}
                                        {country === "NIGERIA, GHANA" && (
                                            <>
                                                <Image src="/flags/ghana.png" alt="Ghana" width={12} height={8} className="sm:w-[16px] sm:h-[10px]" />
                                                <Image src="/flags/nigeria.png" alt="Nigeria" width={12} height={8} className="sm:w-[16px] sm:h-[10px]" />
                                            </>
                                        )}
                                    </div>
                                </label>
                            );
                        })
                    ) : (
                        <label className="custom-radio text-black flex items-center cursor-pointer gap-1 flex-wrap">
                            <input
                                type="radio"
                                name="country"
                                checked
                                readOnly
                                className="appearance-none mr-2"
                            />
                            <span className="text-[8px] sm:text-xs font-medium">{selectedCountry}</span>
                            <div className="flex items-center gap-1">
                                {selectedCountry === "ETHIOPIA, ERITREA" && (
                                    <>
                                        <Image src="/flags/ethiopia.png" alt="Ethiopia" width={12} height={8} className="sm:w-[16px] sm:h-[10px]" />
                                        <Image src="/flags/eritrea.png" alt="Eritrea" width={12} height={8} className="sm:w-[16px] sm:h-[10px]" />
                                    </>
                                )}
                                {selectedCountry === "KENYA" && (
                                    <Image src="/flags/kenya.png" alt="Kenya" width={12} height={8} className="sm:w-[16px] sm:h-[10px]" />
                                )}
                                {selectedCountry === "NIGERIA, GHANA" && (
                                    <>
                                        <Image src="/flags/ghana.png" alt="Ghana" width={12} height={8} className="sm:w-[16px] sm:h-[10px]" />
                                        <Image src="/flags/nigeria.png" alt="Nigeria" width={12} height={8} className="sm:w-[16px] sm:h-[10px]" />
                                    </>
                                )}
                            </div>
                        </label>
                    )}
                    {isViewingMenu && selectedCountry && (
                        <button
                            onClick={handleChange}
                            className="mt-4 bg-red-900 text-white border-2 border-amber-400 rounded-lg py-1 px-3 w-[80px] sm:w-[100px] text-[10px] sm:text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap"
                        >
                            CHANGE
                        </button>
                    )}
                </div>

                {/* Location Selection */}
                <div className="space-y-1 pl-1 w-28 mt-6">
                    {selectedCountry ? Object.keys(locations).map((location) => {
                        const isVisible = !isViewingMenu || selectedLocation === location;
                        if (!isVisible) return null;
                        return (
                            <label key={location} className="custom-radio text-black flex items-center cursor-pointer gap-1 flex-wrap">
                                <input
                                    type="radio"
                                    name="location"
                                    checked={selectedLocation === location}
                                    onChange={() => handleLocationSelect(location as Location)}
                                    className="appearance-none mr-2"
                                />
                                <span className="text-[8px] sm:text-xs font-medium">{location}</span>
                            </label>
                        );
                    }) : (
                        <div className="h-20"></div>
                    )}
                </div>

                {/* Restaurant Selection */}
                <div className="space-y-1 pl-1 w-44 mt-6">
                    {/* See Restaurant List */}
                    {selectedCountry && !selectedLocation && (
                        <div className="p-0 flex items-center justify-center w-full" style={{ maxWidth: '160px' }}>
                            <div className="bg-[#fff2cc] text-start py-0.5 px-1 rounded-2xl">
                                <h3 className="font-semibold text-black text-[6px] sm:text-[8px] uppercase p-1 leading-tight">
                                    CHOOSE A LOCATION TO SEE RESTAURANT LIST AND VIEW THEIR MENU
                                </h3>
                            </div>
                        </div>
                    )}
                    {selectedLocation ? [...Array(locations[selectedLocation] || 1)].map((_, index) => {
                        const restaurantName = `African Restaurant ${index + 1}`;
                        const isVisible = !isViewingMenu || selectedRestaurant === restaurantName;
                        if (!isVisible) return null;
                        return (
                            <label key={restaurantName} className="custom-radio text-black flex flex-col items-center cursor-pointer gap-1 flex-wrap">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="restaurant"
                                        checked={selectedRestaurantInternal === restaurantName}
                                        onChange={() => handleRestaurantSelect(restaurantName)}
                                        className="appearance-none mr-2"
                                    />
                                    <span className="text-[10px] sm:text-sm">{restaurantName}</span>
                                </div>
                            </label>
                        );
                    }) : (
                        <div className="h-0"></div>
                    )}
                    {showError && (
                        <p className="text-red-600 text-[10px] sm:text-xs font-bold mt-1">Choose a restaurant to view menu</p>
                    )}

                    {/* Explore Details */}
                    {!selectedCountry && (
                        <div className="absolute p-0 flex items-center justify-center w-56 mt-6 -ml-24">
                            <div className="bg-[#fff2cc] text-start py-0.5 px-1 rounded-md p-4">
                                <h3 className="font-semibold text-black text-[6px] sm:text-[8px] uppercase p-1 leading-tight">
                                    CHOOSE AN AFRICAN SPECIALTY TO EXPLORE ITS DETAILS AND LOCATIONS WITH RESTAURANTS OFFERING IT
                                </h3>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end mr-14">
                        {selectedLocation && !isViewingMenu && (
                            <button
                                onClick={handleViewMenuClick}
                                className="bg-red-900 text-white border-2 border-amber-400 rounded-lg py-1 px-3 sm:py-2 sm:px-4 text-[10px] sm:text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap"
                            >
                                VIEW MENU
                            </button>
                        )}
                        {isViewingMenu && (
                            <button
                                onClick={handleHome}
                                className="mt- bg-red-900 text-white border-2 border-amber-400 rounded-lg py-1 px-3 w-[80px] sm:w-[100px] text-[10px] sm:text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap"
                            >
                                HOME
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col justify-start gap-2 mt-3 relative z-20">
                {!isViewingMenu && selectedCountry && (
                    <span
                        className="text-black underline cursor-pointer text-[8px] sm:text-xs font-semibold hover:text-amber-700 transition duration-200 whitespace-nowrap"
                    >
                        ABOUT {getCuisineType(selectedCountry)} SPECIALTY
                    </span>
                )}
                {!selectedCountry || !selectedLocation ? <div className="h-[20px]"></div> : null}
            </div>
        </div>
    );
}