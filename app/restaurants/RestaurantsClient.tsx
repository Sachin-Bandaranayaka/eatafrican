"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Share } from "lucide-react";
import RestaurantCard from "@/components/restaurant-card";
import LocationSelectionMobile from "@/components/location-selection-mobile";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import ClientOnly from '@/components/client-only';
import HowItWorks from "@/components/how-it-works";
import DeliveryGuide from "@/components/delivery-guide";

type SortOption = "distance" | "minOrder" | "reviews";

interface Restaurant {
    id: string;
    name: string;
    cuisine: string;
    distance: string;
    minPrice: number;
    rating: number;
    logoUrl: string | null;
    coverImageUrl: string | null;
    status: string;
}

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

export default function RestaurantsClient() {
    const searchParams = useSearchParams();
    const country = searchParams.get("country") || "Ethiopia, Eritrea";
    const location = searchParams.get("location") || "Olten";

    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>("distance");
    const [showChangeOptions, setShowChangeOptions] = useState(false);
    const [howItWorksOpen, setHowItWorksOpen] = useState(false);
    const [deliveryGuideOpen, setDeliveryGuideOpen] = useState(false);

    const headerTitle = getRestaurantHeader(country, location);

    // Fetch restaurants from API
    useEffect(() => {
        async function fetchRestaurants() {
            try {
                setLoading(true);
                setError(null);

                // Build query parameters
                const params = new URLSearchParams();
                if (location) params.append('city', location);
                
                // Map country to cuisine type
                if (country.includes("Ethiopia") || country.includes("Eritrea")) {
                    params.append('cuisineType', 'Ethiopian');
                }
                
                params.append('sortBy', sortBy === 'minOrder' ? 'name' : sortBy);
                
                const response = await fetch(`/api/restaurants?${params.toString()}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch restaurants');
                }

                const data = await response.json();
                setRestaurants(data.restaurants || []);
            } catch (err: any) {
                console.error('Error fetching restaurants:', err);
                setError(err.message || 'Failed to load restaurants');
            } finally {
                setLoading(false);
            }
        }

        fetchRestaurants();
    }, [location, country, sortBy]);

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
                                <LocationSelectionMobile 
                                    onViewMenu={(restaurant) => {
                                        // Handle restaurant selection
                                        console.log('Selected restaurant:', restaurant);
                                    }}
                                    isViewingMenu={false}
                                    selectedRestaurant={null}
                                    onChange={() => {
                                        // Handle location/country change
                                        setShowChangeOptions(false);
                                    }}
                                    onAboutSpecialtyOpen={(cuisineType) => {
                                        // Handle about specialty modal
                                        console.log('About specialty:', cuisineType);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-y-4 mx-auto w-full max-w-[680px]">
                                {loading ? (
                                    <div className="text-center text-white py-10">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                        <p className="mt-4">Loading restaurants...</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center text-red-400 py-10">
                                        <p>{error}</p>
                                        <button 
                                            onClick={() => window.location.reload()} 
                                            className="mt-4 bg-amber-900 text-white px-4 py-2 rounded"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                ) : restaurants.length === 0 ? (
                                    <div className="text-center text-white py-10">
                                        <p>No restaurants found for this selection.</p>
                                        <p className="text-sm mt-2 text-gray-300">Try changing the location or country specialty.</p>
                                    </div>
                                ) : (
                                    restaurants.map((restaurant) => (
                                        <RestaurantCard
                                            key={restaurant.id}
                                            id={restaurant.id}
                                            name={restaurant.name}
                                            cuisineType={restaurant.cuisine}
                                            location={location}
                                            distance={typeof restaurant.distance === 'string' ? parseFloat(restaurant.distance) || 0 : restaurant.distance}
                                            minOrder={restaurant.minPrice}
                                            image={restaurant.coverImageUrl || restaurant.logoUrl || "/images/placeholder.jpg"}
                                            openingHours={`Min Fr. ${restaurant.minPrice.toFixed(2)}`}
                                        />
                                    ))
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