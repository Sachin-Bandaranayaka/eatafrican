"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import EditMenuItemModal from "./EditMenuItemModal";
import RegularButton from "@/app/components/RegularButton";
import CustomDropdown from "@/app/components/DropDown";

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

// ============================================
// MAIN COMPONENT
// ============================================

const MenuViewConnected = ({ restaurantId, activeTab }: MenuViewProps) => {
  
  // ============================================
  // STATE - Component state management
  // ============================================
  
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<any[]>([]);     // All menu items from API
  const [loading, setLoading] = useState(true);              // Loading state
  const [editingItem, setEditingItem] = useState<any>(null); // Item being edited (opens modal)
  const [currentPage, setCurrentPage] = useState(1);         // Current pagination page

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
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  // ============================================
  // HELPER: paginatedItems
  // Returns items for the current page based on pagination
  // ============================================
  
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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

      {/* ============================================
      SECTION: MAIN CONTAINER
      Outer white container with menu items and pagination
      ============================================ */}
      
      <div className="w-full flex flex-col items-center py-6">
        
        {/* OUTER WHITE CONTAINER */}
        <div
          className="w-full max-w-[700px] shadow-md p-3 mt-12 mb-2"
          style={{ backgroundColor: "#E8D7B4" }}
        >
          
          {/* SORT / FILTER / ADD MEAL BUTTONS */}
          <div className="flex justify-start gap-4 mb-6 mt-2">
            {/* Sort Button */}
     <select
              className="px-2 py-1 border border-white rounded-xl text-[10px] font-bold bg-white"
              style={{ width: '90px' }}
            >
              <option value="">SORT BY</option>
              <option value="name">By Name</option>
              <option value="price">By Price</option>
              <option value="date">By Date</option>
            </select>

            {/* Filter Button */}
            <select
              className="px-2 py-1 border border-white rounded-xl text-[10px] font-bold bg-white"
              style={{ width: '90px' }}
            >
              <option value="">FILTER BY</option>
              <option value="all">All</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="non-veg">Non-Veg</option>
            </select>
            {/* Add Meal Button - Navigates to add menu page */}
            <RegularButton
              text="ADD MEAL"
              fillColor="#ffffff"
              borderColor="#ffffff"
              fontColor="#000000"
              onClick={() => router.push(`/restaurant-owner/menu/add?restaurantId=${restaurantId}&type=meal`)}
            />
          </div>

          {/* ============================================
          SECTION: MEAL LIST
          Displays paginated menu items
          ============================================ */}
          
          <div className="space-y-4">
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
                  className="flex items-center gap-4 p-2 mx-auto border border-gray-400 relative"
                  style={{
                    backgroundColor: "#E8D7B4",
                    width: "640px",
                    minHeight: "120px",
                  }}
                >
                  {/* Vegan/Badge Label */}
                  <button className="absolute top-2 right-2 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
                    VEGAN
                  </button>

                  {/* Item Image */}
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-28 h-28 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-28 h-28 bg-gray-300 rounded-md" />
                  )}

                  {/* Item Details */}
                  <div className="flex-grow">
                    {/* Item Name */}
                    <h3 className="text-xs font-bold text-red-800">
                      {item.name}
                    </h3>

                    {/* Item Description */}
                    <p className="text-xs font-semibold text-black mt-1 mb-3">
                      {item.description || "No description"}
                    </p>

                    {/* Action Buttons and Price */}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {/* Quantity Button */}
                        <RegularButton
                          text={`Qty : ${item.quantity || 0}`}
                          fillColor="#fe981f"
                          borderColor="#ffffff"
                          fontColor="#000000"
                          uppercase={false}
                        />

                        {/* Edit Button */}
                        <RegularButton
                          text="EDIT"
                          fillColor="#5b0e01"
                          borderColor="#ffffff"
                          fontColor="#ffffff"
                          onClick={() => setEditingItem(item)}
                        />

                        {/* Delete Button */}
                        <RegularButton
                          text="DELETE"
                          fillColor="#5b0e01"
                          borderColor="#ffffff"
                          fontColor="#ffffff"
                        />

                        {/* Live/Offline Toggle Button */}
                        <button
                          className={`px-2 py-0.5 rounded text-[10px] font-bold text-black ${
                            item.isAvailable
                              ? "bg-[#fefe3c]"
                              : "bg-gray-600"
                          }`}
                        >
                          {item.isAvailable ? "LIVE" : "OFFLINE"}
                          <ChevronDown size={14} className="inline ml-1" />
                        </button>
                      </div>

                      {/* Price Display */}
                      <span className="text-xs font-bold text-gray-800">
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
          <div className="flex justify-center items-center gap-1">
            {/* Previous Page Button */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2 py-0.5 bg-red-900 text-white rounded text-[10px] font-bold disabled:opacity-50"
            >
              PREV
            </button>

            {/* Page Number Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
              className="px-2 py-0.5 bg-red-900 text-white rounded text-[10px] font-bold disabled:opacity-50"
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
