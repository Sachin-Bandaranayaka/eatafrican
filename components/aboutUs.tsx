"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface AboutUsProps {
  isOpen: boolean;
  onClose: () => void;
  embedInModal?: boolean; // New prop to control rendering mode
}

export default function AboutUs({ isOpen, onClose, embedInModal = false }: AboutUsProps) {
  if (!isOpen) return null;

  // Content to be rendered (shared in both modes)
  const content = (
    <div className="md:w-[45%] relative rounded-[5px] overflow-hidden z-10">

        {/* Image - BEHIND */}
        <div className="absolute right-56 md:right-96 w-40 h-40 md:w-48 md:h-48 z-20">
          <Image
            src="/images/chefs-group.png"
            alt="Chefs group"
            fill
            className="object-cover rounded-md opacity-90"
          />
        </div>

      {/* Header */}
      <div className="flex justify-end md:mr-6 mt-12 top-10 md:top-10  z-20 flex items-center space-x-2">
        <div className="bg-amber-900 text-white px-4 py-2 rounded-l-full border border-amber-600 flex items-center">
          <span className="text-sm md:text-base font-bold uppercase">ABOUT US</span>
        </div>
        {/* close button */}
        <button
          onClick={onClose}
          className="bg-[#FFF3C7] text-black rounded-full p-1"
          type="button"
        >
          <img
            src="/images/cancelBtn.png"
            alt="Close"
            className="w-4 h-4 object-contain"
          />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-20 p-4 md:p-8 bg-[#fff2d9]/90 m-4 md:m-8 rounded-3xl">
        <div className="space-y-4 my-6">
          <p className="text-black space-y-2 text-sm md:text-base">
            Whether Nigerian jollof, Ghanaian waakye, Ethiopian injera, Kenyan Pilau, or Eritrean zigni, our mission
            is to make freshly prepared African meals accessible to everyone across Switzerland.
          </p>

          <p className="text-black space-y-2 text-sm md:text-base">
            Craving authentic African flavors but can't find them nearby? Longing for the familiar tastes that feel
            like home? Life can get busy, and cooking your favorite African meals isn't always possible. We partner
            with passionate chefs and restaurants to bring the rich and diverse flavours of Africa straight to your
            doorstep.
          </p>

          <p className="text-black space-y-2 text-sm md:text-base">
            At eatafrican.ch, we believe food is more than just nourishment—it's a celebration of culture, tradition,
            and community.
          </p>
        </div>
      </div>
    </div>
  );

  // If embedInModal is true, render only the content without modal-overlay
  if (embedInModal) {
    return content;
  }

  // Otherwise, render the full modal structure
  return (
    <div className="modal-overlay flex items-start justify-end fixed inset-0 z-0">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-2 bg-transparent rounded-full p-1 z-50"
        type="button"
      >
        <X className="w-5 h-5 text-white" />
      </button>
      {content}
    </div>
  );
}