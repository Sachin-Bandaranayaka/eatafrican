"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface ContactUsProps {
  isOpen: boolean;
  onClose: () => void;
  embedInModal?: boolean;
}

export default function ContactUs({ isOpen, onClose, embedInModal = false }: ContactUsProps) {
  if (!isOpen) return null;

  const content = (
    <div className="md:w-[45%] relative rounded-[5px] overflow-hidden z-10">
      {/* Image - BEHIND */}
      <div className="absolute right-40 md:right-96 w-40 h-40 md:w-48 md:h-48 z-20">
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
          <span className="text-sm md:text-base font-bold uppercase">CONTACT US</span>
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
          <p className="text-black space-y-2 text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm md:text-base">
            Get in touch with our team:
          </p>
          <ul className="space-y-2 text-black text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm">
            <li>
              <strong>Email:</strong> info@eatafrican.com
            </li>
            <li>
              <strong>Phone:</strong> +41 123 456 789
            </li>
            <li>
              <strong>Address:</strong> Bahnhofstrasse 123, 8001 Zürich, Switzerland
            </li>
          </ul>
          <p className="text-black space-y-2 text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm md:text-base">
            Our customer service is available Monday to Friday, 9:00 - 17:00.
          </p>
        </div>
      </div>
    </div>
  );

  if (embedInModal) {
    return content;
  }

  return (
    <div className="md:fixed lg:fixed xl:fixed 2xl:fixed -mt-72 md:mt-[20vh] lg:[20vh] xl:[20vh] 2xl:[20vh] z-50 flex items-start justify-end inset-0 ">
      {content}
    </div>
  );
}