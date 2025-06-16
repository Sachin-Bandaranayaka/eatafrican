"use client";

import { useState, useEffect } from "react";
import { useLocationContext } from '../lib/location-context';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';
import ClientOnly from '../components/client-only';
import LeftSideContent from './left-side-content-updated';
import React from "react";
import { useIsMobile } from '../hooks/use-mobile';
import AdminDashboard from "../components/adminDashboard"; // Import the admin dashboard
import AdminSiteHeader from "../components/adminSite-header"; // Import the admin header

export default function Home() {
  const [visibleComponent, setVisibleComponent] = useState<string | null>(null);
  const [isViewingMenu, setIsViewingMenu] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [isAdminView, setIsAdminView] = useState(false); // State to control admin view

  const { t } = useLocationContext();
  const isMobile = useIsMobile();

  // Handler for opening user dashboard
  const openDashboard = () => {
    setVisibleComponent("dashboard");
  };

  // Handler to toggle between user and admin views
  const toggleAdminView = () => {
    setIsAdminView(prev => !prev);
  };

  // Handlers for location selection state lifting
  const handleViewMenu = (restaurant: string) => {
    setSelectedRestaurant(restaurant);
    setIsViewingMenu(true);
    setVisibleComponent("viewMenu");
  };

  const handleChange = () => {
    setIsViewingMenu(false);
    setSelectedRestaurant(null);
    setVisibleComponent(null);
  };

  useEffect(() => {
    console.log("visibleComponent changed to:", visibleComponent);
  }, [visibleComponent]);

  if (isAdminView) {
    return (
      <ClientOnly>
        <main className="relative w-full min-h-screen">
          <AdminSiteHeader onToggleAdminDashboard={toggleAdminView} />
          <AdminDashboard />
        </main>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <main className={`relative w-full ${isMobile ? 'min-h-screen overflow-y-auto' : 'h-screen overflow-hidden'}`}>
        <div className={`relative z-10 flex flex-col ${isMobile ? 'min-h-screen' : 'h-screen'}`}>
          <div className=" ">
            <SiteHeader
              onOpenDashboard={openDashboard}
              onToggleAdminDashboard={toggleAdminView} // Pass the toggle function
            />
          </div>
          <div className={`flex-1 flex ${isMobile ? 'flex-col' : 'flex-row'} items-start justify-between px-4 sm:px-6 md:px-8 pb-4 md:pb-6 mt`}>
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
            {!isMobile && (
              <div className="w-1/2 max-w-auto"></div>
            )}
          </div>
          <SiteFooter
            onOpenComponent={setVisibleComponent}
            onCloseComponent={() => setVisibleComponent(null)}
          />
        </div>
      </main>
    </ClientOnly>
  );
}