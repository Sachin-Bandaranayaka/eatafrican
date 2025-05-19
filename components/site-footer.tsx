"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import AboutUs from "../components/aboutUs";
import LegalNotice from "../components/legalNotice";
import Terms from "../components/termsConditions";
import ContactUs from "../components/contactUs";
import PrivacyPolicy from "../components/privacyPolicy";

type ModalContent = "about" | "contact" | "legal" | "privacy" | "termsConditions" | null;

export default function SiteFooter() {
  const [modalOpen, setModalOpen] = useState<ModalContent>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openModal = (content: ModalContent) => {
    setModalOpen(content);
  };

  const closeModal = () => {
    setModalOpen(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Desktop footer */}
      <footer className="footer-container hidden md:block py-6 mt-auto z-10">
        <div className="container mx-auto px-4 flex flex-wrap justify-center md:justify-between items-center">
          <div className="flex space-x-6 mb-2 md:mb-0">
            <button
              className="text-white hover:text-yellow-200 text-sm font-bold"
              onClick={() => openModal("about")}
            >
              ABOUT US
            </button>
            <button
              className="text-white hover:text-yellow-200 text-sm font-bold"
              onClick={() => openModal("contact")}
            >
              CONTACT US
            </button>
            <button
              className="text-white hover:text-yellow-200 text-sm font-bold"
              onClick={() => openModal("termsConditions")}
            >
              TERMS & CONDITIONS
            </button>
          </div>

          <div className="text-center mb-2 md:mb-0">
            <p className="text-white text-sm">© EAT AFRICAN 2025</p>
          </div>

          <div className="flex space-x-6">
            <button
              className="text-white hover:text-yellow-200 text-sm font-bold"
              onClick={() => openModal("privacy")}
            >
              PRIVACY POLICY
            </button>
            <button
              className="text-white hover:text-yellow-200 text-sm font-bold"
              onClick={() => openModal("legal")}
            >
              LEGAL NOTICE
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Footer Button (Hamburger) */}
      <div className="md:hidden fixed bottom-6 right-6 z-10">
        <button
          onClick={toggleMobileMenu}
          className="bg-tranperant rounded-full w-12 h-12 flex items-center justify-center text-white shadow-lg"
          aria-label="Open menu"
        >
          {mobileMenuOpen ? (
            <X size={24} />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Footer Popup Card */}
      {mobileMenuOpen && (
        <div className="fixed bottom-20 right-6 md:hidden z-50">
          <div className="bg-[#fff2ccff] rounded-lg shadow-xl overflow-hidden w-64 relative">
            <div className="flex">
              {/* Links Column */}
              <div className="p-5 flex flex-col space-y-3 text-gray-800 w-2/3">
                <button
                  className="text-left font-bold text-sm hover:text-amber-700"
                  onClick={() => {
                    openModal("about");
                    setMobileMenuOpen(false);
                  }}
                >
                  ABOUT US
                </button>
                <button
                  className="text-left font-bold text-sm hover:text-amber-700"
                  onClick={() => {
                    openModal("contact");
                    setMobileMenuOpen(false);
                  }}
                >
                  CONTACT US
                </button>
                <button
                  className="text-left font-bold text-sm hover:text-amber-700"
                  onClick={() => {
                    openModal("termsConditions");
                    setMobileMenuOpen(false);
                  }}
                >
                  TERMS & CONDITIONS
                </button>
                <button
                  className="text-left font-bold text-sm hover:text-amber-700"
                  onClick={() => {
                    openModal("legal");
                    setMobileMenuOpen(false);
                  }}
                >
                  LEGAL NOTICE
                </button>
                <button
                  className="text-left font-bold text-sm hover:text-amber-700"
                  onClick={() => {
                    openModal("privacy");
                    setMobileMenuOpen(false);
                  }}
                >
                  PRIVACY POLICY
                </button>
              </div>

              {/* Image */}
              <div className="relative w-1/3 bg-amber-600">
                <div className="absolute inset-0">
                  <Image
                    src="/images/chefs-cooking.jpg"
                    alt="African chefs cooking"
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </div>

            {/* Close button (X) */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-1 right-1 text-gray-700 hover:text-black bg-white/80 rounded-full w-5 h-5 flex items-center justify-center"
              aria-label="Close menu"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile footer copyright - Visible at the bottom */}
      <div className="bottom-0 fixed left-0 w-full text-gray-200 text-center p-1 text-xs md:hidden z-10">
        © EAT AFRICAN 2025
      </div>

      {/* Modals */}
      {modalOpen && (
        <>
          {modalOpen === "about" ? (
            <AboutUs isOpen={true} onClose={closeModal} />
          ) : modalOpen === "contact" ? (
            <ContactUs isOpen={true} onClose={closeModal} />
          ) : modalOpen === "legal" ? (
            <LegalNotice isOpen={true} onClose={closeModal} />
          ) : modalOpen === "termsConditions" ? (
            <Terms isOpen={true} onClose={closeModal} />
          ) : modalOpen === "privacy" ? (
            <PrivacyPolicy isOpen={true} onClose={closeModal} />
          ) : null}
        </>
      )}
    </>
  );
}