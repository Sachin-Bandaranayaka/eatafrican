"use client";

import { Dispatch, SetStateAction, useState } from "react";

interface OrderDetailsProps {
    order: any;
    setShowOrderDetails: Dispatch<SetStateAction<boolean>>;
    setShowPickupDelivery: Dispatch<SetStateAction<boolean>>;
    refreshOrder: () => Promise<void>;
}

export default function OrderDetails({ order, setShowOrderDetails, setShowPickupDelivery, refreshOrder }: OrderDetailsProps) {
    const [loading, setLoading] = useState(false);

    if (!order) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-600">No order selected</p>
            </div>
        );
    }

    const handleStartDelivery = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`/api/orders/${order.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({ status: 'in_transit' })
            });

            if (response.ok) {
                await refreshOrder();
                setShowOrderDetails(false);
                setShowPickupDelivery(true);
            } else {
                alert('Failed to start delivery');
            }
        } catch (error) {
            console.error('Error starting delivery:', error);
            alert('Failed to start delivery');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col space-y-3 z-10">
            <div className="flex flex-col w-full h-[85vh] mb-12 shadow-md overflow-y-auto relative -mt-2 rounded-[8px]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: "white",
                        opacity: '70%',
                        zIndex: 1,
                        borderRadius: "8px"
                    }}
                ></div>
                <div className="relative z-10 p-1 md:p-2 text-gray-800 font-sans">
                    <h1 className="text-[15px] font-bold mb-6 text-green-900 ">Order Details</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="flex flex-col space-y-4">
                            <div>
                                <h2 className="font-bold text-[15px] text-black">Restaurant's Address</h2>
                                <p className="text-[13px] font-semibold">{order.restaurant?.name || 'N/A'},</p>
                                <p className="text-[13px] font-semibold">{order.restaurant?.address || 'N/A'}, {order.restaurant?.city || 'N/A'}</p>
                            </div>
                            <div>
                                <h2 className="font-bold text-[15px] text-black">Customer's Address</h2>
                                <p className="text-[13px] font-semibold">{order.deliveryAddress?.name || order.customer?.name || 'N/A'},</p>
                                <p className="text-[13px] font-semibold">{order.deliveryAddress?.street || 'N/A'}, {order.deliveryAddress?.city || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="text-left">
                            <h2 className="font-bold text-[15px] text-black">Order Nr. <span className="font-semibold text-[15px]">#{order.orderNumber || order.id?.slice(0, 6)}</span></h2>
                            <h2 className="font-bold text-[15px] text-black">Status <span className="font-semibold text-[15px] capitalize">{order.status?.replace('_', ' ') || 'Processing'}</span></h2>

                        </div>
                    </div>
                    <div className="space-y-4 text-sm">
                        <div>
                            <h3 className="font-bold text-black text-[15px] ">Customer's Requested Delivery Time</h3>
                            <p className="text-[13px] ">{order.deliveryTime ? new Date(order.deliveryTime).toLocaleString() : 'N/A'}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-black text[15px] ">Distance from your location to Restaurant</h3>
                            <p className="text-[13px] ">{order.distanceToRestaurant || 'Calculating...'}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-black">Distance from Restaurant to Customer</h3>
                            <p className="text-[13px] ">{order.distanceToCustomer || 'Calculating...'}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-black">Your Earning From this Delivery</h3>
                            <p className="text-[13px] ">Fr. {order.deliveryFee?.toFixed(2) || '8.00'}</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-[15px] font-bold mb-2 mt-3 text-green-900">Ordered Items</h2>
                        <div className="space-y-1 text-sm w-1/3">
                            {order.items && order.items.length > 0 ? (
                                order.items.map((item: any, index: number) => (
                                    <div key={index} className="flex justify-between font-semibold">
                                        <span>{item.menuItem?.name || item.name || 'Item'}</span>
                                        <span>x {item.quantity}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[13px]">No items available</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="relative z-10 mt-auto p-6 flex justify-center space-x-4">
                    <button
                        onClick={handleStartDelivery}
                        disabled={loading}
                        className="bg-[#6b240c] text-[12px] text-white font-bold py-1 px-4 rounded-md shadow-md hover:bg-[#8a3c1a] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'STARTING...' : 'START DELIVERY'}
                    </button>
                    <button
                        onClick={() => setShowOrderDetails(false)}
                        disabled={loading}
                        className="bg-[#6b240c] text-[12px] text-white font-bold py-1 px-4 rounded-md shadow-md hover:bg-[#8a3c1a] transition-colors duration-300 disabled:opacity-50"
                    >
                        BACK TO ORDERS
                    </button>
                </div>
            </div>
        </section>
    );
}
