"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import OrderDetails from "./driverPortal/orderDetails";
import PickupDelivery from "./driverPortal/pickupDelivery";
import ConfirmPickup from "./driverPortal/confirmPickup";
import ConfirmedPickupMsg from "./driverPortal/confirmedPickupMsg";
import CustomerDelivery from "./driverPortal/customerDelivery";
import ConfirmDelivery from "./driverPortal/confirmDelivery";
import ConfirmedDeliveryMsg from "./driverPortal/confirmedDeliveryMsg";
import Account from "./driverPortal/account";
import Earnings from "./driverPortal/earnings";
import Overview from "./driverPortal/overview";
import NewOrders from "./driverPortal/newOrders";
import ScheduledOrders from "./driverPortal/scheduledOrders";
import History from "./driverPortal/history";
import {
    DRIVER_PORTAL_SECTION_QUERY_KEY,
    buildDriverPortalHref,
    getDriverPortalQueryState,
} from "./driverPortal/sectionContract";

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const dashboardRef = useRef<HTMLDivElement>(null);

    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);
    const [orderDetailsError, setOrderDetailsError] = useState<string | null>(null);

    const [showPickupDelivery, setShowPickupDelivery] = useState(false);
    const [showConfirmPickup, setShowConfirmPickup] = useState(false);
    const [showConfirmedPickup, setShowConfirmedPickup] = useState(false);
    const [showCustomerDelivery, setShowCustomerDelivery] = useState(false);
    const [showConfirmDelivery, setShowConfirmDelivery] = useState(false);
    const [showConfirmedDeliveryMsg, setShowConfirmedDeliveryMsg] = useState(false);

    const rawSection = searchParams.get(DRIVER_PORTAL_SECTION_QUERY_KEY);
    const { section, orderId } = getDriverPortalQueryState(searchParams);

    useEffect(() => {
        if (rawSection && rawSection !== section) {
            router.replace(buildDriverPortalHref(pathname, searchParams, { section }));
        }
    }, [pathname, rawSection, router, searchParams, section]);

    useEffect(() => {
        if (section === "new-deliveries") return;
        if (!orderId) return;

        router.replace(buildDriverPortalHref(pathname, searchParams, { section, orderId: null }));
    }, [orderId, pathname, router, searchParams, section]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        window.dispatchEvent(
            new CustomEvent("driver-portal:section-change", {
                detail: { section },
            }),
        );

        const w = window as typeof window & { dataLayer?: Array<Record<string, unknown>> };
        w.dataLayer?.push({
            event: "driver_portal_section_change",
            section,
        });
    }, [section]);

    useEffect(() => {
        if (section !== "new-deliveries" || !orderId) {
            setOrderDetailsLoading(false);
            setOrderDetailsError(null);
            return;
        }

        if (selectedOrder?.id === orderId) {
            setOrderDetailsLoading(false);
            setOrderDetailsError(null);
            return;
        }

        let isCancelled = false;

        const fetchOrderById = async () => {
            setOrderDetailsLoading(true);
            setOrderDetailsError(null);

            try {
                const token = localStorage.getItem("accessToken");
                const response = await fetch(`/api/orders/${orderId}`, {
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                });

                if (!response.ok) {
                    throw new Error("Unable to load order details.");
                }

                const data = await response.json();
                if (!isCancelled) {
                    setSelectedOrder(data.order ?? null);
                }
            } catch (error) {
                if (!isCancelled) {
                    console.error("Error loading order details from URL:", error);
                    setOrderDetailsError("Unable to load this order detail.");
                }
            } finally {
                if (!isCancelled) {
                    setOrderDetailsLoading(false);
                }
            }
        };

        fetchOrderById();

        return () => {
            isCancelled = true;
        };
    }, [orderId, section, selectedOrder?.id]);

    const resetDeliveryFlow = () => {
        setShowConfirmedDeliveryMsg(false);
        setShowConfirmDelivery(false);
        setShowCustomerDelivery(false);
        setShowConfirmedPickup(false);
        setShowConfirmPickup(false);
        setShowPickupDelivery(false);
    };

    const navigateToOrdersList = () => {
        router.push(buildDriverPortalHref(pathname, searchParams, { section: "new-deliveries", orderId: null }));
    };

    const handleOpenOrderDetails = (order: any) => {
        if (!order?.id) return;

        resetDeliveryFlow();
        setSelectedOrder(order);
        setOrderDetailsError(null);

        router.push(
            buildDriverPortalHref(pathname, searchParams, {
                section: "new-deliveries",
                orderId: String(order.id),
                preserveOrderId: true,
            }),
        );
    };

    const handleBackToOrders = () => {
        resetDeliveryFlow();
        setSelectedOrder(null);
        setOrderDetailsError(null);
        navigateToOrdersList();
    };

    const setShowOrderDetailsCompat: Dispatch<SetStateAction<boolean>> = (nextValue) => {
        const resolved = typeof nextValue === "function" ? nextValue(Boolean(orderId)) : nextValue;
        if (!resolved) {
            navigateToOrdersList();
        }
    };

    const refreshSelectedOrder = async () => {
        if (!selectedOrder?.id) return;

        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`/api/orders/${selectedOrder.id}`, {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (!response.ok) return;

            const data = await response.json();
            setSelectedOrder(data.order);
        } catch (error) {
            console.error("Error refreshing order:", error);
        }
    };

    const renderOrderDetailsView = () => {
        if (orderDetailsLoading) {
            return (
                <section className="flex flex-col space-y-3 z-10">
                    <div className="flex items-center justify-center w-full h-[80vh] mb-12 rounded-[8px] bg-white/70">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
                    </div>
                </section>
            );
        }

        if (orderDetailsError) {
            return (
                <section className="flex flex-col space-y-3 z-10">
                    <div className="flex flex-col items-center justify-center w-full h-[80vh] mb-12 rounded-[8px] bg-white/70 gap-3">
                        <p className="text-red-700 font-semibold">{orderDetailsError}</p>
                        <button
                            onClick={navigateToOrdersList}
                            className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-1 px-3 rounded text-xs"
                        >
                            Back to New Orders
                        </button>
                    </div>
                </section>
            );
        }

        return (
            <OrderDetails
                order={selectedOrder}
                setShowOrderDetails={setShowOrderDetailsCompat}
                setShowPickupDelivery={setShowPickupDelivery}
                refreshOrder={refreshSelectedOrder}
            />
        );
    };

    const renderCurrentView = () => {
        if (showConfirmedDeliveryMsg) {
            return <ConfirmedDeliveryMsg onBackToOrders={handleBackToOrders} />;
        }

        if (showConfirmDelivery) {
            return (
                <ConfirmDelivery
                    order={selectedOrder}
                    setShowConfirmDelivery={setShowConfirmDelivery}
                    setShowConfirmedDeliveryMsg={setShowConfirmedDeliveryMsg}
                    refreshOrder={refreshSelectedOrder}
                />
            );
        }

        if (showCustomerDelivery) {
            return (
                <CustomerDelivery
                    order={selectedOrder}
                    setShowCustomerDelivery={setShowCustomerDelivery}
                    setShowConfirmDelivery={setShowConfirmDelivery}
                />
            );
        }

        if (showConfirmedPickup) {
            return (
                <ConfirmedPickupMsg
                    order={selectedOrder}
                    setShowConfirmedPickup={setShowConfirmedPickup}
                    setShowCustomerDelivery={setShowCustomerDelivery}
                />
            );
        }

        if (showConfirmPickup) {
            return (
                <ConfirmPickup
                    order={selectedOrder}
                    setShowConfirmPickup={setShowConfirmPickup}
                    setShowConfirmedPickup={setShowConfirmedPickup}
                    refreshOrder={refreshSelectedOrder}
                />
            );
        }

        if (showPickupDelivery) {
            return (
                <PickupDelivery
                    order={selectedOrder}
                    setShowPickupDelivery={setShowPickupDelivery}
                    setShowConfirmPickup={setShowConfirmPickup}
                    refreshOrder={refreshSelectedOrder}
                />
            );
        }

        if (section === "new-deliveries" && orderId) {
            return renderOrderDetailsView();
        }

        switch (section) {
            case "overview":
                return <Overview />;
            case "new-deliveries":
                return <NewOrders onOpenOrderDetails={handleOpenOrderDetails} />;
            case "scheduled":
                return <ScheduledOrders onOpenOrderDetails={handleOpenOrderDetails} />;
            case "history":
                return <History onOpenOrderDetails={handleOpenOrderDetails} />;
            case "earnings":
                return <Earnings />;
            case "account":
                return <Account />;
            default:
                return <Overview />;
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div
                ref={dashboardRef}
                className="z-0 w-full md:w-1/2 h-[85vh] bg-transparent xs:p-6 flex flex-col md:flex-row space-y-4 xs:space-y-6 md:space-y-0 md:space-x-6 font-sans text-gray-900 -mt-[80%] md:mt-0 ml-0 md:ml-3"
            >
                <main className="w-full h-[90vh] p-2 md:p-0 flex flex-col space-y-4 xs:space-y-6">
                    {renderCurrentView()}
                </main>
            </div>
        </div>
    );
}
