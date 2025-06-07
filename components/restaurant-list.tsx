"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Heart, Star, Search, ChevronDown, Filter, SortAsc, Minus, Plus, Share,
  Share2
} from "lucide-react";
import ViewMenu from "./view-menu";

export default function RestaurantListing() {
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const mainDivRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);

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
    {
      id: 5,
      name: "Restaurant 4 Name",
      cuisine: "Kenyan",
      distance: "9 km, 47 min from Olten",
      minPrice: 24.0,
      rating: 3.5,
    },
  ];

  useEffect(() => {
    const checkHeight = () => {
      if (mainDivRef.current) {
        const mainDivHeight = mainDivRef.current.scrollHeight;
        const viewportHeight = window.innerHeight;
        setShowArrow(mainDivHeight > viewportHeight);
      }
    };
    checkHeight();
    window.addEventListener('resize', checkHeight);
    return () => window.removeEventListener('resize', checkHeight);
  }, []);

  const handleToggle = () => {
    setShowViewMenu(!showViewMenu);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  if (showViewMenu) {
    return <ViewMenu />;
  }

  return (
    <>
      <div ref={mainDivRef} className="z-50 w-[100%] min-h-screen bg-transparent xs:p-6 flex flex-col space-y-4 xs:space-y-6 md:space-y-0 md:space-x-6 font-sans text-gray-900 -mt-[185%] md:mt-0">

        {/* Header */}
        <div className="p-4 pl-4 space-y-4">
          <div className="flex items-center justify-between">
            {/* Title and Close Button */}
            <div className="flex items-start">
              <div className="relative bg-[url('/images/titlebck.png')] bg-no-repeat bg-cover bg-center rounded-r-full rounded-l-sm pl-2 pr-4 py-2 ml-2 ">
                <div
                  className="absolute inset-0 rounded-r-full rounded-l-sm"
                  style={{
                    backgroundColor: '#f1c232ff',
                    opacity: '80%',
                    zIndex: 1
                  }}
                ></div>
                <div className="relative z-10 md:pr-10">
                  <h2 className="relative text-black font-bold uppercase whitespace-nowrap 
                  text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] ">
                    AFRICAN RESTAURANTS IN ZURICH
                  </h2>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-row gap-1 md:gap-5 md:-mr-4">
              {/* filter & sort btn */}
              <div className="flex flex-row gap-2">
                {/* filer by */}
                <button className="text-white flex items-center bg-amber-900 
                      text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] 
                      rounded-[5px] rounded-[9px] w-14 md:w-20 border-2 rounded:space-x-2  font-bold p-1 pl-2 transition">
                  <span>FILTER BY</span>
                  <div className="ml-1">
                    <ChevronDown style={{ strokeWidth: 6 }} size={12} />
                  </div>
                </button>
                {/* sort by */}
                <button className="text-white 
                      text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] 
                      flex items-center rounded-[5px] rounded-[9px] w-14 md:w-20 border-2 rounded:space-x-2 bg-amber-900 font-bold pl-2 transition">
                  <span>SORT BY</span>
                  <div className="ml-1">
                    <ChevronDown style={{ strokeWidth: 6 }} size={12} />
                  </div>
                </button>
              </div>

              {/* search & share btn */}
              <div className="flex flex-row items-center gap-1 md:gap-4 rounded-lg">
                {/* share btn */}
                <div className=" ">
                  <Share2 style={{ strokeWidth: 1, background: 'white', color: 'black' }} className="rounded-sm size-5 md:size-6" />
                </div>
                {/* <button className="bg-white p-1 rounded-lg shadow-md hover:shadow-lg transition">
                  <img src="/images/shareButton.png" alt="Shopping Basket" className="text-gray-900 size-1 md:size-5" />
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* card section */}
        <div className="flex flex-col mx-auto w-[95%] ml-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-lg mb-4 flex overflow-hidden border-2 border-[#f1c232] relative"
              style={{
                backgroundImage: 'url("/images/Box_Restaurant_BckgImg01.png")',
                backgroundSize: 'contain',
                // backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                borderRadius: '10px'
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: '#f1c232ff',
                  opacity: '80%',
                  zIndex: 1
                }}
              ></div>
              <div className="relative z-10 flex flex-row w-full p-0">
                {/* image */}
                <div className="m-[1%] w-1/2 h-auto bg-gray-200 flex items-start justify-start text-gray-500 text-[10px] xs:text-sm font-semibold rounded-[10px] border border-amber-400 xs:mr-4">
                  {/* image will appear here */}
                </div>

                <div className="w-[60%] p-2 flex flex-col pl-4">
                  <h3 className="font-bold text-[#980000]  text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">{restaurant.name}</h3>
                  <div className="flex items-center text-[8px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px] mt-1">
                    <span className="text-black">{restaurant.cuisine}</span>
                  </div>
                  <div className="text-[8px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px] mt-1">
                    <span className="text-black">{restaurant.distance}</span>
                  </div>
                  <div className="text-[8px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px] mt-1">
                    <span className="text-black">Min Fr: {restaurant.minPrice.toFixed(2)}</span>
                  </div>
                  {/* <div className="text-[8px] md:text-[10px] lg:text-xs xl:text-xs 2xl:text-xs mt-1 flex items-center">
                    <span className="text-black">{restaurant.rating} hrs</span>
                  </div> */}
                  <div className="flex justify-start mt-2">
                    {/* <button
                      onClick={handleToggle}
                      className="bg-[#670402] text-white py-2 px-2 px-3 border  border-amber-400 rounded-[10px] text-[10px] font-semibold transition duration-200 whitespace-nowrap"
                    >
                      VIEW RESTAURANT
                    </button> */}
                    <button className="bg-[#670402] text-white py-[6%] md:py-[3%] px-3 border border-amber-400 rounded-[10px] font-semibold transition duration-200 whitespace-nowrap 
                              text-[8px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px] 
                              ">
                                VIEW RESTAURANT
                              </button>
                  </div>
                </div>
                <div className="w-[50%]">
                  <p className="text-black text-[6px] md:text-[10px] lg:text-[10px ] xl:text-[10px] 2xl:text-[10px] mt-2">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.m nonumy eirmod tempor invidunt ut labore et dolore. nonumy eirmod tempor invidunt ut labore et dolore.nonumy eirmod tempor invidunt ut labore et dolore.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow Indicator */}
      {showArrow && (
        <div className="fixed bottom-4 left-[40%] bg-transparent p-2 z-10">
          <img
            src="/images/scrollArrow.png"
            alt=""
            className="w-14 h-40 object-contain animate-bounce"
            style={{
              animation: 'bounce 2s infinite',
            }}
          />
        </div>
      )}

      {/* Arrow Animation */}
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