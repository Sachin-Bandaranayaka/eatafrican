"use client";

import { Dispatch, SetStateAction } from "react";

interface OrderDetailsProps {
    setShowOrderDetails: Dispatch<SetStateAction<boolean>>;
    setShowPickupDelivery: Dispatch<SetStateAction<boolean>>;
}

export default function OrderDetails({ setShowOrderDetails, setShowPickupDelivery }: OrderDetailsProps) {
    const orderedItems = [
        { name: "Meal Name lorem ipsum dolor sit", quantity: 1 },
        { name: "Meal Name lorem ipsum dolor sit", quantity: 2 },
        { name: "Meal Name lorem ipsum dolor sit", quantity: 2 },
    ];

    const handleStartDelivery = () => {
        setShowOrderDetails(false); // Hide the order details
        setShowPickupDelivery(true); // Show the pickup/delivery view
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
                                <p className="text-[13px] font-semibold">Restaurant African 2,</p>
                                <p className="text-[13px] font-semibold">8500, Zürich</p>
                            </div>
                            <div>
                                <h2 className="font-bold text-[15px] text-black">Customer's Address</h2>
                                <p className="text-[13px] font-semibold">Nicolas Ruedie,</p>
                                <p className="text-[13px] font-semibold">Neuerstrasse 75, Basel</p>
                            </div>
                        </div>
                        <div className="text-left">
                             <h2 className="font-bold text-[15px] text-black">Order Nr. <span className="font-semibold text-[15px]">#427935</span></h2>
                             <h2 className="font-bold text-[15px] text-black">Status <span className="font-semibold text-[15px]">Processing</span></h2>
                            
                        </div>
                    </div>
                    <div className="space-y-4 text-sm">
                        <div>
                            <h3 className="font-bold text-black text-[15px] ">Customer's Requested Delivery Time</h3>
                            <p className="text-[13px] ">10.07.2025, 14.45</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-black text[15px] ">Distance from your location to Restaurant</h3>
                            <p className="text-[13px] ">15 km, 20 Min <span className="ml-4 font-semibold text-[13px]">Recommended pickup time: 10:45 PM</span></p>
                        </div>
                         <div>
                            <h3 className="font-bold text-black">Distance from Restaurant to Customer</h3>
                            <p className="text-[13px] ">5 km, 10 Min</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-black">Your Earning From this Delivery</h3>
                            <p className="text-[13px] ">Fr. 8.-</p>
                        </div>
                    </div>
                    <div>
                         <h2 className="text-[15px] font-bold mb-2 mt-3 text-green-900">Ordered Items</h2>
                         <div className="space-y-1 text-sm w-1/3">
                            {orderedItems.map((item, index) => (
                                <div key={index} className="flex justify-between font-semibold">
                                    <span>{item.name}</span>
                                    <span>x {item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="relative z-10 mt-auto p-6 flex justify-center space-x-4">
                    <button
                        onClick={handleStartDelivery}
                        className="bg-[#6b240c] text-[12px] text-white font-bold py-1 px-4 rounded-md shadow-md hover:bg-[#8a3c1a] transition-colors duration-300">
                        START DELIVERY
                    </button>
                    <button 
                        onClick={() => setShowOrderDetails(false)}
                        className="bg-[#6b240c] text-[12px] text-white font-bold py-1 px-4 rounded-md shadow-md hover:bg-[#8a3c1a] transition-colors duration-300"
                    >
                        BACK TO ORDERS
                    </button>
                </div>
            </div>
        </section>
    );
}