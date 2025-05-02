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
        <Minus size={16} />
      </button>
      <span className="w-6 text-center font-semibold">{quantity}</span>
      <button
        onClick={() => setQuantity(quantity + 1)}
        className="p-1 rounded-full bg-amber-300 hover:bg-amber-400 transition"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
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
    <div className="min-h-screen transperant p-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 font-sans text-gray-900 -mt-10 -mr-10">
      {/* Left Sidebar */}
      {!showRestaurantList && (
        <nav className="flex flex-col space-y-4 mt-56">
          <button
            className="bg-amber-900 text-white py-6 px-0 rounded-2xl border-2 border-white hover:text-amber-200 transition duration-200 transform rotate-180"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            onClick={handleToggle}
          >
            <span className="text-xs font-bold uppercase"> RESTAURANTS IN LUZERN</span>
          </button>
          <button className="bg-[#3A6B35] text-white py-6 px-0 rounded-2xl border-2 border-white hover:bg-[#2E552B] transition duration-200 transform rotate-180" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
            <span className="text-xs font-bold uppercase">AFRICAN RESTAURANTS </span>
          </button>
        </nav>
      )}

      {/* Main Content */}
      {showRestaurantList ? (
        <RestaurantList />
      ) : (
        <main className="flex-1 flex flex-col space-y-6">
          {/* Header Section */}
          <header className="relative md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center">
              {/* image */}
              <div className="transperant flex items-center justify-center overflow-hidden -mt-2">
                <Image
                  src="/images/menuIcon.png"
                  alt="Restaurant Logo"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
              <div className="relative pl-2 text-white">
                <h1 className="text-xs">African Restaurant 3</h1>
                <p className="text-xs ">Kenyan, Luzern</p>
                <div className="relavent">
                  <p className="text-xs">
                    4.7 (128), 1.28 km &bull; 30–40 <br /> &bull; Minmum Order: 25.00 CHF
                  </p>
                </div>
                <p className="text-orange-600 text-xs text-bold">Opening Hours: 07:00 – 23:45 Uhr</p>
              </div>

              {/* top button section */}
              <div className="relative ml-10">
                {/* top btns */}
                <div className="relative space-x-4 -mt-2 mb-4 left-10">
                  <button className=" bg-red-800 text-white p-2 border-2 border-amber-400 rounded-lg py-1 px-3 text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap">
                    MAIN DISHES
                  </button>
                  <button className=" bg-red-800 text-white p-2 border-2 border-amber-400 rounded-lg py-1 px-3 text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap">
                    SNACKS
                  </button>
                  <button className=" bg-red-800 text-white p-2 border-2 border-amber-400 rounded-lg py-1 px-3 text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap">
                    DRINKS
                  </button>
                </div>

                {/* function buttons */}
                <div className="flex space-x-4 ml-10">
                  <button className="text-xs flex items-center border-2 rounded-lg space-x-1 bg-yellow-400 text-black p-1 hover:bg-yellow-500 transition">
                    <span>FILTER BY</span>
                    <ChevronDown className="text-white" size={16} />
                  </button>

                  <button className="text-xs flex items-center border-2 rounded-lg space-x-1 bg-yellow-400 text-black p-1 hover:bg-yellow-500 transition">
                    <span>SORT BY</span>
                    <ChevronDown size={16} />
                  </button>

                  <button className="bg-white p-1 shadow-md hover:shadow-lg transition">
                    <Search size={20} className="text-gray-900" />
                  </button>
                  <button className="bg-white p-1 shadow-md hover:shadow-lg transition">
                    <Share size={20} className="text-gray-900" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Meal Cards List */}
          <section className="flex flex-col space-y-6">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden border-2 border-amber-400"
              >
                {/* Image Placeholder */}
                <div className="w-full md:w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-semibold rounded-xl border border-amber-400 mt-4">
                  No Image Available
                </div>

                {/* Meal Info */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="relative">
                      <h3 className="text-md font-bold mb-1">{meal.title}
                        <span className="inline-block bg-green-800 text-white text-xs px-4 py-2 rounded-lg ml-16">
                          VEGAN
                        </span>
                      </h3>
                    </div>
                    <p className=" mb-2">{meal.description}</p>
                  </div>

                  {/* Quantity and Favorite */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <span className="mr-14">Quantity</span>
                      <span className="w-6 text-center font-semibold">
                        {mealQuantities[meal.id]}
                      </span>
                      <button
                        onClick={() =>
                          setMealQuantities((prev) => ({
                            ...prev,
                            [meal.id]: (prev[meal.id] || 1) + 1,
                          }))
                        }
                        className="p-1 rounded-full bg-amber-300 hover:bg-amber-400 transition"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                      <span className="text-lg font-bold">Fr. {meal.price.toFixed(2)}.-</span>
                    </div>
                  </div>

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between mt-4">
                    <button className="bg-amber-900 ml-10 p-1 text-green-600 hover:text-green-800 transition rounded-lg" aria-label="Add to favorites">
                      <Heart size={26} className="bg-white" />
                    </button>
                    <button className="mr-32 bg-red-800 text-white py-2 border-4 border-amber-400 rounded-3xl py-1 px-3 text-xs font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap">
                      ADD TO CART
                    </button>
                  </div>
                </div>

                {/* Image Placeholder */}
                <div className="w-12 md:w-12 h-56 bg-gray-200 flex text-gray-500 text-sm font-semibold right">
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
          </section>
        </main>
      )}
    </div>
  );
}
