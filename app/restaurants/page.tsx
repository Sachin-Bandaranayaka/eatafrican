"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Share } from "lucide-react";
import RestaurantCard from "@/components/restaurant-card";
import LocationSelection from "@/components/location-selection";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import ClientOnly from '@/components/client-only';
import HowItWorks from "@/components/how-it-works";
import DeliveryGuide from "@/components/delivery-guide";

// Mock restaurant data
const mockRestaurants = [
    {
        id: "1",
        name: "Restaurant 1 Name",
        cuisineType: "Ethiopian, Abbessinisch",
        location: "Olten",
        distance: 1.7,
        minOrder: 24.00,
        image: "/images/placeholder.jpg",
        openingHours: "Min Fr. 24.00"
    },
    {
        id: "2",
        name: "Restaurant 1 Name",
        cuisineType: "Ethiopian, Abbessinisch",
        location: "Olten",
        distance: 2.3,
        minOrder: 25.00,
        image: "/images/placeholder.jpg",
        openingHours: "45 - 50 Min"
    },
    {
        id: "3",
        name: "Restaurant 1 Name",
        cuisineType: "Ethiopian, Abbessinisch",
        location: "Olten",
        distance: 3.5,
        minOrder: 18.00,
        image: "/images/placeholder.jpg",
        openingHours: "45 - 50 Min"
    }
];

type SortOption = "distance" | "minOrder" | "reviews";

// Helper to get title based on query params
const getRestaurantHeader = (country?: string, location?: string) => {
    if (!country || !location) return "AFRICAN RESTAURANTS";

    if (country.includes("ETHIOPIA") || country.includes("Ethiopia") || country.includes("ERITREA") || country.includes("Eritrea")) {
        return `ETHIOPIAN & ERITREAN RESTAURANTS IN ${location.toUpperCase()}`;
    }
    if (country.includes("KENYA") || country.includes("Kenya")) {
        return `KENYAN ONLINE RESTAURANT IN ${location.toUpperCase()}`;
    }
    if (country.includes("NIGERIA") || country.includes("Nigeria") || country.includes("GHANA") || country.includes("Ghana")) {
        return `GHANAIAN & NIGERIAN RESTAURANTS IN ${location.toUpperCase()}`;
    }

    return `${country.toUpperCase()} RESTAURANTS IN ${location.toUpperCase()}`;
};

export default function RestaurantsPage() {
    const searchParams = useSearchParams();
    const country = searchParams.get("country") || "Ethiopia, Eritrea";
    const location = searchParams.get("location") || "Olten";

    const [restaurants, setRestaurants] = useState(mockRestaurants);
    const [sortBy, setSortBy] = useState<SortOption>("distance");
    const [showChangeOptions, setShowChangeOptions] = useState(false);
    const [howItWorksOpen, setHowItWorksOpen] = useState(false);
    const [deliveryGuideOpen, setDeliveryGuideOpen] = useState(false);

    const headerTitle = getRestaurantHeader(country, location);

    // Sort restaurants
    useEffect(() => {
        let sorted = [...mockRestaurants];

        if (sortBy === "distance") {
            sorted.sort((a, b) => a.distance - b.distance);
        } else if (sortBy === "minOrder") {
            sorted.sort((a, b) => a.minOrder - b.minOrder);
        } else if (sortBy === "reviews") {
            // Mock sorting by reviews
            sorted.sort(() => 0.5 - Math.random());
        }

        setRestaurants(sorted);
    }, [sortBy]);

    return (
        <ClientOnly>
            <main className="relative min-h-screen overflow-hidden text-white">
                {/* Background image */}
                <div className="fixed inset-0 z-0">
                    <Image
                        src="/images/background-collage-desktop.png"
                        alt="Food background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/70"></div>
                </div>

                {/* Content container */}
                <div className="relative z-10 min-h-screen flex flex-col">
                    {/* Use the shared SiteHeader component */}
                    <SiteHeader />

                    {/* Country and location title */}
                    <div className="text-center mb-6 px-4">
                        <h1 className="text-white text-xl font-bold">
                            {headerTitle}
                        </h1>
                    </div>

                    {/* Restaurant listings with controls */}
                    <div className="flex-grow px-4 relative">
                        {/* Control buttons row */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() => setShowChangeOptions(!showChangeOptions)}
                                className="bg-amber-900 text-white px-4 py-1.5 rounded-sm text-sm font-medium"
                            >
                                CHANGE COUNTRY SPECIALTY / LOCATION
                            </button>

                            <button
                                onClick={() => setSortBy(prev => prev === "distance" ? "minOrder" : "distance")}
                                className="bg-amber-900 text-white px-4 py-1.5 rounded-sm text-sm font-medium flex items-center gap-1"
                            >
                                SORT BY <ChevronDown size={16} />
                            </button>
                        </div>

                        {/* Restaurant selection interface or location selection */}
                        {showChangeOptions ? (
                            <div className="bg-[#fff2d9] rounded-lg p-3 mb-4">
                                <LocationSelection />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-y-4 mx-auto w-full max-w-[680px]">
                                {restaurants.map((restaurant) => (
                                    <RestaurantCard
                                        key={restaurant.id}
                                        id={restaurant.id}
                                        name={restaurant.name}
                                        cuisineType={restaurant.cuisineType}
                                        location={restaurant.location}
                                        distance={restaurant.distance}
                                        minOrder={restaurant.minOrder}
                                        image={restaurant.image}
                                        openingHours={restaurant.openingHours}
                                    />
                                ))}
                                {restaurants.length === 0 && (
                                    <p className="text-center text-white">No restaurants found for this selection.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <SiteFooter />
                </div>

                {/* Modals */}
                <HowItWorks
                    isOpen={howItWorksOpen}
                    onClose={() => setHowItWorksOpen(false)}
                />

                <DeliveryGuide
                    isOpen={deliveryGuideOpen}
                    onClose={() => setDeliveryGuideOpen(false)}
                />
            </main>
        </ClientOnly>
    );
} 