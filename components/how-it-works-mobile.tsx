"use client";

import Image from "next/image";

interface HowItWorksProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HowItWorksMobile({ isOpen, onClose }: HowItWorksProps) {
    if (!isOpen) return null;

    return (
        <div className="absolute rounded-lg shadow-lg mt-[95%] z-50 w-[95%] right-0">
            {/* Fixed Chefs Image */}
            <div className="absolute top-4 left-[10%] z-10 opacity-100 pointer-events-none">
                <Image
                    src="/images/chefs-group.png"
                    alt="Chefs group"
                    width={120}
                    height={120}
                    className="object-cover rounded-md"
                />
            </div>

            {/* heading & cancel btn */}
            <div className="flex justify-end items-center ml-[35%]">
                {/* Header */}
                <div className="flex mt-4 inline-block rounded-l-full p-1 mb-4 w-full ml-10">
                    <div
                        className="bg-[url('/images/Content_Title_Background.png')] bg-no-repeat bg-cover  rounded-l-full bg-center px-4 py-1 border border-[#ffe599]"
                    >
                        <h2 className="inline-block text-black text-xs font-bold uppercase rounded">
                            HOW IT WORKS
                        </h2>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="top-11 right-0 bg-[#ff9920] border border-white rounded-full p-1 z-50"
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

            {/* Steps Section */}
            <div className="relative z-10 space-y-3 text-[10px] text-center mb-20 mt-2">
                {[
                    {
                        step: "Step 1: Check the Delivery Guide",
                        description:
                            'Check <span class="text-amber-700 font-semibold">How We Deliver</span> to see delivery rates, where we deliver, and how long it takes.',
                    },
                    {
                        step: "Step 2: Choose a Country Specialty & Location",
                        description:
                            "Select a country specialty and your preferred location, then pick a restaurant you'd like to order from.",
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
                ].map((item) => (
                    <div
                        key={item.step}
                        className="p-3 rounded-[10px] relative"
                        style={{
                            backgroundImage: 'url("/images/Box_Restaurant_BckgImg01.png")',
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
                            <h3 className="text-[#ebeb48] text-sm font-bold mb-1">{item.step}</h3>
                            <p
                                className="text-white"
                                dangerouslySetInnerHTML={{ __html: item.description }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}