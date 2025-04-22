"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocationContext } from "@/lib/location-context";

type CountrySpecialty = "ETHIOPIA, ERITREA" | "KENYA" | "NIGERIA, GHANA";
type Location = "BERN" | "OLTEN" | "LUZERN" | "ZURICH";

export default function LocationSelection() {
    const { t } = useLocationContext();
    const [selectedCountry, setSelectedCountry] = useState<CountrySpecialty | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    const countrySpecialties: CountrySpecialty[] = ["ETHIOPIA, ERITREA", "KENYA", "NIGERIA, GHANA"];
    const locations: { [key: string]: number } = {
        "BERN": 1,
        "OLTEN": 1,
        "LUZERN": 2,
        "ZURICH": 3
    };

    const handleCountrySelect = (country: CountrySpecialty) => {
        setSelectedCountry(country);
    };

    const handleLocationSelect = (location: Location) => {
        setSelectedLocation(location);
    };

    const getCuisineType = (country: CountrySpecialty | null): string => {
        if (country === "ETHIOPIA, ERITREA") return "ETHIOPIAN, ERITREAN";
        if (country === "KENYA") return "KENYAN";
        if (country === "NIGERIA, GHANA") return "NIGERIAN, GHANA";
        return "";
    };

    return (
        <div className="bg-white/50 rounded-lg p-4 sm:p-5 w-full max-w-md sm:max-w-lg md:max-w-lg lg:max-w-xl mx-auto relative shadow-lg">

            {/* Scrollable Row on Small Screens */}
            <div className="flex flex-row md:grid md:grid-cols-2 gap-4 mb-4 overflow-x-auto no-scrollbar">

                {/* COUNTRY SPECIALTY SECTION */}
                <div className="p-2 min-w-[230px]">
                    <div className="bg-[#fff2cc] text-center py-1 px-3 rounded-r-xl mb-3 inline-block mx-auto sm:mx-0 ml-10 lg:ml-10">
                        <h3 className="font-semibold text-black text-[10px] sm:text-xs uppercase">COUNTRY SPECIALTY</h3>
                    </div>

                    <div className="space-y-2 pl-2 sm:pl-4 mt-2 ml-4">
                        {countrySpecialties.map((country) => (
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
                        ))}
                    </div>
                </div>

                {/* INFO TEXT */}
                <div className="p-0 flex items-center justify-center min-w-auto mt-12">
                    <div className="bg-[#fff2cc] text-start py-1 px-1 rounded-2xl mr-10">
                        <h3 className="font-semibold text-black text-[8px] sm:text-xs uppercase p-2 leading-tight">
                            CHOOSE AN AFRICAN SPECIALTY TO EXPLORE ITS DETAILS AND LOCATIONS WITH RESTAURANTS OFFERING IT
                        </h3>
                    </div>
                </div>
            </div>

            {/* CHEF IMAGES */}
            <div className="absolute left-0 bottom-0 w-40 h-40 sm:w-28 sm:h-36 md:w-28 md:h-64 z-10 -translate-x-1/3">
                <Image
                    src="/images/chef-male.png"
                    alt="Male Chef"
                    fill
                    className="object-contain object-bottom"
                    priority
                />
            </div>

            <div className="absolute right-0 bottom-0 w-40 h-40 sm:w-28 sm:h-36 md:w-28 md:h-64 z-10 translate-x-1/3">
                <Image
                    src="/images/chef-female.png"
                    alt="Female Chef"
                    fill
                    className="object-contain object-bottom"
                    priority
                />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 md:mt-8 relative z-20">
                {selectedCountry && (
                    <button
                        className="bg-amber-100 text-amber-900 border-2 border-amber-400 rounded-full py-1 px-3 text-xs font-semibold hover:bg-amber-200 transition duration-200 whitespace-nowrap"
                    >
                        ABOUT {getCuisineType(selectedCountry)} CUISINE
                    </button>
                )}
                {selectedCountry && selectedLocation && (
                    <Link href={`/restaurants?country=${encodeURIComponent(selectedCountry)}&location=${encodeURIComponent(selectedLocation)}`} passHref legacyBehavior>
                        <a className="inline-block">
                            <button
                                className="w-full sm:w-auto bg-red-900 text-white border-2 border-amber-400 rounded-full py-1 px-3 text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap"
                            >
                                SEE RESTAURANTS
                            </button>
                        </a>
                    </Link>
                )}
                {!selectedCountry || !selectedLocation ? <div className="h-[30px]"></div> : null}
            </div>
        </div>
    );
}
