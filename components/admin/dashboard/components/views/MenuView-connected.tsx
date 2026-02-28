"use client";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import EditMenuItemModal from "./EditMenuItemModal";

interface MenuViewProps {
    restaurantId: string;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const MenuViewConnected = ({ restaurantId, activeTab, setActiveTab }: MenuViewProps) => {
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<any>(null);

    useEffect(() => {
        if (restaurantId) {
            fetchMenuItems();
        }
    }, [restaurantId]);

    const fetchMenuItems = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            const response = await fetch(`/api/restaurants/${restaurantId}/menu`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMenuItems(data.items || data.menuItems || []);
            }
        } catch (error) {
            console.error('Error fetching menu items:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAvailability = async (itemId: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            // The database uses 'status' field with 'active' or 'inactive' values
            const newStatus = currentStatus ? 'inactive' : 'active';

            const response = await fetch(`/api/restaurants/${restaurantId}/menu/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Refresh menu items
                await fetchMenuItems();
                alert(`Item is now ${!currentStatus ? 'LIVE' : 'OFFLINE'}`);
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                alert('Failed to update item status');
            }
        } catch (error) {
            console.error('Error updating availability:', error);
            alert('Failed to update item status');
        }
    };

    const handleEdit = (itemId: string) => {
        const item = menuItems.find(i => i.id === itemId);
        if (item) {
            setEditingItem(item);
        }
    };

    const handleCloseEdit = () => {
        setEditingItem(null);
    };

    const handleSaveEdit = async () => {
        await fetchMenuItems();
    };

    const handleDelete = async (itemId: string, itemName: string) => {
        if (!confirm(`Are you sure you want to delete "${itemName}"?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
            const response = await fetch(`/api/restaurants/${restaurantId}/menu/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                await fetchMenuItems();
                alert('Item deleted successfully');
            } else {
                alert('Failed to delete item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item');
        }
    };

    const getFilteredItems = () => {
        if (activeTab === 'MEALS') {
            return menuItems.filter(item => item.category !== 'drink' && item.category !== 'beverage');
        }
        if (activeTab === 'DRINKS') {
            return menuItems.filter(item => item.category === 'drink' || item.category === 'beverage');
        }
        if (activeTab === 'SPECIAL DEALS') {
            return menuItems.filter(item => item.isSpecialDeal || item.discountPercentage > 0);
        }
        return menuItems;
    };

    const filteredItems = getFilteredItems();

    return (
        <>
            {editingItem && (
                <EditMenuItemModal
                    item={editingItem}
                    restaurantId={restaurantId}
                    onClose={handleCloseEdit}
                    onSave={handleSaveEdit}
                />
            )}
            <div className="relative w-full z-50">

                <div className="relative w-full p-2">
                    <div className="flex flex-col w-5/6">
                        <div className="flex flex-row w-full items-center mb-3">
                            <h3 className="text-[15px] font-bold text-[#274e13]">{activeTab}</h3>
                            <button
                                onClick={() => {
                                    const type = activeTab === 'MEALS' ? 'meal' : activeTab === 'DRINKS' ? 'drink' : 'deal';
                                    window.location.href = `/restaurant-owner/menu/add?restaurantId=${restaurantId}&type=${type}`;
                                }}
                                className="ml-8 bg-red-900 hover:bg-red-800 text-white font-bold py-1 px-4 rounded-lg transition-colors duration-200 shadow-lg text-[13px]"
                            >
                                ADD {activeTab === 'MEALS' ? 'MEAL' : activeTab === 'DRINKS' ? 'DRINK' : 'DEAL'}
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center w-full py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="flex items-center justify-center w-full py-10">
                            <p className="text-gray-500">No {activeTab.toLowerCase()} added yet</p>
                        </div>
                    ) : (
                        <div className="bg-transparent w-5/6">
                            <div className="flex flex-row justify-end items-end mb-4">
                                <button className="w-auto bg-red-900 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-800 transition-colors duration-200 shadow-lg text-[13px]">
                                    SORT BY
                                </button>
                                <button className="ml-4 w-auto bg-red-900 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-800 transition-colors duration-200 shadow-lg text-[13px]">
                                    FILTER BY
                                </button>
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto pr-2">
                                <div className="space-y-4">
                                    {filteredItems.map((item) => (
                                        <div key={item.id} className="flex w-full items-center gap-4 rounded-lg bg-gray-50 p-1">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-28 h-28 m-1 flex-shrink-0 rounded-md object-cover"
                                                />
                                            ) : (
                                                <div className="w-28 h-28 m-1 flex-shrink-0 rounded-md bg-gray-300"></div>
                                            )}
                                            <div className="flex-grow">
                                                <div className="flex items-start justify-between">
                                                    <h3 className="text-[14px] font-bold text-red-800 mt-2">{item.name}</h3>
                                                    {item.isVegan && (
                                                        <span className="rounded-full px-4 py-1 text-xs font-bold text-white mt-2 mr-2 bg-green-600">
                                                            VEGAN
                                                        </span>
                                                    )}
                                                    {item.isVegetarian && !item.isVegan && (
                                                        <span className="rounded-full px-4 py-1 text-xs font-bold text-white mt-2 mr-2 bg-green-500">
                                                            VEGETARIAN
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 mb-3 text-xs font-bold text-black line-clamp-2">
                                                    {item.description || 'No description'}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => toggleAvailability(item.id, item.isAvailable)}
                                                            className={`flex items-center rounded-md px-3 py-1 text-xs font-semibold text-white ${item.isAvailable ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                                                                }`}
                                                            title="Click to toggle availability"
                                                        >
                                                            <span>{item.isAvailable ? 'LIVE' : 'OFFLINE'}</span>
                                                            <ChevronDown size={16} className="ml-1" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(item.id)}
                                                            className="rounded-md bg-teal-900 px-4 py-1 text-xs font-semibold text-white hover:bg-teal-800"
                                                        >
                                                            EDIT
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id, item.name)}
                                                            className="rounded-md bg-red-600 px-4 py-1 text-xs font-semibold text-white hover:bg-red-700"
                                                        >
                                                            DELETE
                                                        </button>
                                                        {item.quantity !== undefined && (
                                                            <span className={`rounded-md px-3 py-1 text-xs font-bold text-black ${item.quantity > 10 ? 'bg-green-200' :
                                                                item.quantity > 0 ? 'bg-yellow-200' :
                                                                    'bg-red-200'
                                                                }`}>
                                                                Qty: {item.quantity}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[14px] font-bold text-gray-800 mr-6 mt-2">
                                                        Fr. {item.price?.toFixed(2)}.-
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MenuViewConnected;
