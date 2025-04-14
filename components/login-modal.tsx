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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-4">
        {/* Outer container for positioning chef */}
        <div className="relative w-full max-w-4xl">
            {/* Main Modal Box - Lighter background */}
            <div className="relative bg-amber-600 rounded-lg w-full overflow-visible shadow-xl">
                {/* Top-right chef group image - moved behind everything */}
                <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                    <div className="absolute top-6 right-8 w-64 h-64 sm:w-96 sm:h-96 pointer-events-none hidden sm:block">
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
                <div className="pt-4 sm:pt-5 pl-0 z-10 relative">
                    <h2 className="text-lg sm:text-xl font-bold text-white bg-amber-900 py-1.5 sm:py-2 px-6 sm:px-8 sm:pr-12 rounded-r-full rounded-l-none shadow-md uppercase inline-block">
                        {title}
                    </h2>
                </div>

                {/* Inner Content Area - Adjusted padding */}
                <div className="flex flex-col md:flex-row pt-4 sm:pt-5 p-4 sm:p-6 md:p-8 relative z-10">
                    {/* Children will now contain both form and right-side info for login view */}
                    {children}
                </div>
            </div>

            {/* Chef image - Positioned bottom-left relative to outer container */}
            <div className="absolute -bottom-8 -left-6 w-40 h-64 sm:bottom-0 sm:left-0 sm:w-52 sm:h-80 pointer-events-none z-20">
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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-4">
        <div className="relative bg-amber-700 rounded-lg w-full max-w-xl overflow-hidden">
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-white z-10 hover:text-amber-200"
                aria-label="Close"
            >
                <X size={20} />
            </button>
            <div className="flex flex-col">
                <div className="p-4 w-full">
                    <h2 className="text-base sm:text-lg font-bold text-white mb-3 bg-amber-800 text-center py-1 px-2 rounded uppercase">{title}</h2>
                    <div className="relative h-40 sm:h-60 mb-6 mx-auto w-40 sm:w-60">
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
            <div className="absolute bottom-2 right-2 w-28 h-40 sm:w-32 sm:h-48 pointer-events-none">
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
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 w-full">
                        {/* Left side - registration form */}
                        <div className="w-full md:w-1/2">
                            <form className="space-y-3 sm:space-y-4 bg-amber-50/90 p-4 sm:p-6 rounded-lg shadow" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                                <div>
                                    <label className="text-sm text-amber-900 font-medium mb-1 block">E-mail</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white border border-gray-300 rounded p-1.5 sm:p-2 text-sm text-gray-800" />
                                </div>
                                <div>
                                    <label className="text-sm text-amber-900 font-medium mb-1 block">Password</label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white border border-gray-300 rounded p-1.5 sm:p-2 text-sm text-gray-800" />
                                </div>
                                <div>
                                    <label className="text-sm text-amber-900 font-medium mb-1 block">Confirm Password</label>
                                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-white border border-gray-300 rounded p-1.5 sm:p-2 text-sm text-gray-800" />
                                </div>
                                <div className="text-xs text-amber-900 pt-1">
                                    <p className="font-semibold">Your Password must include</p>
                                    <ul className="list-none space-y-0.5 pl-1">
                                        <li>-At least 8 characters</li>
                                        <li>-At least one uppercase and one lowercase letter</li>
                                        <li>-At least one special character or a number</li>
                                    </ul>
                                </div>
                                <div className="pt-2 sm:pt-3 flex justify-center">
                                    <button type="submit" className="relative bg-red-900 text-white rounded-full py-1.5 px-6 sm:px-8 text-sm font-bold hover:bg-red-800 shadow-md">
                                        <span className="relative z-10">REGISTER</span>
                                        <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                        <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                        <span className="absolute inset-0 rounded-full outline outline-2 outline-amber-800" style={{ outlineOffset: '1px' }}></span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right side - info boxes */}
                        <div className="w-full md:w-1/2 space-y-3">
                            {/* "Already have an account?" Box */}
                            <div className="bg-amber-50 rounded-lg p-4 space-y-2 text-amber-900 shadow">
                                <h3 className="font-bold text-center text-base">Already have an account?</h3>
                                <div className="flex justify-center pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setView('login')}
                                        className="relative bg-red-900 text-white rounded-full py-1.5 px-6 sm:px-8 text-sm font-bold hover:bg-red-800 shadow-md"
                                    >
                                        <span className="relative z-10">LOGIN</span>
                                        <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                        <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                        <span className="absolute inset-0 rounded-full outline outline-2 outline-amber-800" style={{ outlineOffset: '1px' }}></span>
                                    </button>
                                </div>
                            </div>

                            {/* Just browsing box - Added mt-8 to push down */}
                            <div className="bg-amber-50 rounded-lg p-4 space-y-2 text-amber-900 shadow mt-24">
                                <h3 className="font-bold text-base">Just browsing?</h3>
                                <p className="text-sm leading-relaxed">
                                    No worries! Order your favorite meals without logging in or creating an account. Delicious food is just a few clicks away, no registration required.
                                </p>
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose} // Close modal to continue as guest
                                        className="relative w-full bg-red-900 text-white rounded-full py-1.5 px-4 text-sm font-semibold hover:bg-red-800 shadow-md"
                                    >
                                        <span className="relative z-10">CONTINUE AS GUEST</span>
                                        <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                        <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                        <span className="absolute inset-0 rounded-full outline outline-2 outline-amber-800" style={{ outlineOffset: '1px' }}></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalWrapper>
            );
        case 'forgotPassword':
            return (
                <ModalWrapper onClose={onClose} title="RESET PASSWORD">
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 w-full">
                        {/* Left side - Reset Password form */}
                        <div className="w-full md:w-1/2">
                            <form className="space-y-3 sm:space-y-4 bg-amber-50/90 p-4 sm:p-6 rounded-lg shadow" onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }}>
                                <div>
                                    <label className="text-sm text-amber-900 font-medium mb-1 block">E-mail</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white border border-gray-300 rounded p-1.5 sm:p-2 text-sm text-gray-800" />
                                </div>
                                <div className="pt-3 flex justify-center">
                                    <button type="submit" className="relative bg-red-900 text-white rounded-full py-1.5 px-6 sm:px-8 text-sm font-bold hover:bg-red-800 shadow-md">
                                        <span className="relative z-10">SUBMIT</span>
                                        <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                        <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                        <span className="absolute inset-0 rounded-full outline outline-2 outline-amber-800" style={{ outlineOffset: '1px' }}></span>
                                    </button>
                                </div>
                                <div className="text-center mt-2 text-sm">
                                    <button type="button" onClick={() => setView('login')} className="text-red-900 font-bold hover:underline">
                                        BACK TO LOGIN
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right side - Just browsing info */}
                        <div className="w-full md:w-1/2 space-y-3 flex flex-col justify-end">
                            {/* Just browsing box */}
                            <div className="bg-amber-50 rounded-lg p-4 space-y-2 text-amber-900 shadow mt-24">
                                <h3 className="font-bold text-base">Just browsing?</h3>
                                <p className="text-sm leading-relaxed">
                                    No worries! Order your favorite meals without logging in or creating an account. Delicious food is just a few clicks away, no registration required.
                                </p>
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose} // Close modal to continue as guest
                                        className="relative w-full bg-red-900 text-white rounded-full py-1.5 px-4 text-sm font-semibold hover:bg-red-800 shadow-md"
                                    >
                                        <span className="relative z-10">CONTINUE AS GUEST</span>
                                        <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                        <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                        <span className="absolute inset-0 rounded-full outline outline-2 outline-amber-800" style={{ outlineOffset: '1px' }}></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
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
                <ModalWrapper onClose={onClose} title="WELCOME">
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 w-full">
                        {/* Left side - Welcome message */}
                        <div className="w-full md:w-1/2">
                            <div className="bg-amber-50/90 p-4 sm:p-6 rounded-lg shadow space-y-3">
                                <p className="text-amber-900 text-base font-bold">
                                    Welcome to your new favorite food destination. Your account is ready!
                                </p>

                                <ul className="space-y-2 pl-1">
                                    <li className="flex items-center text-sm">
                                        <span className="mr-2">🇰🇪</span> Karibu!
                                    </li>
                                    <li className="flex items-center text-sm">
                                        <span className="mr-2">🇬🇭</span> Akwaaba!
                                    </li>
                                    <li className="flex items-center text-sm">
                                        <span className="mr-2">🇳🇬</span> Ekabo!
                                    </li>
                                    <li className="flex items-center text-sm">
                                        <span className="mr-2">🇪🇹</span> Enkwan dehna met'u!
                                    </li>
                                    <li className="flex items-center text-sm">
                                        <span className="mr-2">🇪🇷</span> T'ena yihabkha!
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Right side - Additional info */}
                        <div className="w-full md:w-1/2 space-y-3">
                            <div className="bg-amber-50/90 p-4 sm:p-6 rounded-lg shadow space-y-3">
                                <p className="text-sm text-amber-900">
                                    Whether it's spicy suya, soft injera, or smoky tilapia, your next delicious bite is just a click away.
                                </p>

                                <p className="text-sm text-amber-900 flex items-start gap-2">
                                    <span className="text-xl">📧</span>
                                    <span>We've sent you a confirmation email. Please check it to complete your registration.</span>
                                </p>

                                <p className="text-amber-900 text-sm font-bold pt-1">
                                    Let's make every meal a celebration of African heritage.
                                </p>
                            </div>

                            {/* "Just browsing?" Box for consistency */}
                            <div className="bg-amber-50 rounded-lg p-4 space-y-2 text-amber-900 shadow mt-24">
                                <h3 className="font-bold text-base">Just browsing?</h3>
                                <p className="text-sm leading-relaxed">
                                    No worries! Order your favorite meals without logging in or creating an account. Delicious food is just a few clicks away, no registration required.
                                </p>
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose} // Close modal to continue as guest
                                        className="relative w-full bg-red-900 text-white rounded-full py-1.5 px-4 text-sm font-semibold hover:bg-red-800 shadow-md"
                                    >
                                        <span className="relative z-10">CONTINUE AS GUEST</span>
                                        <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                        <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                        <span className="absolute inset-0 rounded-full outline outline-2 outline-amber-800" style={{ outlineOffset: '1px' }}></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalWrapper>
            );
        case 'resetSent':
            return (
                <ModalWrapper onClose={onClose} title="EMAIL SENT">
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 w-full">
                        {/* Main content */}
                        <div className="w-full md:w-3/4 mx-auto">
                            <div className="bg-amber-50/90 p-4 sm:p-6 rounded-lg shadow space-y-3">
                                <p className="text-amber-900 text-base font-bold">
                                    Check Your Email, Chale!
                                </p>
                                <p className="text-amber-900 text-sm">
                                    We don dey send password reset link to your email now-now! Abeg, check your inbox (and your spam folder too o). The link go expire after 30 minutes for security reasons. No wahala!
                                </p>
                            </div>
                        </div>
                    </div>
                </ModalWrapper>
            );
        case 'login':
        default:
            return (
                <ModalWrapper onClose={onClose} title="LOGIN">
                    {/* Login view now includes both columns inside the wrapper's children */}
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 w-full">
                        {/* Left side - login form */}
                        <div className="w-full md:w-1/2">
                            <form className="space-y-3 sm:space-y-4 bg-amber-50/90 p-4 sm:p-6 rounded-lg shadow" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                                <div>
                                    <label className="text-sm text-amber-900 font-medium mb-1 block">E-mail</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white border border-gray-300 rounded p-1.5 sm:p-2 text-sm text-gray-800" />
                                </div>
                                <div>
                                    <label className="text-sm text-amber-900 font-medium mb-1 block">Password</label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white border border-gray-300 rounded p-1.5 sm:p-2 text-sm text-gray-800" />
                                </div>
                                <div className="text-right">
                                    <button type="button" onClick={() => setView('forgotPassword')} className="text-red-900 text-xs hover:underline font-semibold">
                                        Forgot Password?
                                    </button>
                                </div>
                                <div className="pt-2 sm:pt-3 flex justify-center">
                                    {/* LOGIN Button - Darker red/brown with yellow outline and 3D effect */}
                                    <button type="submit" className="relative bg-red-900 text-white rounded-full py-1.5 px-6 sm:px-8 text-sm font-bold hover:bg-red-800 shadow-md">
                                        <span className="relative z-10">LOGIN</span>
                                        <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                        <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                        <span className="absolute inset-0 rounded-full outline outline-2 outline-amber-800" style={{ outlineOffset: '1px' }}></span>
                                    </button>
                                </div>
                                <div className="text-center mt-2 sm:mt-3 text-sm">
                                    <span className="text-amber-900">New Here?</span>{" "}
                                    <button type="button" onClick={() => setView('register')} className="text-red-900 font-bold hover:underline">
                                        Create Account
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right side - info boxes */}
                        <div className="w-full md:w-1/2 space-y-3">
                            {/* Empty space to make the image more visible - only on larger screens */}
                            <div className="h-0 md:h-80 hidden md:block"></div>

                            {/* Info Boxes - Lighter background */}
                            <div className="bg-amber-50 rounded-lg p-3 space-y-1 text-amber-900 shadow">
                                <h3 className="font-bold text-sm">Why log in?</h3>
                                <p className="text-xs leading-relaxed">
                                    Elevate your experience on our platform. Access your order history, save favorites for quick reordering, and enjoy a seamless checkout.
                                </p>
                            </div>

                            {/* Added vertical margin (mt-8) to push the Just browsing box down */}
                            <div className="bg-amber-50 rounded-lg p-3 space-y-1 text-amber-900 shadow mt-24">
                                <h3 className="font-bold text-sm">Just browsing?</h3>
                                <p className="text-xs mb-3 leading-relaxed">
                                    No worries! Order your favorite meals without logging in or creating an account. Delicious food is just a few clicks away, no registration required.
                                </p>
                                {/* CONTINUE AS GUEST Button - Amber/Yellow */}
                                <button
                                    type="button"
                                    onClick={onClose} // Close modal to continue as guest
                                    className="relative w-full bg-red-900 text-white rounded-full py-1.5 px-4 text-xs font-semibold hover:bg-red-800 shadow-md"
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