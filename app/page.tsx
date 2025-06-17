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
import AdminSiteFooter from "../components/adminSiteFooter"; // Import the admin footer
import PartnerRestaurant from "../components/partnerRestaurant"; // Import the new partner restaurant component

export default function Home() {
  const [visibleComponent, setVisibleComponent] = useState<string | null>(null);
  const [isViewingMenu, setIsViewingMenu] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  // State to control which view is active: 'none', 'dashboard', 'login', or 'partner'
  const [adminView, setAdminView] = useState<'none' | 'dashboard' | 'login' | 'partner'>('none');

  const { t } = useLocationContext();
  const isMobile = useIsMobile();

  // Handler for opening user dashboard
  const openDashboard = () => {
    setVisibleComponent("dashboard");
  };

  // Handler to close any admin view and return to the main site
  const exitAdminView = () => {
    setAdminView('none');
  };

  // Handler to show the partner restaurant page
  const showPartnerRestaurant = () => {
    setAdminView('partner');
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

  // Conditional rendering for the 'DASHBOARD testing' button
  if (adminView === 'dashboard') {
    return (
      <ClientOnly>
        <main className="relative w-full min-h-screen">
          <AdminSiteHeader onToggleAdminDashboard={exitAdminView} />
          <AdminDashboard />
          {/* AdminSiteFooter is intentionally omitted here as per request */}
        </main>
      </ClientOnly>
    );
  }

  // Conditional rendering for the 'Admin login testing' button
  if (adminView === 'login') {
    return (
      <ClientOnly>
        <main className="relative w-full min-h-screen flex flex-col">
          <AdminSiteHeader onToggleAdminDashboard={exitAdminView} />
          {/* The main content area is empty, showing only the header and footer */}
          <div className="flex-grow"></div>
          <AdminSiteFooter
            onShowPartnerRestaurant={showPartnerRestaurant}
            // These props are required by the component but won't be used here.
            // You can also modify the footer to handle this more gracefully.
            onOpenComponent={() => {}}
            onCloseComponent={() => {}}
          />
        </main>
      </ClientOnly>
    );
  }
  
  // Conditional rendering for the 'PARTNER RESTAURANT' button in the admin footer
  if (adminView === 'partner') {
    return (
      <ClientOnly>
        <main className="relative w-full min-h-screen flex flex-col">
          <AdminSiteHeader onToggleAdminDashboard={exitAdminView} />
          <PartnerRestaurant />
          <AdminSiteFooter
            onShowPartnerRestaurant={showPartnerRestaurant}
            onOpenComponent={() => {}}
            onCloseComponent={() => {}}
          />
        </main>
      </ClientOnly>
    );
  }

  // Default user view
  return (
    <ClientOnly>
      <main className={`relative w-full ${isMobile ? 'min-h-screen overflow-y-auto' : 'h-screen overflow-hidden'}`}>
        <div className={`relative z-10 flex flex-col ${isMobile ? 'min-h-screen' : 'h-screen'}`}>
          <div className=" ">
            <SiteHeader
              onOpenDashboard={openDashboard}
              onShowAdminDashboard={() => setAdminView('dashboard')} // Set view to 'dashboard'
              onShowAdminLogin={() => setAdminView('login')}         // Set view to 'login'
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