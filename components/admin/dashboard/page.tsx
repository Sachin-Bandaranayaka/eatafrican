"use client";
import { useState, useRef, useEffect } from "react";
import RestaurantList from "./components/restaurant-list";
import Header from "./components/common/Header";
import OrdersView from "./components/views/OrdersView";
import MenuView from "./components/views/MenuView";
import EarningsView from "./components/views/EarningsView";
import MyRestaurantView from "./components/views/MyRestaurantView";
import TeamManagementView from "./components/views/TeamManagementView";
import AccountView from "./components/views/AccountView";

export default function AdminDashboardPage() {
    const [showRestaurantList, setShowRestaurantList] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentView, setCurrentView] = useState('ORDERS'); // Default view
    const dashboardRef = useRef<HTMLDivElement>(null);

    // This state and the associated effect were in the original code but are not used.
    // Kept here to ensure no code is missing.
    const [showArrow, setShowArrow] = useState(false);
    useEffect(() => {
        const checkOverflow = () => {
            if (dashboardRef.current) {
                const isOverflowing = dashboardRef.current.scrollHeight > window.innerHeight;
                setShowArrow(isOverflowing);
            }
        };
        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [showRestaurantList, currentView]);


    return (
        <>
            <div className="flex flex-col justify-center items-center w-full">
                <div
                    ref={dashboardRef}
                    className="z-0 w-1/2 h-[85vh] bg-transparent xs:p-6 flex flex-col md:flex-row space-y-4 xs:space-y-6 md:space-y-0 md:space-x-6 font-sans text-gray-900 -mt-[80%] md:mt-0 ml-3"
                >
                    {showRestaurantList ? (
                        <RestaurantList />
                    ) : (
                        <main className="w-full h-[90vh] p-2 md:p-0 flex flex-col space-y-4 xs:space-y-6">
                            <Header
                                currentView={currentView}
                                setCurrentView={setCurrentView}
                                isDropdownOpen={isDropdownOpen}
                                setIsDropdownOpen={setIsDropdownOpen}
                            />
                            <section className="flex flex-col space-y-3 z-10">
                                <div className="flex flex-col w-full h-[80vh] mb-12 shadow-md overflow-hidden border-2 border-[#f1c232] relative -mt-2 rounded-[8px] ">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            backgroundColor: "white",
                                            opacity: '70%',
                                            zIndex: 1,
                                            borderRadius: "8px"
                                        }}
                                    ></div>
                                    <div className="z-10 relative p-4">
                                        {currentView === 'ORDERS' && <OrdersView />}
                                        {currentView === 'MENU' && <MenuView />}
                                        {currentView === 'EARNINGS' && <EarningsView />}
                                        {currentView === 'MY RESTAURANT' && <MyRestaurantView />}
                                        {currentView === 'TEAM MANAGEMENT' && <TeamManagementView />}
                                        {currentView === 'ACCOUNT' && <AccountView />}
                                    </div>
                                </div>
                            </section>
                        </main>
                    )}
                </div>
            </div >
        </>
    );
}