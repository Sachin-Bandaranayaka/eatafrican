"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface LegalNoticeProps {
  isOpen: boolean;
  onClose: () => void;
  embedInModal?: boolean;
}

export default function LegalNotice({ isOpen, onClose, embedInModal = false }: LegalNoticeProps) {
  if (!isOpen) return null;

  // Content to be rendered (shared in both modes)
  const content = (
    <div className="md:w-[45%] w-[95%] relative rounded-[5px] overflow-hidden z-10">
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
      <div className="flex justify-end md:mr-6 mt-12 top-10 md:top-10 z-20 flex items-center space-x-2">
        <div className="bg-amber-900 text-white px-4 py-2 rounded-l-full border border-amber-600 flex items-center">
          <span className="text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm md:text-base font-bold uppercase">LEGAL NOTICE</span>
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
      <div className="relative z-20 p-2 md:p-8 bg-[#fff2d9]/90 m-4 md:m-8 rounded-3xl">
        <div className="space-y-4 my-6">
          <p className="text-black text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm md:text-base">
            The Website http://eatafrican.ch is operated by:
          </p>
          <p className="text-black text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm md:text-base">
            Eat African Aloice Ouko Piller
          </p>
          <p className="text-black text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm md:text-base">
            Email: info@eatafrican.ch
          </p>
          <p className="text-black text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm md:text-base">
            Company Nr: CH-241.1.024.430-9
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
    <div className="flex items-start justify-end inset-0 z-50">
     
      {content}
    </div>
  );
}