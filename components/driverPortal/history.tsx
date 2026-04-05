"use client";

import { DriverOrdersSectionView } from "./ordersSectionShared";

interface HistoryProps {
    onOpenOrderDetails: (order: any) => void;
}

export default function History({ onOpenOrderDetails }: HistoryProps) {
    return <DriverOrdersSectionView mode="history" onOpenOrderDetails={onOpenOrderDetails} />;
}
