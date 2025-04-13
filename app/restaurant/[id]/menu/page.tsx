"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Heart, Share } from "lucide-react";
import MenuItem from "@/components/menu-item";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import ClientOnly from '@/components/client-only';

// Mock data for a restaurant
const mockRestaurant = {
    id: "1",
    name: "Restaurant 1 Name",
    cuisineType: "Ethiopian, Äthiopisch",
    location: "Olten",
    rating: 4.7,
    reviews: 168,
    distance: 1.7,
    minOrder: 24.00,
    openingHours: "07:00 - 23:45 Uhr",
    logo: "/images/logo.png",
};

// Mock menu data
const mockMenuItems = [
    {
        id: "item1",
        name: "Restaurant 1 Name",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy euismod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
        price: 24.90,
        image: "/images/placeholder.jpg",
        category: "main",
        location: "Olten",
        cuisineType: "Ethiopian, Abbessinisch",
        openingHours: "45 - 50 Min"
    },
    {
        id: "item2",
        name: "Restaurant 1 Name",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy euismod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
        price: 24.90,
        image: "/images/placeholder.jpg",
        category: "main",
        location: "Olten",
        cuisineType: "Ethiopian, Abbessinisch",
        openingHours: "45 - 50 Min"
    },
    {
        id: "item3",
        name: "Sambusa",
        description: "Crispy pastry filled with spiced meat or vegetables, similar to a samosa.",
        price: 8.50,
        image: "/images/placeholder.jpg",
        category: "snacks",
        location: "Olten",
        cuisineType: "Ethiopian, Abbessinisch",
        openingHours: "45 - 50 Min"
    },
    {
        id: "item4",
        name: "Ethiopian Coffee",
        description: "Traditional Ethiopian coffee, known for its rich, distinctive flavor.",
        price: 4.50,
        image: "/images/placeholder.jpg",
        category: "drinks",
        location: "Olten",
        cuisineType: "Ethiopian, Abbessinisch",
        openingHours: "45 - 50 Min"
    },
    {
        id: "item5",
        name: "Tej",
        description: "Ethiopian honey wine with a sweet, mead-like taste.",
        price: 7.90,
        image: "/images/placeholder.jpg",
        category: "drinks",
        location: "Olten",
        cuisineType: "Ethiopian, Abbessinisch",
        openingHours: "45 - 50 Min"
    }
];

type MenuCategory = "main" | "snacks" | "drinks" | "reviews";

export default function RestaurantMenuPage({ params }: { params: Promise<{ id: string }> }) {
    const [activeCategory, setActiveCategory] = useState<MenuCategory>("main");
    const [cartItems, setCartItems] = useState<{ id: string, quantity: number }[]>([]);

    // Unwrap params using React.use()
    const unwrappedParams = React.use(params);
    const restaurantId = unwrappedParams.id;

    const restaurant = mockRestaurant; // In a real app, fetch based on the id

    // Filter menu items by category
    const filteredItems = mockMenuItems.filter(item => {
        if (activeCategory === "reviews") return false;
        return item.category === activeCategory;
    });

    const handleAddToCart = (itemId: string, quantity: number) => {
        setCartItems(prev => {
            const exists = prev.find(item => item.id === itemId);
            if (exists) {
                return prev.map(item =>
                    item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                return [...prev, { id: itemId, quantity }];
            }
        });
    };

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
                    {/* Header */}
                    <SiteHeader />

                    <div className="flex-grow px-4 relative max-w-5xl mx-auto w-full">
                        {/* Simple Restaurant Info Header */}
                        <div className="flex items-center mb-6 mt-4">
                            {/* Restaurant Logo */}
                            <div className="bg-black rounded-lg p-2 w-24 h-24 flex items-center justify-center flex-shrink-0 mr-4">
                                <div className="text-white text-center">
                                    <Image
                                        src="/images/logo.png"
                                        alt="Restaurant Logo"
                                        width={50}
                                        height={50}
                                        className="mx-auto mb-1"
                                    />
                                    <div className="text-xs">Misswissi</div>
                                    <div className="text-[10px]">Delicious Food</div>
                                </div>
                            </div>

                            {/* Restaurant Info */}
                            <div className="text-white">
                                <h1 className="font-bold text-xl text-amber-500">African Restaurant 1</h1>
                                <p className="text-sm mb-1">Ethiopian, Eritrean, Zürich</p>
                                <div className="flex flex-col text-xs text-gray-300">
                                    <span>Minimum Order: 25.00 CHF</span>
                                    <span>Opening Hours: 07:00 - 23:45 Uhr</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="ml-auto flex items-center gap-4">
                                <button className="bg-amber-600 text-white text-xs uppercase font-medium py-1.5 px-4 rounded-md">
                                    CHANGE LOCATION
                                </button>
                                <div className="flex gap-2">
                                    <button className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                                        <Heart size={16} className="text-gray-700" />
                                    </button>
                                    <button className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                                        <Share size={16} className="text-gray-700" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Menu Categories Navigation */}
                        <div className="flex justify-center gap-4 mb-6">
                            <button
                                className={`px-6 py-2 text-xs font-semibold text-white rounded-full ${activeCategory === "main" ? "bg-red-800" : "bg-red-700"} border border-red-900`}
                                onClick={() => setActiveCategory("main")}
                            >
                                MAIN DISHES
                            </button>
                            <button
                                className={`px-6 py-2 text-xs font-semibold text-white rounded-full ${activeCategory === "snacks" ? "bg-red-800" : "bg-red-700"} border border-red-900`}
                                onClick={() => setActiveCategory("snacks")}
                            >
                                SNACKS
                            </button>
                            <button
                                className={`px-6 py-2 text-xs font-semibold text-white rounded-full ${activeCategory === "drinks" ? "bg-red-800" : "bg-red-700"} border border-red-900`}
                                onClick={() => setActiveCategory("drinks")}
                            >
                                DRINKS
                            </button>
                            <button
                                className={`px-6 py-2 text-xs font-semibold text-white rounded-full ${activeCategory === "reviews" ? "bg-red-800" : "bg-red-700"} border border-red-900`}
                                onClick={() => setActiveCategory("reviews")}
                            >
                                REVIEWS
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="grid grid-cols-1 gap-4 mx-auto w-full max-w-[680px] mb-8">
                            {activeCategory !== "reviews" ? (
                                <>
                                    {filteredItems.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            id={item.id}
                                            name={item.name}
                                            description={item.description}
                                            price={item.price}
                                            image={item.image}
                                            location={item.location}
                                            cuisineType={item.cuisineType}
                                            openingHours={item.openingHours}
                                            onAddToCart={handleAddToCart}
                                        />
                                    ))}
                                    {filteredItems.length === 0 && (
                                        <p className="text-center text-white">No menu items found in this category.</p>
                                    )}
                                </>
                            ) : (
                                <div className="relative bg-yellow-100 rounded-lg overflow-hidden border-[4px] border-yellow-600 w-full p-4">
                                    {/* African mask decorative borders */}
                                    <div className="absolute left-0 top-0 h-full w-10">
                                        <div className="absolute top-0 left-0 h-full w-full">
                                            <Image
                                                src="/images/masks/mask.png"
                                                alt="African mask"
                                                fill
                                                className="object-cover object-left"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute right-0 top-0 h-full w-10">
                                        <div className="absolute top-0 right-0 h-full w-full transform scale-x-[-1]">
                                            <Image
                                                src="/images/masks/mask.png"
                                                alt="African mask"
                                                fill
                                                className="object-cover object-left"
                                            />
                                        </div>
                                    </div>

                                    <div className="ml-10 mr-10">
                                        <h2 className="font-bold text-black mb-2">Customer Reviews</h2>
                                        <div className="space-y-3 text-black">
                                            <div className="border-b border-gray-300 pb-2">
                                                <div className="flex items-center mb-1">
                                                    <span className="text-yellow-500">★★★★★</span>
                                                    <span className="text-xs ml-2">Mark S. - 12.03.2024</span>
                                                </div>
                                                <p className="text-xs">Authentic Ethiopian cuisine, reminded me of my trip to Addis Ababa!</p>
                                            </div>
                                            <div className="border-b border-gray-300 pb-2">
                                                <div className="flex items-center mb-1">
                                                    <span className="text-yellow-500">★★★★</span><span className="text-gray-300">★</span>
                                                    <span className="text-xs ml-2">Sarah L. - 02.04.2024</span>
                                                </div>
                                                <p className="text-xs">Great food, especially the Doro Wat. Delivery was on time and food was still hot.</p>
                                            </div>
                                            <div className="pb-2">
                                                <div className="flex items-center mb-1">
                                                    <span className="text-yellow-500">★★★★★</span>
                                                    <span className="text-xs ml-2">Thomas G. - 28.03.2024</span>
                                                </div>
                                                <p className="text-xs">Best Ethiopian food in Zurich! Highly recommend the coffee ceremony.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <SiteFooter />
                </div>
            </main>
        </ClientOnly>
    );
} 