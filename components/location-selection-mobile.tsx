"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import AboutSpecialty from "./about-specialty";

type CountrySpecialty = "ETHIOPIA, ERITREA" | "KENYA" | "NIGERIA, GHANA";
type Location = "BERN" | "OLTEN" | "LUZERN" | "ZURICH";

interface LocationSelectionProps {
    onViewMenu: (restaurant: string) => void;
    isViewingMenu: boolean;
    selectedRestaurant: string | null;
    onChange: () => void;
    onAboutSpecialtyOpen: () => void;
    onAboutSpecialtyClose: () => void;
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
            className={`bg-red-900 text-white border border-amber-400 rounded-lg py-1 px-3 text-[10px] font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap ${className}`}
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
    onAboutSpecialtyClose,
}: LocationSelectionProps) {
    const [selectedCountry, setSelectedCountry] = useState<CountrySpecialty | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [showError, setShowError] = useState(false);
    const [selectedRestaurantInternal, setSelectedRestaurantInternal] = useState<string | null>(null);
    const [showAboutSpecialty, setShowAboutSpecialty] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showBackButton, setShowBackButton] = useState(false);

    const countrySpecialties: CountrySpecialty[] = ["ETHIOPIA, ERITREA", "KENYA", "NIGERIA, GHANA"];
    const locations: { [key: string]: number } = {
        "BERN": 1,
        "OLTEN": 1,
        "LUZERN": 2,
        "ZURICH": 3
    };

    // Detect mobile screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640); // Tailwind's 'sm' breakpoint
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
        setShowAboutSpecialty(false);
        setShowBackButton(true);
        onChange();
    };

    const handleLocationSelect = (location: Location) => {
        setSelectedLocation(location);
        setSelectedRestaurantInternal(null);
        setShowError(false);
        setShowAboutSpecialty(false);
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
        setShowAboutSpecialty(true);
        onAboutSpecialtyOpen();
    };

    const handleCloseAboutSpecialty = () => {
        setShowAboutSpecialty(false);
        onAboutSpecialtyClose();
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
        setShowAboutSpecialty(false);
        onChange();
    };

    const getCuisineType = (country: CountrySpecialty | null): string => {
        if (country === "ETHIOPIA, ERITREA") return "ETHIOPIAN, ERITREAN";
        if (country === "KENYA") return "KENYAN";
        if (country === "NIGERIA, GHANA") return "NIGERIAN, GHANAIAN";
        return "";
    };

    return (
        <div>
            {/* Heading Text */}
            <div className="max-w-3xl md:w-[100%] mb-4 md:mb-40 sm:mb-8 lg:mb-28 md:text-start md:m-14 text-center mt-10 md:ml-6">
                <p className="text-white font-bold text-xs xs:text-sm sm:text-base lg:text-md uppercase leading-relaxed">
                    ORDER FRESHLY PREPARED AFRICAN FOOD DIRECTLY FROM AFRICAN RESTAURANTS AND HAVE IT CONVENIENTLY DELIVERED TO YOUR HOME
                </p>
            </div>

            <div
                className="border rounded-lg p-2 xs:w-auto w-[90%] md:w-[80%] md:ml-6 mx-auto relative shadow-lg md:mt-40"
                style={{
                    backgroundImage: `url('/images/Box_Restaurant_BckgImg01.png')`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    borderColor: '#f1c232',
                    borderRadius: '10px'
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        borderRadius: '10px',
                        opacity: '75%',
                        background: '#312708'
                    }}
                ></div>
                <div className="relative z-10">
                    {/* Chef Images */}
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

                    {/* Headings */}
                    <div className="flex justify-between mb-0 -mt-5">
                        <div className="bg-[#ff9920] border border-[#e89140] text-center py-0.5 px-2 rounded-r-xl z-20 ">
                            <h3 className="font-semibold text-black text-[6px] md:text-[9px] sm:text-xs uppercase">COUNTRY SPECIALTY</h3>
                        </div>
                        <div className="bg-[#ff9920] border border-[#e89140] text-center py-0.5 px-2 rounded-r-xl z-20 mr-6">
                            <h3 className="font-semibold text-black text-[6px] md:text-[9px] sm:text-xs uppercase">LOCATION</h3>
                        </div>
                        <div className="bg-[#ff9920] border border-[#e89140] text-center py-0.5 px-2 rounded-r-xl z-20 md:mr-[22%]">
                            <h3 className="font-semibold text-black text-[6px] md:text-[9px] sm:text-xs uppercase">RESTAURANT</h3>
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="flex justify-around">
                        {/* Country Selection */}
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
                                        <span className="text-[6px] md:text-[9px] font-bold sm:text-xs">{country}</span>
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
                                    <span className="text-[6px] md:text-[9px] font-bold">{selectedCountry}</span>
                                </label>
                            )}

                            {isViewingMenu && selectedCountry && (
                                <CustomButton onClick={handleChange} className="mt-4">
                                    CHANGE
                                </CustomButton>
                            )}
                        </div>

                        {/* Location Selection */}
                        <div className="space-y-1 pl-1 w-28 mt-4 md:-ml-20">
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
                                        <span className="text-[6px] md:text-[9px] font-bold">{location} ({locations[location] || 0})</span>
                                    </label>
                                );
                            }) : (
                                <div className="h-20"></div>
                            )}
                        </div>

                        {/* Restaurant Selection */}
                        <div className="space-y-1 pl-1 w-56 mt-4 mr-6">
                            {selectedCountry && !selectedLocation && (
                                <div className="p-0 absolute md:mb-10 w-[120%]" style={{ maxWidth: '160px' }}>
                                    <div className="text-start py-0.5 px-1 rounded-lg ml-10">
                                        <h3 className="font-semibold text-white text-[6px] sm:text-[8px] uppercase p-1 leading-tight">
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
                                    <label key={restaurantName} className="custom-radio text-white font-bold flex flex-col items-center cursor-pointer gap-1 flex-wrap">
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="restaurant"
                                                checked={selectedRestaurantInternal === restaurantName}
                                                onChange={() => handleRestaurantSelect(restaurantName)}
                                                className="appearance-none mr-2"
                                            />
                                            <span className="text-[6px] md:text-[9px] font-bold">{restaurantName}</span>
                                        </div>
                                    </label>
                                );
                            }) : (
                                <div className="h-0"></div>
                            )}

                            {showError && (
                                <p className="text-red-600 text-[10px] sm:text-xs font-bold mt-1">Choose a restaurant to view menu</p>
                            )}

                            {!selectedCountry && (
                                <div className="relavent p-0 flex items-center justify-center w-50 mt-6 -ml-28 md:mr-4">
                                    <div className="text-start md:py-2 py-1 px-1 rounded-md p-4">
                                        <h3 className="font-semibold text-white text-[6px] md:text-[9px] text-[6px] uppercase p-4 md:p-1 leading-tight">
                                            CHOOSE A COUNTRY SPECIALTY TO EXPLORE ITS DETAILS AND SEE LOCATIONS WITH RESTAURANTS OFFERING IT
                                        </h3>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex justify-start  mr-14 gap-2">
                                <div className="flex justify-start ml-14">
                                    {/* View Menu Button */}
                                    {selectedLocation && !isViewingMenu && (
                                        <CustomButton onClick={handleViewMenuClick}>
                                            VIEW MENU
                                        </CustomButton>
                                    )}
                                </div>
                                <div className="flex justify-end ml-10">
                                    {/* Home Button */}
                                    {isViewingMenu && (
                                        <CustomButton onClick={handleHome}>
                                            HOME
                                        </CustomButton>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons Section */}
                    <div className="flex justify-between gap-2 mt-2 md:ml-0 md:-mb-1 ml-10 z-20">
                        {!isViewingMenu && selectedCountry && (
                            <span
                                onClick={handleAboutSpecialtyClick}
                                className="text-[#ff9920] hover:text-[#ebeb48] underline cursor-pointer text-[8px] sm:text-xs font-semibold transition duration-200 whitespace-nowrap"
                            >
                                ABOUT {getCuisineType(selectedCountry)} SPECIALTY
                            </span>
                        )}

                        {/* Back Button */}
                        {showBackButton && !isViewingMenu && (
                            <CustomButton onClick={handleBack}>
                                BACK
                            </CustomButton>
                        )}
                    </div>
                </div>
            </div>

            {/* Lower Section */}
            <div className="max-w-2xl mt-2 xs:mt-12 w-[95vw] ml-0 sm:mt-16 lg:mt-10 mb-6 xs:mb-8 sm:mb-10 text-center">
                {isMobile && (
                    <div className="flex justify-between items-center w-full mt-4">
                        <div className="w-16 xs:w-20 h-16 -mt-20 xs:h-20 z-10">
                            <Image
                                src="/images/chef-male.png"
                                alt="Male Chef"
                                width={80}
                                height={80}
                                className="object-contain object-bottom"
                                priority
                            />
                        </div>
                        {/* only shows in mobile view */}
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

            {/* AboutSpecialty for Mobile */}
            {showAboutSpecialty && selectedCountry && (
                <div className="md:hidden mt-2 mx-auto w-full max-w-full flex justify-center">
                    <AboutSpecialty cuisineType={getCuisineType(selectedCountry)} onClose={handleCloseAboutSpecialty} />
                </div>
            )}

            {/* AboutSpecialty for Large Devices */}
            {showAboutSpecialty && selectedCountry && (
                <div className="hidden md:block absolute top-0 right-0 w-1/2 p-0 -mr-4">
                    <AboutSpecialty cuisineType={getCuisineType(selectedCountry)} onClose={handleCloseAboutSpecialty} />
                </div>
            )}
        </div>
    );
}