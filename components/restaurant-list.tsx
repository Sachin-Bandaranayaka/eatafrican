"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart, Star, Search, ChevronDown, Filter, SortAsc, Minus, Plus, Share
} from "lucide-react";
import ViewMenu from "./view-menu";

export default function RestaurantListing() {
  const [showViewMenu, setShowViewMenu] = useState(false);

  const restaurants = [
    {
      id: 1,
      name: "Restaurant 1 Name",
      cuisine: "Ethiopian, Algerian",
      distance: "9 km, 47 min from Olten",
      minPrice: 24.0,
      rating: 3.5,
    },
    {
      id: 2,
      name: "Restaurant 2 Name",
      cuisine: "Nigerian",
      distance: "6 km, 25 min from Olten",
      minPrice: 24.0,
      rating: 3,
    },
    {
      id: 3,
      name: "Restaurant 3 Name",
      cuisine: "Kenyan",
      distance: "3 km, 47 min from Olten",
      minPrice: 24.0,
      rating: 3,
    },
    {
      id: 4,
      name: "Restaurant 4 Name",
      cuisine: "Kenyan",
      distance: "9 km, 47 min from Olten",
      minPrice: 24.0,
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
    <div className="min-h-screen flex flex-col md:flex-row bg-transparent text-gray-900 font-sans pl-1 w-auto -mt-[100vh] md:mt-20">
      <div className="w-screen p-4 pl-10 space-y-4 xs:space-y-6 md:space-y-2">
        <div className="flex justify-end items-end p-0 relative z-10">
          <div className=" bg-[#FFF3C7] inline-block rounded-l-full rounded-r-sm pl-6 pr-2 py-2 mb-4">
            <div className="bg-[url('/images/title-background.png')] bg-contain bg-center px-10 py-1">
              <h2 className="block bg-[#2A5910] text-white text-sm font-bold uppercase rounded whitespace-nowrap">
                AFRICAN RESTAURANTS IN ZURICH
              </h2>
            </div>
          </div>
        </div>

        {/* Filter and Sort Buttons */}
        <div className="flex justify-end space-x-4 mb-6">
          <button className="bg-[#b65f14] text-white rounded-lg px-4 py-1 text-xs font-bold flex items-center">
            <span>FILTER BY</span>
            <ChevronDown size={14} className="ml-1" />
          </button>

          <button className="bg-[#b65f14] text-white rounded-lg px-4 py-1 text-xs font-bold flex items-center">
            <span>SORT BY</span>
            <ChevronDown size={14} className="ml-1" />
          </button>

          <button className="bg-white p-1">
            <img
              src="/images/shareButton.png" // your image path
              alt="Shopping Basket"
              style={{ width: 20, height: 20 }}
            />
          </button>
        </div>

        {/* Restaurant Listings */}
        <div className="relative mx-auto max-w-5xl">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-lg mb-4 flex overflow-hidden border-2 border-amber-400"
            >
              {/* Restaurant Image */}
              <div className="w-32 h-auto bg-gray-200 flex items-center justify-center m-2 rounded-lg border-2 border-gray-300">
                <span className="text-gray-400 text-xs text-center">
                  No Image Available
                </span>
              </div>

              {/* Restaurant Info */}
              <div className="w-auto p-2">
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
                <button
                  onClick={handleToggle}
                  className="bg-red-800 text-white text-xs font-bold rounded-lg px-3 py-1 whitespace-nowrap border border-amber-400"
                >
                  VIEW MENU
                </button>
              </div>

              {/* Image Placeholder */}
              <div className="w-10 md:w-10 ml-20 h-auto bg-gray-200 flex text-gray-500 text-sm font-semibold">
                <Image
                  src="/images/masks/mask02.png"
                  alt="Restaurant Logo"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
