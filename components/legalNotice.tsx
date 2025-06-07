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

  const content = (
    <div className="w-[95%] md:w-[45%] relative rounded-[5px] overflow-hidden z-10">
      {/* Header */}
      <div className="flex justify-start md:ml-10 mt-12 z-20 items-center space-x-2">
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
        <div className="bg-[#ff9920] bg-contain border border-[2px] border-[#fff2ccff] inline-block rounded-r-full p-6 pr-2 py-2 relative">
          <div className="pr-10">
            <h2 className="block text-black text-[15px] font-bold uppercase rounded whitespace-nowrap">
              LEGAL NOTICE
            </h2>
          </div>
        </div>
      </div>

      {/* Image Container */}
      <div className="relative w-full max-w-[600px] mx-auto mt-4 border border-[#f1c232] rounded-3xl">
        <Image
          src="/images/legalnotice_2.png"
          width={600}
          height={400}
          alt="About Us"
          className="w-full h-auto rounded-3xl"
        />
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[#783f04ff] opacity-75 rounded-3xl z-20"></div>

        {/* Content Area */}
        <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-center z-30">
          <div className="space-y-4">
            <p className="text-white text-[10px] md:text-sm">
              The Website http://eatafrican.ch is operated by:
            </p>
            <p className="text-white text-[10px] md:text-sm">
              Eat African Aloice Ouko Piller
            </p>
            <p className="text-white text-[10px] md:text-sm">
              Email: info@eatafrican.ch
            </p>
            <p className="text-white text-[10px] md:text-sm">
              Company Nr: CH-241.1.024.430-9
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
    <div className="md:fixed lg:fixed xl:fixed 2xl:fixed -mt-72 md:mt-[10vh] flex items-start justify-end inset-0 z-50">
      {content}
    </div>
  );
}