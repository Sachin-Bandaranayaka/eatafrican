"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";

interface RestaurantCardProps {
    id: string;
    name: string;
    cuisineType: string;
    location: string;
    distance: number;
    minOrder: number;
    image?: string;
    openingHours: string;
}

export default function RestaurantCard({
    id,
    name,
    cuisineType,
    location,
    distance,
    minOrder,
    image,
    openingHours
}: RestaurantCardProps) {
    return (
        <div className="relative bg-yellow-100 rounded-lg overflow-hidden border-[3px] border-yellow-500 w-full">
            {/* African mask decorative borders */}
            <div className="absolute left-0 top-0 h-full w-10">
                <div className="absolute top-0 left-0 h-full w-full">
                    <Image
                        src="/images/masks/mask.png"
                        alt="African mask"
                        fill
                        className="object-cover object-left"
                    />
                </div>
            </div>
            <div className="absolute right-0 top-0 h-full w-10">
                <div className="absolute top-0 right-0 h-full w-full transform scale-x-[-1]">
                    <Image
                        src="/images/masks/mask.png"
                        alt="African mask"
                        fill
                        className="object-cover object-left"
                    />
                </div>
            </div>

            {/* Content with padding to accommodate the masks */}
            <div className="ml-12 mr-[100px] py-2 px-2">
                <h3 className="font-bold text-gray-800 text-sm">{name}</h3>

                <div className="flex flex-row gap-1 items-center text-gray-600 text-xs">
                    <MapPin size={10} />
                    <span>{location}, {cuisineType}</span>
                </div>

                <div className="flex flex-row gap-1 items-center text-gray-600 text-xs">
                    <Clock size={10} />
                    <span>Min Fr. {minOrder.toFixed(2)}</span>
                </div>

                <div className="flex flex-row gap-1 items-center text-gray-600 text-xs mb-1">
                    <Clock size={10} />
                    <span>{openingHours}</span>
                </div>

                <Link href={`/restaurant/${id}/menu`} className="inline-flex">
                    <div className="flex items-center bg-red-800 px-1.5 py-0.5 rounded-l-full">
                        <Image
                            src="/images/menu icon.png"
                            alt="Menu"
                            width={16}
                            height={16}
                            className="object-contain"
                        />
                    </div>
                    <div className="text-white text-xs bg-red-700 px-2 py-0.5 rounded-r-full hover:bg-red-800 transition">
                        MENU ANSEHEN
                    </div>
                </Link>

                <p className="text-gray-700 text-xs mt-1 line-clamp-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy euismod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                </p>
            </div>

            {/* Images section */}
            <div className="absolute top-0 right-12 h-full flex flex-col space-y-[2px]">
                <div className="relative h-full w-[80px] bg-gray-100 flex items-center justify-center">
                    <div className="w-12 h-12 flex items-center justify-center">
                        <Image
                            src="/images/placeholder.jpg"
                            alt="Restaurant"
                            width={48}
                            height={48}
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 