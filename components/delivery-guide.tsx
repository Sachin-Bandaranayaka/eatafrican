"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface DeliveryGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

// Data structure for delivery zones
const deliveryZones = [
    {
        radius: "15 km from Restaurant's Location",
        time: "45 - 90 minutes",
        fee: "CHF 4.00",
        minOrder: "CHF 25.00",
        example: "You live in Spreitenbach, Embrach or Uster and place an order from a restaurant in Zürich.",
    },
    {
        radius: "30 km from Restaurant's Location",
        time: "1 - 2 hours",
        fee: "CHF 8.00",
        minOrder: "CHF 25.00",
        example: "You live in Lenzburg, Baden or Winterthur and place an order from a restaurant in Zürich.",
    },
    {
        radius: "50 km from Restaurant's Location",
        time: "2 - 3 hours",
        fee: "CHF 8.00",
        minOrder: "CHF 50.00",
        example: "You live in Aarau, Luzern or Schwyz and place an order from a restaurant in Zürich.",
    },
    {
        radius: "70 km from Restaurant's Location",
        time: "3 - 4 hours",
        fee: "CHF 17.00",
        minOrder: "CHF 50.00",
        example: "You live in Konstanz, St. Gallen or Langenthal and place an order from a restaurant in Zürich.",
        note: "Orders from 21:00 will be delivered the next day",
    },
    {
        radius: "100 km from Restaurant's Location",
        time: "4 - 5 hours",
        fee: "CHF 25.00",
        minOrder: "CHF 70.00",
        example: "You live in Bern, Biel, Thun, Interlaken or Davos and place an order from a restaurant in Zürich.",
        note: "Orders from 19:00 will be delivered the next day",
    },
];

export default function DeliveryGuide({ isOpen, onClose }: DeliveryGuideProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay flex items-start justify-end inset-0 z-0 mb-4">
            <div className="modal-container03 relative max-w-xs rounded-bl-3xl rounded-tl-3xl mt-4 mr-4 z-10">


                {/* Scrollable Content */}
                <div className="max-h-[80vh] overflow-y-auto hide-scrollbar">
                    {/* Fixed Image - BEHIND */}
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
                                    HOW WE DELIVER
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

                    {/* Delivery Zones Section */}
                    <div className="relative z-40 mt-10 ml-10 mb-24">
                        {deliveryZones.map((zone) => (
                            <div
                                key={zone.radius}
                                className="p-3 mb-4 ml-3 mr-6 rounded-[10px] relative"
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
                                    <h3 className="text-[#ebeb48] text-sm font-bold mb-2">{zone.radius}</h3>
                                    <div className="flex justify-between items-start text-white text-xs">
                                        <ul className="space-y-1 list-disc list-inside pl-4 mt-4 max-w-[60%]">
                                            <li>
                                                <strong>Delivery Time:</strong> {zone.time}
                                                {zone.note && (
                                                    <span className="block text-gray-300 text-[10px] ml-4">
                                                        {zone.note}
                                                    </span>
                                                )}
                                            </li>
                                            <li>
                                                <strong>Delivery Fee:</strong> {zone.fee}
                                            </li>
                                            <li>
                                                <strong>Minimum Order:</strong> {zone.minOrder}
                                            </li>
                                        </ul>
                                        <div className="max-w-[40%] text-right bg-[#9b0000] p-3 text-white text-[10px] italic">
                                            <strong>Example:</strong> {zone.example}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}