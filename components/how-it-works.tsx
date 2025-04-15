"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface HowItWorksProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HowItWorks({ isOpen, onClose }: HowItWorksProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay flex items-center justify-center fixed inset-0 bg-black/50 z-50">
            <div className="modal-container02 relative max-w-xs bg-[#f0e6d9] rounded-lg shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-10 right-1.5 text-black hover:text-amber-700 z-10"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                <div className="flex justify-between items-start p-0">
                    <div className="bg-amber-900 text-white mt-8 py-1.5  px-4 rounded-r-2xl border-r-2 border-t-2 border-b-2 border-amber-600 -ml-9 rounded-l-none">
                        <h2 className="text-sm font-bold uppercase">HOW IT WORKS</h2>
                    </div>
                    <div className="relative w-28 h-28 md:w-40 md:h-40 flex-shrink-0 ml-2 mb-2 mr-1">
                        <Image
                            src="/images/chefs-group.png"
                            alt="Chefs group"
                            fill
                            className="object-cover rounded-md"
                        />
                    </div>
                </div>

                <div className="bg-[#fff2d9] rounded-lg p-4 space-y-2.5">
                    <div>
                        <h3 className="text-amber-950 text-sm font-bold mb-0.5">Step 1: Check Delivery Options</h3>
                        <p className="text-gray-900 text-xs">
                            See our delivery areas, rates and times.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-amber-950 text-sm font-bold mb-0.5">Step 2: Choose Restaurant</h3>
                        <p className="text-gray-900 text-xs">
                            Select a country specialty, location and restaurant.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-amber-950 text-sm font-bold mb-0.5">Step 3: Order & Schedule</h3>
                        <p className="text-gray-900 text-xs">
                            Select your meals and choose a delivery time.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-amber-950 text-sm font-bold mb-0.5">Step 4: Enjoy!</h3>
                        <p className="text-gray-900 text-xs">
                            We'll deliver your order straight to your door.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 