"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type ModalContent = "about" | "contact" | "legal" | "privacy" | null;

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
            <footer className="footer-container hidden md:block py-6 mt-auto">
                <div className="container mx-auto px-4 flex flex-wrap justify-center md:justify-between items-center">
                    <div className="flex space-x-6 mb-2 md:mb-0">
                        <button
                            className="text-white hover:text-yellow-200 text-sm font-medium"
                            onClick={() => openModal("about")}
                        >
                            ABOUT US
                        </button>
                        <button
                            className="text-white hover:text-yellow-200 text-sm font-medium"
                            onClick={() => openModal("contact")}
                        >
                            CONTACT US
                        </button>
                    </div>

                    <div className="text-center mb-2 md:mb-0">
                        <p className="text-white text-sm">© EAT AFRICAN 2025</p>
                    </div>

                    <div className="flex space-x-6">
                        <button
                            className="text-white hover:text-yellow-200 text-sm font-medium"
                            onClick={() => openModal("privacy")}
                        >
                            PRIVACY POLICY
                        </button>
                        <button
                            className="text-white hover:text-yellow-200 text-sm font-medium"
                            onClick={() => openModal("legal")}
                        >
                            LEGAL NOTICE
                        </button>
                    </div>
                </div>
            </footer>

            {/* Mobile Footer Button (Hamburger) */}
            <div className="md:hidden fixed bottom-6 right-6 z-50">
                <button
                    onClick={toggleMobileMenu}
                    className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center text-white shadow-lg"
                    aria-label="Open menu"
                >
                    {mobileMenuOpen ? (
                        <X size={24} />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
                                    className="text-left font-medium text-sm hover:text-amber-700"
                                    onClick={() => { openModal("about"); setMobileMenuOpen(false); }}
                                >
                                    ABOUT US
                                </button>
                                <button
                                    className="text-left font-medium text-sm hover:text-amber-700"
                                    onClick={() => { openModal("contact"); setMobileMenuOpen(false); }}
                                >
                                    CONTACT US
                                </button>
                                <button
                                    className="text-left font-medium text-sm hover:text-amber-700"
                                    onClick={() => { openModal("legal"); setMobileMenuOpen(false); }}
                                >
                                    LEGAL NOTICE
                                </button>
                                <button
                                    className="text-left font-medium text-sm hover:text-amber-700"
                                    onClick={() => { openModal("privacy"); setMobileMenuOpen(false); }}
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
            <div className="fixed bottom-0 left-0 w-full text-gray-200 text-center p-1 text-xs md:hidden z-40">
                © EAT AFRICAN 2025
            </div>

            {/* Modals */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container relative max-w-2xl">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-white hover:text-gray-200"
                            aria-label="Close"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-white text-xl font-bold">
                                {modalOpen === "about" && "ABOUT US"}
                                {modalOpen === "contact" && "CONTACT US"}
                                {modalOpen === "privacy" && "PRIVACY POLICY"}
                                {modalOpen === "legal" && "LEGAL NOTICE"}
                            </h2>
                            <div className="relative w-32 h-32">
                                <Image
                                    src="/images/chefs-cooking.jpg"
                                    alt="Chefs"
                                    fill
                                    className="object-cover rounded-md"
                                />
                            </div>
                        </div>

                        <div className="text-white">
                            {modalOpen === "about" && (
                                <div>
                                    <p className="mb-4">
                                        Eat African is a platform connecting food lovers with authentic African restaurants across Switzerland, Germany and France.
                                    </p>
                                    <p className="mb-4">
                                        Our mission is to bring the rich and diverse flavors of African cuisine directly to your doorstep. We partner with the best African restaurants to ensure you get an authentic taste experience.
                                    </p>
                                    <p>
                                        Founded in 2023, we've been growing our network of restaurants and delivery partners to serve more locations across Europe.
                                    </p>
                                </div>
                            )}

                            {modalOpen === "contact" && (
                                <div>
                                    <p className="mb-4">Get in touch with our team:</p>
                                    <ul className="space-y-2">
                                        <li><strong>Email:</strong> info@eatafrican.com</li>
                                        <li><strong>Phone:</strong> +41 123 456 789</li>
                                        <li><strong>Address:</strong> Bahnhofstrasse 123, 8001 Zürich, Switzerland</li>
                                    </ul>
                                    <p className="mt-4">Our customer service is available Monday to Friday, 9:00 - 17:00.</p>
                                </div>
                            )}

                            {modalOpen === "privacy" && (
                                <div>
                                    <p className="mb-4">
                                        Eat African respects your privacy and is committed to protecting your personal data.
                                    </p>
                                    <p className="mb-4">
                                        We collect your personal information to process your orders, provide customer support, and improve our services. We do not sell your data to third parties.
                                    </p>
                                    <p>
                                        By using our service, you consent to our privacy policy. For more information on how we process your data, please contact us.
                                    </p>
                                </div>
                            )}

                            {modalOpen === "legal" && (
                                <div>
                                    <p className="mb-4">
                                        Eat African GmbH is a registered company in Switzerland, CHE-123.456.789.
                                    </p>
                                    <p className="mb-4">
                                        All content on this website, including text, graphics, logos, and images, is the property of Eat African GmbH and is protected by copyright laws.
                                    </p>
                                    <p>
                                        For any legal inquiries, please contact our legal department at legal@eatafrican.com.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 