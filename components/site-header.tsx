"use client"

import { useState } from "react"
import Image from "next/image"
import { User, ChevronDown } from "lucide-react"
import LoginModal from "./login-modal"
import LoginModalTest from "./login-modal-test"
import { CartComponent } from "./cart"

export default function SiteHeader() {
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [loginModalTestOpen, setLoginModalTestOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("ENGLISH")
  const [cartOpen, setCartOpen] = useState(false)

  const languages = ["ENGLISH", "DEUTSCH", "FRANÇAIS", "ESPAÑOL"]

  const iconButtonStyle =
    "bg-white p-2 text-amber-800 hover:bg-gray-100 transition duration-200 border-2 border-transparent"

  const languageButtonStyle =
    "flex items-center gap-1 text-white hover:text-yellow-200 text-sm font-medium transition duration-200"

  return (
    <header className="w-full z-30 pt-0 pb-12 md:pt-0 md:pb-4 px-3 md:px-4 flex justify-between items-center">
      {/* Left section with Logo and Language Selector */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Logo */}
        <div className="relative w-14 h-14 md:w-20 md:h-20 mt-1">
          <div className="absolute inset-0 bg-[#8B0000] rounded-[10px] z-0 animate-heartbeat" />
          <div className="absolute inset-0 z-10 animate-heartbeat">
            <Image src="/images/logo.png" alt="Eat African Logo" fill className="object-contain" priority />
          </div>
        </div>

        <style jsx>{`
          @keyframes heartbeat {
            0%, 100% {
              transform: scale(1);
            }
            14% {
              transform: scale(1.15);
            }
            28% {
              transform: scale(1);
            }
            42% {
              transform: scale(1.15);
            }
            70% {
              transform: scale(1);
            }
          }
          .animate-heartbeat {
            animation: heartbeat 1.5s ease-in-out infinite;
          }
        `}</style>

        {/* Language Selector */}
        <div className="relative">
          <button onClick={() => setLanguageOpen(!languageOpen)} className={languageButtonStyle}>
            {currentLanguage} <ChevronDown size={18} strokeWidth={3} />
          </button>

          {languageOpen && (
            <div className="absolute left-0 mt-1 bg-black/80 backdrop-blur-sm rounded shadow-lg py-1 w-32 md:w-36 z-40">
              {languages.map((lang) => (
                <button
                  key={lang}
                  className={`block w-full text-left px-3 py-1.5 text-xs md:text-sm hover:bg-white/10 ${
                    currentLanguage === lang ? "text-amber-400" : "text-white"
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

      {/* Right Section with User Icon and Shopping Cart */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* login test */}
        <button
          onClick={() => {
            console.log("Test button clicked, opening test modal")
            setLoginModalTestOpen(true)
          }}
          className={iconButtonStyle}
          aria-label="test"
        >
          <User size={10} />
        </button>
        
        {/* User Icon */}
        <button
          onClick={() => {
            console.log("Login button clicked, opening modal")
            setLoginModalOpen(true)
          }}
          className={iconButtonStyle}
          aria-label="Login"
        >
          <User size={20} />
        </button>

        {/* Shopping Cart */}
        <button
          onClick={() => {
            console.log("Cart button clicked, opening cart")
            setCartOpen(true)
          }}
          className={iconButtonStyle}
          aria-label="Shopping Cart"
        >
          <img src="/images/cartButton.png" alt="Shopping Basket" style={{ width: 20, height: 20 }} />
        </button>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      
      {/* Login Modal Test */}
      <LoginModalTest isOpen={loginModalTestOpen} onClose={() => setLoginModalTestOpen(false)} />

      {/* Cart Component */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <CartComponent onClose={() => setCartOpen(false)} />
        </div>
      )}
    </header>
  )
}