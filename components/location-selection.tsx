"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocationContext } from "../lib/location-context";
import ViewMenu from "./view-menu";

type CountrySpecialty = "ETHIOPIA, ERITREA" | "KENYA" | "NIGERIA, GHANA";
type Location = "BERN" | "OLTEN" | "LUZERN" | "ZURICH";

interface LocationSelectionProps {
    onViewMenu: (restaurant: string) => void;
    isViewingMenu: boolean;
    selectedRestaurant: string | null;
    onChange: () => void;
}

export default function LocationSelection({ onViewMenu, isViewingMenu, selectedRestaurant, onChange }: LocationSelectionProps) {
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
        <div className="bg-white/50 rounded-lg p-4 sm:p-5 w-full max-w-7xl mx-auto relative shadow-lg ml-1">

            {/* Scrollable Row on Small Screens */}
            <div className="flex flex-row md:grid md:grid-cols-2 gap-4 mb-4 overflow-x-auto no-scrollbar ">
            </div>

            {/* LOCATION */}
            <div className="absolute" style={{ minHeight: '120px' }}>
                <div className="flex justify-center -mt-4 ml-72">
                    <div className="absolute bg-[#fff2cc] text-center py-1 px-3 rounded-r-xl z-20 mt-2">
                        <h3 className="font-semibold text-black text-[10px] sm:text-xs uppercase">LOCATION</h3>
                    </div>
                </div>

                {/* Location Selection */}
                {selectedCountry && (
                    <div className="flex  mt-10 mb-6 absolute z-20 ml-56">
                        <div className="space-y-2 pl-2 sm:pl-4 w-36">
                            {Object.keys(locations).map((location) => {
                                const isVisible = !isViewingMenu || selectedLocation === location;
                                if (!isVisible) return null;
                                return (
                                    <label key={location} className="custom-radio text-black flex items-center cursor-pointer gap-1 flex-wrap sm:flex-nowrap">
                                        <input
                                            type="radio"
                                            name="location"
                                            checked={selectedLocation === location}
                                            onChange={() => handleLocationSelect(location as Location)}
                                            className="appearance-none mr-2"
                                        />
                                        <span className="text-xs font-medium">{location}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className=" flex flex-row md:grid md:grid-cols-2 gap-4 mb-4 overflow-x-auto no-scrollbar ">

                {/* COUNTRY SPECIALTY SECTION */}
                <div className="p-2 min-w-[230px]">

                    {/* Chef male */}
                    <div className="absolute left-0 -top-40 w-32 h-32 sm:w-24 sm:h-28 md:w-24 md:h-52 z-10 translate-x-1/4 hidden sm:block">
                        <Image
                            src="/images/chef-male.png"
                            alt="Male Chef"
                            fill
                            className="object-contain object-bottom"
                            priority
                        />
                    </div>

                    {/* Chef female */}
                    <div className="absolute right-6 -top-40 w-32 h-32 sm:w-24 sm:h-28 md:w-24 md:h-52 z-10 -translate-x-1/2 hidden sm:block">
                        <Image
                            src="/images/chef-female.png"
                            alt="Female Chef"
                            fill
                            className="object-contain object-bottom"
                            priority
                        />
                    </div>

                    {/* RESTUARANT */}
                    <div className="absolute right-10 bottom-25 w-40 flex justify-center -mt-4">
                        <div className="absolute bg-[#fff2cc] text-center py-1 px-3 rounded-r-xl z-20 -ml-2 -translate-x-1/3">
                            <h3 className="font-semibold text-black text-[10px] sm:text-xs uppercase">RESTUARANT</h3>
                        </div>
                    </div>

                    {/* Restaurant Selection */}
                    {selectedLocation && (
                        <div className="flex mb-6 absolute z-20 right-10">
                            <div className="space-y-2 pl-2 sm:pl-4 w-56 mt-4">
                                {[...Array(locations[selectedLocation] || 1)].map((_, index) => {
                                    const restaurantName = `African Restaurant ${index + 1}`;
                                    const isVisible = !isViewingMenu || selectedRestaurant === restaurantName;
                                    if (!isVisible) return null;
                                    return (
                                        <label key={restaurantName} className="custom-radio text-black flex flex-col items-center cursor-pointer gap-1 flex-wrap sm:flex-nowrap">
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="restaurant"
                                                    checked={selectedRestaurantInternal === restaurantName}
                                                    onChange={() => handleRestaurantSelect(restaurantName)}
                                                    className="appearance-none mr-2"
                                                />
                                                <span className="text-sm">{restaurantName}</span>
                                            </div>
                                        </label>
                                    );
                                })}
                                {showError && (
                                    <p className="text-red-600 text-xs font-bold mt-1">Choose a restaurant to view menu</p>
                                )}

                                <div className="mt-10 flex justify-end mr-20">
                                    {!isViewingMenu ? (
                                        <button
                                            onClick={handleViewMenuClick}
                                            className="bg-red-900 text-white border-2 border-amber-400 rounded-lg py-1 px-3 text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap"
                                        >
                                            VIEW MENU
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleHome}
                                            className="mt-12 bg-red-800 text-white border-2 border-amber-400 rounded-lg py-1 px-3 text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap"
                                        >
                                            HOME
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* COUNTRY SPECIALTY */}
                    <div className="flex gap-4 ml-10  z-20 -mt-4">
                        <div className="absolute bg-[#fff2cc] text-center py-1 px-3 rounded-r-xl z-20 -ml-2 -translate-x-1/3">
                            <h3 className="font-semibold text-black text-[10px] sm:text-xs uppercase">COUNTRY SPECIALTY</h3>
                        </div>
                    </div>

                    {/* Country Selection */}
                    <div className="space-y-2 pl-2 sm:pl-4 mt-10 -ml-4 w-56">
                        {countrySpecialties.map((country) => {
                            const isVisible = !isViewingMenu || selectedCountry === country;
                            if (!isVisible) return null;
                            return (
                                <label key={country} className="custom-radio text-black flex items-center cursor-pointer gap-1 flex-wrap sm:flex-nowrap">
                                    <input
                                        type="radio"
                                        name="country"
                                        checked={selectedCountry === country}
                                        onChange={() => handleCountrySelect(country)}
                                        className="appearance-none mr-2"
                                    />
                                    <span className="text-xs font-medium">{country}</span>
                                    <div className="flex items-center gap-1">
                                        {country === "ETHIOPIA, ERITREA" && (
                                            <>
                                                <Image src="/flags/ethiopia.png" alt="Ethiopia" width={16} height={10} />
                                                <Image src="/flags/eritrea.png" alt="Eritrea" width={16} height={10} />
                                            </>
                                        )}
                                        {country === "KENYA" && (
                                            <Image src="/flags/kenya.png" alt="Kenya" width={16} height={10} />
                                        )}
                                        {country === "NIGERIA, GHANA" && (
                                            <>
                                                <Image src="/flags/ghana.png" alt="Ghana" width={16} height={10} />
                                                <Image src="/flags/nigeria.png" alt="Nigeria" width={16} height={10} />
                                            </>
                                        )}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* EXPLORE ITS DETAILS */}
                {!selectedCountry && (
                    <div className="p-0 flex items-center justify-center w-full max-w-xl mt-14">
                        <div className="bg-[#fff2cc] text-start py-1 px-1 rounded-2xl">
                            <h3 className="font-semibold text-black text-[8px] sm:text-xs uppercase p-2 leading-tight">
                                CHOOSE AN AFRICAN SPECIALTY TO EXPLORE ITS DETAILS AND LOCATIONS WITH RESTAURANTS OFFERING IT
                            </h3>
                        </div>
                    </div>
                )}

                {/* SEE RESTARUANT LIST */}
                {selectedCountry && !selectedLocation && (
                    <div className="p-0 flex items-center justify-center w-full ml-10" style={{ maxWidth: '200px', marginTop: '3.5rem' }}>
                        <div className="bg-[#fff2cc] text-start py-1 px-1 rounded-2xl">
                            <h3 className="font-semibold text-black text-[8px] sm:text-xs uppercase p-2 leading-tight">
                                CHOOSE A LOCATION TO SEE RESTARUANT LIST AND VIEW THEIR MENU
                            </h3>
                        </div>
                    </div>
                )}
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-start gap-3 mt-6 md:mt-8 relative z-20">
                {!isViewingMenu && selectedCountry && (
                    <span
                        className="text-black underline cursor-pointer text-xs font-semibold hover:text-amber-700 transition duration-200 whitespace-nowrap"
                    >
                        ABOUT {getCuisineType(selectedCountry)} SPECIALTY
                    </span>
                )}
                {isViewingMenu && selectedCountry && (
                    <button
                        onClick={handleChange}
                        className="bg-red-900 text-white rounded-lg py-1 px-3 text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap"
                    >
                        CHANGE
                    </button>
                )}
                {/* {selectedCountry && selectedLocation && (
                        <Link href={`/restaurants?country=${encodeURIComponent(selectedCountry)}&location=${encodeURIComponent(selectedLocation)}`} passHref legacyBehavior>
                            <a className="inline-block">
                                <button
                                    className="w-full sm:w-auto bg-red-900 text-white border-2 border-amber-400 rounded-full py-1 px-3 text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap"
                                >
                                    SEE RESTAURANTS
                                </button>
                            </a>
                        </Link>
                    )} */}
                {!selectedCountry || !selectedLocation ? <div className="h-[30px]"></div> : null}
            </div>

        </div>
    );
}
