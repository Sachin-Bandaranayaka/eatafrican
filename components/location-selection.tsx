"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocationContext } from "@/lib/location-context";

// TODO: Define types for modal content if needed for the 'About Cuisine' button
// type CuisineInfoModalContent = "ethiopian" | "kenyan" | "nigerian_ghanaian" | null;

type CountrySpecialty = "ETHIOPIA, ERITREA" | "KENYA" | "NIGERIA, GHANA";
type Location = "BERN" | "OLTEN" | "LUZERN" | "ZURICH";

export default function LocationSelection() {
    const { t } = useLocationContext();
    const [selectedCountry, setSelectedCountry] = useState<CountrySpecialty | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    // TODO: Add state for cuisine info modal: const [cuisineModalOpen, setCuisineModalOpen] = useState<CuisineInfoModalContent>(null);

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

    // TODO: Function to open cuisine modal: const openCuisineModal = (cuisine: CuisineInfoModalContent) => setCuisineModalOpen(cuisine);

    const getCuisineType = (country: CountrySpecialty | null): string => {
        if (country === "ETHIOPIA, ERITREA") return "ETHIOPIAN, ERITREAN";
        if (country === "KENYA") return "KENYAN";
        if (country === "NIGERIA, GHANA") return "NIGERIAN, GHANA";
        return "";
    }

    return (
        // Main container with amber background, rounded corners, padding, and max-width
        <div className="bg-white/50 rounded-lg p-5 md:p-7 w-full max-w-md md:max-w-2xl mx-auto relative shadow-xl ml-4">
            {/* Removed the explicit title H2 here as it's handled in page.tsx */}

            {/* Grid for selection areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Left side - Country selection */}
                <div className="p-2">
                    <div className="bg-[#fff2cc] text-center py-1 px-4 rounded-r-lg mb-3 inline-block ml-20">
                        <h3 className="font-semibold text-black text-xs uppercase">COUNTRY SPECIALTY</h3>
                    </div>

                    <div className="space-y-2 pl-8 sm:pl-12 md:pl-10 mt-2">
                        {countrySpecialties.map((country) => (
                            <label key={country} className="custom-radio text-black flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="country"
                                    checked={selectedCountry === country}
                                    onChange={() => handleCountrySelect(country)}
                                    className="appearance-none mr-2"
                                />
                                <span className="text-sm font-medium">{country}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Right side - Location selection */}
                {/* <div className="p-2">
                    <div className="bg-[#fff2cc] text-center py-1 px-4 rounded-r-lg mb-3 inline-block">
                        <h3 className="font-semibold text-amber-900 text-xs uppercase">LOCATION</h3>
                    </div>

                    <div className="space-y-2 pr-16 sm:pr-24 md:pr-20">
                        {Object.entries(locations).map(([location, count]) => (
                            <label
                                key={location}
                                className={`custom-radio text-white flex items-center cursor-pointer ${!selectedCountry ? "cursor-not-allowed opacity-50" : ""}`}
                            >
                                <input
                                    type="radio"
                                    name="location"
                                    checked={selectedLocation === location}
                                    onChange={() => handleLocationSelect(location as Location)}
                                    className="appearance-none mr-2"
                                    disabled={!selectedCountry}
                                />
                                <span className="text-sm font-medium">{location} ({count})</span>
                            </label>
                        ))}
                    </div>
                </div> */}

                <div className="bg-[#fff2cc] text-start py-0.5 px-2 rounded-3xl mb-3 inline-block mt-14 mr-8">
                    <h3 className="font-semibold text-black text-xs uppercase p-3">CHOOSE AN AFRICAN SPECIALTY TO EXPLORE ITS DETAILS AND LOCATIONS WITH RESTAURANTS OFFERING IT</h3>
                </div>

            </div>

            {/* Chef Images - Adjusted positioning to fit within the card without overlapping menu items */}
            <div className="absolute left-2 bottom-0 w-24 h-36 sm:w-28 sm:h-40 md:w-32 md:h-44 z-10 translate-x-[-30%]">
                <Image
                    src="/images/chef-male.png"
                    alt="Male Chef"
                    fill
                    className="object-contain object-bottom"
                    priority
                />
            </div>

            <div className="absolute right-2 bottom-0 w-24 h-36 sm:w-28 sm:h-40 md:w-32 md:h-44 z-10 translate-x-[30%]">
                <Image
                    src="/images/chef-female.png"
                    alt="Female Chef"
                    fill
                    className="object-contain object-bottom"
                    priority
                />
            </div>

            {/* Buttons - Adjusted styling and structure */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 md:mt-8 relative z-20">
                {selectedCountry && (
                    <button
                        // onClick={() => openCuisineModal(getCuisineType(selectedCountry).toLowerCase() as CuisineInfoModalContent)} // TODO: Enable when modal exists
                        className="bg-amber-100 text-amber-900 border-2 border-amber-400 rounded-full py-1 px-4 text-xs font-semibold hover:bg-amber-200 transition duration-200 whitespace-nowrap"
                    >
                        ABOUT {getCuisineType(selectedCountry)} CUISINE
                    </button>
                )}
                {selectedCountry && selectedLocation && (
                    <Link href={`/restaurants?country=${encodeURIComponent(selectedCountry)}&location=${encodeURIComponent(selectedLocation)}`} passHref legacyBehavior>
                        <a className="inline-block">
                            <button
                                className="w-full sm:w-auto bg-red-900 text-white border-2 border-amber-400 rounded-full py-1 px-4 text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap"
                            >
                                SEE RESTAURANTS
                            </button>
                        </a>
                    </Link>
                )}
                {!selectedCountry || !selectedLocation ? <div className="h-[34px]"></div> : null} {/* Placeholder for alignment */}
            </div>

            {/* TODO: Add Cuisine Info Modal component instance here */}
            {/* <CuisineInfoModal isOpen={cuisineModalOpen !== null} onClose={() => setCuisineModalOpen(null)} content={cuisineModalOpen} /> */}
        </div>
    );
}













// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useLocationContext } from "@/lib/location-context";

// // TODO: Define types for modal content if needed for the 'About Cuisine' button
// // type CuisineInfoModalContent = "ethiopian" | "kenyan" | "nigerian_ghanaian" | null;

// type CountrySpecialty = "ETHIOPIA, ERITREA" | "KENYA" | "NIGERIA, GHANA";
// type Location = "BERN" | "OLTEN" | "LUZERN" | "ZURICH";

// export default function LocationSelection() {
//     const { t } = useLocationContext();
//     const [selectedCountry, setSelectedCountry] = useState<CountrySpecialty | null>(null);
//     const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
//     // TODO: Add state for cuisine info modal: const [cuisineModalOpen, setCuisineModalOpen] = useState<CuisineInfoModalContent>(null);

//     const countrySpecialties: CountrySpecialty[] = ["ETHIOPIA, ERITREA", "KENYA", "NIGERIA, GHANA"];

//     const locations: { [key: string]: number } = {
//         "BERN": 1,
//         "OLTEN": 1,
//         "LUZERN": 2,
//         "ZURICH": 3
//     };

//     const handleCountrySelect = (country: CountrySpecialty) => {
//         setSelectedCountry(country);
//     };

//     const handleLocationSelect = (location: Location) => {
//         setSelectedLocation(location);
//     };

//     // TODO: Function to open cuisine modal: const openCuisineModal = (cuisine: CuisineInfoModalContent) => setCuisineModalOpen(cuisine);

//     const getCuisineType = (country: CountrySpecialty | null): string => {
//         if (country === "ETHIOPIA, ERITREA") return "ETHIOPIAN, ERITREAN";
//         if (country === "KENYA") return "KENYAN";
//         if (country === "NIGERIA, GHANA") return "NIGERIAN, GHANA";
//         return "";
//     }

//     return (
//         // Main container with amber background, rounded corners, padding, and max-width
//         <div className="bg-white/50 rounded-lg p-5 md:p-7 w-full max-w-md md:max-w-2xl mx-auto relative shadow-xl ml-4">
//             {/* Removed the explicit title H2 here as it's handled in page.tsx */}

//             {/* Grid for selection areas */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 {/* Left side - Country selection */}
//                 <div className="p-2">
//                     <div className="bg-[#fff2cc] text-center py-1 px-4 rounded-r-lg mb-3 inline-block ml-20">
//                         <h3 className="font-semibold text-amber-900 text-xs uppercase">COUNTRY SPECIALTY</h3>
//                     </div>

//                     <div className="space-y-2 pl-16 sm:pl-24 md:pl-20">
//                         {countrySpecialties.map((country) => (
//                             <label key={country} className="custom-radio text-white flex items-center cursor-pointer">
//                                 <input
//                                     type="radio"
//                                     name="country"
//                                     checked={selectedCountry === country}
//                                     onChange={() => handleCountrySelect(country)}
//                                     className="appearance-none mr-2"
//                                 />
//                                 <span className="text-sm font-medium">{country}</span>
//                             </label>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Right side - Location selection */}
//                 <div className="p-2">
//                     <div className="bg-[#fff2cc] text-center py-1 px-4 rounded-r-lg mb-3 inline-block">
//                         <h3 className="font-semibold text-amber-900 text-xs uppercase">LOCATION</h3>
//                     </div>

//                     <div className="space-y-2 pr-16 sm:pr-24 md:pr-20">
//                         {Object.entries(locations).map(([location, count]) => (
//                             <label
//                                 key={location}
//                                 className={`custom-radio text-white flex items-center cursor-pointer ${!selectedCountry ? "cursor-not-allowed opacity-50" : ""}`}
//                             >
//                                 <input
//                                     type="radio"
//                                     name="location"
//                                     checked={selectedLocation === location}
//                                     onChange={() => handleLocationSelect(location as Location)}
//                                     className="appearance-none mr-2"
//                                     disabled={!selectedCountry}
//                                 />
//                                 <span className="text-sm font-medium">{location} ({count})</span>
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Chef Images - Adjusted positioning to fit within the card without overlapping menu items */}
//             <div className="absolute left-2 bottom-0 w-32 h-48 sm:w-36 sm:h-52 md:w-40 md:h-56 z-10 translate-x-[-30%]">
//                 <Image
//                     src="/images/chef-male.png"
//                     alt="Male Chef"
//                     fill
//                     className="object-contain object-bottom"
//                     priority
//                 />
//             </div>

//             <div className="absolute right-2 bottom-0 w-32 h-48 sm:w-36 sm:h-52 md:w-40 md:h-56 z-10 translate-x-[30%]">
//                 <Image
//                     src="/images/chef-female.png"
//                     alt="Female Chef"
//                     fill
//                     className="object-contain object-bottom"
//                     priority
//                 />
//             </div>

//             {/* Buttons - Adjusted styling and structure */}
//             <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 md:mt-8 relative z-20">
//                 {selectedCountry && (
//                     <button
//                         // onClick={() => openCuisineModal(getCuisineType(selectedCountry).toLowerCase() as CuisineInfoModalContent)} // TODO: Enable when modal exists
//                         className="bg-amber-100 text-amber-900 border-2 border-amber-400 rounded-full py-1 px-4 text-xs font-semibold hover:bg-amber-200 transition duration-200 whitespace-nowrap"
//                     >
//                         ABOUT {getCuisineType(selectedCountry)} CUISINE
//                     </button>
//                 )}
//                 {selectedCountry && selectedLocation && (
//                     <Link href={`/restaurants?country=${encodeURIComponent(selectedCountry)}&location=${encodeURIComponent(selectedLocation)}`} passHref legacyBehavior>
//                         <a className="inline-block">
//                             <button
//                                 className="w-full sm:w-auto bg-red-900 text-white border-2 border-amber-400 rounded-full py-1 px-4 text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap"
//                             >
//                                 SEE RESTAURANTS
//                             </button>
//                         </a>
//                     </Link>
//                 )}
//                 {!selectedCountry || !selectedLocation ? <div className="h-[34px]"></div> : null} {/* Placeholder for alignment */}
//             </div>

//             {/* TODO: Add Cuisine Info Modal component instance here */}
//             {/* <CuisineInfoModal isOpen={cuisineModalOpen !== null} onClose={() => setCuisineModalOpen(null)} content={cuisineModalOpen} /> */}
//         </div>
//     );
// }
