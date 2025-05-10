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
        radius: "15 km from Restuarant's Location",
        time: "45 - 90 minutes",
        fee: "CHF 4.00",
        minOrder: "CHF 25.00",
        example: "You live in Spreitenbach, Embrach or Uster and place an order from a restaurant in Zürich.",
    },
    {
        radius: "30 km from Restuarant's Location",
        time: "1 - 2 hours",
        fee: "CHF 8.00",
        minOrder: "CHF 25.00",
        example: "You live in Lenzburg, Baden or Winterthur and place an order from a restaurant in Zürich.",
    },
    {
        radius: "50 km from Restuarant's Location",
        time: "2 - 3 hours",
        fee: "CHF 8.00",
        minOrder: "CHF 50.00",
        example: "You live in Aarau, Luzern or Schwyz and place an order from a restaurant in Zürich.",
    },
    {
        radius: "70 km from Restuarant's Location",
        time: "3 - 4 hours",
        fee: "CHF 17.00",
        minOrder: "CHF 50.00",
        example: "You live in Konstanz, St. Gallen or Langenthal and place an order from a restaurant in Zürich.",
        note: "Orders from 21:00 will be delivered the next day",
    },
    {
        radius: "100 km from Restuarant's Location",
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
            <div className="modal-container03 relative max-w-xs bg-[#f0e6d9]/80 rounded-bl-3xl rounded-tl-3xl shadow-lg mt-4 mr-4 z-10">

                {/* Image - BEHIND */}
                <div className="absolute  right-72 w-40 h-40 md:w-48 md:h-48 z-20">
                    <Image
                        src="/images/chefs-group.png"
                        alt="Chefs group"
                        fill
                        className="object-cover rounded-md opacity-90"
                    />
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-20 right-2 bg-[#FFF3C7] rounded-full p-1 z-50"
                    type="button"
                >
                    <img
                        src="/images/cancelBtn.png" // Replace with your image path
                        alt="Close"
                        className="w-4 h-4 object-contain"
                    />
                </button>

                {/* Header */}
                <div className="flex justify-end items-end p-0 relative z-10 mr-12">
                    <div className="mt-16 ml-72 bg-[#FFF3C7] inline-block rounded-l-full rounded-r-sm pl-6 pr-2 py-2 mb-4">
                        <div className="bg-[url('/images/title-background03.png')]  bg-contain bg-start px-10 py-2">
                            <h2 className="inline-block bg-[#2A5910] text-white text-sm font-bold uppercase rounded -ml-4">
                                DELIVERY GUIDE
                            </h2>
                        </div>
                    </div>
                </div>



                {/* Transparent Steps Section */}
                <div className="relative z-40 mt-10 ml-10 mb-24">
                    {deliveryZones.map((zone) => (
                        <div key={zone.radius} className="bg-[#fff2d9]/90 p-1 mb-3 ml-3 mr-6 rounded-sm relative z-50">
                            <h3 className="text-amber-950 text-sm font-bold mb-0.5">{zone.radius} Radius</h3>
                            <div className="flex justify-between items-start text-gray-900 text-xs">
                                <ul className="space-y-1 list-disc list-inside pl-1 max-w-[60%]">
                                    <li>
                                        <strong>Delivery Time:</strong> {zone.time}
                                        {zone.note && <span className="block text-gray-700 text-[10px] ml-4">{zone.note}</span>}
                                    </li>
                                    <li><strong>Delivery Fee:</strong> {zone.fee}</li>
                                    <li><strong>Minimum Order:</strong> {zone.minOrder}</li>
                                </ul>
                                <div className="max-w-[50%] text-right bg-[#ebd1dc] text-gray-800 text-[10px] italic pl-2">
                                    <strong>Example:</strong> {zone.example}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 