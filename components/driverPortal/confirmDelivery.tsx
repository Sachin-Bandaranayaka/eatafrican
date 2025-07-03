"use client";

import { Dispatch, SetStateAction } from "react";

interface ConfirmDeliveryProps {
    setShowConfirmDelivery: Dispatch<SetStateAction<boolean>>;
    setShowConfirmedDeliveryMsg: Dispatch<SetStateAction<boolean>>;
}

const TimesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block mx-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

export default function ConfirmDelivery({ setShowConfirmDelivery, setShowConfirmedDeliveryMsg }: ConfirmDeliveryProps) {
    const orderedItems = [
        { name: "Meal Name lorem ipsum dolor sit", quantity: 1 },
        { name: "Meal Name lorem ipsum dolor sit", quantity: 2 },
        { name: "Meal Name lorem ipsum dolor sit", quantity: 2 },
    ];

    const handleConfirm = () => {
        setShowConfirmDelivery(false); 
        setShowConfirmedDeliveryMsg(true);
    };
    
    return (
        <section className="relative w-full h-screen flex bg-transperant font-sans">
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: "white",
                    opacity: '70%', 
                    zIndex: 1,
                    borderRadius: "8px"
                }}
            ></div>
            <div className="relative z-10 w-full max-w-4xl p-6 text-gray-800">
                <div className="flex flex-row justify-between gap-10">
                    <div className="flex flex-col space-y-6">
                        <div>
                            <h1 className="text-[15px] font-bold text-red-900">CONFIRM DELIVERY</h1>
                        </div>
                        <div>
                            <label htmlFor="deliveryCode" className="block text-sm font-bold text-black mb-1">
                                Input Customer's Delivery Code
                            </label>
                            <div>
                                <input
                                    id="deliveryCode"
                                    type="text"
                                    className="w-full max-w-[200px] border border-gray-400 rounded-md focus:ring-red-800 focus:border-red-800"
                                />
                                <div className="mt-2">
                                    <button 
                                        onClick={handleConfirm}
                                        className="bg-[#6b240c] text-[12px] text-white font-bold py-1 px-4 rounded-md shadow-md hover:bg-[#8a3c1a] transition-colors duration-300">
                                        CONFIRM
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="font-bold text-[15px] text-green-900">Customer's Address</h2>
                            <p className="text-[13px] font-semibold">Nicolas Ruedie,</p>
                            <p className="text-[13px] font-semibold">Neuerstrasse 75, Basel</p>
                        </div>
                        <div>
                            <h2 className="text-[15px] font-bold text-green-900 mb-2">Ordered Items</h2>
                            <div className="space-y-1 text-sm">
                                {orderedItems.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center font-semibold w-full max-w-sm">
                                        <span>{item.name}</span>
                                        <span><TimesIcon /> {item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-6 md:pt-10 mr-32 mt-3">
                        <div>
                            <h2 className="font-bold text-[15px] text-black">Order Nr. <span className="font-semibold">#427935</span></h2>
                        </div>
                        <div>
                            <h2 className="font-bold text-[15px] text-black">Status: <span className="font-semibold">In Transit.</span></h2>
                        </div>
                        <div>
                            <h3 className="font-bold text-black text-[15px] mt-24">Delivery Schedule</h3>
                            <p className="text-[13px] font-semibold">10.07.2025, 12:30</p>
                        </div>
                    </div>
                </div>
                <div className="mt-40 flex justify-center">
                    <button
                        onClick={() => setShowConfirmDelivery(false)}
                        className="bg-[#6b240c] text-[12px] text-white font-bold py-1 px-4 rounded-md shadow-md hover:bg-[#8a3c1a] transition-colors duration-300"
                    >
                        BACK TO DELIVERY
                    </button>
                </div>
            </div>
        </section>
    );
}