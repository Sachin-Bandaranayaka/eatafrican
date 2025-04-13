"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, DollarSign, Heart, Share } from "lucide-react";
import MenuItem from "@/components/menu-item";
import SiteFooter from "@/components/site-footer";
import ClientOnly from '@/components/client-only';

// Mock data for a restaurant
const mockRestaurant = {
    id: "1",
    name: "African Restaurant 1",
    cuisineType: "Ethiopian, Eritrean, Zurich",
    location: "Zurich",
    rating: 4.7,
    reviews: 168,
    distance: 1.7,
    minOrder: 25.00,
    openingHours: "07:00 - 23:45 Uhr",
    logo: "/images/placeholder.jpg",
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

// Mock reviews
const mockReviews = [
    {
        id: "review1",
        rating: 5,
        text: "Authentic Ethiopian cuisine, reminded me of my trip to Addis Ababa!",
        author: "Mark S.",
        date: "12.03.2024"
    },
    {
        id: "review2",
        rating: 4,
        text: "Great food, especially the Doro Wat. Delivery was on time and food was still hot.",
        author: "Sarah L.",
        date: "02.04.2024"
    },
    {
        id: "review3",
        rating: 5,
        text: "Best Ethiopian food in Zurich! Highly recommend the coffee ceremony.",
        author: "Thomas G.",
        date: "28.03.2024"
    }
];

type MenuCategory = "main" | "snacks" | "drinks" | "reviews";

export default function RestaurantPage({ params }: { params: { id: string } }) {
    const [activeCategory, setActiveCategory] = useState<MenuCategory>("main");
    const [cartItems, setCartItems] = useState<{ id: string, quantity: number }[]>([]);

    const { id } = params;
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
            <main className="min-h-screen bg-black text-white overflow-x-hidden">
                {/* Top Bar */}
                <div className="flex justify-between items-center p-2 bg-white">
                    <div className="w-8 h-8 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <Image src="/images/logo.png" alt="African Restaurant" width={60} height={40} className="h-8 object-contain" />
                    </div>

                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                </div>

                {/* Restaurant Info Box */}
                <div className="p-3 relative">
                    <div className="flex items-start gap-3">
                        <div className="bg-gray-800 rounded-lg p-2 w-32 h-32 flex items-center justify-center">
                            <div className="text-white text-center">
                                <Image src="/images/logo.png" alt="Restaurant Logo" width={80} height={80} className="mx-auto mb-1" />
                                <div className="text-xs">Misswissi</div>
                                <div className="text-[10px]">Delicious Food</div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <h1 className="text-lg font-semibold">African Restaurant 1</h1>
                            <p className="text-sm text-gray-300">Ethiopian, Eritrean, Zurich</p>
                            <div className="flex items-center text-sm my-1">
                                <span className="text-yellow-400">★★★★</span><span className="text-gray-400">★</span>
                                <span className="text-gray-300 ml-1 text-xs">4.7 (168)</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-300">
                                <MapPin size={12} />
                                <span>1.7 km, Olten, 20.50 CHF</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-300">
                                <Clock size={12} />
                                <span>Opening Hours: 07:00 - 23:45 Uhr</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            <button className="bg-amber-700 rounded px-4 py-1 mt-2 text-white text-xs w-full">
                                CHANGE COUNTRY SPECIALTY / LOCATION
                            </button>
                        </div>
                    </div>

                    {/* Absolute positioned buttons */}
                    <div className="absolute top-2 right-2 flex gap-2">
                        <button className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                            <Heart size={16} className="text-gray-700" />
                        </button>
                        <button className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                            <Share size={16} className="text-gray-700" />
                        </button>
                    </div>
                </div>

                {/* Menu categories navigation */}
                <div className="flex justify-between px-3 py-2 border-y border-gray-800">
                    <button
                        className={`px-3 py-1 text-xs rounded-md ${activeCategory === "main" ? "bg-red-700 text-white" : "text-white"}`}
                        onClick={() => setActiveCategory("main")}
                    >
                        MAIN DISHES
                    </button>
                    <button
                        className={`px-3 py-1 text-xs rounded-md ${activeCategory === "snacks" ? "bg-red-700 text-white" : "text-white"}`}
                        onClick={() => setActiveCategory("snacks")}
                    >
                        SNACKS
                    </button>
                    <button
                        className={`px-3 py-1 text-xs rounded-md ${activeCategory === "drinks" ? "bg-red-700 text-white" : "text-white"}`}
                        onClick={() => setActiveCategory("drinks")}
                    >
                        DRINKS
                    </button>
                    <button
                        className={`px-3 py-1 text-xs rounded-md ${activeCategory === "reviews" ? "bg-red-700 text-white" : "text-white"}`}
                        onClick={() => setActiveCategory("reviews")}
                    >
                        REVIEWS
                    </button>
                </div>

                {/* Menu items or reviews */}
                <div className="p-3">
                    {activeCategory !== "reviews" ? (
                        <div className="space-y-3">
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
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {mockReviews.map((review) => (
                                <div key={review.id} className="bg-gray-800 rounded-lg p-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex text-yellow-400">
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <span key={index} className={index < review.rating ? "text-yellow-400" : "text-gray-500"}>★</span>
                                                ))}
                                            </div>
                                            <div className="text-gray-300 text-xs mt-1">{review.author} | {review.date}</div>
                                        </div>
                                    </div>
                                    <p className="text-sm mt-2">{review.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Using the SiteFooter component instead of the inline footer */}
                <SiteFooter />
            </main>
        </ClientOnly>
    );
} 