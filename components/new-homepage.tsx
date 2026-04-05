"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import LoginModal from "./login-modal";

export default function NewHomepage() {
  const [isCuisineOpen, setIsCuisineOpen] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [view, setView] = useState<"HOME" | "CUISINE" | "RESTAURANTS">("HOME");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const toggleCuisineDropdown = () => {
    setIsCuisineOpen(!isCuisineOpen);
  };

  const handleCuisineSelect = (cuisine: string) => {
    setSelectedCuisine(cuisine);
    setIsCuisineOpen(false);
    setView("CUISINE");
  };

  const handleBack = () => {
    if (view === "RESTAURANTS") {
      setView("CUISINE");
      return;
    }

    setView("HOME");
    setSelectedCuisine(null);
  };

  const handleSeeRestaurants = () => {
    setView("RESTAURANTS");
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-x-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <Image
          src={
            view === "HOME"
              ? "/images/eatafricanbck1.png"
              : view === "CUISINE"
                ? "/images/eatafricanbck3.jpg"
                : "/images/eatafricanck2.png"
          }
          alt="Background"
          fill
          className="object-cover opacity-60 transition-opacity duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-black/80 md:bg-gradient-to-r md:from-black/90 md:via-black/50 md:to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col p-4 sm:p-6 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4 sm:gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1 text-xs font-bold cursor-pointer hover:text-yellow-500 transition">
              <span>EN</span>
              <ChevronDown size={12} />
            </div>

            <div className="mt-5 sm:mt-8 w-full max-w-xs sm:max-w-sm">
              {view === "HOME" ? (
                <>
                  <div className="text-yellow-500 text-xs mb-2 font-semibold tracking-wide">-- How We Deliver</div>

                  <div className="relative block text-left">
                    <button
                      onClick={toggleCuisineDropdown}
                      className="flex w-full items-center justify-between space-x-4 border border-white/30 rounded-full px-4 sm:px-6 py-3 bg-black/40 backdrop-blur-md hover:bg-black/60 transition"
                    >
                      <span className="uppercase text-xs sm:text-sm tracking-wider font-medium">Choose a Cuisine</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${isCuisineOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isCuisineOpen && (
                      <div className="absolute left-0 mt-2 w-full origin-top-left bg-stone-900/95 backdrop-blur-xl border border-stone-700 divide-y divide-stone-700 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50">
                        <div className="py-2">
                          {["Eritrean", "Ethiopian", "Nigerian", "Kenyan"].map((cuisine) => (
                            <button
                              key={cuisine}
                              onClick={() => handleCuisineSelect(cuisine)}
                              className="group flex items-center w-full px-6 py-3 text-sm text-gray-300 hover:bg-stone-800 hover:text-white transition-colors"
                            >
                              <span
                                className={`w-2 h-2 rounded-full mr-3 transition-opacity ${
                                  selectedCuisine === cuisine
                                    ? "bg-red-500 opacity-100"
                                    : "bg-red-500 opacity-0 group-hover:opacity-100"
                                }`}
                              />
                              {cuisine}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-4">
                  <button onClick={handleBack} className="text-xs text-gray-400 hover:text-white transition flex items-center space-x-1">
                    <span>{"<-"} {view === "RESTAURANTS" ? "Back" : "Home"}</span>
                  </button>

                  {view === "CUISINE" && (
                    <>
                      <div className="text-yellow-500 text-xs font-semibold tracking-wide uppercase">
                        ORDER {selectedCuisine} DISHES
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={handleSeeRestaurants}
                          className="flex items-center justify-between w-full border border-white/30 rounded-full px-4 sm:px-6 py-3 bg-black/40 backdrop-blur-md hover:bg-black/60 transition text-left"
                        >
                          <span className="text-sm font-medium">See Restaurants and Order</span>
                          <ChevronDown size={16} className="-rotate-90" />
                        </button>
                        <button className="flex items-center justify-between w-full border border-transparent rounded-full px-4 sm:px-6 py-3 hover:bg-white/10 transition text-left text-gray-300">
                          <span className="text-sm">About</span>
                        </button>
                      </div>
                    </>
                  )}

                  {view === "RESTAURANTS" && (
                    <div className="text-yellow-500 text-xs font-semibold tracking-wide uppercase">
                      {selectedCuisine} RESTAURANTS
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="ml-auto flex items-center space-x-3 sm:space-x-6">
            <button onClick={() => setIsLoginModalOpen(true)} className="group flex items-center">
              <span className="relative text-[11px] sm:text-xs font-bold text-yellow-500 pr-3 sm:pr-4 pb-1">
                LOGIN
                <span
                  className="absolute bottom-0 h-[1.5px] bg-white transition-all group-hover:bg-yellow-500"
                  style={{ left: "-0.75rem", width: "calc(100% + 1.5rem)" }}
                />
              </span>

              <span className="relative w-8 h-8 sm:w-10 sm:h-10 -ml-2 sm:-ml-3">
                <Image src="/images/UserIcon (1).png" alt="Profile" fill className="object-contain" />
              </span>
            </button>

            <button className="relative w-7 h-7 sm:w-8 sm:h-8 hover:scale-110 transition">
              <Image src="/images/cart_icon.png" alt="Cart" fill className="object-contain" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-4xl mt-6 sm:mt-10 ml-0 sm:ml-2 md:ml-10">
          <div className="mb-5 sm:mb-8">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-4 sm:mb-6">
              <Image src="/images/logo.png" alt="Eat African Logo" fill className="object-contain" />
            </div>
          </div>

          {view === "HOME" && (
            <>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4 sm:mb-6 tracking-wide max-w-lg">
                ORDER FRESHLY PREPARED AFRICAN FOOD DIRECTLY FROM AFRICAN RESTAURANTS AND HAVE IT DELIVERED TO YOUR HOME.
              </h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-md leading-relaxed">
                Select from our available cuisines to see restaurants and order your meal.
              </p>
            </>
          )}

          {view === "RESTAURANTS" && (
            <div className="animate-fadeIn w-full overflow-y-auto max-h-[55vh] sm:max-h-[60vh] pr-1 sm:pr-4 no-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-stone-900/80 backdrop-blur-sm border border-stone-700 rounded-xl overflow-hidden hover:border-yellow-500 transition cursor-pointer group"
                  >
                    <div className="h-32 bg-stone-800 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-stone-600">Restaurant Image</div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-yellow-500 transition">Restaurant Name {i}</h3>
                      <p className="text-xs text-gray-400 mb-2">123 African Street, City</p>
                      <div className="flex items-center space-x-1 text-yellow-500 text-xs">
                        <span>*****</span>
                        <span className="text-gray-500">(24 reviews)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
