"use client"

import { useState } from "react"
import Image from "next/image"
import { User, ShoppingBasket, ChevronDown, Menu } from "lucide-react"
import LoginModal from "./login-modal"

export default function SiteHeader() {
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const [languageOpen, setLanguageOpen] = useState(false)
    const [currentLanguage, setCurrentLanguage] = useState("ENGLISH")

    const languages = ["ENGLISH", "DEUTSCH", "FRANÇAIS", "ESPAÑOL"]

    // Updated icon style: white background, no rounded corners, brownish-orange icon
    const iconButtonStyle = "bg-white p-2 text-amber-800 hover:bg-gray-100 transition duration-200"
    const languageButtonStyle = "flex items-center gap-1 text-white hover:text-yellow-200 text-sm font-medium transition duration-200"

    return (
        <header className="w-full z-30 pt-4 pb-12 md:pt-6 md:pb-16 px-3 md:px-4 flex justify-center items-center">
            {/* Center Section with Logo and Icons */}
            <div className="flex items-center gap-4 md:gap-6">
                {/* User Icon */}
                <button
                    onClick={() => setLoginModalOpen(true)}
                    className={iconButtonStyle}
                    aria-label="Login"
                >
                    <User size={20} />
                </button>

                {/* Logo */}
                <div className="relative w-14 h-14 md:w-20 md:h-20">
                    <Image
                        src="/images/logo.png"
                        alt="Eat African Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Shopping Cart */}
                <button
                    className={iconButtonStyle}
                    aria-label="Shopping Cart"
                >
                    <ShoppingBasket size={20} />
                </button>
            </div>

            {/* Language Selector - Absolute positioned to top right */}
            <div className="absolute right-3 md:right-6 top-4 md:top-6">
                <div className="relative">
                    <button
                        onClick={() => setLanguageOpen(!languageOpen)}
                        className={languageButtonStyle}
                    >
                        {currentLanguage} <ChevronDown size={18} strokeWidth={3} />
                    </button>

                    {languageOpen && (
                        <div className="absolute right-0 mt-1 bg-black/80 backdrop-blur-sm rounded shadow-lg py-1 w-32 md:w-36 z-40">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    className={`block w-full text-left px-3 py-1.5 text-xs md:text-sm hover:bg-white/10 ${currentLanguage === lang ? "text-amber-400" : "text-white"
                                        }`}
                                    onClick={() => {
                                        setCurrentLanguage(lang)
                                        setLanguageOpen(false)
                                    }}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Login Modal */}
            <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
        </header>
    )
} 