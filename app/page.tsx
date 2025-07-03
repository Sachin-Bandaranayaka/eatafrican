"use client";

import { useState, useEffect } from "react";
import { useLocationContext } from '../lib/location-context';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';
import ClientOnly from '../components/client-only';
import LeftSideContent from './left-side-content-updated';
import React from "react";
import { useIsMobile } from '../hooks/use-mobile';
import AdminDashboard from "../components/adminDashboard";
import AdminSiteHeader from "../components/adminSite-header";
import AdminSiteFooter from "../components/adminSiteFooter";
import PartnerRestaurant from "../components/restaurantRegistration";
import DriverPortalAuth from "../components/driverPortalAuth";
import DriverPortal from "../components/driverPortal"; // Import the DriverPortal component

export default function Home() {
    const [visibleComponent, setVisibleComponent] = useState<string | null>(null);
    const [isViewingMenu, setIsViewingMenu] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
    const [adminView, setAdminView] = useState<'none' | 'dashboard' | 'login' | 'partner' | 'driver' | 'driverPortal'>('none');

    const { t } = useLocationContext();
    const isMobile = useIsMobile();

    const openDashboard = () => {
        setVisibleComponent("dashboard");
    };

    const exitAdminView = () => {
        setAdminView('none');
    };

    const showPartnerRestaurant = () => {
        setAdminView('partner');
    };

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

    // --- START OF CONDITIONAL RENDERING ---

    if (adminView === 'dashboard') {
        return (
            <ClientOnly>
                <main className="relative w-full min-h-screen">
                    <AdminSiteHeader onToggleAdminDashboard={exitAdminView} />
                    <AdminDashboard />
                </main>
            </ClientOnly>
        );
    }

    if (adminView === 'driverPortal') {
        return (
            <ClientOnly>
                <main className="relative w-full min-h-screen flex flex-col">
                    <AdminSiteHeader onToggleAdminDashboard={exitAdminView} />
                    <div className="flex-1">
                        <DriverPortal onLogout={() => setAdminView('driver')} />
                    </div>
                    <SiteFooter
                        onOpenComponent={setVisibleComponent}
                        onCloseComponent={() => setVisibleComponent(null)}
                    />
                </main>
            </ClientOnly>
        );
    }

    if (adminView === 'driver') {
        return (
            <ClientOnly>
                <main className="relative w-full min-h-screen flex flex-col">
                    <AdminSiteHeader onToggleAdminDashboard={exitAdminView} />
                    <div className="flex-1">
                        <DriverPortalAuth onLoginSuccess={() => setAdminView('driverPortal')} />
                    </div>
                    <SiteFooter
                        onOpenComponent={setVisibleComponent}
                        onCloseComponent={() => setVisibleComponent(null)}
                    />
                </main>
            </ClientOnly>
        );
    }

    if (adminView === 'login') {
        return (
            <ClientOnly>
                <main className="relative w-full min-h-screen flex flex-col">
                    <AdminSiteHeader onToggleAdminDashboard={exitAdminView} />
                    <div className="flex-grow"></div>
                    <AdminSiteFooter
                        onShowPartnerRestaurant={showPartnerRestaurant}
                        onOpenComponent={() => { }}
                        onCloseComponent={() => { }}
                    />
                </main>
            </ClientOnly>
        );
    }

    if (adminView === 'partner') {
        return (
            <ClientOnly>
                <main className="relative w-full min-h-screen flex flex-col">
                    <AdminSiteHeader onToggleAdminDashboard={exitAdminView} />
                    <PartnerRestaurant />
                    <AdminSiteFooter
                        onShowPartnerRestaurant={showPartnerRestaurant}
                        onOpenComponent={() => { }}
                        onCloseComponent={() => { }}
                    />
                </main>
            </ClientOnly>
        );
    }

    // --- DEFAULT USER VIEW ---
    return (
        <ClientOnly>
            <main className={`relative w-full ${isMobile ? 'min-h-screen overflow-y-auto' : 'h-screen overflow-hidden'}`}>
                <div className={`relative z-10 flex flex-col ${isMobile ? 'min-h-screen' : 'h-screen'}`}>
                    <div className=" ">
                        <SiteHeader
                            onOpenDashboard={openDashboard}
                            onShowAdminDashboard={() => setAdminView('dashboard')}
                            onShowAdminLogin={() => setAdminView('login')}
                            onShowDriverPortal={() => setAdminView('driver')}
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