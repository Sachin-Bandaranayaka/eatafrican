// components\site-header.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, LogOut, User } from "lucide-react";
import LoginModal from "./login-modal";
import LoginModalTest from "./login-modal-test";
import { CartComponent } from "./cart-connected";
import { useLocationContext } from "@/lib/location-context";
import { useCart } from "@/lib/cart-context";
import type { Language } from "@/lib/translations";
import { getCurrentUser, logout } from "@/lib/auth/client";
import { getUserDisplayName, type User as AuthUser } from "@/lib/auth/utils";

interface SiteHeaderProps {
  onOpenDashboard?: () => void;
}

// Language mapping
const LANGUAGE_MAP: Record<string, { code: Language; display: string }> = {
  'en': { code: 'en', display: 'ENGLISH' },
  'de': { code: 'de', display: 'DEUTSCH' },
  'fr': { code: 'fr', display: 'FRANÇAIS' },
  'it': { code: 'it', display: 'ITALIANO' },
};

export default function SiteHeader({
  onOpenDashboard,
}: SiteHeaderProps) {
  const { locationInfo, setLanguage } = useLocationContext();
  const { getTotalItems } = useCart();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalTestOpen, setLoginModalTestOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  
  const cartItemCount = getTotalItems();

  // Check for logged-in user on mount and when localStorage changes
  useEffect(() => {
    const checkUser = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
    };

    checkUser();

    // Listen for storage changes (e.g., login in another tab)
    window.addEventListener('storage', checkUser);
    
    // Custom event for login/logout
    window.addEventListener('auth-change', checkUser);

    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('auth-change', checkUser);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setUserMenuOpen(false);
    window.location.href = '/';
  };

  const iconButtonStyle =
    "bg-white p-2 text-amber-800 hover:bg-gray-100 transition duration-200 border-2 border-transparent rounded-lg";

  const languageButtonStyle =
    "flex items-center gap-1 text-white hover:text-yellow-200 text-[10px] md:text-[15px] font-medium transition duration-200";

  const getLanguageCode = (lang: string) => lang.slice(0, 2).toUpperCase();

  // Get current language display name
  const currentLanguageDisplay = LANGUAGE_MAP[locationInfo.language as Language]?.display || 'EN';

  // Handle language change
  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setLanguageOpen(false);
  };

  return (
    <>
      <header className="w-full z-30 pt-0 pb-12 md:pt-0 md:pb-1 px-3 md:px-4 flex justify-between items-center">
        {/* Left section with Logo and Language Selector */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Logo */}
          <Link href="/" className="relative w-14 h-14 md:w-20 md:h-20 mt-1 -left-2 cursor-pointer">
            <div className="absolute inset-0 z-10 animate-heartbeat">
              <Image
                src="/images/EATAFRICANLOGO.png"
                alt="Eat African Logo"
                fill
                className="object-cover rounded-[10px]"
                priority
              />
            </div>
          </Link>
          {/* Language Selector */}
          <div className="relative">
            <button onClick={() => setLanguageOpen(!languageOpen)} className={languageButtonStyle}>
              {getLanguageCode(locationInfo.language)} <ChevronDown size={18} strokeWidth={3} />
            </button>
            {languageOpen && (
              <div className="absolute left-0 mt-1 bg-black/80 backdrop-blur-sm rounded shadow-lg py-1 w-auto md:w-36 z-40">
                {Object.entries(LANGUAGE_MAP).map(([code, { display }]) => (
                  <button
                    key={code}
                    className={`block w-full px-3 py-1.5 text-[10px] md:text-[15px] md:text-sm hover:bg-white/10 ${locationInfo.language === code ? "text-amber-400" : "text-white"
                      }`}
                    onClick={() => handleLanguageChange(code as Language)}
                  >
                    {display}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section with User Icon and Shopping Cart */}
        <div className="flex items-center gap-4 md:gap-2">
          {/* Dashboard btn */}
          <div className="md:mr-12">
            <button
              onClick={onOpenDashboard}
              className="bg-amber-900 text-white border border-amber-400 rounded-[8px] py-1 px-3 text-[8px] font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap inline-block"
              aria-label="Dashboard"
            >
              DASHBOARD
            </button>
          </div>
          
          {/* User Menu or Login Button */}
          {currentUser ? (
            <div className="relative md:mr-12">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="bg-amber-900 text-white border border-amber-400 rounded-[8px] py-1 px-3 text-[8px] font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap flex items-center gap-1"
                aria-label="User Menu"
              >
                <User size={12} />
                <span className="hidden md:inline">{getUserDisplayName(currentUser)}</span>
                <ChevronDown size={12} />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg py-2 w-48 z-40 border border-amber-400">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{currentUser.email}</p>
                    <p className="text-xs text-amber-600 capitalize">{currentUser.role.replace('_', ' ')}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="md:mr-12">
              <button
                onClick={() => {
                  setLoginModalOpen(true);
                }}
                className="bg-amber-900 text-white border border-amber-400 rounded-[8px] py-1 px-3 text-[8px] font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap"
                aria-label="Login"
              >
                LOGIN
              </button>
            </div>
          )}
          
          {/* Shopping Cart */}
          <button
            onClick={() => {
              setCartOpen(true);
            }}
            className={`${iconButtonStyle} relative`}
            aria-label="Shopping Cart"
          >
            <img src="/images/cartButton.png" alt="Shopping Basket" style={{ width: 20, height: 20 }} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                {cartItemCount}
              </span>
            )}
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