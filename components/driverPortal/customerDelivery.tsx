"use client";

import { Dispatch, SetStateAction } from "react";

interface CustomerDeliveryProps {
    setShowCustomerDelivery: Dispatch<SetStateAction<boolean>>;
    setShowConfirmDelivery: Dispatch<SetStateAction<boolean>>;
}

export default function CustomerDelivery({ setShowCustomerDelivery, setShowConfirmDelivery }: CustomerDeliveryProps) {
    
    const handleCompleteDelivery = () => {
        setShowCustomerDelivery(false); // Hide this component
        setShowConfirmDelivery(true);   // Show the final confirmation screen
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
                    <h1 className="text-[15px] font-bold mb-6 text-green-900 ">Delivery to Customer's Location</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="flex flex-col space-y-4">
                            <div>
                                <h2 className="font-bold text-[15px] text-black">Customer's Address</h2>
                                <p className="text-[13px] font-semibold">Nicolas Ruedie,</p>
                                <p className="text-[13px] font-semibold">Neuerstrasse 75, Basel</p>
                            </div>
                        </div>
                        <div className="text-left">
                            <h2 className="font-bold text-[15px] text-black">Order Nr. <span className="font-semibold text-[15px]">#427935</span></h2>
                            <h2 className="font-bold text-[15px] text-black">Status <span className="font-semibold text-[15px]">In Transit</span></h2>
                        </div>
                        <div>
                            {/* the map shows inside this div */}
                            map shows inside this div
                        </div>
                    </div>
                </div>
                <div className="relative z-10 mt-auto p-6 flex justify-center space-x-4">
                    <button
                        onClick={handleCompleteDelivery}
                        className="bg-[#6b240c] text-[12px] text-white font-bold py-1 px-4 rounded-md shadow-md hover:bg-[#8a3c1a] transition-colors duration-300">
                        COMPLETE DELIVERY
                    </button>
                    <button
                        onClick={() => setShowCustomerDelivery(false)}
                        className="bg-[#6b240c] text-[12px] text-white font-bold py-1 px-4 rounded-md shadow-md hover:bg-[#8a3c1a] transition-colors duration-300"
                    >
                        BACK TO ORDERS
                    </button>
                </div>
            </div>
        </section>
    );
}