"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useLocationContext } from "@/lib/location-context"
import LocationSelection from "@/components/location-selection"
import HowItWorks from "@/components/how-it-works"
import DeliveryGuide from "@/components/delivery-guide"
import SiteFooter from "@/components/site-footer"
import SiteHeader from "@/components/site-header"
import ClientOnly from "@/components/client-only"

export default function Home() {
  const [howItWorksOpen, setHowItWorksOpen] = useState(false)
  const [deliveryGuideOpen, setDeliveryGuideOpen] = useState(false)

  // Get location context and translations
  const { t } = useLocationContext()

  return (
    <ClientOnly>
      <main className="relative w-full min-h-screen overflow-hidden">
        {/* Content Overlay */}
        <div className="relative z-20 flex flex-col min-h-screen">
          {/* Header with user icon and language selector */}
          <SiteHeader />

          {/* Main Content Area - Adjusted for better spacing */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 pb-12 md:pb-16">
            {/* Heading Text */}
            <div className="text-center max-w-xl mb-8 md:mb-10">
              <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                {t('order_food_title')}
              </h1>
              <p className="text-white text-base md:text-lg">
                {t('delivery_subtitle')}
              </p>
            </div>

            {/* Location Selection Box */}
            <LocationSelection />

            {/* How It Works & Delivery Guide Sections */}
            <div className="flex flex-col md:flex-row gap-4 mt-10 md:mt-12 w-full max-w-md md:max-w-lg justify-center">
              <button
                onClick={() => setHowItWorksOpen(true)}
                className="flex items-center justify-center gap-2 text-white text-sm p-3 hover:text-amber-200 transition duration-200 w-full md:w-auto"
              >
                <span className="font-bold">❯</span>
                HOW IT WORKS
              </button>

              <button
                onClick={() => setDeliveryGuideOpen(true)}
                className="flex items-center justify-center gap-2 text-white text-sm p-3 hover:text-amber-200 transition duration-200 w-full md:w-auto"
              >
                <span className="font-bold">❯</span>
                DELIVERY GUIDE
              </button>
            </div>
          </div>

          {/* Footer */}
          <SiteFooter />
        </div>

        {/* Modals */}
        <HowItWorks
          isOpen={howItWorksOpen}
          onClose={() => setHowItWorksOpen(false)}
        />

        <DeliveryGuide
          isOpen={deliveryGuideOpen}
          onClose={() => setDeliveryGuideOpen(false)}
        />
      </main>
    </ClientOnly>
  )
}

