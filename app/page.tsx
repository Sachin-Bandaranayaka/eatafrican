"use client";

import { useState } from "react";
import { useLocationContext } from '../lib/location-context';
import ViewMenu from '../components/view-menu';
import HowItWorks from '../components/how-it-works';
import DeliveryGuide from '../components/delivery-guide';
import HowItWorksMobile from '../components/how-it-works-mobile';
import DeliveryGuideMobile from '../components/delivery-guide-mobile';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';
import ClientOnly from '../components/client-only';
import LeftSideContent from './left-side-content-updated';
import React from "react";
import { useIsMobile } from '../hooks/use-mobile';

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
      <main className={`relative w-full ${isMobile ? 'min-h-screen overflow-y-auto' : 'h-screen overflow-hidden'}`}>
        {/* Content Overlay */}
        <div className={`relative z-10 flex flex-col ${isMobile ? 'min-h-screen' : 'h-screen'}`}>
          {/* Header with user icon and language selector */}
          <div className="overflow-hidden">
            <SiteHeader />
          </div>

          {/* Main Content Area */}
          <div className={`flex-1 flex ${isMobile ? 'flex-col' : 'flex-row'} overflow-y-hidden items-start justify-between px-4 sm:px-6 md:px-8 pb-4 md:pb-6 mt`}>
            {/* Left Side Content */}
            <div className="w-full md:w-1/2 max-w-2xl flex flex-col">
              <LeftSideContent
                onViewMenu={handleViewMenu}
                isViewingMenu={isViewingMenu}
                selectedRestaurant={selectedRestaurant}
                onChange={handleChange}
              />
            </div>
            {/* Right Side Placeholder for Desktop */}
            {!isMobile && (
              <div className="w-1/2 max-w-auto"></div>
            )}
          </div>

          {/* Footer */}
          <SiteFooter />
        </div>
      </main>
    </ClientOnly>
  );
}