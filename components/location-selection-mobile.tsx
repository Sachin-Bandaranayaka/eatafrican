"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLocationContext } from "@/lib/location-context";

type CountrySpecialty = string;
type Location = string;

interface LocationSelectionProps {
    onViewMenu: (restaurant: string) => void;
    isViewingMenu: boolean;
    selectedRestaurant: string | null;
    onChange: () => void;
    onAboutSpecialtyOpen: (cuisineType: string) => void;
}

interface CustomButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onClick, children, className = "" }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-red-900 text-white border border-amber-400 rounded-lg pt-[3px] pb-[2.5px] px-3 font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap 
            text-[7px] md:text-[8px] lg:text-[8px] xl:text-[8px] 2xl:text-[8px]${className}`}
        >
            {children}
        </button>
    );
};

export default function LocationSelectionMobile({
    onViewMenu,
    isViewingMenu,
    selectedRestaurant,
    onChange,
    onAboutSpecialtyOpen,
}: LocationSelectionProps) {
    const { t } = useLocationContext();
    const [selectedCountry, setSelectedCountry] = useState<CountrySpecialty | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [showError, setShowError] = useState(false);
    const [selectedRestaurantInternal, setSelectedRestaurantInternal] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [showBackButton, setShowBackButton] = useState(false);
    
    // Dynamic data from API
    const [countrySpecialties, setCountrySpecialties] = useState<CountrySpecialty[]>([]);
    const [locations, setLocations] = useState<{ [key: string]: number }>({});
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch available cuisines and locations from API
    useEffect(() => {
        async function fetchLocations() {
            try {
                setLoading(true);
                const response = await fetch('/api/locations');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch locations');
                }

                const data = await response.json();
                
                // Set cuisines (country groups)
                const cuisineGroups = data.cuisines.map((c: any) => c.group);
                setCountrySpecialties(cuisineGroups);
                
                // Set locations with counts
                const locationMap: { [key: string]: number } = {};
                data.locations.forEach((loc: any) => {
                    locationMap[loc.city] = loc.count;
                });
                setLocations(locationMap);
            } catch (error) {
                console.error('Error fetching locations:', error);
                // Fallback to default values
                setCountrySpecialties(["ETHIOPIA, ERITREA", "KENYA", "NIGERIA, GHANA"]);
                setLocations({
                    "BERN": 1,
                    "OLTEN": 1,
                    "LUZERN": 1,
                    "ZURICH": 1,
                    "BASEL": 1
                });
            } finally {
                setLoading(false);
            }
        }

        fetchLocations();
    }, []);

    // Fetch restaurants when location is selected
    useEffect(() => {
        async function fetchRestaurants() {
            if (!selectedLocation || !selectedCountry) {
                setRestaurants([]);
                return;
            }

            try {
                console.log('Fetching restaurants for:', { selectedLocation, selectedCountry });
                
                // Use the simpler /api/restaurants endpoint instead of search
                // Ensure city name is properly encoded for URL
                const cityParam = encodeURIComponent(selectedLocation);
                const response = await fetch(`/api/restaurants?city=${cityParam}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch restaurants');
                }

                const data = await response.json();
                console.log('Fetched restaurants:', data);
                
                const allRestaurants = data.restaurants || [];
                
                // Filter by cuisine type on the client side for more flexible matching
                const cuisineType = getCuisineType(selectedCountry);
                const cuisineKeywords = cuisineType.split(',').map(c => c.trim().toLowerCase());
                
                console.log('Filtering by cuisine keywords:', cuisineKeywords);
                
                const filteredRestaurants = allRestaurants.filter((restaurant: any) => {
                    const restaurantCuisines = restaurant.cuisine?.toLowerCase() || '';
                    const matches = cuisineKeywords.some(keyword => restaurantCuisines.includes(keyword));
                    console.log(`Restaurant "${restaurant.name}" cuisines: "${restaurantCuisines}", matches: ${matches}`);
                    return matches;
                });
                
                console.log('Filtered restaurants:', filteredRestaurants);
                
                // Always set the filtered results (even if empty)
                // This will show the actual availability
                setRestaurants(filteredRestaurants);
                
                // Log a helpful message if no matches
                if (filteredRestaurants.length === 0 && allRestaurants.length > 0) {
                    console.log(`No ${cuisineType} restaurants found in ${selectedLocation}.`);
                    console.log('Available restaurants:', allRestaurants.map((r: any) => `${r.name} (${r.cuisine})`));
                }
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                setRestaurants([]);
            }
        }

        fetchRestaurants();
    }, [selectedLocation, selectedCountry]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleCountrySelect = (country: CountrySpecialty) => {
        setSelectedCountry(country);
        setSelectedLocation(null);
        setSelectedRestaurantInternal(null);
        setShowError(false);
        setShowBackButton(true);
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
            setShowBackButton(false);
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

    const handleAboutSpecialtyClick = () => {
        if (selectedCountry) {
            onAboutSpecialtyOpen(getCuisineType(selectedCountry));
        }
    };

    const handleBack = () => {
        if (selectedRestaurantInternal) {
            setSelectedRestaurantInternal(null);
        } else if (selectedLocation) {
            setSelectedLocation(null);
        } else if (selectedCountry) {
            setSelectedCountry(null);
            setShowBackButton(false);
        }
        setShowError(false);
        onChange();
    };

    const getCuisineType = (country: CountrySpecialty | null): string => {
        if (country === "ETHIOPIA, ERITREA") return "ETHIOPIAN, ERITREAN";
        if (country === "KENYA") return "KENYAN";
        if (country === "NIGERIA, GHANA") return "NIGERIAN, GHANAIAN";
        return "";
    };

    if (loading) {
        return (
            <div>
                <div className="max-w-3xl md:w-[100%] mb-4 md:mb-40 sm:mb-8 lg:mb-28 md:text-start md:m-14 text-center mt-10 md:ml-6">
                    <p className="text-white font-bold text-xs xs:text-sm sm:text-base lg:text-md uppercase leading-relaxed">
                        {t('main_title')}
                    </p>
                </div>
                <div className="text-center text-white py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <p className="mt-4">{t('loading_locations')}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="max-w-3xl md:w-[100%] mb-4 md:mb-40 sm:mb-8 lg:mb-28 md:text-start md:m-14 text-center mt-10 md:ml-6">
                <p className="text-white font-bold text-xs xs:text-sm sm:text-base lg:text-md uppercase leading-relaxed">
                    {t('main_title')}
                </p>
            </div>

            <div
                className="border p-2 xs:w-auto w-[98%] md:w-[80%] md:ml-6 mx-auto relative shadow-lg md:mt-40 animated-background"
                style={{
                    borderColor: '#f1c232',
                    borderRadius: '10px'
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        borderRadius: '10px',
                        opacity: '70%',
                        background: '#5b0f00ff'
                    }}
                ></div>
                <div className="relative z-10">
                    <div className="relative flex justify-between mb-4 mt-1">
                        <div className="hidden sm:block absolute w-28 h-28 -left-0 -mt-[95px]">
                            <Image
                                src="/images/chef-male.png"
                                alt="Male Chef"
                                fill
                                className="object-contain object-bottom"
                                priority
                            />
                        </div>
                        <div className="hidden sm:block absolute w-28 h-28 right-0 -mt-[95px]">
                            <Image
                                src="/images/chef-female.png"
                                alt="Female Chef"
                                fill
                                className="object-contain object-bottom"
                                priority
                            />
                        </div>
                    </div>

                    <div className="flex justify-between mb-0 -mt-5">
                        <div className="bg-[#ff9920] border border-[#e89140] text-center py-0.5 px-2 rounded-r-xl z-20 ">
                            <h3 className="font-semibold text-black text-[7px] md:text-[9px] sm:text-xs uppercase">{t('country_specialty')}</h3>
                        </div>
                        <div className="bg-[#ff9920] border border-[#e89140] text-center py-0.5 px-2 rounded-r-xl z-20 mr-6 md:ml-4 ml-6">
                            <h3 className="font-semibold text-black text-[7px] md:text-[9px] sm:text-xs uppercase">{t('location')}</h3>
                        </div>
                        <div className="bg-[#ff9920] border border-[#e89140] text-center py-0.5 px-2 rounded-r-xl z-20 md:mr-[22%] mr-[11%] ">
                            <h3 className="font-semibold text-black text-[7px] md:text-[9px] sm:text-xs uppercase">{t('restaurant')}</h3>
                        </div>
                    </div>

                    <div className="flex justify-around">
                        <div className="space-y-1 pl-0 mt-4 w-1/2 md:w-50">
                            {!isViewingMenu ? (
                                countrySpecialties.map((country) => (
                                    <label key={country} className="custom-radio text-white flex items-center cursor-pointer flex-wrap">
                                        <input
                                            type="radio"
                                            name="country"
                                            checked={selectedCountry === country}
                                            onChange={() => handleCountrySelect(country)}
                                            className="appearance-none mr-2"
                                        />
                                        <span className="text-[7px] md:text-[9px] font-bold sm:text-xs">{country}</span>
                                    </label>
                                ))
                            ) : (
                                <label className="custom-radio text-white flex items-center cursor-pointer gap-1 flex-wrap">
                                    <input
                                        type="radio"
                                        name="country"
                                        checked
                                        readOnly
                                        className="appearance-none mr-2"
                                    />
                                    <span className="text-[7px] md:text-[9px] font-bold">{selectedCountry}</span>
                                </label>
                            )}

                            {isViewingMenu && selectedCountry && (
                                <CustomButton onClick={handleChange} className="mt-4">
                                    {t('change')}
                                </CustomButton>
                            )}
                        </div>

                        <div className="space-y-1 pl-1 w-28 mt-4 md:-ml-12 ml-10 absolute">
                            {selectedCountry ? Object.keys(locations).map((location) => {
                                const isVisible = !isViewingMenu || selectedLocation === location;
                                if (!isVisible) return null;
                                return (
                                    <label key={location} className="custom-radio text-white flex items-center overflow-hidden cursor-pointer flex-wrap">
                                        <input
                                            type="radio"
                                            name="location"
                                            checked={selectedLocation === location}
                                            onChange={() => handleLocationSelect(location as Location)}
                                            className="appearance-none mr-2"
                                        />
                                        <span className="text-[7px] md:text-[9px] font-bold">{location} ({locations[location] || 0})</span>
                                    </label>
                                );
                            }) : (
                                <div className="h-20"></div>
                            )}
                        </div>

                        <div className="space-y-1 pl-1 w-56 mt-4 md:mr-7 -mr-[17%]">
                            {selectedCountry && !selectedLocation && (
                                <div className="p-0 absolute md:mb-10 w-[120%]" style={{ maxWidth: '160px' }}>
                                    <div className="text-start py-0.5 px-1 rounded-lg md:ml-10 ml-14">
                                        <h3 className="font-semibold text-white text-[7px] sm:text-[8px] uppercase p-1 leading-tight">
                                            CHOOSE A LOCATION TO SEE RESTAURANT LIST AND VIEW THEIR MENU
                                        </h3>
                                    </div>
                                </div>
                            )}

                            {selectedLocation ? (
                                restaurants.length > 0 ? (
                                    restaurants.map((restaurant) => {
                                        const isVisible = !isViewingMenu || selectedRestaurant === restaurant.id;
                                        if (!isVisible) return null;
                                        return (
                                            <label key={restaurant.id} className="custom-radio text-white font-bold flex md:ml-2 flex-col items-center cursor-pointer gap-1 flex-wrap">
                                                <div className="flex items-center -ml-2 md:ml-0">
                                                    <input
                                                        type="radio"
                                                        name="restaurant"
                                                        checked={selectedRestaurantInternal === restaurant.id}
                                                        onChange={() => handleRestaurantSelect(restaurant.id)}
                                                        className="appearance-none mr-2"
                                                    />
                                                    <span className="text-[7px] md:text-[9px] font-bold">{restaurant.name}</span>
                                                </div>
                                            </label>
                                        );
                                    })
                                ) : (
                                    <div className="p-0 absolute md:mb-10 w-[120%]" style={{ maxWidth: '160px' }}>
                                        <div className="text-start py-0.5 px-1 rounded-lg md:ml-10 ml-14">
                                            <h3 className="font-semibold text-yellow-300 text-[7px] sm:text-[8px] uppercase p-1 leading-tight">
                                                NO {getCuisineType(selectedCountry)} RESTAURANTS IN {selectedLocation}. TRY ANOTHER LOCATION.
                                            </h3>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="h-0"></div>
                            )}

                            {showError && (
                                <div className="w-[70%] ml-[55px]">
                                    <p className="text-white text-[7px] md:text-[8px] lg:text-[8px] xl:text-[8px] 2xl:text-[8px] font-bold mt-3">Choose a restaurant to view menu</p>
                                </div>
                            )}

                            {!selectedCountry && (
                                <div className="relavent p-0 flex items-center justify-center w-56 md:w-auto mt-6 md:-ml-24 -ml-12 mr-6 md:mr-4">
                                    <div className="text-start md:py-2 py-1 px-1 rounded-md p-4">
                                        <h3 className="font-semibold text-white text-[7px] md:text-[9px] text-[7px] uppercase p-4 md:p-1 leading-tight">
                                            CHOOSE A COUNTRY SPECIALTY TO EXPLORE ITS DETAILS AND SEE LOCATIONS WITH RESTAURANTS OFFERING IT
                                        </h3>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex justify-start md:mr-14 gap-2">
                                <div className="flex justify-start ml-[27%] md:ml-14 mt-[6px]">
                                    {selectedLocation && !isViewingMenu && (
                                        <button className="bg-red-900 text-white border border-amber-400 rounded-lg p-1 px-3 text-[7px] md:text-[8px] lg:text-[8px] xl:text-[8px] 2xl:text-[8px] font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap" onClick={handleViewMenuClick}>
                                            {t('view_menu')}
                                        </button>
                                    )}
                                </div>
                                <div className="flex justify-end md:ml-[104px] ">
                                    {isViewingMenu && (
                                        <CustomButton onClick={handleHome}>
                                            HOME
                                        </CustomButton>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center gap-2 mt-6 md:ml-0 md:-mb-1 ml-10 z-20">
                        <div className=" ml-0 md:ml-0">
                            {!isViewingMenu && selectedCountry && (
                                <div
                                    onClick={handleAboutSpecialtyClick}
                                    className="text-[#ebeb48] hover:text-[#0ff502] cursor-pointer text-[7px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px] font-semibold transition duration-200 whitespace-nowrap -mb-3 md:-mb-2"
                                >
                                    ABOUT {getCuisineType(selectedCountry)} SPECIALTY
                                </div>
                            )}
                        </div>
                        {showBackButton && !isViewingMenu && (
                            <div className="mr-9 flex items-center justify-center">
                                <CustomButton onClick={handleBack}>
                                    {t('back')}
                                </CustomButton>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mt-2 xs:mt-12 w-[95vw] ml-0 sm:mt-16 lg:mt-10 mb-6 xs:mb-8 sm:mb-10 text-center">
                {isMobile && (
                    <div className="flex justify-between items-center w-full mt-4">
                        <div className="w-16 xs:w-20 h-16 -mt-20 -ml-2 xs:h-20 z-10">
                            <Image
                                src="/images/chef-male.png"
                                alt="Male Chef"
                                width={80}
                                height={80}
                                className="object-contain object-bottom"
                                priority
                            />
                        </div>
                        <div className="flex-1 mx-2">
                            <p className="text-white font-bold text-xs uppercase leading-relaxed">
                                YOUR FAVOURITE AFRICAN MEALS JUST A FEW CLICKS AWAY, WHEREVER YOU ARE IN SWITZERLAND.
                            </p>
                        </div>
                        <div className="w-16 xs:w-20 h-16 -mt-20 -mr-2 xs:h-20 z-10">
                            <Image
                                src="/images/chef-female.png"
                                alt="Female Chef"
                                width={80}
                                height={80}
                                className="object-contain object-bottom"
                                priority
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}