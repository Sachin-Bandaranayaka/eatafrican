"use client";
import { useState, useRef, useEffect } from "react";
import Header from "./admin/dashboard/components/common/Header";
import OrdersViewConnected from "./admin/dashboard/components/views/OrdersView-connected";
import MenuViewConnected from "./admin/dashboard/components/views/MenuView-connected";
import EarningsViewConnected from "./admin/dashboard/components/views/EarningsView-connected";
import MyRestaurantViewConnected from "@/app/restaurant-owner/my-restaurant/MyRestaurantView-connected";
import TeamManagementView from "./admin/dashboard/components/views/TeamManagementView";
import AccountView from "./admin/dashboard/components/views/AccountView";
import OnboardingPage from "@/app/restaurant-owner/onboarding/page";
import OverviewPage from "@/app/restaurant-owner/overview/page";
import SettingsView from "./SettingsView";

interface RestaurantOwnerDashboardProps {
    restaurantId: string;
    onLogout: () => void;
    currentView: string;
    setCurrentView: (view: string) => void;
    myRestaurantTab: string;
    setMyRestaurantTab: (tab: string) => void;
    menuTab: string;
    setMenuTab: (tab: string) => void;
    orderStatusTab: string;
    setOrderStatusTab: (tab: string) => void;
}

export default function RestaurantOwnerDashboard({ restaurantId, onLogout, currentView, setCurrentView, myRestaurantTab, setMyRestaurantTab, menuTab, setMenuTab, orderStatusTab, setOrderStatusTab }: RestaurantOwnerDashboardProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <div
                ref={dashboardRef}
                className={`z-0 w-full max-w-6xl h-[85vh] bg-transparent ${
                    (currentView === 'ONBOARDING' || currentView === 'MY RESTAURANT' || currentView === 'MENU' || currentView === 'ORDERS' || currentView === 'PAYMENTS') ? 'p-1 sm:p-6' : 'p-6'
                } flex flex-col font-sans text-gray-900`}
            >
                <main className="w-full h-[90vh] flex flex-col space-y-6">
                    <section className="flex flex-col space-y-3 z-10">
                        <div className={`flex flex-col w-full min-h-[80vh] mb-12 shadow-md overflow-y-auto ${
                            currentView === 'MENU' ? 'overflow-x-visible' : 'overflow-x-hidden'
                        } sm:overflow-x-visible relative rounded-[8px]`}>
                            {/* <div
                                className="absolute inset-0"
                                style={{
                                    backgroundColor: "white",
                                    opacity: '70%',
                                    zIndex: 1,
                                    borderRadius: "8px"
                                }}
                            ></div> */}
                            <div className={`z-10 relative ${
                                (currentView === 'ONBOARDING' || currentView === 'MY RESTAURANT' || currentView === 'MENU' || currentView === 'ORDERS' || currentView === 'PAYMENTS') ? 'p-0 sm:p-4' : 'p-4'
                            }`}>
                                {currentView === 'ORDERS' && <OrdersViewConnected restaurantId={restaurantId} orderStatusTab={orderStatusTab} />}
                                {currentView === 'MENU' && <MenuViewConnected restaurantId={restaurantId} activeTab={menuTab} setActiveTab={setMenuTab} />}
                                {currentView === 'PAYMENTS' && <EarningsViewConnected restaurantId={restaurantId} />}
                                {(currentView === 'MY RESTAURANT' || currentView === 'OPENING HOURS' || currentView === 'RESTAURANT INFO') && <MyRestaurantViewConnected restaurantId={restaurantId} myRestaurantTab={currentView === 'OPENING HOURS' ? 'OPENING HOURS' : myRestaurantTab} setMyRestaurantTab={setMyRestaurantTab} />}
                                {currentView === 'TEAM MANAGEMENT' && <TeamManagementView />}
                                {currentView === 'ACCOUNT' && <AccountView />}
                                {currentView === 'ONBOARDING' && <OnboardingPage />}
                                {currentView === 'OVERVIEW' && <OverviewPage />}
                                {currentView === 'SETTINGS' && <SettingsView />}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
