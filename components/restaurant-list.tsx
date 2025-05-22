"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Heart, Star, Search, ChevronDown, Filter, SortAsc, Minus, Plus, Share
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
      <div ref={mainDivRef} className="z-50 min-h-screen md:w-[100%] bg-transparent xs:p-6 flex flex-col md:flex-row space-y-4 xs:space-y-6 md:space-y-0 md:space-x-6 font-sans text-gray-900 -mt-[80vh] md:mt-14">
        <div className="w-screen p-4 pl-10 space-y-4 xs:space-y-6 md:space-y-2">
          <div className="flex items-center justify-end p-0 relative z-10">
            <div className="bg-[url('/images/Content_Title_Background.png')] bg-no-repeat bg-cover bg-center inline-block rounded-l-full rounded-r-sm pl-6 pr-2 py-2">
              <h2 className="block text-balck text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold uppercase rounded whitespace-nowrap">
                AFRICAN RESTAURANTS IN ZURICH
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="bg-[#ff9920] rounded-full p-1 z-50 ml-2"
              type="button"
            >
              <img
                src="/images/cancelBtnBlack.png"
                alt="Close"
                className="w-4 h-4 object-contain"
              />
            </button>
          </div>

          <div className="flex justify-end space-x-4 mb-6">
            <button className="bg-[#434343ff] text-white rounded-lg px-4 py-1 text-[5px] md:text-[8px] lg:text-[8px] xl:text-[8px] 2xl:text-[8px] font-bold flex items-center">
              <span>FILTER BY</span>
              <ChevronDown size={14} className="ml-1" />
            </button>
            <button className="bg-[#434343ff] text-white rounded-lg px-4 py-1 text-[5px] md:text-[8px] lg:text-[8px] xl:text-[8px] 2xl:text-[8px] font-bold flex items-center">
              <span>SORT BY</span>
              <ChevronDown size={14} className="ml-1" />
            </button>
            {/* share btn */}
            <button className="bg-white p-1 rounded-lg">
              <img
                src="/images/shareButton.png"
                alt="Shopping Basket"
                style={{ width: 20, height: 20 }}
              />
            </button>
          </div>

          <div className="relative mx-auto ">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-lg mb-4 flex overflow-hidden border-2 border-[#f1c232] relative"
                style={{
                  backgroundImage: 'url("/images/Box_Restaurant_BckgImg01.png")',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  borderRadius: '10px'
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: '#312708',
                    opacity: 0.75,
                    zIndex: 1
                  }}
                ></div>
                <div className="relative z-10 flex w-full">
                  <div className="w-[40%] h-[50%] mt-[6%] bg-none flex items-center justify-center m-2 rounded-lg border-2 border-gray-300">
                    <div className="w-[70%] bg-white h-auto bg-none m-2 rounded-lg border-2 border-gray-300">
                      <span className="text-gray-400 text-xs text-center">
                        No Image Available
                      </span>
                    </div>
                  </div>
                  <div className="w-[60%] p-2">
                    <h3 className="font-bold text-sm text-[#ebeb48]">{restaurant.name}</h3>
                    <div className="flex items-center text-[8px] md:text-xs lg:text-xs xl:text-xs 2xl:text-xs mt-1">
                      <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mr-1"></span>
                      <span className=" text-white">{restaurant.cuisine}</span>
                    </div>
                    <div className="text-[8px] md:text-xs lg:text-xs xl:text-xs 2xl:text-xs mt-1">
                      <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mr-1"></span>
                      <span className=" text-white">{restaurant.distance}</span>
                    </div>
                    <div className="text-[8px] md:text-xs lg:text-xs xl:text-xs 2xl:text-xs mt-1">
                      <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mr-1"></span>
                      <span className=" text-white">Min Fr: {restaurant.minPrice.toFixed(2)}</span>
                    </div>
                    <div className="text-[8px] md:text-xs lg:text-xs xl:text-xs 2xl:text-xs mt-1 flex items-center">
                      <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mr-1"></span>
                      <span className=" text-white">{restaurant.rating} hrs</span>
                    </div>
                    <button
                      onClick={handleToggle}
                      className="bg-red-800 text-white text-[8px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px] rounded-full px-3 py-1 whitespace-nowrap border-4 border-amber-400"
                    >
                      VIEW RESTAURANT
                    </button>
                  </div>
                  <div className="flex items-center pr-2 ml-4 w-[90%]">
                    <p className="text-white text-[8px] md:text-xs lg:text-xs xl:text-xs 2xl:text-xs">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.m nonumy eirmod tempor invidunt ut labore et dolore. nonumy eirmod tempor invidunt ut labore et dolore.nonumy eirmod tempor invidunt ut labore et dolore.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Arrow Indicator */}
      {showArrow && (
        <div className="fixed bottom-4 left-[45%] bg-transperant  p-2 z-10">
          <img src="/images/scrollArrow.png" alt="" className="w-14 h-40 object-contain"/>
        </div>
      )}
    </>
  );
}