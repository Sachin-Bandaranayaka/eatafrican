"use client";

import { useState } from "react";
import { useLocationContext } from '../lib/location-context'; // Adjusted path
import LocationSelection from '../components/location-selection'; // Importing Location Selection
import HowItWorks from '../components/how-it-works'; // Adjusted path
import DeliveryGuide from '../components/delivery-guide'; // Adjusted path
import SiteFooter from '../components/site-footer'; // Adjusted path
import SiteHeader from '../components/site-header'; // Adjusted path
import ClientOnly from '../components/client-only'; // Adjusted path
import LeftSideContent from './left-side-content-updated'; // Importing Left Side Content
import RightSideContent from './right-side-content-updated'; // Importing Right Side Content
import React from "react";

function RightSideContentInline({ setHowItWorksOpen, setDeliveryGuideOpen }: { setHowItWorksOpen: React.Dispatch<React.SetStateAction<boolean>>, setDeliveryGuideOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <div className="flex flex-col items-center  w-full max-w-md md:max-w-lg ml-10">
      {/* Buttons side by side on medium screens and up */}
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mb-8">
        <button
          onClick={() => setDeliveryGuideOpen(true)}
          className="flex items-center justify-center gap-2 text-white text-sm p-3 hover:text-amber-200 transition duration-200 w-full md:w-auto"
        >
          <span className="font-bold">❯❯</span>
          HOW WE DELIVER
        </button>

        <button
          onClick={() => setHowItWorksOpen(true)}
          className="flex items-center justify-center gap-2 text-white text-sm p-3 hover:text-amber-200 transition duration-200 w-full md:w-auto"
        >
          <span className="font-bold">❯❯</span>
          HOW IT WORKS
        </button>
      </div>

      {/* Heading on top */}
      <h1 className="text-white font-bold text-base md:text-lg mb-4">
        YOUR FAVORITE AFRICAN MEALS—JUST A FEW CLICKS AWAY, WHEREVER YOU ARE IN SWITZERLAND.
      </h1>
    </div>
  );
}

export default function Home() {
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [deliveryGuideOpen, setDeliveryGuideOpen] = useState(false);

  // Get location context and translations
  const { t } = useLocationContext();

  const isAnyOpen = howItWorksOpen || deliveryGuideOpen;

  return (
    <ClientOnly>
      <main className="relative w-full min-h-screen overflow-hidden">
        {/* Content Overlay */}
        <div className="relative z-20 flex flex-col min-h-screen">
          {/* Header with user icon and language selector */}
          <SiteHeader />

          {/* Main Content Area - Adjusted for better spacing */}
          <div className="flex-1 flex flex-row items-start justify-between px-4 sm:px-6 md:px-8 pb-12 md:pb-16 mt-10">

            {/* Wrap LeftSideContent and conditional RightSideContentInline vertically */}
            <div className="flex flex-col max-w-2xl">
              <LeftSideContent /> {/* Left Side Content */}
              {isAnyOpen && (
                <RightSideContentInline
                  setHowItWorksOpen={setHowItWorksOpen}
                  setDeliveryGuideOpen={setDeliveryGuideOpen}
                />
              )}
              {howItWorksOpen && (
                <HowItWorks
                  isOpen={howItWorksOpen}
                  onClose={() => setHowItWorksOpen(false)}
                />
              )}
              {deliveryGuideOpen && (
                <DeliveryGuide
                  isOpen={deliveryGuideOpen}
                  onClose={() => setDeliveryGuideOpen(false)}
                />
              )}
            </div>

            {!isAnyOpen && (
              <RightSideContent
                setHowItWorksOpen={setHowItWorksOpen}
                setDeliveryGuideOpen={setDeliveryGuideOpen}
              /> /* Right Side Content */
            )}
          </div>

          {/* Footer */}
          <SiteFooter />
        </div>
      </main>
    </ClientOnly>
  );
}
