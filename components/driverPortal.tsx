"use client";

import { useState, useRef } from "react";
import Header from "./driverPortal/Header";
import OrdersSection from "./driverPortal/OrdersSection";
import OrderDetails from "./driverPortal/orderDetails";
import PickupDelivery from "./driverPortal/pickupDelivery";
import ConfirmPickup from "./driverPortal/confirmPickup";
import ConfirmedPickupMsg from "./driverPortal/confirmedPickupMsg";
import CustomerDelivery from "./driverPortal/customerDelivery";
import ConfirmDelivery from "./driverPortal/confirmDelivery";
import ConfirmedDeliveryMsg from "./driverPortal/confirmedDeliveryMsg";
import Account from "./driverPortal/account"; // Import the Account component
import Earnings from "./driverPortal/earnings"; // Import the Earnings component

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentView, setCurrentView] = useState('ORDERS');

    // State management for the full delivery flow
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [showPickupDelivery, setShowPickupDelivery] = useState(false);
    const [showConfirmPickup, setShowConfirmPickup] = useState(false);
    const [showConfirmedPickup, setShowConfirmedPickup] = useState(false);
    const [showCustomerDelivery, setShowCustomerDelivery] = useState(false);
    const [showConfirmDelivery, setShowConfirmDelivery] = useState(false);
    const [showConfirmedDeliveryMsg, setShowConfirmedDeliveryMsg] = useState(false);

    const dashboardRef = useRef<HTMLDivElement>(null);

    // Function to reset all flow states and return to the main orders view
    const handleBackToOrders = () => {
        setShowConfirmedDeliveryMsg(false);
        setShowConfirmDelivery(false);
        setShowCustomerDelivery(false);
        setShowConfirmedPickup(false);
        setShowConfirmPickup(false);
        setShowPickupDelivery(false);
        setShowOrderDetails(false);
        setCurrentView('ORDERS');
    };

    const renderCurrentView = () => {
        // The order of these checks is important to show the correct screen.
        // The flow proceeds from the last step to the first.
        if (showConfirmedDeliveryMsg) {
            return <ConfirmedDeliveryMsg onBackToOrders={handleBackToOrders} />;
        }
        if (showConfirmDelivery) {
            return <ConfirmDelivery
                setShowConfirmDelivery={setShowConfirmDelivery}
                setShowConfirmedDeliveryMsg={setShowConfirmedDeliveryMsg}
            />;
        }
        if (showCustomerDelivery) {
            return <CustomerDelivery
                setShowCustomerDelivery={setShowCustomerDelivery}
                setShowConfirmDelivery={setShowConfirmDelivery}
            />;
        }
        if (showConfirmedPickup) {
            return <ConfirmedPickupMsg
                setShowConfirmedPickup={setShowConfirmedPickup}
                setShowCustomerDelivery={setShowCustomerDelivery}
            />;
        }
        if (showConfirmPickup) {
            return <ConfirmPickup
                setShowConfirmPickup={setShowConfirmPickup}
                setShowConfirmedPickup={setShowConfirmedPickup}
            />;
        }
        if (showPickupDelivery) {
            return <PickupDelivery
                setShowPickupDelivery={setShowPickupDelivery}
                setShowConfirmPickup={setShowConfirmPickup}
            />;
        }
        if (showOrderDetails) {
            return <OrderDetails
                setShowOrderDetails={setShowOrderDetails}
                setShowPickupDelivery={setShowPickupDelivery}
            />;
        }

        switch (currentView) {
            case 'ORDERS':
                return <OrdersSection setShowOrderDetails={setShowOrderDetails} />;
            case 'ACCOUNT': // Added case for Account
                return <Account />;
            case 'EARNINGS': // Added case for Earnings
                return <Earnings />;
            default:
                return <OrdersSection setShowOrderDetails={setShowOrderDetails} />;
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div
                ref={dashboardRef}
                className="z-0 w-1/2 h-[85vh] bg-transparent xs:p-6 flex flex-col md:flex-row space-y-4 xs:space-y-6 md:space-y-0 md:space-x-6 font-sans text-gray-900 -mt-[80%] md:mt-0 ml-3"
            >
                <main className="w-full h-[90vh] p-2 md:p-0 flex flex-col space-y-4 xs:space-y-6">
                    <Header
                        currentView={currentView}
                        isDropdownOpen={isDropdownOpen}
                        setIsDropdownOpen={setIsDropdownOpen}
                        setCurrentView={setCurrentView}
                    />
                    {renderCurrentView()}
                </main>
            </div>
        </div>
    );
}