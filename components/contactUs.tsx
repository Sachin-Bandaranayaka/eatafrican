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

      {/* Header */}
      <div className="flex justify-start ml-10 mt-12 z-20 items-center space-x-2">
        {/* close btn */}
        <button
          onClick={onClose}
          className="bg-[#ff9920] text-black border rounded-full p-1 mr-2 z-30"
          type="button"
        >
          <img
            src="/images/cancelBtnBlack.png"
            alt="Close"
            className="w-4 h-4 object-contain"
          />
        </button>

        {/* heading text */}
        <div className="bg-[url('/images/Content_Title_Background.png')] bg-contain border border-[2px] border-[#fff2ccff] inline-block rounded-r-full p-6 pr-2 py-2 relative">
          <div className="pr-10">
            <h2 className="block text-black text-[15px] font-bold uppercase rounded whitespace-nowrap">
              CONTACT US
            </h2>
          </div>
        </div>
      </div>

      {/* Image Container */}
      <div className="relative w-full max-w-[600px] mx-auto mt-4 border border-[#f1c232] rounded-3xl">
        <Image
          src="/images/aboutus_1.png"
          width={600}
          height={400}
          alt="About Us"
          className="w-full h-auto rounded-3xl"
        />
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[#312708] opacity-75 rounded-3xl z-20"></div>

        {/* Content Area */}
        <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-center z-30">
          <div className="space-y-4 my-6">
            <p className="text-white space-y-2 text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm md:text-base">
              Get in touch with our team:
            </p>
            <ul className="space-y-2 text-white text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm">
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
            <p className="text-white space-y-2 text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm md:text-base">
              Our customer service is available Monday to Friday, 9:00 - 17:00.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (embedInModal) {
    return content;
  }

  return (
    <div className="md:fixed lg:fixed xl:fixed 2xl:fixed -mt-72 md:mt-[10vh] lg:[20vh] xl:[20vh] 2xl:[20vh] z-50 flex items-start justify-end inset-0 ">
      {content}
    </div>
  );
}