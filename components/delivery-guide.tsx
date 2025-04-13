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
        radius: "15 km",
        time: "45 - 90 minutes",
        fee: "CHF 4.00",
        minOrder: "CHF 25.00",
        example: "You live in Spreitenbach, Embrach or Uster and place an order from a restaurant in Zürich.",
    },
    {
        radius: "30 km",
        time: "1 - 2 hours",
        fee: "CHF 8.00",
        minOrder: "CHF 25.00",
        example: "You live in Lenzburg, Baden or Winterthur and place an order from a restaurant in Zürich.",
    },
    {
        radius: "50 km",
        time: "2 - 3 hours",
        fee: "CHF 8.00",
        minOrder: "CHF 50.00",
        example: "You live in Aarau, Luzern or Schwyz and place an order from a restaurant in Zürich.",
    },
    {
        radius: "70 km",
        time: "3 - 4 hours",
        fee: "CHF 17.00",
        minOrder: "CHF 50.00",
        example: "You live in Konstanz, St. Gallen or Langenthal and place an order from a restaurant in Zürich.",
        note: "Orders from 21:00 will be delivered the next day",
    },
    {
        radius: "100 km",
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
        <div className="modal-overlay flex items-center justify-center fixed inset-0 bg-black/50 z-50">
            {/* Use modal-container for base styling */}
            <div className="modal-container relative max-w-xs bg-[#f0e6d9] rounded-lg shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-1.5 right-1.5 text-black hover:text-amber-700 z-10"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                {/* Header Section */}
                <div className="flex justify-between items-start p-2.5">
                    <div className="bg-amber-900 text-white py-1.5 px-4 rounded-r-xl border-r-2 border-t-2 border-b-2 border-amber-600 -ml-9 rounded-l-none">
                        <h2 className="text-sm font-bold uppercase">DELIVERY GUIDE</h2>
                    </div>
                    <div className="relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0 ml-2">
                        <Image
                            src="/images/chefs-group.png"
                            alt="Chefs group"
                            fill
                            className="object-cover rounded-md"
                        />
                    </div>
                </div>

                {/* Content Section - Using cream background */}
                <div className="bg-[#fff2d9] rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-4">
                        {deliveryZones.map((zone) => (
                            <div key={zone.radius}>
                                <h3 className="font-bold text-amber-950 mb-0.5 text-sm">{zone.radius} Radius</h3>
                                <ul className="space-y-1 text-gray-900 text-xs list-disc list-inside pl-1">
                                    <li>
                                        <strong>Delivery Time:</strong> {zone.time}
                                        {zone.note && <span className="block text-gray-700 text-[10px] ml-4">{zone.note}</span>}
                                    </li>
                                    <li><strong>Delivery Fee:</strong> {zone.fee}</li>
                                    <li><strong>Minimum Order:</strong> {zone.minOrder}</li>
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 