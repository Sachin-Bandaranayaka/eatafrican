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
    <div className="min-h-screen bg-transparent  xs:p-6 flex flex-col md:flex-row space-y-4 xs:space-y-6 md:space-y-0 md:space-x-6 font-sans text-gray-900 -mt-[100vh] md:mt-20 -mr-10 ">
      {/* Main Content */}
      {showRestaurantList ? (
        <RestaurantList />
      ) : (
        <main className="flex-1 p-2 md:p-10 flex flex-col space-y-4 xs:space-y-6">
          {/* Header Section */}
          <header className="flex flex-row justify-between items-start mr-2">
            {/* Left Side: Logo and Restaurant Details */}
            <div className="flex items-start">
              <div className="bg-transparent flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/menuIcon.png"
                  alt="Restaurant Logo"
                  width={150}
                  height={150}
                  className="object-cover xs:w-[80px] xs:h-[80px]"
                />
              </div>
              <div
                className="pl-2 text-white flex flex-col space-y-0 relative rounded-r-xl w-full"
                style={{
                  backgroundImage: 'url("/images/Restaurant Info_Bckimg.png")',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  border: '2px solid #f1c232', // Border color
                  // borderEndEndRadius: '10px'
                }}
              >
                {/* Overlay using ::before */}
                <div
                  className="absolute inset-0 rounded-r-xl w-full"
                  style={{
                    backgroundColor: '#783f04',
                    opacity: 0.7,
                    zIndex: 1
                  }}
                ></div>

                {/* Content with higher z-index to appear above overlay */}
                <div className="relative z-10">
                  <h1 className="text-[8px] xs:text-xs sm:text-sm text-[#ebeb48] -mb-1">African Restaurant 3</h1>
                  <p className="text-[8px] xs:text-xs sm:text-sm">Kenyan, Luzern</p>
                  <p className="text-[8px] xs:text-[8px] sm:text-xs">
                    4.7 (128), 1.28 km • 30–40
                  </p>
                  <p className="text-[8px] xs:text-[8px] sm:text-xs">
                    • Minimum Order: 25.00 CHF
                  </p>
                  <p className="text-[#92c482] text-[8px] xs:text-[8px] sm:text-xs font-bold mt-2 -mr-6">
                    Opening Hours: 07:00 – 23:45 Uhr
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Buttons */}
            <div className="flex flex-col items-center md:items-end space-y-3">
              {/* Category Buttons (MAIN DISHES, SNACKS, DRINKS) */}
              <div className="flex flex-wrap justify-center md:justify-end gap-2 xs:gap-3 sm:gap-4">
                <button className="bg-[#670402] text-white border-2 border-white rounded-full py-1 px-2 xs:px-3 text-[8px] xs:text-xs sm:text-xs font-semibold hover:bg-[#670402] transition duration-200 whitespace-nowrap">
                  MAIN DISHES
                </button>
                <button className="bg-[#670402] text-white border-2 border-white rounded-full py-1 px-2 xs:px-3 text-[8px] xs:text-xs sm:text-xs font-semibold hover:bg-[#670402] transition duration-200 whitespace-nowrap">
                  SNACKS
                </button>
                <button className="bg-[#670402] text-white border-2 border-white rounded-full py-1 px-2 xs:px-3 text-[8px] xs:text-xs sm:text-xs font-semibold hover:bg-[#670402] transition duration-200 whitespace-nowrap">
                  DRINKS
                </button>
              </div>

              {/* Function Buttons (FILTER BY, SORT BY, Search, Share) */}
              <div className="flex flex-wrap justify-center md:justify-end gap-2 xs:gap-3 sm:gap-4">
                <button className="text-[8px] xs:text-xs sm:text-xs flex items-center border-2 rounded-lg space-x-1 bg-[#434343ff] text-black font-bold p-1 transition">
                  <span>FILTER BY</span>
                  <ChevronDown className="text-white" size={12} />
                </button>
                <button className="text-[8px] xs:text-xs sm:text-xs flex items-center border-2 rounded-lg space-x-1 bg-[#434343ff] text-black font-bold p-1 transition">
                  <span>SORT BY</span>
                  <ChevronDown size={12} />
                </button>
                <button className="bg-white p-1 shadow-md hover:shadow-lg transition">
                  <Search size={16} className="text-gray-900 xs:size-20" />
                </button>
                <button className="bg-white p-1 shadow-md hover:shadow-lg transition">
                  <img
                    src="/images/shareButton.png" // your image path
                    alt="Shopping Basket"
                    style={{ width: 20, height: 20 }}
                  />
                </button>
              </div>
            </div>
          </header>

          {/* Meal Section */}
          <section className="flex flex-col space-y-4 xs:space-y-6">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="flex flex-col xs:flex-row rounded-lg shadow-md overflow-hidden border-2 border-[#f1c232] relative"
                style={{
                  backgroundImage: 'url("/images/Box_Restaurant_BckgImg01.png")',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  borderRadius: '10px'
                }}
              >
                {/* Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: '#312708',
                    opacity: 0.75,
                    zIndex: 1
                  }}
                ></div>

                {/* Content with higher z-index */}
                <div className="relative z-10 w-full">
                  {/* Left Image Placeholder and Meal Info on Same Level */}
                  <div className="flex flex-row xs:flex-row w-full">
                    {/* Left Image Placeholder */}
                    <div className="m-2 mb-2 w-1/4 h-auto bg-gray-200 flex items-start justify-start text-gray-500 text-[10px] xs:text-sm font-semibold rounded-xl border border-amber-400 xs:mr-4">
                      No Image Available
                    </div>

                    {/* Meal Info */}
                    <div className="flex-1 p-3 xs:p-4 flex flex-col justify-end">
                      {/* Title and Vegan Button on Same Level */}
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-[10px] xs:text-sm sm:text-lg font-bold text-[#ebeb48]">{meal.title}</h3>
                        <span className="inline-block bg-[#367627] border border-[#f1c232] text-white text-[10px] xs:text-xs py-1 px-4 xs:px-4 xs:py-2 rounded-full">
                          VEGAN
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[8px] xs:text-[10px] sm:text-sm mb-2 text-white">{meal.description}</p>

                      {/* Quantity, Increase Button, Price, Heart Icon, and Add to Cart Button */}
                      <div className="flex items-center justify-between mt-3 xs:mt-4 space-x-4">
                        <div className="flex items-center space-x-2 xs:space-x-4">
                          <span className="text-[8px] xs:text-xs sm:text-sm text-white mr-4">Quantity</span>
                          <button className="px-2 border-2 bg-white">
                            1+
                          </button>
                          <span className="text-[10px] xs:text-sm sm:text-lg text-white">
                            Fr. {meal.price.toFixed(2)}.-
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button className="bg-red-800 text-white py-1 xs:py-2 px-2 xs:px-3 border-4 border-amber-400 rounded-3xl text-[8px] xs:text-xs sm:text-xs font-semibold transition duration-200 whitespace-nowrap">
                            ADD TO CART
                          </button>
                          <button
                            className="p-1 text-green-600 hover:text-green-800 transition rounded-lg"
                            aria-label="Add to favorites"
                          >
                            <Heart size={30} className="bg-white xs:size-26 p-1" />
                          </button>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </main>
      )
      }
    </div >
  );
}