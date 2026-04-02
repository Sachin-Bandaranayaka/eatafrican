"use client";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import EditMenuItemModal from "./EditMenuItemModal";
import AddMenuItemModal from "./AddMenuItemModal";
import RegularButton from "@/app/components/RegularButton";

// ============================================
// INTERFACES - Type definitions for data structures
// ============================================

interface MenuViewProps {
  restaurantId: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// ============================================
// CONSTANTS
// ============================================

const ITEMS_PER_PAGE = 4;
const MOBILE_MAIN_DISHES_ITEMS_PER_PAGE = 5;
type AddItemType = "meal" | "drink" | "deal";

// ============================================
// MAIN COMPONENT
// ============================================

const MenuViewConnected = ({ restaurantId, activeTab }: MenuViewProps) => {
  
  // ============================================
  // STATE - Component state management
  // ============================================
  
  const [menuItems, setMenuItems] = useState<any[]>([]);     // All menu items from API
  const [loading, setLoading] = useState(true);              // Loading state
  const [editingItem, setEditingItem] = useState<any>(null); // Item being edited (opens modal)
  const [addItemType, setAddItemType] = useState<AddItemType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);         // Current pagination page
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  // ============================================
  // EFFECT: Fetch menu items when restaurantId changes
  // ============================================
  
  useEffect(() => {
    if (restaurantId) fetchMenuItems();
  }, [restaurantId]);

  // ============================================
  // EFFECT: Reset to page 1 when tab or restaurant changes
  // ============================================
  
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, restaurantId]);

  useEffect(() => {
    const syncViewport = () => setIsMobileViewport(window.innerWidth < 640);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  // ============================================
  // API FUNCTION: fetchMenuItems
  // Fetches all menu items from the API for the given restaurant
  // ============================================
  
  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("auth_token");

      const response = await fetch(
        `/api/restaurants/${restaurantId}/menu`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMenuItems(data.items || data.menuItems || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // HELPER FUNCTION: getFilteredItems
  // Returns menu items filtered by the active tab (Main Dishes, DRINKS, etc.)
  // ============================================
  
  const getFilteredItems = () => {
    if (activeTab === "Main Dishes") {
      // Filter out drinks and beverages for Main Dishes tab
      return menuItems.filter(
        (item) =>
          item.category !== "drink" &&
          item.category !== "beverage"
      );
    }
    if (activeTab === "DRINKS") {
      // Filter only drinks and beverages for DRINKS tab
      return menuItems.filter(
        (item) =>
          item.category === "drink" ||
          item.category === "beverage"
      );
    }
    // Return all items if no specific filter
    return menuItems;
  };

  const filteredItems = getFilteredItems();
  const isMainDishes = activeTab === "Main Dishes";
  const activeAddType: AddItemType =
    activeTab === "DRINKS" ? "drink" : activeTab === "SPECIAL DEALS" ? "deal" : "meal";
  const addButtonLabel =
    activeAddType === "drink" ? "ADD DRINK" : activeAddType === "deal" ? "ADD DEAL" : "ADD MEAL";
  const itemsPerPage =
    isMainDishes && isMobileViewport
      ? MOBILE_MAIN_DISHES_ITEMS_PER_PAGE
      : ITEMS_PER_PAGE;
  const compactButtonProps = isMainDishes
    ? { fontSize: "text-[6px] sm:text-[10px]", padding: "py-0 px-1 sm:py-0.5 sm:px-3" }
    : {};
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ============================================
  // HELPER: paginatedItems
  // Returns items for the current page based on pagination
  // ============================================
  
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <>
      {/* ============================================
      MODAL: EditMenuItemModal
      Shown when editing an existing menu item
      ============================================ */}
      
      {editingItem && (
        <EditMenuItemModal
          item={editingItem}
          restaurantId={restaurantId}
          onClose={() => setEditingItem(null)}
          onSave={fetchMenuItems}
        />
      )}
      {addItemType && (
        <AddMenuItemModal
          restaurantId={restaurantId}
          type={addItemType}
          onClose={() => setAddItemType(null)}
          onSave={fetchMenuItems}
        />
      )}

      {/* ============================================
      SECTION: MAIN CONTAINER
      Outer white container with menu items and pagination
      ============================================ */}
      
      <div className={`w-full flex flex-col items-center ${isMainDishes ? "py-4 sm:py-6" : "py-6"}`}>
        
        {/* OUTER WHITE CONTAINER */}
        <div
          className={`${isMainDishes
            ? "w-[calc(100%+1rem)] -mx-2 sm:w-full sm:max-w-[700px] max-w-full p-1.5 sm:p-3 mt-24 sm:mt-12"
            : "w-full max-w-[700px] p-3 mt-12"
          } shadow-md mb-2 opacity-85`}
          style={{ backgroundColor: "#E8D7B4" }}
        >
          
          {/* SORT / FILTER / ADD MEAL BUTTONS */}
          <div className={`w-full flex justify-start flex-wrap ${isMainDishes ? "gap-2 sm:gap-4 mb-4 sm:mb-6 mt-1 sm:mt-2" : "gap-4 mb-6 mt-2"}`}>
            {/* Sort Button */}
     <select
              className={`border border-white rounded-xl font-bold bg-white ${isMainDishes ? "w-[60px] sm:w-[90px] px-1 sm:px-2 py-0 sm:py-1 text-[6px] sm:text-[10px]" : "w-[90px] px-2 py-1 text-[10px]"}`}
            >
              <option value="">SORT BY</option>
              <option value="name">By Name</option>
              <option value="price">By Price</option>
              <option value="date">By Date</option>
            </select>

            {/* Filter Button */}
            <select
              className={`border border-white rounded-xl font-bold bg-white ${isMainDishes ? "w-[60px] sm:w-[90px] px-1 sm:px-2 py-0 sm:py-1 text-[6px] sm:text-[10px]" : "w-[90px] px-2 py-1 text-[10px]"}`}
            >
              <option value="">FILTER BY</option>
              <option value="all">All</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="non-veg">Non-Veg</option>
            </select>
            {/* Add Meal Button - Navigates to add menu page */}
            <RegularButton
              text={addButtonLabel}
              fillColor="#ffffff"
              borderColor="#ffffff"
              fontColor="#000000"
              {...compactButtonProps}
              onClick={() => setAddItemType(activeAddType)}
            />
          </div>

          {/* ============================================
          SECTION: MEAL LIST
          Displays paginated menu items
          ============================================ */}
          
          <div className={isMainDishes ? "space-y-2 sm:space-y-4" : "space-y-4"}>
            {loading ? (
              // Loading State
              <div className="text-center py-8">
                <p className="text-gray-600">Loading menu items...</p>
              </div>
            ) : paginatedItems.length === 0 ? (
              // Empty State
              <div className="text-center py-8">
                <p className="text-gray-600">No items found</p>
              </div>
            ) : (
              // Menu Items List
              paginatedItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center mx-auto border border-gray-400 relative w-full sm:w-[640px] min-w-0 overflow-hidden ${isMainDishes ? "gap-1 sm:gap-4 p-0.5 sm:p-2 min-h-[82px] sm:min-h-[120px]" : "gap-4 p-2 min-h-[120px]"}`}
                  style={{
                    backgroundColor: "#E8D7B4",
                  }}
                >
                  {/* Vegan/Badge Label */}
                  <button className={`absolute top-1 sm:top-2 right-1 sm:right-2 bg-green-600 text-white font-bold rounded ${isMainDishes ? "px-0.5 sm:px-2 py-0 sm:py-1 text-[6px] sm:text-xs" : "px-2 py-1 text-xs"}`}>
                    VEGAN
                  </button>

                  {/* Item Image */}
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className={isMainDishes ? "w-14 h-14 sm:w-28 sm:h-28 rounded-md object-cover" : "w-28 h-28 rounded-md object-cover"}
                    />
                  ) : (
                    <div className={isMainDishes ? "w-14 h-14 sm:w-28 sm:h-28 bg-gray-300 rounded-md" : "w-28 h-28 bg-gray-300 rounded-md"} />
                  )}

                  {/* Item Details */}
                  <div className="flex-grow min-w-0">
                    {/* Item Name */}
                    <h3 className={isMainDishes ? "text-[8px] sm:text-xs font-bold text-red-800 truncate" : "text-xs font-bold text-red-800 truncate"}>
                      {item.name}
                    </h3>

                    {/* Item Description */}
                    <p className={isMainDishes ? "text-[7px] sm:text-xs font-semibold text-black mt-0 sm:mt-1 mb-1 sm:mb-3 break-words line-clamp-2" : "text-xs font-semibold text-black mt-1 mb-3 break-words line-clamp-2"}>
                      {item.description || "No description"}
                    </p>

                    {/* Action Buttons and Price */}
                    <div className={`flex justify-between ${isMainDishes ? "items-start sm:items-center gap-2 sm:gap-0 flex-col sm:flex-row" : "items-center"}`}>
                      <div className={`flex max-w-full ${isMainDishes ? "gap-0 sm:gap-2 flex-wrap" : "gap-2"}`}>
                        {/* Quantity Button */}
                        <RegularButton
                          text={`Qty : ${item.quantity || 0}`}
                          fillColor="#fe981f"
                          borderColor="#ffffff"
                          fontColor="#000000"
                          className={isMainDishes ? "max-w-full" : ""}
                          uppercase={false}
                          {...compactButtonProps}
                        />

                        {/* Edit Button */}
                        <RegularButton
                          text="EDIT"
                          fillColor="#5b0e01"
                          borderColor="#ffffff"
                          fontColor="#ffffff"
                          className={isMainDishes ? "max-w-full" : ""}
                          {...compactButtonProps}
                          onClick={() => setEditingItem(item)}
                        />

                        {/* Delete Button */}
                        <RegularButton
                          text="DELETE"
                          fillColor="#5b0e01"
                          borderColor="#ffffff"
                          fontColor="#ffffff"
                          className={isMainDishes ? "max-w-full" : ""}
                          {...compactButtonProps}
                        />

                        {/* Live/Offline Toggle Button */}
                        <button
                          className={`max-w-full rounded font-bold text-black ${isMainDishes ? "px-0.5 sm:px-2 py-0 sm:py-0.5 text-[6px] sm:text-[10px]" : "px-2 py-0.5 text-[10px]"} ${
                            item.isAvailable
                              ? "bg-[#fefe3c]"
                              : "bg-gray-600"
                          }`}
                        >
                          {item.isAvailable ? "LIVE" : "OFFLINE"}
                          <ChevronDown size={isMainDishes ? 9 : 14} className="inline ml-1" />
                        </button>
                      </div>

                      {/* Price Display */}
                      <span className={isMainDishes ? "text-[8px] sm:text-xs font-bold text-gray-800" : "text-xs font-bold text-gray-800"}>
                        Fr. {item.price?.toFixed(2)}.-
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ============================================
        SECTION: PAGINATION
        Navigation buttons for page navigation
        ============================================ */}
        
        {!loading && filteredItems.length > 0 && (
          <div className={`flex flex-wrap justify-center items-center ${isMainDishes ? "gap-0.5 sm:gap-1" : "gap-1"}`}>
            {/* Previous Page Button */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`bg-red-900 text-white rounded font-bold disabled:opacity-50 ${isMainDishes ? "px-0.5 sm:px-2 py-0 sm:py-0.5 text-[6px] sm:text-[10px]" : "px-2 py-0.5 text-[10px]"}`}
            >
              PREV
            </button>

            {/* Page Number Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`${isMainDishes ? "px-0.5 sm:px-2 py-0 sm:py-0.5 text-[6px] sm:text-[10px]" : "px-2 py-0.5 text-[10px]"} rounded font-bold ${
                  page === currentPage
                    ? "bg-red-900 text-white"
                    : "bg-white text-gray-800 border border-gray-400"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Page Button */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`bg-red-900 text-white rounded font-bold disabled:opacity-50 ${isMainDishes ? "px-0.5 sm:px-2 py-0 sm:py-0.5 text-[6px] sm:text-[10px]" : "px-2 py-0.5 text-[10px]"}`}
            >
              NEXT
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MenuViewConnected;
