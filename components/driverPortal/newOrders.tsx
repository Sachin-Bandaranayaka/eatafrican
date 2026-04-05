"use client";

import { DriverOrdersSectionView } from "./ordersSectionShared";

interface NewOrdersProps {
    onOpenOrderDetails: (order: any) => void;
}

export default function NewOrders({ onOpenOrderDetails }: NewOrdersProps) {
    return <DriverOrdersSectionView mode="new" onOpenOrderDetails={onOpenOrderDetails} />;
}
