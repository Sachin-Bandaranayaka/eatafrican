"use client"

import { LocationProvider } from "@/lib/location-context"
import ClientOnly from "@/components/client-only"
import type React from "react"

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    return (
        <LocationProvider>
            {children}
        </LocationProvider>
    )
} 