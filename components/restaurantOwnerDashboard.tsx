"use client";
import { useState, useRef, useEffect } from "react";
import Header from "./admin/dashboard/components/common/Header";
import OrdersViewConnected from "./admin/dashboard/components/views/OrdersView-connected";
import MenuViewConnected from "./admin/dashboard/components/views/MenuView-connected";
import EarningsViewConnected from "./admin/dashboard/components/views/EarningsView-connected";
import MyRestaurantViewConnected from "./admin/dashboard/components/views/MyRestaurantView-connected";
import TeamManagementView from "./admin/dashboard/components/views/TeamManagementView";
import AccountView from "./admin/dashboard/components/views/AccountView";

interface RestaurantOwnerDashboardProps {
    restaurantId: string;
    onLogout: () => void;
    currentView: string;
    setCurrentView: (view: string) => void;
    myRestaurantTab: string;
    setMyRestaurantTab: (tab: string) => void;
    menuTab: string;
    setMenuTab: (tab: string) => void;
}

export default function RestaurantOwnerDashboard({ restaurantId, onLogout, currentView, setCurrentView, myRestaurantTab, setMyRestaurantTab, menuTab, setMenuTab }: RestaurantOwnerDashboardProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <div
                ref={dashboardRef}
                className="z-0 w-full max-w-6xl h-[85vh] bg-transparent p-6 flex flex-col font-sans text-gray-900"
            >
                <main className="w-full h-[90vh] flex flex-col space-y-6">
                    <section className="flex flex-col space-y-3 z-10">
                        <div className="flex flex-col w-full h-[80vh] mb-12 shadow-md overflow-hidden relative rounded-[8px]">
                            {/* <div
                                className="absolute inset-0"
                                style={{
                                    backgroundColor: "white",
                                    opacity: '70%',
                                    zIndex: 1,
                                    borderRadius: "8px"
                                }}
                            ></div> */}
                            <div className="z-10 relative p-4">
                                {currentView === 'ORDERS' && <OrdersViewConnected restaurantId={restaurantId} />}
                                {currentView === 'MENU' && <MenuViewConnected restaurantId={restaurantId} activeTab={menuTab} setActiveTab={setMenuTab} />}
                                {currentView === 'EARNINGS' && <EarningsViewConnected restaurantId={restaurantId} />}
                                {currentView === 'MY RESTAURANT' && <MyRestaurantViewConnected restaurantId={restaurantId} myRestaurantTab={myRestaurantTab} setMyRestaurantTab={setMyRestaurantTab} />}
                                {currentView === 'TEAM MANAGEMENT' && <TeamManagementView />}
                                {currentView === 'ACCOUNT' && <AccountView />}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
