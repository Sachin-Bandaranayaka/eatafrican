"use client";

import { DriverOrdersSectionView } from "./ordersSectionShared";

interface ScheduledOrdersProps {
    onOpenOrderDetails: (order: any) => void;
}

export default function ScheduledOrders({ onOpenOrderDetails }: ScheduledOrdersProps) {
    return <DriverOrdersSectionView mode="assigned" onOpenOrderDetails={onOpenOrderDetails} />;
}
