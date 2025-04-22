"use client";

import Image from "next/image";

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

export default function DeliveryGuideMobile({ isOpen, onClose }: DeliveryGuideProps) {
    if (!isOpen) return null;

    return (
        <div className="relative bg-[#f0e6d9]/60 rounded-lg shadow-lg p-4 mt-4 clip-hexagon02">
            {/* Image - BEHIND */}
            <div className="absolute top-4 right-4 w-40 h-40 z-10 opacity-100 pointer-events-none">
                <Image
                    src="/images/chefs-group.png"
                    alt="Chefs group"
                    fill
                    className="object-cover rounded-md"
                />
            </div>

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-8 left-20 text-gray-700 font-bold hover:text-amber-700 z-20"
                aria-label="Close"
            >
                ✕
            </button>

            {/* Header */}
            <div className="mt-4 ml-28 bg-amber-900 text-white py-1.5 px-4 rounded-l-2xl border-r-2 border-t-2 border-b-2 border-amber-600 mb-4 inline-block">
                <h2 className="text-sm font-bold uppercase">HOW WE DELIVER</h2>
            </div>

            {/* Delivery Zones Section */}
            <div className="mt-2">
                {deliveryZones.map((zone) => (
                    <div key={zone.radius} className="bg-[#fff2d9]/90 p-3 mb-3 rounded-md relative z-10">
                    <div className="flex justify-between items-start gap-4">
                        {/* Main Content */}
                        <div className="text-amber-950 text-[10px]">
                            <h3 className="font-bold mb-1 ">{zone.radius} Radius</h3>
                            <ul className="text-gray-900 list-disc list-inside space-y-1">
                                <li>
                                    <strong>Delivery Time:</strong> {zone.time}
                                    {zone.note && (
                                        <span className="block text-gray-700 ml-4">{zone.note}</span>
                                    )}
                                </li>
                                <li><strong>Delivery Fee:</strong> {zone.fee}</li>
                                <li><strong>Minimum Order:</strong> {zone.minOrder}</li>
                            </ul>
                        </div>
                
                        {/* Example box on the right */}
                        <div className="max-w-[40%] bg-purple-300 text-gray-800 text-[9px] italic pl-2 rounded">
                            <strong>Example:</strong> {zone.example}
                        </div>
                    </div>
                </div>
                
                ))}
            </div>
        </div>
    );
}
