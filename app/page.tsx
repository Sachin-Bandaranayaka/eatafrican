"use client";

// import { useState } from "react";
// import { useLocationContext } from '../lib/location-context'; // Adjusted path
// import LocationSelection from '../components/location-selection'; // Importing Location Selection
// import HowItWorks from '../components/how-it-works'; // Adjusted path
// import DeliveryGuide from '../components/delivery-guide'; // Adjusted path
// import HowItWorksMobile from '../components/how-it-works-mobile';
// import DeliveryGuideMobile from '../components/delivery-guide-mobile';
// import SiteFooter from '../components/site-footer'; // Adjusted path
// import SiteHeader from '../components/site-header'; // Adjusted path
// import ClientOnly from '../components/client-only'; // Adjusted path
import LeftSideContent from './left-side-content-updated'; // Importing Left Side Content
import RightSideContent from './right-side-content-updated'; // Importing Right Side Content
// import React from "react";
// import { useIsMobile } from '../hooks/use-mobile'; // Import useIsMobile hook

function Buttons({ setHowItWorksOpen, setDeliveryGuideOpen }: { setHowItWorksOpen: React.Dispatch<React.SetStateAction<boolean>>, setDeliveryGuideOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
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
  );
}

function RightSideContentInline({ setHowItWorksOpen, setDeliveryGuideOpen }: { setHowItWorksOpen: React.Dispatch<React.SetStateAction<boolean>>, setDeliveryGuideOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <div className="flex flex-col items-center  w-full max-w-md md:max-w-lg ml-10">
      {/* Buttons side by side on medium screens and up */}
      <Buttons setHowItWorksOpen={setHowItWorksOpen} setDeliveryGuideOpen={setDeliveryGuideOpen} />

      {/* Heading on top */}
      <h1 className="text-white font-bold text-base md:text-lg mb-4">
        YOUR FAVORITE AFRICAN MEALS—JUST A FEW CLICKS AWAY, WHEREVER YOU ARE IN SWITZERLAND.
      </h1>
    </div>
  );
}

import { useState } from "react";
import { useLocationContext } from '../lib/location-context'; // Adjusted path
import LocationSelection from '../components/location-selection'; // Importing Location Selection
import ViewMenu from '../components/view-menu'; // Importing ViewMenu
import HowItWorks from '../components/how-it-works'; // Adjusted path
import DeliveryGuide from '../components/delivery-guide'; // Adjusted path
import HowItWorksMobile from '../components/how-it-works-mobile';
import DeliveryGuideMobile from '../components/delivery-guide-mobile';
import SiteFooter from '../components/site-footer'; // Adjusted path
import SiteHeader from '../components/site-header'; // Adjusted path
import ClientOnly from '../components/client-only'; // Adjusted path
import React from "react";
import { useIsMobile } from '../hooks/use-mobile'; // Import useIsMobile hook

export default function Home() {
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [deliveryGuideOpen, setDeliveryGuideOpen] = useState(false);

  // New state for menu viewing
  const [isViewingMenu, setIsViewingMenu] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  // Get location context and translations
  const { t } = useLocationContext();

  const isAnyOpen = howItWorksOpen || deliveryGuideOpen;

  const isMobile = useIsMobile();

  // Ensure only one modal open at a time
  const openHowItWorks = () => {
    setDeliveryGuideOpen(false);
    setHowItWorksOpen(true);
  };

  const openDeliveryGuide = () => {
    setHowItWorksOpen(false);
    setDeliveryGuideOpen(true);
  };

  // Handlers for location selection state lifting
  const handleViewMenu = (restaurant: string) => {
    setSelectedRestaurant(restaurant);
    setIsViewingMenu(true);
  };

  const handleChange = () => {
    setIsViewingMenu(false);
    setSelectedRestaurant(null);
  };

  return (
    <ClientOnly>
      <main className="relative w-full min-h-screen overflow-hidden">
        {/* Content Overlay */}
        <div className="relative z-20 flex flex-col min-h-screen">
          {/* Header with user icon and language selector */}
          <SiteHeader />

          {/* Main Content Area - Adjusted for better spacing */}
          <div className={`flex-1 flex ${isMobile ? 'flex-col' : 'flex-row'} items-start justify-between px-4 sm:px-6 md:px-8 pb-12 md:pb-16 mt-10`}>

            { !isMobile && (
              <div className="hidden md:fixed md:left-0 md:top-1/2 md:transform md:-translate-y-1/2 md:flex md:flex-col md:items-start md:gap-4 md:ml-4 md:z-50">
                <button
                  onClick={openDeliveryGuide}
                  className="bg-amber-900 text-white py-6 px-0 rounded-2xl border-2 border-amber-600 hover:text-amber-200 transition duration-200 transform rotate-180"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  <span className="text-xs font-bold uppercase">HOW WE DELIVER</span>
                </button>

                <button
                  onClick={openHowItWorks}
                  className="bg-amber-900 text-white py-6 px-0 rounded-2xl border-2 border-amber-600 hover:text-amber-200 transition duration-200 transform rotate-180"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  <span className="text-xs font-bold uppercase">HOW IT WORKS</span>
                </button>
              </div>
            )}


            {/* Left Side Content */}
            <div className="max-w-2xl w-full flex flex-col ">
              <LeftSideContent
                onViewMenu={handleViewMenu}
                isViewingMenu={isViewingMenu}
                selectedRestaurant={selectedRestaurant}
                onChange={handleChange}
              />
            </div>

            {/* Right Side Content: ViewMenu */}
            {isViewingMenu && selectedRestaurant && (
              <div className="w-full md:w-1/2 sticky top-20 self-start">
                <ViewMenu restaurantName={selectedRestaurant} onBack={handleChange} />
              </div>
            )}
          </div>

          {/* Render HowItWorks and DeliveryGuide modals conditionally */}
          {isMobile ? (
            <>
              <HowItWorksMobile isOpen={howItWorksOpen} onClose={() => setHowItWorksOpen(false)} />
              <DeliveryGuideMobile isOpen={deliveryGuideOpen} onClose={() => setDeliveryGuideOpen(false)} />
            </>
          ) : (
            <>
              <HowItWorks isOpen={howItWorksOpen} onClose={() => setHowItWorksOpen(false)} />
              <DeliveryGuide isOpen={deliveryGuideOpen} onClose={() => setDeliveryGuideOpen(false)} />
            </>
          )}

          {/* Footer */}
          <SiteFooter />
        </div>
      </main>
    </ClientOnly>
  );
}
