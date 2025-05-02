"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Search, ChevronDown, Plus, Minus, Share } from "lucide-react";
import RestaurantList from "./restaurant-list";

function QuantitySelector({ quantity, setQuantity }: { quantity: number; setQuantity: (q: number) => void }) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="p-1 rounded-full bg-amber-300 hover:bg-amber-400 transition"
        aria-label="Decrease quantity"
      >
        <Minus size={12} className="xs:size-16" />
      </button>
      <span className="w-6 text-center font-semibold text-xs xs:text-base">{quantity}</span>
      <button
        onClick={() => setQuantity(quantity + 1)}
        className="p-1 rounded-full bg-amber-300 hover:bg-amber-400 transition"
        aria-label="Increase quantity"
      >
        <Plus size={12} className="xs:size-16" />
      </button>
    </div>
  );
}

export default function ViewMenu() {
  const [mealQuantities, setMealQuantities] = useState<{ [key: number]: number }>({
    1: 1,
    2: 1,
    3: 1,
  });

  const [showRestaurantList, setShowRestaurantList] = useState(false);

  const meals = [
    {
      id: 1,
      title: "Meal Name Lorem ipsum dolor sit",
      description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.",
      vegan: true,
      price: 45.0,
    },
    {
      id: 2,
      title: "Meal Name Lorem ipsum dolor sit",
      description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.",
      vegan: true,
      price: 45.0,
    },
    {
      id: 3,
      title: "Meal Name Lorem ipsum dolor sit",
      description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.",
      vegan: true,
      price: 45.0,
    },
  ];

  const handleToggle = () => {
    setShowRestaurantList(!showRestaurantList);
  };

  return (
    <div className="min-h-screen bg-transparent p-4 xs:p-6 flex flex-col md:flex-row space-y-4 xs:space-y-6 md:space-y-0 md:space-x-6 font-sans text-gray-900 -mt-28 -mr-10">
      {/* Left Sidebar */}
      {!showRestaurantList && (
        <nav className="w-6 flex flex-col space-y-4 mt-32 xs:mt-40 sm:mt-56">
          <button
            className="w-6 bg-amber-900 text-white py-4 xs:py-6 px-0 rounded-2xl border-2 border-white hover:text-amber-200 transition duration-200 transform rotate-180"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            onClick={handleToggle}
          >
            <span className="text-[10px] xs:text-xs font-bold uppercase">RESTAURANTS IN LUZERN</span>
          </button>
          <button
            className="w-6 bg-[#3A6B35] text-white py-4 xs:py-6 px-0 rounded-2xl border-2 border-white hover:bg-[#2E552B] transition duration-200 transform rotate-180"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            <span className="text-[10px] xs:text-xs font-bold uppercase">AFRICAN RESTAURANTS</span>
          </button>
        </nav>
      )}

      {/* Main Content */}
      {showRestaurantList ? (
        <RestaurantList />
      ) : (
        <main className="flex-1 flex flex-col space-y-4 xs:space-y-6">
          {/* Header Section */}
          <header className="flex flex-row justify-between items-start mr-2">
            {/* Left Side: Logo and Restaurant Details */}
            <div className="flex items-start">
              <div className="bg-transparent flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/menuIcon.png"
                  alt="Restaurant Logo"
                  width={90}
                  height={90}
                  className="object-cover xs:w-[80px] xs:h-[80px]"
                />
              </div>
              <div className="pl-2 text-white flex flex-col space-y-0">
                <h1 className="text-[10px] xs:text-xs sm:text-sm">African Restaurant 3</h1>
                <p className="text-[10px] xs:text-xs sm:text-sm">Kenyan, Luzern</p>
                <p className="text-[8px] xs:text-[10px] sm:text-xs">
                  4.7 (128), 1.28 km • 30–40
                </p>
                <p className="text-[8px] xs:text-[10px] sm:text-xs">
                  • Minimum Order: 25.00 CHF
                </p>
                <p className="text-orange-600 text-[8px] xs:text-[10px] sm:text-xs font-bold">
                  Opening Hours: 07:00 – 23:45 Uhr
                </p>
              </div>
            </div>

            {/* Right Side: Buttons */}
            <div className="flex flex-col items-center md:items-end space-y-3">
              {/* Category Buttons (MAIN DISHES, SNACKS, DRINKS) */}
              <div className="flex flex-wrap justify-center md:justify-end gap-2 xs:gap-3 sm:gap-4">
                <button className="bg-red-800 text-white border-2 border-amber-400 rounded-lg py-1 px-2 xs:px-3 text-[8px] xs:text-xs sm:text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap">
                  MAIN DISHES
                </button>
                <button className="bg-red-800 text-white border-2 border-amber-400 rounded-lg py-1 px-2 xs:px-3 text-[8px] xs:text-xs sm:text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap">
                  SNACKS
                </button>
                <button className="bg-red-800 text-white border-2 border-amber-400 rounded-lg py-1 px-2 xs:px-3 text-[8px] xs:text-xs sm:text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap">
                  DRINKS
                </button>
              </div>

              {/* Function Buttons (FILTER BY, SORT BY, Search, Share) */}
              <div className="flex flex-wrap justify-center md:justify-end gap-2 xs:gap-3 sm:gap-4">
                <button className="text-[8px] xs:text-xs sm:text-xs flex items-center border-2 rounded-lg space-x-1 bg-yellow-400 text-black p-1 hover:bg-yellow-500 transition">
                  <span>FILTER BY</span>
                  <ChevronDown className="text-white" size={12} />
                </button>
                <button className="text-[8px] xs:text-xs sm:text-xs flex items-center border-2 rounded-lg space-x-1 bg-yellow-400 text-black p-1 hover:bg-yellow-500 transition">
                  <span>SORT BY</span>
                  <ChevronDown size={12} />
                </button>
                <button className="bg-white p-1 shadow-md hover:shadow-lg transition">
                  <Search size={16} className="text-gray-900 xs:size-20" />
                </button>
                <button className="bg-white p-1 shadow-md hover:shadow-lg transition">
                  <Share size={16} className="text-gray-900 xs:size-20" />
                </button>
              </div>
            </div>
          </header>

          {/* Meal Cards List */}
          <section className="flex flex-col space-y-4 xs:space-y-6">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="flex flex-col xs:flex-row bg-white rounded-lg shadow-md overflow-hidden border-2 border-amber-400"
              >
                {/* Left Image Placeholder and Meal Info on Same Level */}
                <div className="flex flex-row xs:flex-row w-full">
                  {/* Left Image Placeholder */}
                  <div className="w-1/4 h-auto bg-gray-200 flex items-start justify-start text-gray-500 text-[10px] xs:text-sm font-semibold rounded-xl border border-amber-400 xs:mr-4">
                    No Image Available
                  </div>

                  {/* Meal Info */}
                  <div className="flex-1  p-3 xs:p-4 flex flex-col justify-end">
                    {/* Title and Vegan Button on Same Level */}
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-[10px] xs:text-sm sm:text-lg font-bold">{meal.title}</h3>
                      <span className="inline-block bg-green-800 text-white text-[8px] xs:text-xs px-2 xs:px-4 py-1 xs:py-2 rounded-lg">
                        VEGAN
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[8px] xs:text-[10px] sm:text-sm mb-2">{meal.description}</p>

                    {/* Quantity, Increase Button, and Price */}
                    <div className="flex items-center justify-between mt-3 xs:mt-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-[8px] xs:text-xs sm:text-sm mr-2 xs:mr-4">Quantity</span>
                        <QuantitySelector
                          quantity={mealQuantities[meal.id]}
                          setQuantity={(q) =>
                            setMealQuantities((prev) => ({
                              ...prev,
                              [meal.id]: q,
                            }))
                          }
                        />
                      </div>
                      <span className="text-[10px] xs:text-sm sm:text-lg font-bold">
                        Fr. {meal.price.toFixed(2)}.-
                      </span>
                    </div>

                    {/* Heart Icon and Add to Cart Button */}
                    <div className="flex items-center justify-between mt-3 xs:mt-4">
                      <button
                        className="bg-amber-900 p-1 text-green-600 hover:text-green-800 transition rounded-lg"
                        aria-label="Add to favorites"
                      >
                        <Heart size={20} className="bg-white xs:size-26" />
                      </button>
                      <button className="bg-red-800 text-white py-1 xs:py-2 px-2 xs:px-3 border-4 border-amber-400 rounded-3xl text-[8px] xs:text-xs sm:text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap">
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Image Placeholder */}
                <div className="hidden xs:flex w-12 h-36 bg-gray-200 items-center justify-center">
                  <Image
                    src="./images/menuIcon.png"
                    alt="Restaurant Logo"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </section>
        </main>
      )}
    </div>
  );
}