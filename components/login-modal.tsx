"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
}

type ModalView = 'login' | 'register' | 'forgotPassword' | 'loginSuccess' | 'registerSuccess' | 'resetSent';

// Helper component for consistent modal layout - UPDATED
const ModalWrapper: React.FC<{ children: React.ReactNode; onClose: () => void; title: string }> = ({ children, onClose, title }) => (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        {/* Outer container for positioning chef */}
        <div className="relative">
            {/* Main Modal Box - Lighter background */}
            <div className="relative bg-amber-600 rounded-lg w-full max-w-3xl overflow-visible shadow-xl">
                {/* Top-right chef group image - moved behind everything */}
                <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                    <div className="absolute top-10 right-10 w-72 h-72 pointer-events-none">
                        <Image
                            src="/images/login-group-chef.png"
                            alt="Group of African chefs"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Close Button - Positioned relative to the amber box */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white z-20 hover:text-amber-200"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                {/* Title Section - Now inside the modal */}
                <div className="pt-5 pl-0 z-10 relative">
                    <h2 className="text-xl font-bold text-white bg-amber-900 py-2 px-8 pr-12 rounded-r-full rounded-l-none shadow-md uppercase inline-block">
                        {title}
                    </h2>
                </div>

                {/* Inner Content Area - Adjusted padding */}
                <div className="flex flex-col md:flex-row pt-5 p-4 md:p-6 relative z-10">
                    {/* Children will now contain both form and right-side info for login view */}
                    {children}
                </div>
            </div>

            {/* Chef image - Positioned bottom-left relative to outer container */}
            <div className="absolute bottom-2 left-2 w-36 h-52 pointer-events-none z-20">
                <Image
                    src="/images/login-person.png"
                    alt="African chef"
                    fill
                    className="object-contain object-bottom"
                />
            </div>
        </div>
    </div>
);

// Separate wrapper for success messages which have a different layout
const SuccessModalWrapper: React.FC<{ children: React.ReactNode; onClose: () => void; title: string }> = ({ children, onClose, title }) => (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="relative bg-amber-700 rounded-lg w-full max-w-xl overflow-hidden">
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-white z-10 hover:text-amber-200"
                aria-label="Close"
            >
                <X size={20} />
            </button>
            <div className="flex flex-col md:flex-row">
                <div className="p-4 w-full">
                    <h2 className="text-lg font-bold text-white mb-3 bg-amber-800 text-center py-1 px-2 rounded uppercase">{title}</h2>
                    <div className="relative h-44 mb-3">
                        <Image
                            src="/images/login-person.png"
                            alt="African chef"
                            fill
                            className="object-contain"
                        />
                    </div>
                    {children}
                </div>
            </div>
            {/* Chef image - smaller for this layout */}
            <div className="absolute bottom-2 right-2 w-24 h-36 pointer-events-none">
                <Image
                    src="/images/login-person.png"
                    alt="African chef"
                    fill
                    className="object-contain object-bottom"
                />
            </div>
        </div>
    </div>
);

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [view, setView] = useState<ModalView>('login');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    if (!isOpen) return null;

    // --- Mock Handlers --- 
    const handleLogin = () => {
        console.log("Attempting login with:", email, password);
        // Simulate API call
        setTimeout(() => setView('loginSuccess'), 1000);
    };
    const handleRegister = () => {
        console.log("Attempting registration with:", email, password, confirmPassword);
        // Add validation checks here (e.g., password match, strength)
        // Simulate API call
        setTimeout(() => setView('registerSuccess'), 1000);
    };
    const handleForgotPassword = () => {
        console.log("Requesting password reset for:", email);
        // Simulate API call
        setTimeout(() => setView('resetSent'), 1000);
    };

    // --- Render Logic --- 
    switch (view) {
        case 'register':
            return (
                <ModalWrapper onClose={onClose} title="REGISTRATION">
                    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                        <div>
                            <label className="text-sm text-white mb-1 block">E-mail</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-gray-300 rounded p-1.5 text-sm" />
                        </div>
                        <div>
                            <label className="text-sm text-white mb-1 block">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border border-gray-300 rounded p-1.5 text-sm" />
                        </div>
                        <div>
                            <label className="text-sm text-white mb-1 block">Confirm Password</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full border border-gray-300 rounded p-1.5 text-sm" />
                        </div>
                        <div className="text-xs text-amber-200 pt-1">
                            <p>Your Password must include</p>
                            <ul className="list-disc list-inside pl-2">
                                <li>At least 8 characters</li>
                                <li>At least one uppercase and one lowercase letter</li>
                                <li>At least one special character or a number</li>
                            </ul>
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="relative w-full bg-red-900 text-white rounded-full py-1 px-4 text-sm font-semibold hover:bg-red-800 shadow-md">
                                <span className="relative z-10">REGISTER</span>
                                <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                <span className="absolute inset-0 rounded-full outline outline-2 outline-amber-800" style={{ outlineOffset: '1px' }}></span>
                            </button>
                        </div>
                        <div className="text-center mt-2 text-sm">
                            <span className="text-white">Already have an account?</span>{" "}
                            <button type="button" onClick={() => setView('login')} className="text-amber-200 font-bold hover:underline">
                                LOGIN
                            </button>
                        </div>
                    </form>
                </ModalWrapper>
            );
        case 'forgotPassword':
            return (
                <ModalWrapper onClose={onClose} title="RESET PASSWORD">
                    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }}>
                        <div>
                            <label className="text-sm text-white mb-1 block">E-mail</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-gray-300 rounded p-1.5 text-sm" />
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="relative w-full bg-red-900 text-white rounded-full py-1 px-4 text-sm font-semibold hover:bg-red-800 shadow-md">
                                <span className="relative z-10">SUBMIT</span>
                                <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                <span className="absolute inset-0 rounded-full outline outline-2 outline-amber-800" style={{ outlineOffset: '1px' }}></span>
                            </button>
                        </div>
                        <div className="text-center mt-2 text-sm">
                            <button type="button" onClick={() => setView('login')} className="text-amber-200 font-bold hover:underline">
                                BACK TO LOGIN
                            </button>
                        </div>
                    </form>
                </ModalWrapper>
            );
        case 'loginSuccess':
            return (
                <SuccessModalWrapper onClose={onClose} title="WELCOME BACK">
                    <div className="bg-white/90 rounded-lg p-4 text-center">
                        <p className="text-amber-900 text-base font-semibold mb-2">
                            Karibu tena, Akwaaba, Enkwan dehna met'u, T'ena yihabkha, Ekabo o!
                        </p>
                        <p className="text-gray-700 text-sm">
                            You've logged in successfully. Redirecting you shortly.
                        </p>
                    </div>
                </SuccessModalWrapper>
            );
        case 'registerSuccess':
            return (
                <SuccessModalWrapper onClose={onClose} title="WELCOME">
                    <div className="bg-white/90 rounded-lg p-4 space-y-3">
                        <p className="text-amber-900 text-base font-semibold">
                            Welcome to your new favorite food destination. Your account is ready!
                        </p>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li className="flex items-center"><span className="mr-2">🇰🇪</span> Karibu!</li>
                            <li className="flex items-center"><span className="mr-2">🇬🇭</span> Akwaaba!</li>
                            <li className="flex items-center"><span className="mr-2">🇳🇬</span> Ekabo!</li>
                            <li className="flex items-center"><span className="mr-2">🇪🇹</span> Enkwan dehna met'u!</li>
                            <li className="flex items-center"><span className="mr-2">🇪🇷</span> T'ena yihabkha!</li>
                        </ul>
                        <p className="text-gray-700 text-sm pt-2">
                            Whether it's spicy suya, soft injera, or smoky tilapia, your next delicious bite is just a click away.
                        </p>
                        <p className="text-gray-700 text-sm flex items-center gap-2">
                            <span className="text-xl">📧</span> We've sent you a confirmation email. Please check it to complete your registration.
                        </p>
                        <p className="text-amber-900 text-sm font-semibold pt-2">
                            Let's make every meal a celebration of African heritage.
                        </p>
                    </div>
                </SuccessModalWrapper>
            );
        case 'resetSent':
            return (
                <SuccessModalWrapper onClose={onClose} title="EMAIL SENT">
                    <div className="bg-white/90 rounded-lg p-4 text-center">
                        <p className="text-amber-900 text-base font-semibold mb-2">
                            Check Your Email, Chale!
                        </p>
                        <p className="text-gray-700 text-sm">
                            We don dey send password reset link to your email now-now! Abeg, check your inbox (and your spam folder too o). The link go expire after 30 minutes for security reasons. No wahala!
                        </p>
                    </div>
                </SuccessModalWrapper>
            );
        case 'login':
        default:
            return (
                <ModalWrapper onClose={onClose} title="LOGIN">
                    {/* Login view now includes both columns inside the wrapper's children */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
                        {/* Left side - login form */}
                        <div className="w-full md:w-1/2">
                            <form className="space-y-4 bg-amber-50/90 p-6 rounded-lg shadow" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                                <div>
                                    <label className="text-sm text-amber-900 font-medium mb-1 block">E-mail</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white border border-gray-300 rounded p-2 text-sm text-gray-800" />
                                </div>
                                <div>
                                    <label className="text-sm text-amber-900 font-medium mb-1 block">Password</label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white border border-gray-300 rounded p-2 text-sm text-gray-800" />
                                </div>
                                <div className="text-right">
                                    <button type="button" onClick={() => setView('forgotPassword')} className="text-red-900 text-xs hover:underline font-semibold">
                                        Forgot Password?
                                    </button>
                                </div>
                                <div className="pt-3 flex justify-center">
                                    {/* LOGIN Button - Darker red/brown with yellow outline and 3D effect */}
                                    <button type="submit" className="relative bg-red-900 text-white rounded-full py-1.5 px-8 text-sm font-bold hover:bg-red-800 shadow-md">
                                        <span className="relative z-10">LOGIN</span>
                                        <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                        <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                        <span className="absolute inset-0 rounded-full outline outline-2 outline-amber-800" style={{ outlineOffset: '1px' }}></span>
                                    </button>
                                </div>
                                <div className="text-center mt-3 text-sm">
                                    <span className="text-amber-900">New Here?</span>{" "}
                                    <button type="button" onClick={() => setView('register')} className="text-red-900 font-bold hover:underline">
                                        Create Account
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right side - info boxes */}
                        <div className="w-full md:w-1/2 space-y-3">
                            {/* Empty space to make the image more visible */}
                            <div className="h-40"></div>

                            {/* Info Boxes - Lighter background */}
                            <div className="bg-amber-50 rounded-lg p-3 space-y-1 text-amber-900 shadow">
                                <h3 className="font-bold text-sm">Why log in?</h3>
                                <p className="text-xs leading-relaxed">
                                    Elevate your experience on our platform. Access your order history, save favorites for quick reordering, and enjoy a seamless checkout.
                                </p>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-3 space-y-1 text-amber-900 shadow">
                                <h3 className="font-bold text-sm">Just browsing?</h3>
                                <p className="text-xs mb-2 leading-relaxed">
                                    No worries! Order your favorite meals without logging in or creating an account. Delicious food is just a few clicks away, no registration required.
                                </p>
                                {/* CONTINUE AS GUEST Button - Amber/Yellow */}
                                <button
                                    type="button"
                                    onClick={onClose} // Close modal to continue as guest
                                    className="relative w-full bg-red-900 text-white rounded-full py-1 px-4 text-xs font-semibold hover:bg-red-800 shadow-md"
                                >
                                    <span className="relative z-10">CONTINUE AS GUEST</span>
                                    <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                    <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                    <span className="absolute inset-0 rounded-full outline outline-2 outline-amber-800" style={{ outlineOffset: '1px' }}></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalWrapper>
            );
    }
} 