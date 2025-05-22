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
                <div className="absolute right-72 w-40 h-40 md:w-48 md:h-48 z-20">
                    <Image
                        src="/images/chefs-group.png"
                        alt="Chefs group"
                        fill
                        className="object-cover rounded-md opacity-90"
                    />
                </div>
                {/* Header */}
                <div className="flex justify-end items-end p-0 relative z-10 mr-12">
                    <div className="flex items-center justify-end p-0 relative z-10 mt-14">
                        <div className="bg-[url('/images/Content_Title_Background.png')] bg-no-repeat bg-cover bg-center inline-block rounded-l-full border border-[#ffe599] rounded-r-sm pl-6 pr-2 py-2">
                            <h2 className="block text-black text-sm font-bold uppercase rounded whitespace-nowrap">
                                HOW IT WORKS
                            </h2>
                        </div>
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="bg-[#ff9920] border border-white rounded-full p-1 z-50 ml-2"
                            type="button"
                            aria-label="Close"
                        >
                            <img
                                src="/images/cancelBtnBlack.png"
                                alt="Close"
                                className="w-4 h-4 object-contain"
                            />
                        </button>
                    </div>
                </div>

                <div className="relative z-40 mt-10 ml-10 mb-24">
                    {[
                        {
                            step: "Step 1: Check the Delivery Guide",
                            description: "Check <span className='text-amber-700 font-semibold'>How We Deliver</span> to see delivery rates, where we deliver, and how long it takes.",
                        },
                        {
                            step: "Step 2: Choose a Country Specialty & Location",
                            description: "Select a country specialty and your preferred location, then pick a restaurant you'd like to order from.",
                        },
                        {
                            step: "Step 3: Choose Your Meal",
                            description: "Browse the restaurant's menu and add the meals you'd like to order.",
                        },
                        {
                            step: "Step 4: Select a Delivery Time",
                            description: "At checkout, choose a delivery time that suits your schedule.",
                        },
                        {
                            step: "Step 5: Enjoy Your Meal",
                            description: "We'll deliver your order right to your doorstep.",
                        },
                    ].map((item, index) => (
                        <div
                            key={item.step}
                            className="p-3 mb-4 ml-3 mr-6 rounded-[10px] relative"
                            style={{
                                backgroundImage: 'url("/images/How_it_Works_bckimg.png")',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                border: '2px solid #f1c232',
                            }}
                        >
                            {/* Overlay */}
                            <div
                                className="absolute inset-0 rounded-[10px]"
                                style={{
                                    backgroundColor: '#312708',
                                    opacity: 0.75,
                                    zIndex: 1,
                                }}
                            ></div>

                            {/* Content */}
                            <div className="relative z-10">
                                <h3 className="text-[#ebeb48] text-sm font-bold mb-2">{item.step}</h3>
                                <p
                                    className="text-white text-xs"
                                    dangerouslySetInnerHTML={{ __html: item.description }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}