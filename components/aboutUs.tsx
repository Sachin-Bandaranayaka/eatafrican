"use client";

import Image from "next/image";

interface AboutUsProps {
  isOpen: boolean;
  onClose: () => void;
  embedInModal?: boolean;
}

export default function AboutUs({ isOpen, onClose, embedInModal = false }: AboutUsProps) {
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
        <div className="bg-[#ff9920] border border-[2px] border-[#fff2ccff] inline-block rounded-r-full p-6 pr-2 py-2 relative">
          <div className="pr-10">
            <h2 className="block text-black font-bold uppercase rounded whitespace-nowrap
            text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] ">
              ABOUT US
            </h2>
          </div>
        </div>
      </div>

      {/* Image Container */} 
      <div className="relative w-full h-auto max-w-[600px] mx-auto mt-4 border border-[#f1c232] rounded-3xl">
        <Image
          src="/images/aboutus_1.png"
          width={600}
          height={400}
          alt="About Us"
          className="w-full h-auto rounded-3xl"
        />
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[#783f04ff] opacity-75 rounded-3xl z-20"></div>

        {/* Content Area */}
        <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-center z-30 h-auto">
          <div className="space-y-4 pt-8 pb-8">
            <p className="text-white text-[10px] md:text-sm pt-4 md:pt-0">
              Whether Nigerian jollof, Ghanaian waakye, Ethiopian injera, Kenyan Pilau, or Eritrean zigni, our mission is to make freshly prepared African meals accessible to everyone across Switzerland.
            </p>
            <p className="text-white text-[10px] md:text-sm">
              Craving authentic African flavors but can’t find them nearby? Longing for the familiar tastes that feel like home? Life can get busy, and cooking your favorite African meals isn’t always possible. We partner with passionate chefs and restaurants to bring the rich and diverse flavours of Africa straight to your doorstep.
            </p>
            <p className="text-white text-[10px] md:text-sm pb-4">
              At eatafrican.ch, we believe food is more than just nourishment—it’s a celebration of culture, tradition, and community.
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
    <div className="md:fixed lg:fixed xl:fixed 2xl:fixed -mt-72 md:mt-[10vh] lg:[10vh] xl:[10vh] 2xl:[10vh] flex items-start justify-end inset-0 z-50">
      {content}
    </div>
  );
}