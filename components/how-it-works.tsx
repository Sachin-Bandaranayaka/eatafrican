"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface HowItWorksProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HowItWorks({ isOpen, onClose }: HowItWorksProps) {
    console.log("How It Works Modal isOpen:", isOpen); // Debugging log

    if (!isOpen) return null;

    return (
        <div className="modal-overlay flex items-start justify-end fixed inset-0 z-0">
            <div className="modal-container02 relative max-w-xs bg-[#f0e6d9]/80 rounded-bl-3xl rounded-tl-3xl shadow-lg mt-4 mr-4 clip-hexagon overflow-hidden z-10">

                {/* Image - BEHIND */}
                <div className="absolute  right-72 w-40 h-40 md:w-48 md:h-48 z-20">
                    <Image
                        src="/images/chefs-group.png"
                        alt="Chefs group"
                        fill
                        className="object-cover rounded-md opacity-90"
                    />
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute mt-16 right-4 text-white font-bold hover:text-amber-700 z-30"
                    aria-label="Close"
                >
                    <X size={30} />
                </button>

                {/* Header */}
                <div className="flex justify-end items-end p-0 relative z-10 mr-12">
                    <div className="bg-amber-900 text-white mt-16 py-1.5 px-4 rounded-l-2xl border-r-2 border-t-2 border-b-2 border-amber-600 ml-72">
                        <h2 className="text-sm font-bold uppercase">HOW IT WORKS</h2>
                    </div>
                </div>

                {/* Transparent Steps Section */}
                <div className="relative z-40 mt-10 ml-10 mb-24">


                    <div className="bg-[#fff2d9]/90 p-2 mb-3 ml-3 mr-6 rounded-sm relative z-50">
                        <h3 className="text-amber-950 text-sm font-bold mb-0.5">Step 1: Check the Delivery Guide</h3>
                        <p className="text-gray-900 text-xs">
                            Check <span className="text-amber-700 font-semibold">How We Deliver</span> to see delivery rates, where we deliver, and how long it takes.
                        </p>
                    </div>

                    <div className="bg-[#fff2d9]/90 p-2 mb-3 ml-3 mr-6 rounded-sm">
                        <h3 className="text-amber-950 text-sm font-bold mb-0.5">Step 2: Choose a Country Specialty & Location</h3>
                        <p className="text-gray-900 text-xs">
                            Select a country specialty and your preferred location, then pick a restaurant you'd like to order from.
                        </p>
                    </div>

                    <div className="bg-[#fff2d9]/90 p-2 mb-3 ml-3 mr-6 rounded-sm">
                        <h3 className="text-amber-950 text-sm font-bold mb-0.5">Step 3: Choose Your Meal</h3>
                        <p className="text-gray-900 text-xs">
                            Browse the restaurant's menu and add the meals you'd like to order.
                        </p>
                    </div>

                    <div className="bg-[#fff2d9]/90 p-2 mb-3 ml-3 mr-6 rounded-sm">
                        <h3 className="text-amber-950 text-sm font-bold mb-0.5">Step 4: Select a Delivery Time</h3>
                        <p className="text-gray-900 text-xs">
                            At checkout, choose a delivery time that suits your schedule.
                        </p>
                    </div>

                    <div className="bg-[#fff2d9]/90 p-2 mb-3 ml-3 mr-6 rounded-sm mb-20">
                        <h3 className="text-amber-950 text-sm font-bold mb-0.5">Step 5: Enjoy Your Meal</h3>
                        <p className="text-gray-900 text-xs">
                            We'll deliver your order right to your doorstep.
                        </p>
                    </div>
                </div>
            </div>
        </div>


    );
}
