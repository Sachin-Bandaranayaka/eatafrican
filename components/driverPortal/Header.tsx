"use client";

import { Dispatch, SetStateAction } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CustomDropdown from "../../app/components/DropDown";
import {
    DRIVER_PORTAL_ORDER_ID_QUERY_KEY,
    DRIVER_PORTAL_SECTION_QUERY_KEY,
    DriverPortalSection,
    getDriverPortalSection,
} from "./sectionContract";

// Define the types for the props
interface HeaderProps {
    currentView?: string;
    setCurrentView?: Dispatch<SetStateAction<string>>;
    isDropdownOpen?: boolean;
    setIsDropdownOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function Header({ currentView, setCurrentView }: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const section = getDriverPortalSection(searchParams.get(DRIVER_PORTAL_SECTION_QUERY_KEY));
    const sectionItems: { section: DriverPortalSection; label: string }[] = [
        { section: "overview", label: "OVERVIEW" },
        { section: "new-deliveries", label: "NEW" },
        { section: "scheduled", label: "SCHEDULED" },
        { section: "history", label: "HISTORY" },
        { section: "earnings", label: "EARNINGS" },
        { section: "account", label: "ACCOUNT" },
    ];
    const activeLabel = sectionItems.find((item) => item.section === section)?.label ?? "OVERVIEW";

    const navigateToSection = (nextSection: DriverPortalSection) => {
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.set(DRIVER_PORTAL_SECTION_QUERY_KEY, nextSection);

        if (nextSection !== "new-deliveries") {
            nextParams.delete(DRIVER_PORTAL_ORDER_ID_QUERY_KEY);
        }

        const query = nextParams.toString();
        router.push(query ? `${pathname}?${query}` : pathname);

        if (setCurrentView) {
            setCurrentView(mapSectionToLegacyView(nextSection));
        }

    };

    const handleOptionSelect = (selectedLabel: string) => {
        const selectedItem = sectionItems.find((item) => item.label === selectedLabel);
        if (!selectedItem) return;
        navigateToSection(selectedItem.section);
    };

    return (
        <header className="absolute top-44 left-1 z-40">
            <CustomDropdown
                options={sectionItems.map((item) => item.label)}
                defaultOption={activeLabel || currentView || "OVERVIEW"}
                backgroundColor="#14532d"
                textColor="#FFFFFF"
                width="160px"
                onOptionSelect={handleOptionSelect}
            />
        </header>
    );
}

function mapSectionToLegacyView(section: DriverPortalSection): string {
    switch (section) {
        case "account":
            return "ACCOUNT";
        case "earnings":
            return "EARNINGS";
        default:
            return "ORDERS";
    }
}
