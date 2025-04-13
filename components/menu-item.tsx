"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MapPin, Clock } from "lucide-react";

interface MenuItemProps {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    location: string;
    cuisineType: string;
    openingHours: string;
    onAddToCart: (id: string, quantity: number) => void;
}

export default function MenuItem({
    id,
    name,
    description,
    price,
    image = "/images/placeholder.jpg",
    location,
    cuisineType,
    openingHours,
    onAddToCart
}: MenuItemProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = () => {
        setIsFavorite(prev => !prev);
    };

    return (
        <div className="relative bg-yellow-100 rounded-lg border-[4px] border-yellow-600 overflow-hidden">
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
            <div className="ml-12 mr-[170px] py-3 px-2">
                <h3 className="font-bold text-gray-800">{name}</h3>

                <div className="flex flex-row gap-1 items-center text-gray-600 text-xs">
                    <MapPin size={12} />
                    <span>{location}, {cuisineType}</span>
                </div>

                <div className="flex flex-row gap-1 items-center text-gray-600 text-xs">
                    <Clock size={12} />
                    <span>Min Fr. {price.toFixed(2)}</span>
                </div>

                <div className="flex flex-row gap-1 items-center text-gray-600 text-xs mb-2">
                    <Clock size={12} />
                    <span>{openingHours}</span>
                </div>

                <button className="text-white text-xs bg-red-700 px-3 py-1 rounded-full">
                    MENU ANSEHEN
                </button>

                <p className="text-gray-700 text-xs mt-2">
                    {description}
                </p>
            </div>

            {/* Images section */}
            <div className="absolute top-0 right-[45px] h-full flex flex-row">
                <div className="relative h-full w-[100px] bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v7H4V5zm0 9v1h12v-1H4z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="flex flex-col">
                    <div className="h-[74px] w-[60px] bg-gray-200 flex items-center justify-center mb-[1px]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v7H4V5zm0 9v1h12v-1H4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="h-[74px] w-[60px] bg-gray-200 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v7H4V5zm0 9v1h12v-1H4z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
} 