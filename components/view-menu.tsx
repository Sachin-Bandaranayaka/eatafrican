"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Heart, Search, ChevronDown, Plus, Minus, Share, Share2 } from "lucide-react";
import RestaurantList from "./restaurant-list";
import { useCart } from "@/lib/cart-context";

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

interface ViewMenuProps {
  restaurantId?: string;
}

export default function ViewMenu({ restaurantId }: ViewMenuProps) {
  const { addItem } = useCart();
  const [mealQuantities, setMealQuantities] = useState<{ [key: string]: number }>({});
  const [heartStates, setHeartStates] = useState<{ [key: string]: boolean }>({});
  const [showRestaurantList, setShowRestaurantList] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const outerDivRef = useRef<HTMLDivElement>(null);

  // Dynamic data from API
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch restaurant details and menu items
  useEffect(() => {
    async function fetchData() {
      if (!restaurantId) {
        setError("No restaurant selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch restaurant details
        const restaurantResponse = await fetch(`/api/restaurants/${restaurantId}`);
        if (!restaurantResponse.ok) {
          throw new Error("Failed to fetch restaurant details");
        }
        const restaurantData = await restaurantResponse.json();
        setRestaurant(restaurantData);

        // Fetch menu items
        const menuResponse = await fetch(`/api/restaurants/${restaurantId}/menu`);
        if (!menuResponse.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const menuData = await menuResponse.json();
        setMenuItems(menuData.items || []);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(menuData.items?.map((item: any) => item.category) || [])
        ) as string[];
        setCategories(uniqueCategories);

        // Initialize quantities and heart states
        const quantities: { [key: string]: number } = {};
        const hearts: { [key: string]: boolean } = {};
        menuData.items?.forEach((item: any) => {
          quantities[item.id] = 1;
          hearts[item.id] = false;
        });
        setMealQuantities(quantities);
        setHeartStates(hearts);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load menu");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [restaurantId]);

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

  // Filter menu items by selected category
  const filteredMenuItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

  // Format opening hours for display
  const formatOpeningHours = (hours: any): string[] => {
    if (!hours) return ["Not available"];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days.map((day) => {
      const dayKey = day.toLowerCase();
      const dayHours = hours[dayKey];
      if (!dayHours) return `${day}: Closed`;
      return `${day}: ${dayHours.open} – ${dayHours.close}`;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white text-lg">Loading menu...</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-lg">{error || "Restaurant not found"}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col">
        <div
          ref={outerDivRef}
          className="z-0 w-[100%] bg-transparent xs:p-6 flex flex-col md:flex-row space-y-4 xs:space-y-6 md:space-y-0 md:space-x-6 font-sans text-gray-900 -mt-[185%] md:mt-0 ml-3"
        >
          {showRestaurantList ? (
            <RestaurantList />
          ) : (
            <main className="  md:w-[95%] p-2 md:p-0 flex flex-col space-y-4 xs:space-y-6">
              {/* site header */}
              <header className="flex flex-row justify-between items-center mr-2">

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
                        backgroundColor: "#f1c232ff",
                        opacity: '80%',
                        zIndex: 1,
                      }}
                    ></div>

                    {/* Content (Menu Icon and Restaurant Info) */}
                    <div className="relative z-10 flex flex-row">
                      {/* Menu Icon */}
                      <div className="p-[1%] mt-1 
                      w-[70%] md:w-auto lg:w-auto xl:w-auto 2xl:w-auto h-[70%] md:h-auto lg:h-auto xl:h-auto 2xl:h-auto 
                      ">
                        <Image
                          src="/images/menuIcon.png"
                          alt="Restaurant Logo"
                          width={130}
                          height={130}
                          className="object-cover    "
                        />
                      </div>

                      {/* Restaurant Info */}
                      <div className="pt-2 md:pt-[1%] pb-[1%] pl-0 text-white flex flex-col space-y-0 w-full">
                        <div className="relative z-10 ml-1 md:ml-2">
                          <h1 className="text-[8px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px] text-[#980000] -mb-1">
                            {restaurant.name}
                          </h1>
                          <p className="text-[#980000] text-[6px] md:text-[11px] lg:text-[11px] xl:text-[11px] 2xl:text-[11px]">
                            {restaurant.cuisineTypes?.join(", ") || "African"}, {restaurant.city}
                          </p>
                          <p className="text-[#980000] text-[6px] md:text-[11px] lg:text-[11px] xl:text-[11px] 2xl:text-[11px]">
                            {restaurant.rating?.toFixed(1) || "N/A"} ({restaurant.totalRatings || 0})
                          </p>
                          <p className="text-[#980000] text-[6px] md:text-[11px] lg:text-[11px] xl:text-[11px] 2xl:text-[11px]">
                            Minimum Order: {restaurant.minOrderAmount?.toFixed(2) || "0.00"} CHF
                          </p>
                          <button
                            className="flex flex-row text-[#274e13] font-bold mt-1 md:-mr-6 items-center
                            text-[6px] md:text-[11px] lg:text-[11px] xl:text-[11px] 2xl:text-[11px] "
                            onClick={toggleDropdown}
                            aria-expanded={isDropdownOpen}
                            aria-controls="opening-hours-dropdown"
                          >
                            Opening Hours{" "}
                            <div className="md:ml-1 ">
                              <ChevronDown size={12} className={`text-[#274e13] ${isDropdownOpen ? "rotate-180" : ""}`} style={{ strokeWidth: 6 }} />
                            </div>
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
                              <div className="p-2 text-white text-[11px] z-50">
                                {formatOpeningHours(restaurant.openingHours).map((line: string, idx: number) => (
                                  <p key={idx}>{line}</p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* right side content */}
                <div className="flex flex-col items-end justify-start -mr-4 md:-mr-10 md:items-end space-y-3">
                  <div className="flex flex-wrap justify-center md:justify-end gap-2">
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={`${!selectedCategory ? 'bg-amber-700' : 'bg-amber-900'} text-white rounded-[9px] w-12 md:w-20 border-2 border-white py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] font-semibold hover:bg-amber-700 transition duration-200 whitespace-nowrap`}>
                      ALL
                    </button>
                    {categories.map((category) => (
                      <button 
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`${selectedCategory === category ? 'bg-amber-700' : 'bg-amber-900'} text-white rounded-[9px] w-12 md:w-20 border-2 border-white py-1.5 px-1 md:px-3 text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] font-semibold hover:bg-amber-700 transition duration-200 whitespace-nowrap`}>
                        {category.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-row gap-1 md:gap-5">
                    {/* filter & sort btn */}
                    <div className="flex flex-row md:gap-2">
                      {/* filer by */}
                      <button className="text-white flex items-center bg-amber-900 py-1 md:py-1.5
                      text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] 
                      rounded-[5px] rounded-[9px] w-14 md:w-20 border-2 rounded:space-x-2  font-bold p-1 pl-2 transition md:mr-0.5">
                        <span>FILTER BY</span>
                        <div className="ml-1">
                          <ChevronDown style={{ strokeWidth: 6 }} size={12} />
                        </div>
                      </button>
                      {/* sort by */}
                      <button className="text-white  py-1 md:py-1.5
                      text-[5px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-[9px] 
                      flex items-center rounded-[5px] rounded-[9px] w-14 md:w-20 border-2 rounded:space-x-2 bg-amber-900 font-bold pl-2 transition md:mr-0.5">
                        <span>SORT BY</span>
                        <div className="ml-1">
                          <ChevronDown style={{ strokeWidth: 6 }} size={12} />
                        </div>
                      </button>
                    </div>

                    {/* search & share btn */}
                    <div className="flex flex-row gap-1 md:gap-4 items-center">
                      <div className=" ">
                        <Search style={{ strokeWidth: 1, background: 'white', color: 'black' }} className="rounded-sm size-5 md:size-6 p-1 " />
                      </div>
                      {/* share btn */}
                      <div className=" ">
                        <Share2 style={{ strokeWidth: 1, background: 'white', color: 'black' }} className="rounded-sm size-5 md:size-6 p-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {/* card section */}
              <section className="flex flex-col w-[102%] space-y-3 z-10">
                {filteredMenuItems.length === 0 ? (
                  <div className="text-center text-white py-8">
                    <p>No menu items available</p>
                  </div>
                ) : (
                  filteredMenuItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col shadow-md overflow-hidden border-2 border-[#f1c232] relative -mt-2"
                      style={{
                        backgroundImage: 'url("/images/Box_Restaurant_BckgImg01.png")',
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        borderRadius: "10px",
                      }}>

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

                          <div className="m-[1%] w-1/2 h-auto bg-gray-200 flex items-start justify-start text-gray-500 text-[10px] xs:text-sm font-semibold rounded-[10px] border border-amber-400 xs:mr-4 overflow-hidden">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                No Image
                              </div>
                            )}
                          </div>

                          <div className="p-[1%] flex flex-col justify-end">
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold text-[#980000]">
                                {item.name}
                              </h3>
                              {item.dietaryTags && item.dietaryTags.length > 0 && (
                                <span className="inline-block bg-[#367627] border border-[#f1c232] text-white text-[10px] py-1 px-4 xs:px-4 xs:py-2 rounded-full">
                                  {item.dietaryTags[0].toUpperCase()}
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] mb-1 text-white ">{item.description}</p>

                            {/* btn section */}
                            <div className="flex items-center justify-between md:mt-[1%] space-x-4">
                              <div className="flex items-center space-x-6 xs:space-x-4 ">
                                <button 
                                  onClick={() => {
                                    if (!restaurant || !restaurantId) {
                                      alert('Restaurant information not available');
                                      return;
                                    }
                                    
                                    const quantity = mealQuantities[item.id] || 1;
                                    
                                    // Add item to cart using the cart context
                                    addItem({
                                      id: `${item.id}-${Date.now()}`, // Unique cart item ID
                                      menuItemId: item.id,
                                      name: item.name,
                                      description: item.description || '',
                                      price: parseFloat(item.price),
                                      quantity: quantity,
                                      image: item.imageUrl,
                                      restaurantId: restaurantId,
                                      restaurantName: restaurant.name,
                                    });
                                    
                                    // Reset quantity to 1 after adding
                                    setMealQuantities((prev) => ({
                                      ...prev,
                                      [item.id]: 1,
                                    }));
                                    
                                    // Show success feedback
                                    console.log('Added to cart:', { item: item.name, quantity, price: item.price });
                                  }}
                                  className="bg-[#670402] text-white py-[3%] px-3 border border-amber-400 rounded-[10px] font-semibold transition duration-200 whitespace-nowrap hover:bg-[#8a0503]
                                  text-[8px] md:text-[10px] lg:text-[10px] xl:text-[10px] 2xl:text-[10px] 
                                ">
                                  ADD TO CART
                                </button>
                                
                                {/* Quantity selector with +/- buttons */}
                                <div className="flex items-center gap-1 bg-white rounded-md px-1 border-2 border-amber-400">
                                  <button
                                    onClick={() => {
                                      setMealQuantities((prev) => ({
                                        ...prev,
                                        [item.id]: Math.max(1, (prev[item.id] || 1) - 1),
                                      }));
                                    }}
                                    className="text-[#670402] font-bold hover:text-[#8a0503] text-[12px] md:text-[16px] px-1"
                                  >
                                    -
                                  </button>
                                  <span className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold text-[#670402] min-w-[20px] text-center">
                                    {mealQuantities[item.id] || 1}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setMealQuantities((prev) => ({
                                        ...prev,
                                        [item.id]: (prev[item.id] || 1) + 1,
                                      }));
                                    }}
                                    className="text-[#670402] font-bold hover:text-[#8a0503] text-[12px] md:text-[16px] px-1"
                                  >
                                    +
                                  </button>
                                </div>
                                
                                <span className="text-[8px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] xs:text-sm sm:text-lg text-white">
                                  Fr. {item.price.toFixed(2)}.-
                                </span>
                              </div>
                              <div className="flex items-center space-x-4">

                                <button
                                  className="relative p-0 text-green-600 hover:text-green-800 transition rounded-lg"
                                  onClick={() => {
                                    setHeartStates((prev) => ({
                                      ...prev,
                                      [item.id]: !prev[item.id],
                                    }));
                                  }}
                                >
                                  <img
                                    src={heartStates[item.id] ? '/images/heartIconG.png' : '/images/heartIconO.png'}
                                    alt="Add to favorites"
                                    className="w-auto h-auto md:w-14 md:h-14"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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