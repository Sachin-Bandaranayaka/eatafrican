"use client";

import Image from "next/image";

interface HowItWorksProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HowItWorksMobile({ isOpen, onClose }: HowItWorksProps) {
    if (!isOpen) return null;

    return (
        <div className="relative rounded-lg shadow-lg p-4 -mt-80">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="rounded-full bg-[#f0e6d9] px-2 absolute top-10 right-10 text-gray-700 font-bold hover:text-amber-700 z-20"
                aria-label="Close"
            >
                ✕
            </button>

            {/* Header */}
            <div className="mt-4 ml-48 bg-amber-900 text-white py-1.5 px-4 rounded-l-2xl border-r-2 border-t-2 border-b-2 border-amber-600 mb-4 inline-block">
                <h2 className="text-sm font-bold uppercase">HOW IT WORKS</h2>
            </div>

            <div className="absolute top-4 left-4 w-40 h-40 z-0 opacity-100 pointer-events-none">
                <Image
                    src="/images/chefs-group.png"
                    alt="Chefs group"
                    fill
                    className="object-cover rounded-md"
                />
            </div>
            
            

            {/* Steps Section */}
            <div className="space-y-3 text-gray-900 text-[10px] text-center relative Z-10 mb-20 mt-6">
                <div className="bg-[#fff2d9]/90 p-3 rounded-md">
                    <h3 className="text-amber-950 text-sm font-bold mb-1">Step 1: Check the Delivery Guide</h3>
                    <p>Check <span className="text-amber-700 font-semibold">How We Deliver</span> to see delivery rates, where we deliver, and how long it takes.</p>
                </div>
                <div className="bg-[#fff2d9]/90 p-3 rounded-md">
                    <h3 className="text-amber-950 text-sm font-bold mb-1">Step 2: Choose a Country Specialty & Location</h3>
                    <p>Select a country specialty and your preferred location, then pick a restaurant you'd like to order from.</p>
                </div>
                <div className="bg-[#fff2d9]/90 p-3 rounded-md">
                    <h3 className="text-amber-950 text-sm font-bold mb-1">Step 3: Choose Your Meal</h3>
                    <p>Browse the restaurant's menu and add the meals you'd like to order.</p>
                </div>
                <div className="bg-[#fff2d9]/90 p-3 rounded-md">
                    <h3 className="text-amber-950 text-sm font-bold mb-1">Step 4: Select a Delivery Time</h3>
                    <p>At checkout, choose a delivery time that suits your schedule.</p>
                </div>
                <div className="bg-[#fff2d9]/90 p-3 rounded-md">
                    <h3 className="text-amber-950 text-sm font-bold mb-1">Step 5: Enjoy Your Meal</h3>
                    <p>We'll deliver your order right to your doorstep.</p>
                </div>
            </div>
        </div>
    );
}
