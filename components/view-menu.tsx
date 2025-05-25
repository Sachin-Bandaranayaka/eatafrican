"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Heart, Search, ChevronDown, Plus, Minus, Share } from "lucide-react";
import RestaurantList from "./restaurant-list";

function QuantitySelector({ quantity, setQuantity }) {
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
  const [mealQuantities, setMealQuantities] = useState({
    1: 1,
    2: 1,
    3: 1,
  });

  const [heartStates, setHeartStates] = useState({
    1: true,
    2: true,
    3: true,
  });

  const [showRestaurantList, setShowRestaurantList] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const outerDivRef = useRef(null);

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
    {
      id: 4,
      title: "Meal Name Lorem ipsum dolor sit",
      description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.",
      vegan: true,
      price: 45.0,
    },
  ];

  useEffect(() => {
    const checkOverflow = () => {
      if (outerDivRef.current) {
        const isOverflowing = outerDivRef.current.scrollHeight > window.innerHeight;
        setShowArrow(isOverflowing);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [showRestaurantList]);

  const handleToggle = () => {
    setShowRestaurantList(!showRestaurantList);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <div className="flex flex-col">
        <div
          ref={outerDivRef}
          className="z-0 w-[100%] bg-transparent xs:p-6 flex flex-col md:flex-row space-y-4 xs:space-y-6 md:space-y-0 md:space-x-6 font-sans text-gray-900 -mt-[80vh] md:mt-0 ml-3"
        >
          {showRestaurantList ? (
            <RestaurantList />
          ) : (
            <main className="p-2 md:p-0 flex flex-col space-y-4 xs:space-y-6">
              {/* site header */}
              <header className="flex flex-row justify-between items-start mr-2">

                {/* left side content */}
                <div className="flex items-start">
                  <div
                    className="relative rounded-xl"
                    style={{
                      backgroundImage: 'url("/images/Restaurant Info_Bckimg.png")',
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      border: "2px solid #f1c232",
                    }}
                  >
                    {/* Dark Overlay */}
                    <div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        backgroundColor: "#312708",
                        opacity: 0.7,
                        zIndex: 1,
                      }}
                    ></div>

                    {/* Content (Menu Icon and Restaurant Info) */}
                    <div className="relative z-10 flex flex-row">
                      {/* Menu Icon */}
                      <div className="p-2 pr-0 mt-1">
                        <Image
                          src="/images/menuIcon.png"
                          alt="Restaurant Logo"
                          width={130}
                          height={130}
                          className="object-cover xs:w-[80px] xs:h-[80px]"
                        />
                      </div>

                      {/* Restaurant Info */}
                      <div className="pt-2 pb-2 pl-0 text-white flex flex-col space-y-0 w-full">
                        <div className="relative z-10 ml-2">
                          <h1 className="text-[10px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px] text-[#ebeb48] -mb-1">
                            African Restaurant 3
                          </h1>
                          <p className="text-[8px] md:text-[11px] lg:text-[11px] xl:text-[11px] 2xl:text-[11px]">
                            Kenyan, Luzern
                          </p>
                          <p className="text-[8px] md:text-[11px] lg:text-[11px] xl:text-[11px] 2xl:text-[11px]">
                            4.7 (118), 1.28 km • 30–40
                          </p>
                          <p className="text-[8px] md:text-[11px] lg:text-[11px] xl:text-[11px] 2xl:text-[11px]">
                            Minimum Order: 25.00 CHF
                          </p>
                          <button
                            className="flex flex-row text-[#0bdad4] text-[8px] md:text-[11px] lg:text-[11px] xl:text-[11px] 2xl:text-[11px] font-bold mt-1 -mr-6 items-center"
                            onClick={toggleDropdown}
                            aria-expanded={isDropdownOpen}
                            aria-controls="opening-hours-dropdown"
                          >
                            Opening Hours: 07:00 – 23:45 Uhr{" "}
                            <ChevronDown size={12} className={isDropdownOpen ? "rotate-180" : ""} />
                          </button>
                          {isDropdownOpen && (
                            <div
                              id="opening-hours-dropdown"
                              className="absolute top-full left-0 mt-1 rounded-xl w-full"
                              style={{
                                backgroundColor: "#312708",
                                opacity: 0.9,
                                border: "2px solid #f1c232",
                              }}
                            >
                              <div className="p-2 text-white text-[11px]">
                                <p>Monday: 07:00 – 23:45</p>
                                <p>Tuesday: 07:00 – 23:45</p>
                                <p>Wednesday: 07:00 – 23:45</p>
                                <p>Thursday: 07:00 – 23:45</p>
                                <p>Friday: 07:00 – 00:00</p>
                                <p>Saturday: 08:00 – 00:00</p>
                                <p>Sunday: 08:00 – 22:00</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* right side content */}
                <div className="flex flex-col items-center mt-4 md:-mr-10 md:items-end space-y-3">
                  <div className="flex flex-wrap justify-center md:justify-end gap-2">
                    <button className="bg-[#670402] text-white rounded-full w-20 border-2 border-white py-1.5 px-2 md:px-3 text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] font-semibold hover:bg-[#670402] transition duration-200 whitespace-nowrap">
                      MAIN DISHES
                    </button>
                    <button className="bg-[#670402] text-white rounded-full w-20 border-2 border-white py-1.5 px-2 md:px-3 text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] font-semibold hover:bg-[#670402] transition duration-200 whitespace-nowrap">
                      SNACKS
                    </button>
                    <button className="bg-[#670402] text-white rounded-full w-20 border-2 border-white py-1.5 px-2 md:px-3 text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] font-semibold hover:bg-[#670402] transition duration-200 whitespace-nowrap">
                      DRINKS
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-5">
                    {/* filter & sort btn */}
                    <div className="flex flex-wrap gap-2">
                      {/* filer by */}
                      <button className="text-white text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] xs:text-xs sm:text-xs flex items-center rounded-full w-20 border-2 rounded:space-x-2 bg-[#670402] text-black font-bold p-1 pl-2 transition">
                        <span>FILTER BY</span>
                        <ChevronDown className="text-white" size={12} />
                      </button>
                      {/* sort by */}
                      <button className="text-white text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] xs:text-xs sm:text-xs flex items-center rounded-full w-20 border-2 rounded:space-x-2 bg-[#670402] text-black font-bold p-1 pl-2 transition">
                        <span>SORT BY</span>
                        <ChevronDown size={12} />
                      </button>
                    </div>

                    {/* search & share btn */}
                    <div className="flex flex-wrap gap-4">
                      {/* search buttons */}
                      <button className="bg-white rounded-lg p-1 shadow-md hover:shadow-lg transition">
                        <Search size={16} className="text-gray-900 xs:size-20" />
                      </button>
                      {/* share btn */}
                      <button className="bg-white p-1 rounded-lg shadow-md hover:shadow-lg transition">
                        <img src="/images/shareButton.png" alt="Shopping Basket" style={{ width: 20, height: 20 }} />
                      </button>
                    </div>
                  </div>
                </div>
              </header>

              {/* card section */}
              <section className="flex flex-col w-[102%] space-y-6 z-10 ">
                {meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex flex-col shadow-md overflow-hidden border-2 border-[#f1c232] relative"
                    style={{
                      backgroundImage: 'url("/images/Box_Restaurant_BckgImg01.png")',
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      borderRadius: "10px",
                    }}>

                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: "#312708",
                        opacity: 0.75,
                        zIndex: 1,
                      }}
                    ></div>
                    <div className="relative z-10 w-auto">
                      <div className="flex flex-row w-auto">

                        <div className="m-3 mb-2 w-1/2 h-auto bg-gray-200 flex items-start justify-start text-gray-500 text-[10px] xs:text-sm font-semibold rounded-[10px] border border-amber-400 xs:mr-4">
                          {/* image will appear here */}
                        </div>

                        <div className="p-2 flex flex-col justify-end">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="text-[13px] font-bold text-[#ebeb48]">
                              {meal.title}
                            </h3>
                            <span className="inline-block bg-[#367627] border border-[#f1c232] text-white text-[10px] py-1 px-4 xs:px-4 xs:py-2 rounded-full">
                              VEGAN
                            </span>
                          </div>
                          <p className="text-sm mb-1 text-white ">{meal.description}</p>

                          {/* btn section */}
                          <div className="flex items-center justify-between mt-1 space-x-4">
                            <div className="flex items-center space-x-6 xs:space-x-4 rounded-lg">
                              <button className="bg-[#670402] text-white py-2 px-2 px-3 border  border-amber-400 rounded-3xl text-[10px] font-semibold transition duration-200 whitespace-nowrap">
                                ADD TO CART
                              </button>
                              <button className="px-2 border-2 rounded-lg bg-white">
                                1+
                              </button>
                              <span className="text-[5px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] xs:text-sm sm:text-lg text-white">
                                Fr. {meal.price.toFixed(2)}.-
                              </span>
                            </div>
                            <div className="flex items-center space-x-4">

                              <button
                                className="relative p-0 text-green-600 hover:text-green-800 transition rounded-lg"
                                onClick={() => {
                                  setHeartStates((prev) => ({
                                    ...prev,
                                    [meal.id]: !prev[meal.id],
                                  }));
                                }}
                              >
                                <img
                                  src={heartStates[meal.id] ? '/images/heartIconG.png' : '/images/heartIconO.png'}
                                  alt="Add to favorites"
                                  style={{ width: 60, height: 60 }}
                                />
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
          )}
          {showArrow && (
            <div className="fixed bottom-4 left-[38.5vw] bg-transparent p-2 z-10">
              <img
                src="/images/scrollArrow.png"
                alt="Scroll down"
                className="w-14 h-40 object-contain animate-bounce"
              />
            </div>
          )}
        </div>
      </div>
      {/* Arrow animation */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce {
          animation: bounce 1.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}