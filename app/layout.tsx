import type { Metadata } from "next"
import "./globals.css"
import ClientWrapper from "@/components/client-wrapper"
import type React from "react"
import BackgroundCollage from "@/app/components/background-collage"

export const metadata: Metadata = {
  title: "African Restaurant",
  description: "Order freshly prepared African food directly from African restaurants and have it conveniently delivered to your home",
  generator: 'next.js'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        <BackgroundCollage />
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}