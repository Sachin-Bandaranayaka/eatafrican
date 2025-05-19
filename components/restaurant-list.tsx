"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart, Star, Search, ChevronDown, Filter, SortAsc, Minus, Plus, Share
} from "lucide-react";
import ViewMenu from "./view-menu";

export default function RestaurantListing() {
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

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
    <div className="min-h-screen flex md:flex-row bg-transparent text-gray-900 font-sans pl-1 w-auto -mt-[80vh] md:mt-20">
      <div className="w-screen p-4 pl-10 space-y-4 xs:space-y-6 md:space-y-2">
        <div className="flex items-center justify-end p-0 relative z-10">
          <div className="bg-[url('/images/Content_Title_Background.png')] bg-no-repeat bg-cover bg-center inline-block rounded-l-full rounded-r-sm pl-6 pr-2 py-2">
            <h2 className="block text-balck text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold uppercase rounded whitespace-nowrap">
              AFRICAN RESTAURANTS IN ZURICH
            </h2>
          </div>
          {/* Close Button */}
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

        {/* Filter and Sort Buttons */}
        <div className="flex justify-end space-x-4 mb-6">
          <button className="bg-[#434343ff] text-white rounded-lg px-4 py-1 text-[5px] md:text-[8px] lg:text-[8px] xl:text-[8px] 2xl:text-[8px] font-bold flex items-center">
            <span>FILTER BY</span>
            <ChevronDown size={14} className="ml-1" />
          </button>

          <button className="bg-[#434343ff] text-white rounded-lg px-4 py-1 text-[5px] md:text-[8px] lg:text-[8px] xl:text-[8px] 2xl:text-[8px] font-bold flex items-center">
            <span>SORT BY</span>
            <ChevronDown size={14} className="ml-1" />
          </button>

          <button className="bg-white p-1">
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
              <div className="relative z-10 flex w-full">
                {/* Restaurant Image */}
                <div className="w-[40%] h-[50%] mt-[6%] bg-none flex items-center justify-center m-2 rounded-lg border-2 border-gray-300">
                  <div className="w-[70%] bg-white h-auto bg-none m-2 rounded-lg border-2 border-gray-300">
                    <span className="text-gray-400 text-xs text-center">
                      No Image Available
                    </span>
                  </div>
                </div>

                {/* Restaurant Info */}
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

                {/* View Menu Button */}
                <div className="flex items-center pr-2 ml-4 w-[90%]">
                  <p className="text-white text-[8px] md:text-xs lg:text-xs xl:text-xs 2xl:text-xs">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.m nonumy eirmod tempor invidunt ut labore et dolore. nonumy eirmod tempor invidunt ut labore et dolore.nonumy eirmod tempor invidunt ut labore et dolore.</p>
                </div>

                {/* Mask Image Placeholder */}
                {/* <div className="w-10 md:w-10 ml-20 h-auto bg-gray-200 flex text-gray-500 text-sm font-semibold">
                  <Image
                    src="/images/masks/mask02.png"
                    alt="Restaurant Logo"
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}