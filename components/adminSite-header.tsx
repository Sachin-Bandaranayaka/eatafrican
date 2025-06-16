"use client";

import { useState } from "react";
import Image from "next/image";
import LoginModal from "./login-modal";
import LoginModalTest from "./login-modal-test";
import { CartComponent } from "./cart";

interface AdminSiteHeaderProps {
  onToggleAdminDashboard: () => void; // Added prop to toggle admin view
}

export default function AdminSiteHeader({ onToggleAdminDashboard }: AdminSiteHeaderProps) {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalTestOpen, setLoginModalTestOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

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
        </div>

        {/* Right Section with User Icon and Shopping Cart */}
        <div className="flex items-center gap-4 md:gap-2">
          {/* Logout btn */}
          <div className="md:mr-12">
            <button
              onClick={onToggleAdminDashboard} // Switches back to the main site
              className="bg-amber-900 text-white border border-amber-400 rounded-[8px] py-1 px-3 text-[8px] font-semibold hover:bg-red-800 transition duration-200 whitespace-nowrap"
              aria-label="Logout"
            >
              LOGOUT
            </button>
          </div>
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