"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { USE_MOCK_DATA, mockNewOrders, mockAssignedOrders, mockOrderHistory, mockCities, mockDelay, mockDriver } from "./mockData";
import RegularButton from "@/app/components/RegularButton";

type DriverOrderViewMode = "new" | "assigned" | "history";

interface DriverOrdersSectionProps {
    mode: DriverOrderViewMode;
    onOpenOrderDetails: (order: any) => void;
}

export function DriverOrdersSectionView({
    mode,
    onOpenOrderDetails,
}: DriverOrdersSectionProps) {
    const [showPickupZoneModal, setShowPickupZoneModal] = useState(false);
    const [pickupZone, setPickupZone] = useState("Zurich");
    const [selectedZone, setSelectedZone] = useState(pickupZone);

    const [newOrders, setNewOrders] = useState<any[]>([]);
    const [assignedOrders, setAssignedOrders] = useState<any[]>([]);
    const [orderHistory, setOrderHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [driverId, setDriverId] = useState<string | null>(null);
    const [refreshTick, setRefreshTick] = useState(0);
    const [zones, setZones] = useState<string[]>(["Basel", "Bern", "Zurich"]);

    useEffect(() => {
        const fetchCities = async () => {
            if (USE_MOCK_DATA) {
                await mockDelay();
                setZones(["Basel", "Bern", "Zurich"]);
                return;
            }

            try {
                const response = await fetch("/api/cities");
                const data = await response.json();
                const cityNames = data.map((city: any) => city.name);
                // Filter to only keep Basel, Bern, and Zurich
                const filteredCities = cityNames.filter((city: string) => 
                    ["Basel", "Bern", "Zurich"].includes(city)
                );
                setZones(filteredCities.length > 0 ? filteredCities : ["Basel", "Bern", "Zurich"]);
            } catch (error) {
                console.error("Error fetching cities:", error);
                setError("Unable to load cities.");
            }
        };

        fetchCities();
    }, []);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;

        const user = JSON.parse(userStr);
        if (user.role === "driver") {
            setDriverId(user.driverId || user.id);
        }
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);

                if (USE_MOCK_DATA) {
                    await mockDelay();
                    
                    // Get different orders based on mode
                    if (mode === "new") {
                        setNewOrders(mockNewOrders);
                    } else if (mode === "assigned") {
                        setAssignedOrders(mockAssignedOrders);
                    } else {
                        setOrderHistory(mockOrderHistory);
                    }
                    
                    setLoading(false);
                    return;
                }

                const token = localStorage.getItem("accessToken");
                const headers = {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                };

                const newOrdersRes = await fetch("/api/drivers/available-orders", { headers });
                if (newOrdersRes.ok) {
                    const data = await newOrdersRes.json();
                    setNewOrders(data.orders || []);
                }

                const assignedOrdersRes = await fetch(
                    `/api/drivers/${driverId}/orders?status=assigned,in_transit`,
                    { headers },
                );
                if (assignedOrdersRes.ok) {
                    const data = await assignedOrdersRes.json();
                    setAssignedOrders(data.orders || []);
                }

                const historyRes = await fetch(`/api/drivers/${driverId}/orders?status=delivered`, {
                    headers,
                });
                if (historyRes.ok) {
                    const data = await historyRes.json();
                    setOrderHistory(data.orders || []);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Unable to load orders. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, [driverId, pickupZone, refreshTick, mode]);

    const displayOrders = useMemo(() => {
        switch (mode) {
            case "assigned":
                return assignedOrders;
            case "history":
                return orderHistory;
            default:
                return newOrders;
        }
    }, [assignedOrders, mode, newOrders, orderHistory]);

    const handleSave = async () => {
        if (!driverId) return;

        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`/api/drivers/${driverId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({ pickupZone: selectedZone }),
            });

            if (response.ok) {
                setPickupZone(selectedZone);
                setShowPickupZoneModal(false);
            }
        } catch (error) {
            console.error("Error updating pickup zone:", error);
        }
    };

    const handleCancel = () => {
        setSelectedZone(pickupZone);
        setShowPickupZoneModal(false);
    };

    const handleAcceptOrder = async (orderId: string) => {
        if (!driverId) return;

        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`/api/drivers/${driverId}/orders/${orderId}/accept`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (!response.ok) {
                alert("Failed to accept order");
                return;
            }

            const newOrdersRes = await fetch("/api/drivers/available-orders", {
                headers: { ...(token && { Authorization: `Bearer ${token}` }) },
            });
            if (newOrdersRes.ok) {
                const data = await newOrdersRes.json();
                setNewOrders(data.orders || []);
            }

            const assignedOrdersRes = await fetch(
                `/api/drivers/${driverId}/orders?status=assigned,in_transit`,
                { headers: { ...(token && { Authorization: `Bearer ${token}` }) } },
            );
            if (assignedOrdersRes.ok) {
                const data = await assignedOrdersRes.json();
                setAssignedOrders(data.orders || []);
            }

            alert("Order accepted successfully!");
        } catch (error) {
            console.error("Error accepting order:", error);
            alert("Failed to accept order");
        }
    };

    const handleOrderClick = (order: any) => onOpenOrderDetails(order);

    const retryFetch = () => {
        setRefreshTick((prev) => prev + 1);
    };

    return (
        <section
            className={`flex justify-center w-full ${mode === "new" ? "pt-[26rem] sm:pt-28" : "pt-28"}`}
        >
            <div
                style={{ backgroundColor: '#E8D7B4' }}
                className={`w-full max-w-[768px] min-h-[60vh] shadow-lg flex text-black opacity-85 mb-4 ${
                    mode === "new" ? "text-[10px] sm:text-xs" : "text-xs"
                }`}
            >
                <div className={`flex-1 ${mode === "new" ? "p-2.5 sm:p-4" : "p-4"}`}>
                    <div className="flex flex-col w-full">
                        {mode === "new" && (
                            <div className="flex flex-row items-center justify-between gap-2 sm:gap-3 w-full mb-1 sm:mb-2">
                                <h2 className="text-sm sm:text-lg font-bold" style={{ color: '#990000' }}>NEW DELIVERIES</h2>
                                <div className="flex flex-row items-center gap-3">
                                    <span className="text-[6px] md:text-[10px] font-semibold whitespace-nowrap" style={{ color: '#14532d' }}>
                                        Your Pick Up Zone is set to {pickupZone}
                                    </span>
                                    <button
                                        onClick={() => setShowPickupZoneModal(true)}
                                        className="text-white font-bold py-0.5 sm:py-1 px-1.5 sm:px-2 rounded-md transition-colors duration-200 shadow-lg text-[7px] sm:text-[8px] md:text-[9px] bg-red-900 hover:bg-red-800"
                                    >
                                        CHANGE PICK UP ZONE
                                    </button>
                                </div>
                            </div>
                        )}

                        {mode === "assigned" && (
                            <div className="flex flex-row items-center justify-between gap-3 w-full mb-2">
                                <h2 className="text-lg font-bold" style={{ color: '#990000' }}>SCHEDULED DELIVERY</h2>
                                <div className="flex flex-row items-center gap-3">
                                    <span className="text-[6px] md:text-[10px] font-semibold whitespace-nowrap" style={{ color: '#14532d' }}>
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
                        )}

                        {mode === "history" && (
                            <div className="flex flex-row items-center justify-between gap-3 w-full mb-2">
                                <h2 className="text-lg font-bold" style={{ color: '#990000' }}>ORDER HISTORY</h2>
                                <div className="flex flex-row items-center gap-3">
                                    <span className="text-black font-semibold" style={{ fontSize: '12px' }}>
                                        Total No. of Deliveries This Month: {mockDriver.totalDeliveries}
                                    </span>
                                </div>
                            </div>
                        )}

                        {showPickupZoneModal && mode === "new" && (
                            <div style={{ backgroundColor: '#fed86e', opacity: 0.95 }} className="absolute top-28 sm:top-32 right-2 sm:right-4 border-2 border-gray-300 p-3 sm:p-5 rounded-none shadow-xl z-30 w-56 sm:w-72">
                                <div className="flex flex-col">
                                    <h3 style={{ color: '#a52a2a' }} className="font-bold mb-2 text-[11px] sm:text-base">Change Pick Up Zone</h3>
                                    {zones.map((zone) => (
                                        <label key={zone} className="flex items-center space-x-1 cursor-pointer my-0.5">
                                            <input
                                                type="radio"
                                                name="pickupZone"
                                                value={zone}
                                                checked={selectedZone === zone}
                                                onChange={() => setSelectedZone(zone)}
                                                className="form-radio h-3.5 w-3.5 sm:h-4 sm:w-4"
                                                style={{ borderColor: '#e7964a' }}
                                            />
                                            <span className="text-black font-semibold text-[10px] sm:text-sm" style={{ color: '#3b36d8' }}>{zone}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="flex justify-center gap-3 mt-2">
                                    <RegularButton text="Save" onClick={handleSave} fillColor="#5b0e01" />
                                    <RegularButton text="Cancel" onClick={handleCancel} fillColor="#5b0e01" />
                                </div>
                            </div>
                        )}

                        <div className={`flex flex-row w-full overflow-auto max-h-[65vh] ${mode === "new" ? "mt-1 sm:mt-2" : "mt-2"}`}>
                            {loading ? (
                                <div className="flex items-center justify-center w-full py-10">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center w-full py-10 gap-2">
                                    <p className="text-red-700 font-semibold">{error}</p>
                                    <button
                                        onClick={retryFetch}
                                        className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-1 px-3 rounded text-xs"
                                    >
                                        RETRY
                                    </button>
                                </div>
                            ) : displayOrders.length === 0 ? (
                                <div className="flex items-center justify-center w-full py-10">
                                    <p className="text-gray-600">No orders available</p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="w-full sticky top-0" style={{ backgroundColor: '#e7964a' }}>
                                        <tr>
                                            {mode === "assigned" ? (
                                                <>
                                                    <th className="py-2 text-left text-black pl-2 font-semibold text-sm">
                                                        PickUp Information
                                                    </th>
                                                    <th className="py-2 text-left text-black font-semibold text-sm">
                                                        Deliver to
                                                    </th>
                                                    <th className="py-2 text-left text-black font-semibold text-sm">
                                                        Est. Pick Time
                                                    </th>
                                                </>
                                            ) : mode === "history" ? (
                                                <>
                                                    <th className="py-2 text-left text-black pl-2 font-semibold text-sm">
                                                        Pick Up Information
                                                    </th>
                                                    <th className="py-2 text-left text-black font-semibold text-sm">
                                                        Deliver to
                                                    </th>
                                                    <th className="py-2 text-left text-black font-semibold text-sm">
                                                        Delivery Date, Time
                                                    </th>
                                                </>
                                            ) : (
                                                <>
                                                    <th className="py-1 sm:py-2 text-left text-black pl-2 font-semibold text-[9px] sm:text-sm">
                                                        Order
                                                    </th>
                                                    <th className="py-1 sm:py-2 text-left text-black font-semibold text-[9px] sm:text-sm">
                                                        Location
                                                    </th>
                                                    <th className="py-1 sm:py-2 text-left text-black font-semibold text-[9px] sm:text-sm">
                                                        Date,Time
                                                    </th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="w-full">
                                        {displayOrders.map((order: any) => (
                                            <tr
                                                key={order.id}
                                                className={`w-full cursor-pointer hover:bg-gray-100 border-b ${
                                                    mode === "new" ? "leading-tight" : ""
                                                }`}
                                                onClick={() => handleOrderClick(order)}
                                            >
                                                <td className={mode === "new" ? "py-1 sm:py-2 pl-2 text-[9px] sm:text-xs" : "py-2 pl-2"}>
                                                    {order.restaurant?.name}, {order.restaurant?.city}
                                                </td>
                                                <td className={mode === "new" ? "py-1 sm:py-2 text-[9px] sm:text-xs" : "py-2"}>
                                                    {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                                                </td>
                                                <td className={mode === "new" ? "py-1 sm:py-2 text-[9px] sm:text-xs" : "py-2"}>
                                                    {new Date(order.deliveryTime).toLocaleString()}
                                                </td>
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
