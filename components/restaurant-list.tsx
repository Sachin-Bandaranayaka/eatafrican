"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Star, Search, ChevronDown, Filter, SortAsc, Minus, Plus, Share } from "lucide-react";
import ViewMenu from "./view-menu";

export default function RestaurantListing() {
    const [showViewMenu, setShowViewMenu] = useState(false);

    const restaurants = [
        {
            id: 1,
            name: "Restaurant 1 Name",
            cuisine: "Ethiopian, Algerian",
            distance: "9 km, 47 min from Olten",
            minPrice: 24.00,
            rating: 3.5,
        },
        {
            id: 2,
            name: "Restaurant 2 Name",
            cuisine: "Nigerian",
            distance: "6 km, 25 min from Olten",
            minPrice: 24.00,
            rating: 3,
        },
        {
            id: 3,
            name: "Restaurant 3 Name",
            cuisine: "Kenyan",
            distance: "3 km, 47 min from Olten",
            minPrice: 24.00,
            rating: 3,
        },
        {
            id: 4,
            name: "Restaurant 4 Name",
            cuisine: "Kenyan",
            distance: "9 km, 47 min from Olten",
            minPrice: 24.00,
            rating: 3.5,
        },
    ];

    const handleToggle = () => {
        setShowViewMenu(!showViewMenu);
    };

    if (showViewMenu) {
        return <ViewMenu />;
    }

    return (
        <div className="min-h-screen transperant p-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 font-sans text-gray-900 -mt-20 -mr-10">

            {/* Left Sidebar */}
            <nav className="flex flex-col space-y-4 mt-48 ml-10">
                <button
                    className="bg-[#3A6B35] text-white py-6 px-0 rounded-2xl border-2 border-white hover:bg-[#2E552B] transition duration-200 transform rotate-180"
                    style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                >
                    <span className="text-xs font-bold uppercase"> RESTAURANTS IN LUZERN</span>
                </button>
                <button
                    className="bg-amber-900 text-white py-6 px-0 rounded-2xl border-2 border-white  hover:text-amber-200 transition duration-200 transform rotate-180"
                    style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                    onClick={handleToggle}
                >
                    <span className="text-xs font-bold uppercase">AFRICAN RESTAURANTS </span>
                </button>
            </nav>
            <main className="relative space-y-6">
                {/* Header */}
                <div className="flex justify-end mb-4">
                    <div className="bg-amber-800 text-white rounded-l-3xl border-2 border-amber-400 px-6 py-2 text-sm font-bold">
                        AFRICAN RESTAURANTS IN ZURICH
                    </div>
                </div>

                {/* Filter and Sort Buttons */}
                <div className="flex justify-end space-x-4 mb-6">
                    <button className="bg-amber-500 text-white rounded-lg px-4 py-1 text-xs font-bold flex items-center">
                        <span>FILTER BY</span>
                        <ChevronDown size={14} className="ml-1" />
                    </button>

                    <button className="bg-amber-500 text-white rounded-lg px-4 py-1 text-xs font-bold flex items-center">
                        <span>SORT BY</span>
                        <ChevronDown size={14} className="ml-1" />
                    </button>

                    <button className="bg-white p-1 rounded-full">
                        <Share size={16} className="text-gray-900" />
                    </button>
                </div>

                {/* Restaurant Listings */}
                <div className="relative mx-auto justify-end max-w-5xl ml-20">
                    {restaurants.map((restaurant) => (
                        <div
                            key={restaurant.id}
                            className="bg-white rounded-lg mb-4 flex overflow-hidden border-2 border-amber-400"
                        >
                            {/* Restaurant Image */}
                            <div className="w-32 h-24 bg-gray-200 flex items-center justify-center m-2 rounded-lg border border-gray-300">
                                <span className="text-gray-400 text-xs text-center">No Image Available</span>
                            </div>

                            {/* Restaurant Info */}
                            <div className="relative-1 p-2">
                                <h3 className="font-bold text-sm">{restaurant.name}</h3>
                                <div className="flex items-center text-xs mt-1">
                                    <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mr-1"></span>
                                    <span>{restaurant.cuisine}</span>
                                </div>
                                <div className="text-xs mt-1">
                                    <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mr-1"></span>
                                    <span>{restaurant.distance}</span>
                                </div>
                                <div className="text-xs mt-1">
                                    <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mr-1"></span>
                                    <span>Min Fr: {restaurant.minPrice.toFixed(2)}</span>
                                </div>
                                <div className="text-xs mt-1 flex items-center">
                                    <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mr-1"></span>
                                    <span>{restaurant.rating} hrs</span>
                                </div>
                            </div>

                            {/* View Menu Button */}
                            <div className="flex items-center pr-2 ml-20">
                                <button className="bg-red-800 text-white text-xs font-bold rounded-lg px-3 py-1 whitespace-nowrap border border-amber-400">
                                    VIEW MENU
                                </button>
                            </div>

                            {/* Image Placeholder */}
                            <div className="w-10 md:w-10 h-auto bg-gray-200 flex text-gray-500 text-sm font-semibold right">
                                <Image
                                    src="/images/menuIcon.png"
                                    alt="Restaurant Logo"
                                    width={80}
                                    height={80}
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
