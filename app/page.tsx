"use client";

import { useState, useEffect } from "react";
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
  const [visibleComponent, setVisibleComponent] = useState<string | null>(null); // Added for component visibility
  const [isViewingMenu, setIsViewingMenu] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  const { t } = useLocationContext();
  const isMobile = useIsMobile();

  const isAnyOpen = howItWorksOpen || deliveryGuideOpen;

  // Ensure only one modal open at a time
  const openHowItWorks = () => {
    setDeliveryGuideOpen(false);
    setHowItWorksOpen(true);
    setVisibleComponent("howItWorks"); // Sync with visibleComponent
  };

  const openDeliveryGuide = () => {
    setHowItWorksOpen(false);
    setDeliveryGuideOpen(true);
    setVisibleComponent("deliveryGuide"); // Sync with visibleComponent
  };

  // Handler for opening dashboard
  const openDashboard = () => {
    setHowItWorksOpen(false);
    setDeliveryGuideOpen(false);
    setVisibleComponent("dashboard");
  };

  // Handlers for location selection state lifting
  const handleViewMenu = (restaurant: string) => {
    setSelectedRestaurant(restaurant);
    setIsViewingMenu(true);
    setHowItWorksOpen(false);
    setDeliveryGuideOpen(false);
    setVisibleComponent("viewMenu"); // Sync with visibleComponent
  };

  const handleChange = () => {
    setIsViewingMenu(false);
    setSelectedRestaurant(null);
    setVisibleComponent(null); // Close any visible component
  };

  useEffect(() => {
    console.log("visibleComponent changed to:", visibleComponent);
  }, [visibleComponent]);

  return (
    <ClientOnly>
      <main className={`relative w-full ${isMobile ? 'min-h-screen overflow-y-auto' : 'h-screen overflow-hidden'}`}>
        {/* Content Overlay */}
        <div className={`relative z-10 flex flex-col ${isMobile ? 'min-h-screen' : 'h-screen'}`}>
          {/* Header with user icon and language selector */}
          <div className=" ">
            <SiteHeader onOpenDashboard={openDashboard} />
          </div>

          {/* Main Content Area */}
          <div className={`flex-1 flex ${isMobile ? 'flex-col' : 'flex-row'} items-start justify-between px-4 sm:px-6 md:px-8 pb-4 md:pb-6 mt`}>
            {/* Left Side Content */}
            <div className="w-full md:w-1/2 max-w-2xl flex flex-col">
              <LeftSideContent
                visibleComponent={visibleComponent}
                setVisibleComponent={setVisibleComponent}
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
          <SiteFooter
            onOpenComponent={setVisibleComponent}
            onCloseComponent={() => setVisibleComponent(null)}
          />
        </div>
      </main>
    </ClientOnly>
  );
}