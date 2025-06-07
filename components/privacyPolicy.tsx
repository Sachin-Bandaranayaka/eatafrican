"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
  embedInModal?: boolean;
}

export default function PrivacyPolicy({ isOpen, onClose, embedInModal = false }: PrivacyPolicyProps) {
  if (!isOpen) return null;

  const content = (
    <div className="w-[95%] md:w-[45%] relative rounded-[5px] overflow-hidden z-10">

      {/* Header */}
      <div className="flex justify-start md:ml-10 mt-12 z-20 items-center space-x-2">
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
              PRIVACY POLICY
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
          <div className="space-y-4 my-6">
            <p className="text-white space-y-2 text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm md:text-base">
              Eat African respects your privacy and is committed to protecting your personal data.
            </p>
            <p className="text-white space-y-2 text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm md:text-base">
              We collect your personal information to process your orders, provide customer support, and improve our services. We do not sell your data to third parties.
            </p>
            <p className="text-white space-y-2 text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm md:text-base">
              By using our service, you consent to our privacy policy. For more information on how we process your data, please contact us.
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