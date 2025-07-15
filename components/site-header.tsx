"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import LoginModal from "./login-modal";
import LoginModalTest from "./login-modal-test";
import { CartComponent } from "./cart";

interface SiteHeaderProps {
  onOpenDashboard: () => void;
  onShowAdminDashboard: () => void; // Prop for the dashboard view
  onShowAdminLogin: () => void;     // Prop for the admin login view
  onShowDriverPortal: () => void;    // Prop for the driver portal view
}

export default function SiteHeader({
  onOpenDashboard,
  onShowAdminDashboard,
  onShowAdminLogin,
  onShowDriverPortal, // Destructure the new prop
}: SiteHeaderProps) {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalTestOpen, setLoginModalTestOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("ENGLISH");
  const [cartOpen, setCartOpen] = useState(false);

  const languages = ["ENGLISH", "DEUTSCH", "FRANÇAIS", "ESPAÑOL"];

  const iconButtonStyle =
    "bg-white p-2 text-amber-800 hover:bg-gray-100 transition duration-200 border-2 border-transparent rounded-lg";

  const languageButtonStyle =
    "flex items-center gap-1 text-white hover:text-yellow-200 text-[10px] md:text-[15px] font-medium transition duration-200";

  const getLanguageCode = (lang: string) => lang.slice(0, 2).toUpperCase();

  return (
    <>
      <header className="w-full z-30 pt-0 pb-12 md:pt-0 md:pb-1 px-3 md:px-4 flex justify-between items-center">
        {/* Left section with Logo and Language Selector */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Logo */}
          <div className="relative w-14 h-14 md:w-20 md:h-20 mt-1 -left-2">
            <div className="absolute inset-0 z-10 animate-heartbeat">
              <Image
                src="/images/EATAFRICANLOGO.png"
                alt="Eat African Logo"
                fill
                className="object-cover rounded-[10px]"
                priority
              />
            </div>
          </div>
          {/* Language Selector */}
          <div className="relative">
            <button onClick={() => setLanguageOpen(!languageOpen)} className={languageButtonStyle}>
              {getLanguageCode(currentLanguage)} <ChevronDown size={18} strokeWidth={3} />
            </button>
            {languageOpen && (
              <div className="absolute left-0 mt-1 bg-black/80 backdrop-blur-sm rounded shadow-lg py-1 w-auto md:w-36 z-40">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    className={`block w-full px-3 py-1.5 text-[10px] md:text-[15px] md:text-sm hover:bg-white/10 ${currentLanguage === lang ? "text-amber-400" : "text-white"
                      }`}
                    onClick={() => {
                      setCurrentLanguage(lang);
                      setLanguageOpen(false);
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          {/* admin dashboard */}
          {/* <div className="hidden md:block relative w-12 max-w-[400px]">
            <button
              onClick={onShowAdminDashboard} // Triggers the dashboard view
              className="bg-white text-black border border-amber-400 rounded-[8px] py-1 px-3 text-[10px] font-semibold  transition duration-200 whitespace-nowrap"
              aria-label="Dashboard"
            >
              DASHBOARD testing
            </button>
          </div> */}
        </div>

        <div>
          {/* driver portal */}
          {/* <div className="hidden md:block relative w-12 max-w-[400px]">
            <button
              onClick={onShowDriverPortal} // <-- ADDED ONCLICK HANDLER
              className="bg-white text-black border border-amber-400 rounded-[8px] py-1 px-3 text-[10px] font-semibold  transition duration-200 whitespace-nowrap"
              aria-label="Driver Portal"
            >
              DRIVER PORTAL login test
            </button>
          </div> */}
        </div>

        <div>
          {/* admin login */}
          {/* <div className="hidden md:block relative w-12 max-w-[400px]">
            <button
              onClick={onShowAdminLogin} // Triggers the admin login view
              className="bg-black text-white border rounded-[8px] py-1 px-3 text-[10px] font-semibold  transition duration-200 whitespace-nowrap"
              aria-label="Admin Login"
            >
              Admin login testing
            </button>
          </div> */}
        </div>

        {/* Right Section with User Icon and Shopping Cart */}
        <div className="flex items-center gap-4 md:gap-2">
          {/* Dashboard btn */}
          <div className="md:mr-12">
            <button
              onClick={() => {
                console.log("Dashboard button clicked, opening dashboard");
                onOpenDashboard();
              }}
              className="bg-amber-900 text-white border border-amber-400 rounded-[8px] py-1 px-3 text-[8px] font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap"
              aria-label="Dashboard"
            >
              DASHBOARD
            </button>
          </div>
          {/* Login btn */}
          <div className="md:mr-12">
            <button
              onClick={() => {
                console.log("Login button clicked, opening modal");
                setLoginModalOpen(true);
              }}
              className="bg-amber-900 text-white border border-amber-400 rounded-[8px] py-1 px-3 text-[8px] font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap"
              aria-label="Login"
            >
              LOGIN
            </button>
          </div>
          {/* Shopping Cart */}
          <button
            onClick={() => {
              console.log("Cart button clicked, opening cart");
              setCartOpen(true);
            }}
            className={iconButtonStyle}
            aria-label="Shopping Cart"
          >
            <img src="/images/cartButton.png" alt="Shopping Basket" style={{ width: 20, height: 20 }} />
          </button>
        </div>
      </header>
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
    </>
  );
}