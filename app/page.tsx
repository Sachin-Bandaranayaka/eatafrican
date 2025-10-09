// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useLocationContext } from '../lib/location-context';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';
import ClientOnly from '../components/client-only';
import LeftSideContent from './left-side-content-updated';
import React from "react";
import { useIsMobile } from '../hooks/use-mobile';
import AdminDashboard from "../components/admin/dashboard/page";
import AdminSiteHeader from "../components/admin/adminSite-header";
import AdminSiteFooter from "../components/admin/adminSiteFooter";
import PartnerRestaurant from "../components/restaurantRegistration";
import DriverPortalAuth from "../components/driverPortalAuth";
import DriverPortal from "../components/driverPortal";
import SuperAdminLogin from "../components/superAdmin/auth/login";
import SuperAdminHeader from "../components/superAdmin/header";

// Import all the components for the Super Admin dashboard views.
// If an error occurs, it's likely one of these files is not exporting
// the component with the correct name.
import { SuperAdminDashboardConnected } from "../components/superAdmin/dashboard-connected";
import { OrdersManagementConnected } from "../components/superAdmin/orders/OrdersManagement-connected";
import { EarningsManagementConnected } from "../components/superAdmin/earnings/EarningsManagement-connected";
import { DriversManagementConnected } from "../components/superAdmin/delivery-drivers/DriversManagement-connected";
import { CustomersManagementConnected } from "../components/superAdmin/customer-accounts/CustomersManagement-connected";
import { SuperAdminRestaurant } from "../components/superAdmin/restaurant";
import { SuperAdminDeliveryDrivers } from "../components/superAdmin/delivery-drivers/page";
import { SuperAdminCustomerAccount } from "../components/superAdmin/customer-accounts/page";
import { SuperAdminSettings } from "../components/superAdmin/settings/page";
import { SuperAdminDeliveryBackend } from "../components/superAdmin/delivery-backend/page";


export default function Home() {
    const [visibleComponent, setVisibleComponent] = useState<string | null>(null);
    const [isViewingMenu, setIsViewingMenu] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
    const [adminView, setAdminView] = useState<'none' | 'dashboard' | 'login' | 'partner' | 'driver' | 'driverPortal' | 'superAdmin' | 'superAdminDashboard'>('none');
    
    // Add state to manage the view within the Super Admin Dashboard
    const [superAdminView, setSuperAdminView] = useState('DASHBOARD');

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

    if (adminView === 'superAdminDashboard') {
        // --- MODIFIED ---
        // This function now checks if the imported component is undefined and
        // will render an error message if it is.
        const renderSuperAdminComponent = () => {
            // A helper component for displaying errors
            const ErrorDisplay = ({ name }: { name: string }) => (
                <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <p className="font-bold">Component Loading Error</p>
                    <p>The component <code className="bg-red-200 p-1 rounded">{name}</code> is undefined.</p>
                    <p>Please ensure you have <code className="bg-red-200 p-1 rounded">export const {name} = ...</code> in your component file.</p>
                </div>
            );

            switch (superAdminView) {
                case 'DASHBOARD':
                    return SuperAdminDashboardConnected ? <SuperAdminDashboardConnected /> : <ErrorDisplay name="SuperAdminDashboardConnected" />;
                case 'ORDERS':
                    return OrdersManagementConnected ? <OrdersManagementConnected /> : <ErrorDisplay name="OrdersManagementConnected" />;
                case 'EARNINGS':
                    return EarningsManagementConnected ? <EarningsManagementConnected /> : <ErrorDisplay name="EarningsManagementConnected" />;
                case 'PAYOUTS':
                    return EarningsManagementConnected ? <EarningsManagementConnected /> : <ErrorDisplay name="EarningsManagementConnected" />;
                case 'RESTAURANT':
                    return SuperAdminRestaurant ? <SuperAdminRestaurant /> : <ErrorDisplay name="SuperAdminRestaurant" />;
                case 'DELIVERY BACKEND':
                    return SuperAdminDeliveryBackend ? <SuperAdminDeliveryBackend /> : <ErrorDisplay name="SuperAdminDeliveryDrivers" />;
                case 'DELIVERY DRIVERS':
                    return DriversManagementConnected ? <DriversManagementConnected /> : <ErrorDisplay name="DriversManagementConnected" />;
                case 'CUSTOMER ACCOUNT':
                    return CustomersManagementConnected ? <CustomersManagementConnected /> : <ErrorDisplay name="CustomersManagementConnected" />;
                case 'SETTINGS':
                    return SuperAdminSettings ? <SuperAdminSettings /> : <ErrorDisplay name="SuperAdminSettings" />;
                default:
                    // Fallback to the dashboard
                    return SuperAdminDashboardConnected ? <SuperAdminDashboardConnected /> : <ErrorDisplay name="SuperAdminDashboardConnected" />;
            }
        };

        return (
            <ClientOnly>
                <main className="relative w-full min-h-screen">
                    {/* Pass the state and the updater function to the header */}
                    <SuperAdminHeader 
                        currentView={superAdminView} 
                        onViewChange={setSuperAdminView} 
                    />
                    {/* Render the selected component or an error message */}
                    <div className="mt-4 px-4">
                        {renderSuperAdminComponent()}
                    </div>
                </main>
            </ClientOnly>
        );
    }

    // ... (The rest of your component remains the same)

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

    if (adminView === 'superAdmin') {
        return (
            <ClientOnly>
                <main className="relative w-full min-h-screen flex flex-col">
                    <AdminSiteHeader onToggleAdminDashboard={exitAdminView} />
                    <div className="flex-1">
                        <SuperAdminLogin onLoginSuccess={() => setAdminView('superAdminDashboard')} />
                    </div>
                    <SiteFooter
                        onOpenComponent={setVisibleComponent}
                        onCloseComponent={() => setVisibleComponent(null)}
                    />
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
                            onShowSuperAdminLogin={() => setAdminView('superAdmin')}
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
