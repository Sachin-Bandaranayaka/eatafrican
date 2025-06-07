"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Heart, Search, ChevronDown, Plus, Minus, Share, Share2, X } from "lucide-react";
import RestaurantList from "./restaurant-list";

function ItemQuantitySelector({ quantity, setQuantity }) {
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

export default function UserDashboardComponent({ onClose }) {
  const [itemQuantities, setItemQuantities] = useState({
    1: 1,
    2: 1,
    3: 1,
  });

  const [favoriteStates, setFavoriteStates] = useState({
    1: true,
    2: true,
    3: true,
  });

  const [showRestaurantList, setShowRestaurantList] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [currentView, setCurrentView] = useState('orders'); // Added state for view control
  const dashboardRef = useRef(null);

  const order = [
    {
      id: "ORD-5400",
      status: "In Transit",
      title: "Meal Name Lorem ipsum dolor sit",
      adress: "Restaurant Tastes of Africa, Zurich",
      date: "26. June 2025",
      time: "15.30",
      order: "1x Doro Wat, 2X Injera +more",
      price: 45.0,
      qty: 5,
    },
    {
      id: "ORD-5400",
      status: "In Transit",
      title: "Meal Name Lorem ipsum dolor sit",
      adress: "Restaurant Tastes of Africa, Zurich",
      date: "26. June 2025",
      time: "15.30",
      order: "1x Doro Wat, 2X Injera +more",
      price: 45.0,
    },
    {
      id: "ORD-5400",
      status: "In Transit",
      title: "Meal Name Lorem ipsum dolor sit",
      adress: "Restaurant Tastes of Africa, Zurich",
      date: "26. June 2025",
      time: "15.30",
      order: "1x Doro Wat, 2X Injera +more",
      price: 45.0,
    },
  ];

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
      if (dashboardRef.current) {
        const isOverflowing = dashboardRef.current.scrollHeight > window.innerHeight;
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
          ref={dashboardRef}
          className="z-0 w-[100%] bg-transparent xs:p-6 flex flex-col md:flex-row space-y-4 xs:space-y-6 md:space-y-0 md:space-x-6 font-sans text-gray-900 -mt-[80%] md:mt-0 ml-3"
        >
          {showRestaurantList ? (
            <RestaurantList />
          ) : (
            <main className="md:w-[95%] p-2 md:p-0 flex flex-col space-y-4 xs:space-y-6">
              {/* Dashboard header - Always visible */}
              <header className="flex flex-row justify-between items-center mr-2">
                {/* Left side content */}
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
                        backgroundColor: "#f1c232ff",
                        opacity: '80%',
                        zIndex: 1,
                      }}
                    ></div>
                    {/* Content (Menu Icon and Restaurant Info) */}
                    <div className="relative z-10 flex flex-row w-full p-[8%] mr-10">
                      {/* Dashboard Info */}
                      <div className="pt-[1%] pb-[1%] pl-0 text-white flex flex-col space-y-0 w-full">
                        <div className="relative z-10 ml-2">
                          <h1 className="text-[#274e13] text-[8px] md:text-[13px] font-bold lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">
                            Hallo John Doe
                          </h1>
                          <h1 className="text-[#274e13] text-[8px] md:text-[13px] font-bold lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">
                            Welcome to your dashboard
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side content */}
                <div className="flex flex-col items-center md:-mr-10 md:items-end space-y-3">
                  <div className="flex flex-wrap justify-center md:justify-end gap-2">
                    <button
                      onClick={() => setCurrentView('orders')}
                      className="bg-amber-900 text-white rounded-[9px] w-12 md:w-20 border-2 border-white py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] font-semibold hover:bg-amber-900 transition duration-200 whitespace-nowrap"
                    >
                      ORDERS
                    </button>
                    {/* FAVOURITES */}
                    <button
                      onClick={() => setCurrentView('favourites')}
                      className="bg-red-900 text-white rounded-[9px] w-12 md:w-20 border-2 border-white py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] font-semibold hover:bg-red-900 transition duration-200 whitespace-nowrap"
                    >
                      FAVOURITES
                    </button>
                    <button className="bg-red-900 text-white rounded-[9px] w-12 md:w-auto border-2 border-white py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] font-semibold hover:bg-red-900 transition duration-200 whitespace-nowrap">
                      LOYALTY POINTS
                    </button>
                    <button className="bg-red-900 text-white rounded-[9px] w-12 md:w-20 border-2 border-white py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] font-semibold hover:bg-red-900 transition duration-200 whitespace-nowrap">
                      NEWS
                    </button>
                  </div>

                  <div className="flex flex-row gap-1 md:gap-5 items-center justify-center">
                    {/* Filter & Sort buttons */}
                    <div className="flex flex-row gap-2">
                      <div className=" items-center justify-center">

                        {/* Account */}
                        <button className="bg-red-900 text-white rounded-[9px] w-12 md:w-20 border-2 border-white py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] font-semibold hover:bg-red-900 transition duration-200 whitespace-nowrap">
                          ACCOUNT
                        </button>

                      </div>
                      {/* empty box for layout */}
                      <div className="w-8 md:w-10 p-1"> </div>
                      <div className="w-32 md:w-56 flex flex-row justify-end gap-2  p-0.5">
                        {/* Conditionally render Sort by and Filter by */}
                        {currentView !== 'favourites' && (
                          <>
                            <button className="text-white text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] flex items-center rounded-[5px] rounded-[9px] w-14 md:w-20 border-2 rounded:space-x-2 bg-amber-900 font-bold pl-2 transition">
                              <span>SORT BY</span>
                              <div className="ml-1">
                                <ChevronDown style={{ strokeWidth: 6 }} size={12} />
                              </div>
                            </button>
                            <button className="text-white text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] flex items-center rounded-[5px] rounded-[9px] w-14 md:w-20 border-2 rounded:space-x-2 bg-amber-900 font-bold pl-2 transition">
                              <span>FILTER BY</span>
                              <div className="ml-1">
                                <ChevronDown style={{ strokeWidth: 6 }} size={12} />
                              </div>
                            </button>

                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {/* Ordercard section - Shown by default */}
              {currentView === 'orders' && (
                <section className="flex flex-col w-[102%] space-y-3 z-10">
                  {order.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col shadow-md overflow-hidden border-2 border-[#f1c232] relative -mt-2"
                      style={{
                        backgroundImage: 'url("/images/Box_Restaurant_BckgImg01.png")',
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        borderRadius: "10px",
                      }}
                    >
                      {/* Overlay */}
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: "#783f04ff",
                          opacity: '70%',
                          zIndex: 1,
                        }}
                      ></div>
                      <div className="relative z-10 w-auto">
                        <div className="flex flex-row w-auto">
                          {/* details */}
                          <div className="m-[1%] w-3/4 h-auto flex flex-col items-between justify-between text-gray-500 text-[10px] xs:text-sm rounded-[10px] xs:mr-4">
                            <div className="flex flex-row mb-2">
                              <h3 className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold text-white">
                                {order.id}
                              </h3>
                              <h3 className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] text-white ml-4">
                                {order.status}
                              </h3>
                            </div>
                            <p className="text-[10px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] font-base text-white ">
                              {order.title}
                            </p>
                            <p className="text-[10px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] text-white ">
                              {order.description}
                            </p>
                            <p className="text-[10px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] text-white ">
                              {order.date},{order.time}
                            </p>
                            <p className="text-[10px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] text-white ">
                              {order.order}
                            </p>
                          </div>
                          {/* price & view more btn */}
                          <div className="p-[1%] flex flex-col justify-end items-end space-y-10 w-1/4">
                            <div className="flex items-end mb-1">
                              <span className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] xs:text-sm sm:text-lg font-bold text-white">
                                Fr. {order.price.toFixed(2)}.-
                              </span>
                            </div>
                            {/* Button section */}
                            <div className="flex flex-col items-end justify-end md:mt-[1%] space-x-4">
                              <div className="flex items-center space-x-4">
                                {/* view details btn */}
                                <button
                                  onClick={() => setCurrentView('orderDetails')}
                                  className="relative p-0 font-bold text-red-900 hover:text-white transition rounded-lg text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]"
                                >
                                  View Details -&gt;
                                </button>
                              </div>
                              {/* view more btn */}
                              <div className="flex items-center space-x-4">
                                <button
                                  className="relative p-0 font-bold text-amber-400 hover:text-white transition rounded-lg text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]"
                                >
                                  View More -&gt;
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {/* Meal card section - Hidden by default */}
              {currentView === 'favourites' && (
                <section className="flex flex-col w-[102%] space-y-3 z-10">
                  {meals.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex flex-col shadow-md overflow-hidden border-2 border-[#f1c232] relative -mt-2"
                      style={{
                        backgroundImage: 'url("/images/Box_Restaurant_BckgImg01.png")',
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        borderRadius: "10px",
                      }}
                    >
                      {/* overlay */}
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: "#783f04ff",
                          opacity: '70%',
                          zIndex: 1,
                        }}
                      ></div>
                      <div className="relative z-10 w-auto">
                        <div className="flex flex-row w-auto">
                          <div className="m-[1%] w-1/2 h-auto bg-gray-200 flex items-start justify-start text-gray-500 text-[10px] xs:text-sm font-semibold rounded-[10px] border border-amber-400 xs:mr-4">
                            {/* image will appear here */}
                          </div>
                          <div className="p-[1%] flex flex-col justify-end">
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold text-[#ebeb48]">
                                {meal.title}
                              </h3>
                              <span className="inline-block bg-[#367627] border border-[#f1c232] text-white py-1 px-4 xs:px-4 xs:py-2 rounded-full
                              text-[6px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]">
                                VEGAN
                              </span>
                            </div>

                            <div className="flex flex-col w-[100%] items-between justify-between">
                              <div className="w-full flex flex-row items-between justify-between">
                                <p className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] mb-1 text-[#ebeb48] w-1/3">Restaurant Name</p>
                                <p className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] mb-1 text-white w-2/3">Lorem ipsom dolor sit amet, consetetur</p>
                              </div>
                            </div>

                            <div className="flex flex-col w-[100%] items-between justify-between">
                              <div className="w-full flex flex-row items-between justify-between">
                                  <p className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] mb-1 text-[#ebeb48] w-1/3">Restaurant Location</p>
                                  <p className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] mb-1 text-white w-2/3">sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore.m</p>
                              </div>
                            </div>
                            {/* btn section */}
                            <div className="flex items-center justify-between md:mt-[1%] space-x-4">
                              <div className="flex items-center space-x-6 xs:space-x-4 ">
                                <button className="bg-[#670402] text-white py-[3%] px-3 border border-amber-400 rounded-[10px] font-semibold transition duration-200 whitespace-nowrap text-[8px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px]">
                                  ADD TO CART
                                </button>
                                <button className="px-2 border-2 rounded-[20%] bg-white text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">
                                  1+
                                </button>
                                <span className="text-[8px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] xs:text-sm sm:text-lg text-white">
                                  Fr. {meal.price.toFixed(2)}.-
                                </span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <button className="relative p-0 text-green-600 hover:text-green-800 transition rounded-lg">
                                  <img
                                    src="/images/recycleBin.png"
                                    alt="Add to favorites"
                                    style={{ width: 20, height: 20 }}
                                    className="w-auto h-auto md:w-14 md:h-14"
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
              )}

              {/* Order details section - Hidden by default */}
              {currentView === 'orderDetails' && (
                <section className="flex flex-col w-[102%] h-auto space-y-3 z-10 border-2 border-white "
                  style={{
                    backgroundImage: 'url("/images/orderstatus.png")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "10px",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="relative h-auto">
                    {/* overlay */}
                    <div
                      className="absolute inset-0 "
                      style={{
                        backgroundColor: "#783f04ff",
                        opacity: '70%',
                        zIndex: 1,
                        borderRadius: "10px",
                      }}
                    ></div>
                    <div className="flex justify-between z-10">
                      {/* left side */}
                      <div className="flex flex-col w-1/2 mb-20 ml-4">
                        <div className="relative z-10 p-3 text-white">
                          <h1 className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]">ORDER DETAILS</h1>
                        </div>
                        <div className="flex flex-row justify-between">
                          <div className="relative z-10 p-3 text-white font-bold">
                            <h1 className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]"> ORD-5400</h1>
                          </div>
                          <div className="relative z-10 p-3 text-white">
                            <h1 className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]"> IN TRANSIT</h1>
                          </div>
                        </div>
                        <div className="relative z-10 space-y-4">
                          {order.map((order) => (
                            <div className="">
                              <h1 className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] text-amber-400 font-bold">{order.adress}</h1>
                              <div className="space-y-4">
                                <div className="flex flex-row w-auto h-auto">
                                  <div className="m-[1%] w-1/3 h-20 bg-gray-200 flex items-start justify-start text-gray-500 text-[10px] xs:text-sm font-semibold border border-amber-400 xs:mr-4">
                                    {/* image will appear here */}
                                  </div>
                                  <div className="flex flex-col text-white ml-4 text-[15px] ">
                                    <p className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold">Jollof Rice With Plantain</p>
                                    <p className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Fr. {order.price}.- </p>
                                    <p className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Qty - {order.qty} </p>
                                  </div>
                                </div>
                                <div className="flex flex-row w-auto h-auto">
                                  <div className="m-[1%] w-1/3 h-20 bg-gray-200 flex items-start justify-start text-gray-500 text-[10px] xs:text-sm font-semibold border border-amber-400 xs:mr-4">
                                    {/* image will appear here */}
                                  </div>
                                  <div className="flex flex-col text-white ml-4 text-[15px] ">
                                    <p className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold">Jollof Rice With Plantain</p>
                                    <p className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Fr. {order.price}.- </p>
                                    <p className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Qty - {order.qty} </p>
                                  </div>
                                </div>
                                <div className="flex flex-row w-auto h-auto">
                                  <div className="m-[1%] w-1/3 h-20 bg-gray-200 flex items-start justify-start text-gray-500 text-[10px] xs:text-sm font-semibold border border-amber-400 xs:mr-4">
                                    {/* image will appear here */}
                                  </div>
                                  <div className="flex flex-col text-white ml-4 text-[15px] ">
                                    <p className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold">Jollof Rice With Plantain</p>
                                    <p className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Fr. {order.price}.- </p>
                                    <p className="text-[7px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Qty - {order.qty} </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* right side */}
                      <div className="relative z-10 p-3 w-1/2">
                        <div className="flex flex-col justify-end items-end">
                          {/* cancel btn */}
                          <button
                            onClick={() => setCurrentView('orders')}
                            className="rounded-full p-1 z-50 ml-2"
                            type="button"
                            aria-label="Close"
                          >
                            <img
                              src="/images/cancelBtnWhite.png"
                              alt="Close"
                              className="w-4 h-4 object-contain"
                            />
                          </button>
                        </div>
                        <div className="w-[80%] flex flex-col space-y-3 mt-[20%] ml-[5%]">
                          <div className="w-auto h-auto">
                            <div className="relative w-full bg-[#df9f5b] border border-white opacity-75 p-4 rounded-lg flex justify-between text-black">
                              <div>
                                <h1 className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] font-bold text-red-600">Order Date and Time:</h1>
                                <div className="text-[7px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">June 28.2025 at 12.30 pm</div>
                                <h1 className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] font-bold text-red-600">Expected Delivery Date and Time:</h1>
                                <div className="text-[7px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">June 28.2025 at 12.30 pm</div>
                                <h1 className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] font-bold text-red-600">Delivery To:</h1>
                                <div className="text-[7px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px]">
                                  <p>john Dankbarkeit</p>
                                  <p>Erfullstreasse 43,</p>
                                  <p>8300 Zurich</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-auto h-auto">
                            <div className="relative w-full bg-[#cfe2f3] border border-white opacity-75 p-4 rounded-lg flex justify-between">
                              <div className="text-red-600 font-bold">
                                <div className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Subtotal</div>
                                <div className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Delivery Fee</div>
                                <div className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] font-bold">Total</div>
                              </div>
                              <div className="text-center">
                                <div className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Fr. 250.000.-</div>
                                <div className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px]">Fr. 250.000.-</div>
                                <div className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] font-bold">Fr. 250.000.-</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
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
      </div >
      {/* Scroll animation */}
      < style > {`
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
      `}</style >
    </>
  );
}