"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, DollarSign, Heart, Share } from "lucide-react";
import MenuItem from "@/components/menu-item";
import SiteFooter from "@/components/site-footer";
import ClientOnly from '@/components/client-only';
import { useCart } from "@/lib/cart-context";

type MenuCategory = "main" | "snacks" | "drinks" | "reviews";

interface Restaurant {
    id: string;
    name: string;
    cuisine: string;
    city: string;
    rating: number;
    distance: string;
    minPrice: number;
    openingHours: any;
    logoUrl: string | null;
    coverImageUrl: string | null;
}

interface MenuItemType {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string | null;
    category: string;
    isAvailable: boolean;
    dietaryTags: string[];
}

interface Review {
    id: string;
    rating: number;
    comment: string;
    customerName: string;
    createdAt: string;
}

export default function RestaurantPage({ params }: { params: { id: string } }) {
    const [activeCategory, setActiveCategory] = useState<MenuCategory>("main");
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addItem } = useCart();

    const { id } = params;

    // Fetch restaurant details
    useEffect(() => {
        async function fetchRestaurant() {
            try {
                const response = await fetch(`/api/restaurants/${id}`);
                if (!response.ok) throw new Error('Failed to fetch restaurant');
                const data = await response.json();
                setRestaurant(data.restaurant);
            } catch (err: any) {
                console.error('Error fetching restaurant:', err);
                setError(err.message);
            }
        }
        fetchRestaurant();
    }, [id]);

    // Fetch menu items
    useEffect(() => {
        async function fetchMenu() {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (activeCategory !== 'reviews') {
                    params.append('category', activeCategory);
                }
                
                const response = await fetch(`/api/restaurants/${id}/menu?${params.toString()}`);
                if (!response.ok) throw new Error('Failed to fetch menu');
                const data = await response.json();
                setMenuItems(data.menuItems || []);
            } catch (err: any) {
                console.error('Error fetching menu:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        
        if (activeCategory !== 'reviews') {
            fetchMenu();
        } else {
            setLoading(false);
        }
    }, [id, activeCategory]);

    const handleAddToCart = (item: MenuItemType, quantity: number) => {
        if (!restaurant) return;
        
        addItem({
            id: `${item.id}-${Date.now()}`,
            menuItemId: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity,
            image: item.imageUrl,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
        });
    };

    if (error) {
        return (
            <ClientOnly>
                <main className="min-h-screen bg-black text-white flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-400 mb-4">{error}</p>
                        <Link href="/restaurants" className="text-amber-400 hover:underline">
                            Back to Restaurants
                        </Link>
                    </div>
                </main>
            </ClientOnly>
        );
    }

    if (!restaurant) {
        return (
            <ClientOnly>
                <main className="min-h-screen bg-black text-white flex items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </main>
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <main className="min-h-screen bg-black text-white overflow-x-hidden">
                {/* Top Bar */}
                <div className="flex justify-between items-center p-2 bg-white">
                    <Link href="/restaurants" className="w-8 h-8 flex items-center justify-center">
                        <ArrowLeft className="h-6 w-6 text-gray-800" />
                    </Link>

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
                            {restaurant.logoUrl ? (
                                <Image src={restaurant.logoUrl} alt="Restaurant Logo" width={80} height={80} className="rounded" />
                            ) : (
                                <div className="text-white text-center">
                                    <div className="text-xs">{restaurant.name}</div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <h1 className="text-lg font-semibold">{restaurant.name}</h1>
                            <p className="text-sm text-gray-300">{restaurant.cuisine}</p>
                            <div className="flex items-center text-sm my-1">
                                <span className="text-yellow-400">★★★★</span><span className="text-gray-400">★</span>
                                <span className="text-gray-300 ml-1 text-xs">{restaurant.rating || 4.7}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-300">
                                <MapPin size={12} />
                                <span>{restaurant.distance}, {restaurant.city}, {restaurant.minPrice.toFixed(2)} CHF</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-300">
                                <Clock size={12} />
                                <span>Opening Hours: {restaurant.openingHours?.monday || '07:00 - 23:45'}</span>
                            </div>

                            <Link href="/restaurants">
                                <button className="bg-amber-700 rounded px-4 py-1 mt-2 text-white text-xs w-full">
                                    CHANGE COUNTRY SPECIALTY / LOCATION
                                </button>
                            </Link>
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
                    {loading ? (
                        <div className="text-center py-10">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    ) : activeCategory !== "reviews" ? (
                        <div className="space-y-3">
                            {menuItems.length === 0 ? (
                                <p className="text-center text-gray-400 py-10">No items in this category</p>
                            ) : (
                                menuItems.map((item) => (
                                    <MenuItem
                                        key={item.id}
                                        id={item.id}
                                        name={item.name}
                                        description={item.description}
                                        price={item.price}
                                        image={item.imageUrl || "/images/placeholder.jpg"}
                                        location={restaurant.city}
                                        cuisineType={restaurant.cuisine}
                                        openingHours={restaurant.openingHours?.monday || '07:00 - 23:45'}
                                        onAddToCart={(id, quantity) => handleAddToCart(item, quantity)}
                                        isAvailable={item.isAvailable}
                                        dietaryTags={item.dietaryTags}
                                    />
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-center text-gray-400 py-10">Reviews coming soon</p>
                        </div>
                    )}
                </div>

                <SiteFooter onOpenComponent={() => {}} onCloseComponent={() => {}} />
            </main>
        </ClientOnly>
    );
}
