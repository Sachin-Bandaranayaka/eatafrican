"use client";

import { Dispatch, SetStateAction, useState, useEffect } from "react";

interface OrdersSectionProps {
    setShowOrderDetails: Dispatch<SetStateAction<boolean>>;
    setSelectedOrder: Dispatch<SetStateAction<any>>;
}

export default function OrdersSection({ setShowOrderDetails, setSelectedOrder }: OrdersSectionProps) {
    const [showPickupZoneModal, setShowPickupZoneModal] = useState(false);
    const [pickupZone, setPickupZone] = useState("Zürich");
    const [selectedZone, setSelectedZone] = useState(pickupZone);
    const [activeTab, setActiveTab] = useState<'new' | 'assigned' | 'history'>('new');
    
    // Data states
    const [newOrders, setNewOrders] = useState([]);
    const [assignedOrders, setAssignedOrders] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [driverId, setDriverId] = useState<string | null>(null);

    const [zones, setZones] = useState<string[]>(["Basel", "Bern", "Luzern", "Olten", "Zürich"]);

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await fetch('/api/cities');
            const data = await response.json();
            const cityNames = data.map((city: any) => city.name);
            setZones(cityNames);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    // Get driver ID from localStorage or auth context
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role === 'driver') {
                // Use driverId from user object if available, otherwise use user.id
                setDriverId(user.driverId || user.id);
            }
        }
    }, []);

    // Fetch available orders
    useEffect(() => {
        if (!driverId) return;

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('accessToken');
                const headers = {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                };

                // Fetch new orders (available for pickup)
                const newOrdersRes = await fetch('/api/drivers/available-orders', { headers });
                if (newOrdersRes.ok) {
                    const data = await newOrdersRes.json();
                    setNewOrders(data.orders || []);
                }

                // Fetch assigned orders
                const assignedOrdersRes = await fetch(`/api/drivers/${driverId}/orders?status=assigned,in_transit`, { headers });
                if (assignedOrdersRes.ok) {
                    const data = await assignedOrdersRes.json();
                    setAssignedOrders(data.orders || []);
                }

                // Fetch order history
                const historyRes = await fetch(`/api/drivers/${driverId}/orders?status=delivered`, { headers });
                if (historyRes.ok) {
                    const data = await historyRes.json();
                    setOrderHistory(data.orders || []);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
        
        // Refresh every 30 seconds
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, [driverId, pickupZone]);

    const handleSave = async () => {
        if (!driverId) return;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`/api/drivers/${driverId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({ pickupZone: selectedZone })
            });

            if (response.ok) {
                setPickupZone(selectedZone);
                setShowPickupZoneModal(false);
            }
        } catch (error) {
            console.error('Error updating pickup zone:', error);
        }
    };

    const handleCancel = () => {
        setSelectedZone(pickupZone);
        setShowPickupZoneModal(false);
    };

    const handleAcceptOrder = async (orderId: string) => {
        if (!driverId) return;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`/api/drivers/${driverId}/orders/${orderId}/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (response.ok) {
                // Refresh orders
                const newOrdersRes = await fetch('/api/drivers/available-orders', {
                    headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
                });
                if (newOrdersRes.ok) {
                    const data = await newOrdersRes.json();
                    setNewOrders(data.orders || []);
                }

                const assignedOrdersRes = await fetch(`/api/drivers/${driverId}/orders?status=assigned,in_transit`, {
                    headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
                });
                if (assignedOrdersRes.ok) {
                    const data = await assignedOrdersRes.json();
                    setAssignedOrders(data.orders || []);
                }

                alert('Order accepted successfully!');
            }
        } catch (error) {
            console.error('Error accepting order:', error);
            alert('Failed to accept order');
        }
    };

    const handleOrderClick = (order: any) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const getDisplayOrders = () => {
        switch (activeTab) {
            case 'new':
                return newOrders;
            case 'assigned':
                return assignedOrders;
            case 'history':
                return orderHistory;
            default:
                return [];
        }
    };

    const displayOrders = getDisplayOrders();

    return (
        <section className="flex flex-col space-y-3 z-10">
            <div className="flex flex-col w-full h-[80vh] mb-12 shadow-md overflow-hidden border-2 border-[#f1c232] relative -mt-2 rounded-[8px]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: "white",
                        opacity: '70%',
                        zIndex: 1,
                        borderRadius: "8px"
                    }}
                ></div>
                <div className="z-10 relative p-4">
                    <div className="flex flex-col w-full p-2">
                        <div className="flex flex-row justify-between items-start gap-1 w-full">
                            {/* Button section */}
                            <div className="flex flex-row gap-1 w-full">
                                <button 
                                    onClick={() => setActiveTab('new')}
                                    className={`flex items-center p-1 px-2.5 text-white text-[9px] md:text-[12px] rounded-sm ${
                                        activeTab === 'new' ? 'bg-blue-900' : 'bg-blue-500'
                                    }`}
                                >
                                    NEW
                                    <span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">
                                        {newOrders.length}
                                    </span>
                                </button>
                                <button 
                                    onClick={() => setActiveTab('assigned')}
                                    className={`flex items-center p-1 px-2.5 text-white text-[9px] md:text-[12px] rounded-sm ${
                                        activeTab === 'assigned' ? 'bg-blue-900' : 'bg-blue-500'
                                    }`}
                                >
                                    ASSIGNED TO ME
                                    <span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">
                                        {assignedOrders.length}
                                    </span>
                                </button>
                                <button 
                                    onClick={() => setActiveTab('history')}
                                    className={`flex items-center p-1 px-2.5 text-white text-[9px] md:text-[12px] rounded-sm ${
                                        activeTab === 'history' ? 'bg-blue-900' : 'bg-blue-500'
                                    }`}
                                >
                                    ORDER HISTORY
                                    <span className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-green-500 ml-1 text-black">
                                        {orderHistory.length}
                                    </span>
                                </button>
                            </div>
                            <div className="flex flex-row items-center justify-end gap-3 w-full">
                                <span className="text-[6px] md:text-[10px] font-semibold whitespace-nowrap">
                                    Your Pick Up Zone is set to {pickupZone}
                                </span>
                                <button 
                                    onClick={() => setShowPickupZoneModal(true)} 
                                    className="text-white font-bold py-1 px-2 rounded-md transition-colors duration-200 shadow-lg text-[8px] md:text-[9px] bg-red-900 hover:bg-red-800"
                                >
                                    CHANGE PICK UP ZONE
                                </button>
                            </div>
                        </div>

                        {/* Change Pickup Zone Modal */}
                        {showPickupZoneModal && (
                            <div className="absolute top-12 right-4 bg-yellow-200 border-2 border-gray-300 p-5 rounded-lg shadow-xl z-30 w-72">
                                <div className="flex flex-col">
                                    {zones.map((zone) => (
                                        <label key={zone} className="flex items-center space-x-1 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="pickupZone"
                                                value={zone}
                                                checked={selectedZone === zone}
                                                onChange={() => setSelectedZone(zone)}
                                                className="form-radio h-4 w-4 text-red-900"
                                            />
                                            <span className="text-black font-medium">{zone}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="flex justify-center gap-3 mt-2">
                                    <button 
                                        onClick={handleSave} 
                                        className="bg-red-900 hover:bg-red-800 text-white font-bold py-1 px-4 rounded-md shadow-md text-sm"
                                    >
                                        SAVE
                                    </button>
                                    <button 
                                        onClick={handleCancel} 
                                        className="bg-red-900 hover:bg-red-800 text-white font-bold py-1 px-4 rounded-md shadow-md text-sm"
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Table section */}
                        <div className="flex flex-row w-full mt-2 overflow-auto max-h-[65vh]">
                            {loading ? (
                                <div className="flex items-center justify-center w-full py-10">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                                </div>
                            ) : displayOrders.length === 0 ? (
                                <div className="flex items-center justify-center w-full py-10">
                                    <p className="text-gray-600">No orders available</p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-yellow-100 w-full sticky top-0">
                                        <tr>
                                            <th className="py-2 text-left text-black pl-2 font-semibold text-sm">Deliver From</th>
                                            <th className="py-2 text-left text-black font-semibold text-sm">Deliver to</th>
                                            <th className="py-2 text-left text-black font-semibold text-sm">Delivery Schedule</th>
                                            <th className="py-2 text-left text-black font-semibold text-sm">Amount</th>
                                            {activeTab === 'new' && (
                                                <th className="py-2 text-left text-black font-semibold text-sm">Action</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="w-full">
                                        {displayOrders.map((order: any) => (
                                            <tr 
                                                key={order.id} 
                                                className="w-full cursor-pointer hover:bg-gray-100 border-b"
                                                onClick={() => handleOrderClick(order)}
                                            >
                                                <td className="py-2 pl-2">
                                                    {order.restaurant?.name}, {order.restaurant?.city}
                                                </td>
                                                <td className="py-2">
                                                    {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                                                </td>
                                                <td className="py-2">
                                                    {new Date(order.deliveryTime).toLocaleString()}
                                                </td>
                                                <td className="py-2">
                                                    Fr. {order.totalAmount.toFixed(2)}
                                                </td>
                                                {activeTab === 'new' && (
                                                    <td className="py-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAcceptOrder(order.id);
                                                            }}
                                                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs"
                                                        >
                                                            ACCEPT
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
