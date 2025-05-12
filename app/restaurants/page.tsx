"use client";

import { useState, useEffect, Suspense } from "react";
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
import RestaurantsClient from "./RestaurantsClient";

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
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RestaurantsClient />
        </Suspense>
    );
} 