"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
}

type ModalView = 'login' | 'register' | 'forgotPassword' | 'loginSuccess' | 'registerSuccess' | 'resetSent' | 'guestSuccess';

// Helper component for consistent modal layout
const ModalWrapper: React.FC<{ children: React.ReactNode; onClose: () => void; title: string }> = ({ children, onClose, title }) => (
    <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 z-50">
        {/* Outer container for positioning chef */}
        <div className="relative max-w-4xl w-[35%] md:h-[100%] h-full -mr-[950px] mt-40">
            {/* Main Modal Box - Lighter background with scrolling */}
            <div className="relative bg-amber-600 rounded-2xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar shadow-xl">
                {/* Top-right chef group image - moved behind everything */}
                <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                    <div className="absolute top-6 right-8 w-48 h-64 sm:w-64 sm:h-80 lg:w-80 lg:h-96 pointer-events-none hidden sm:block overflow-hidden">
                        <Image
                            src="/images/login-group-chef.png"
                            alt="Group of African chefs"
                            fill
                            className="object-cover object-center"
                        />
                    </div>
                </div>

                {/* Close Button - Positioned relative to the amber box */}
                <button
                    onClick={onClose}
                    className="bg-amber-600 text-black rounded-full p-1 md:ml-[95%] md:mt-10 relative z-50"
                    type="button"
                >
                    <img
                        src="/images/cancelBtn.png"
                        alt="Close"
                        className="w-6 h-6 object-contain"
                    />
                </button>

                {/* Title Section - Consistent across all views */}
                <div className="relative w-[250px] pt-4 sm:pt-6 pl-0 z-10 -mt-10">
                    <h2 className="md:text-[16px] sm:text-xl font-bold text-white bg-amber-900 py-1.5 sm:py-2 px-2 sm:px-2 sm:pr-6 rounded-r-full rounded-l-none shadow-md uppercase inline-block">
                        {title}
                    </h2>
                </div>

                {/* Inner Content Area - Adjusted padding */}
                <div className="flex flex-col md:flex-row pt-4 sm:pt-5 p-4 sm:p-6 md:p-8 relative z-10">
                    {children}
                </div>

                {/* Chef image - Positioned bottom-left relative to outer container */}
                <div className="absolute bottom-0 -left-6 w-40 h-72 sm:left-0 sm:w-48 sm:h-96 lg:w-52 lg:h-80 pointer-events-none z-20">
                    <Image
                        src="/images/login-person.png"
                        alt="African chef"
                        fill
                        className="object-contain object-bottom"
                    />
                </div>
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

    // --- Handlers ---
    const handleLogin = () => {
        setView('loginSuccess');
    };

    const handleRegister = () => {
        setView('registerSuccess');
    };

    const handleForgotPassword = () => {
        setView('resetSent');
    };

    // --- Render Logic ---
    switch (view) {
        case 'register':
            return (
                <ModalWrapper onClose={onClose} title="REGISTER">
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 w-full md:mt-4 -ml-6">
                        {/* Left side - registration form */}
                        <div className="w-full md:w-[55%] h-full">
                            <form className="space-y-3 sm:space-y-3 bg-amber-50/80 p-4 sm:p-4 rounded-lg shadow" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                                <div>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-gray-300 rounded p-1.5 sm:p-2 text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black" placeholder="E-mail" />
                                </div>
                                <div>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white border border-gray-300 rounded p-1.5 sm:p-2 text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black" placeholder="Password" />
                                </div>
                                <div>
                                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-white border border-gray-300 rounded p-1.5 sm:p-2 text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black" placeholder="Confirm Password" />
                                </div>
                                <div className="text-xs text-black pt-1">
                                    Your password must be at least 8 characters long and include an uppercase letter, a number, and a special character.
                                </div>
                                <div className="pt-2 pb- sm:pt-3 flex justify-center gap-3">
                                    <button type="submit" className="relative bg-red-900 text-white rounded-full py-2.5 px-6 sm:px-8 text-sm font-bold hover:bg-red-800 shadow-md">
                                        <span className="relative z-10">REGISTER</span>
                                        <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                        <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                        <span className="absolute inset-0 rounded-full outline outline-2" style={{ outlineOffset: '1px' }}></span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right side - info boxes */}
                        <div className="w-full md:w-1/2 space-y-3 -mr-40 mt-6">
                            {/* Empty space to make the image more visible - only on larger screens */}
                            <div className="h-0 md:h-36 hidden md:block"></div>

                            {/* "Already have an account?" Box */}
                            <div className="relative item-center bg-amber-50/80 rounded-lg py-6 px-6 space-y-1 text-black shadow hover:shadow-md transition-shadow">
                                <h3 className="font-bold text-sm">Already have an account?</h3>
                                <div className="pt-2 sm:pt-3 flex justify-center gap-3">
                                    <button type="button" onClick={() => setView('login')} className="relative bg-red-900 text-white rounded-full py-2.5 px-6 sm:px-8 text-sm font-bold hover:bg-red-800 shadow-md">
                                        <span className="relative z-10">LOGIN</span>
                                        <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                        <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                        <span className="absolute inset-0 rounded-full outline outline-2" style={{ outlineOffset: '1px' }}></span>
                                    </button>
                                </div>
                            </div>

                            {/* "Just browsing?" Box */}
                            <div className="relative -ml-[45%] bg-[#f9e9d5] rounded-lg p-4 shadow hover:shadow-md transition-shadow md:mt-14">
                                <p className="text-black text-sm leading-relaxed text-start">
                                    <span className="font-bold">Just browsing?</span> No worries! Order your favorite meals without logging in or creating an account. Delicious food is just a few clicks away, no registration required.
                                </p>
                                <div className="pt-2 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setView('guestSuccess')}
                                        className="relative bg-[#6b2c0c] text-white rounded-full py-1.5 px-6 text-sm font-bold hover:bg-red-800 shadow-md"
                                    >
                                        <span className="relative z-10">CONTINUE AS GUEST</span>
                                        <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                        <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                        <span className="absolute inset-0 rounded-full outline outline-2" style={{ outlineOffset: '1px' }}></span>
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
                            <form className="space-y-3 sm:space-y-4 bg-amber-50/80 p-4 sm:p-6 rounded-lg shadow" onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }}>
                                <div>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-gray-300 rounded p-1.5 sm:p-2 text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black" placeholder="E-mail" />
                                </div>
                                <div className="pt-3 flex justify-center gap-3">
                                    <button type="submit" className="relative bg-red-900 text-white rounded-full py-1.5 px-6 sm:px-8 text-sm font-bold hover:bg-red-800 shadow-md">
                                        <span className="relative z-10">SUBMIT</span>
                                        <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                        <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                        <span className="absolute inset-0 rounded-full outline outline-2 outline-amber-200" style={{ outlineOffset: '1px' }}></span>
                                    </button>
                                </div>
                                <div className="text-center">
                                    <button type="button" onClick={() => setView('login')} className="text-red-900 text-xs hover:underline font-bold">
                                        BACK TO LOGIN
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right side - info boxes */}
                        <div className="w-full md:w-1/2 -mr-56">
                            {/* Empty space to make the image more visible - only on larger screens */}
                            <div className="h-0 md:h-56 hidden md:block"></div>

                            {/* "Why log in?" Box */}
                            <div className="relative item-center rounded-lg px-4 space-y-1 text-black shadow hover:shadow-md transition-shadow">
                            </div>

                            {/* "Just browsing?" Box */}
                            <div className="relative md:mb-32 -ml-[45%] bg-[#f9e9d5] rounded-lg p-4 shadow hover:shadow-md transition-shadow mt-4">
                                <p className="text-black text-sm leading-relaxed text-start">
                                    <span className="font-bold">Just browsing?</span> No worries! Order your favorite meals without logging in or creating an account. Delicious food is just a few clicks away, no registration required.
                                </p>
                                <div className="pt-2 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setView('guestSuccess')}
                                        className="relative bg-[#6b2c0c] text-white rounded-full py-1.5 px-6 text-sm font-bold hover:bg-red-800 shadow-md"
                                    >
                                        <span className="relative z-10">CONTINUE AS GUEST</span>
                                        <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                        <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                        <span className="absolute inset-0 rounded-full outline outline-2 outline-amber-200" style={{ outlineOffset: '1px' }}></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalWrapper>
            );
        case 'loginSuccess':
            return (
                <ModalWrapper onClose={onClose} title="WELCOME BACK">
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 w-full">
                        {/* Left side - Success message */}
                        <div className="w-full md:w-[100%] md:mt-[40%] md:mb-[40%]">
                            <div className="bg-amber-50/80 p-4 sm:p-6 rounded-lg shadow space-y-3">
                                <p className="text-black text-center text-base font-semibold mb-2">
                                    Karibu tena, Akwaaba, Enkwan dehna met'u, T'ena yihabkha, Ekabo o!
                                </p>
                                <p className="text-gray-700 text-sm text-start">
                                    You've logged in successfully. Redirecting you shortly.
                                </p>
                            </div>
                        </div>
                    </div>
                </ModalWrapper>
            );
        case 'registerSuccess':
            return (
                <ModalWrapper onClose={onClose} title="WELCOME">
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 w-full -ml-6">
                        {/* Left side - Welcome message */}
                        <div className="w-full md:w-[55%]">
                            <div className="bg-amber-50/80 p-2 sm:p-4 rounded-lg shadow space-y-3">
                                <p className="text-black text-md font-bold">
                                    Welcome to your new favorite food destination. Your account is ready!
                                </p>
                                <ul className="space-y-2 pl-1">
                                    <li className="flex items-center text-sm text-black text-bold">
                                        <Image src="/flags/kenya.png" alt="Kenya" width={12} height={8} className="mr-2 sm:w-[16px] sm:h-[10px]" />
                                        Karibu!
                                    </li>
                                    <li className="flex items-center text-sm text-black">
                                        <Image src="/flags/ghana.png" alt="Ghana" width={12} height={8} className="mr-2 sm:w-[16px] sm:h-[10px]" />
                                        Akwaaba!
                                    </li>
                                    <li className="flex items-center text-sm text-black">
                                        <Image src="/flags/nigeria.png" alt="Nigeria" width={12} height={8} className="mr-2 sm:w-[16px] sm:h-[10px]" />
                                        Ekabo!
                                    </li>
                                    <li className="flex items-center text-sm text-black">
                                        <Image src="/flags/ethiopia.png" alt="Ethiopia" width={12} height={8} className="mr-2 sm:w-[16px] sm:h-[10px]" />
                                        Enkwan dehna met'u!
                                    </li>
                                    <li className="flex items-center text-sm text-black">
                                        <Image src="/flags/eritrea.png" alt="Eritrea" width={12} height={8} className="mr-2 sm:w-[16px] sm:h-[10px]" />
                                        T'ena yihabkha!
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Right side - Additional info */}
                        <div className="w-full md:w-1/2 space-y-3 -mr-40 mt-14">
                            <div className="h-0 md:h-40 hidden md:block"></div>
                            <div className="bg-amber-50/80 p-4 sm:p-4 rounded-lg shadow space-y-3">
                                <p className="text-sm text-black">
                                    Whether it's spicy suya, soft injera, or smoky tilapia, your next delicious bite is just a click away.
                                </p>
                                <p className="text-sm text-black font-bold flex items-start gap-2">
                                    <span>📧 We've sent you a confirmation email. Please check it to complete your registration.</span>
                                </p>
                                <p className="text-black text-sm pt-1">
                                    Let's make every meal a celebration of African heritage.
                                </p>
                            </div>
                        </div>
                    </div>
                </ModalWrapper>
            );
        case 'resetSent':
            return (
                <ModalWrapper onClose={onClose} title="PASSWORD RESET">
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 w-full">
                        {/* Left side - Success message */}
                        <div className="w-full md:w-[100%] md:mt-[20%] md:mb-[40%]">
                            <div className="bg-amber-50/80 p-6 sm:p-10 rounded-lg shadow space-y-3">
                                <p className="text-black text-start text-base font-semibold mb-2">
                                    Check Your Email, Chale!
                                </p>
                                <p className="text-gray-700 text-sm text-start">
                                    We don dey send password reset link to your email now-now! Abeg, check your inbox (and your spam folder too o). The link go expire after 30 minutes for security reasons. No wahala!
                                </p>
                            </div>
                        </div>
                    </div>
                </ModalWrapper>
            );
        case 'guestSuccess':
            return (
                <ModalWrapper onClose={onClose} title="WELCOME GUEST">
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 w-full md:mt-4 -ml-6">
                        {/* Left side - Welcome message */}
                        <div className="w-full md:w-[50%]">
                            <div className="bg-amber-50/80 sm:p-4 rounded-lg shadow space-y-3 py-6">
                                <p className="text-black text-sm font-bold py-4">
                                    Welcome to your new favorite food destination.
                                </p>
                                <p className="text-black text-sm py-4">
                                    You can now enjoy a seamless checkout without logging in!
                                </p>
                                <p className="text-black text-sm font-bold py-4">
                                    Jollof, injera, suya--your plate is just a click away.
                                </p>
                            </div>
                        </div>

                        {/* Right side - info boxes */}
                        <div className="w-full md:w-1/2 space-y-3 -mr-40 mt-6 ml-4">
                            {/* Empty space to make the image more visible - only on larger screens */}
                            <div className="h-0 md:h-20 hidden md:block"></div>

                            {/* "Already have an account?" Box */}
                            <div className="relative item-center bg-amber-50/80 rounded-lg py-6 px-6 space-y-1 text-black shadow hover:shadow-md transition-shadow">
                                <h3 className="font-bold text-sm">Prefer to log or sign up?</h3>
                                <div className="pt-2 sm:pt-3 flex justify-center gap-3">
                                    <button type="button" onClick={() => setView('login')} className="relative bg-red-900 text-white rounded-full py-2.5 px-6 sm:px-8 text-sm font-bold hover:bg-red-800 shadow-md">
                                        <span className="relative z-10">LOGIN</span>
                                        <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                        <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                        <span className="absolute inset-0 rounded-full outline outline-2" style={{ outlineOffset: '1px' }}></span>
                                    </button>
                                </div>
                            </div>

                            <div className="h-0 md:h-48 hidden md:block"></div>
                        </div>
                    </div>
                </ModalWrapper>
            );
        case 'login':
        default:
            return (
                <ModalWrapper onClose={onClose} title="LOGIN">
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 w-full -ml-6">
                        {/* Left side - login form */}
                        <div className="w-full md:w-[55%]">
                            <form className="space-y-3 sm:space-y-4 bg-amber-50/80 p-2 sm:p-4 rounded-lg shadow" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                                <div>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-gray-300 rounded p-1.5 sm:p-2 text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black" placeholder="E-mail" />
                                </div>
                                <div>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white border border-gray-300 rounded p-1.5 sm:p-2 text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black" placeholder="Password" />
                                </div>
                                <div className="text-center">
                                    <button type="button" onClick={() => setView('forgotPassword')} className="text-red-900 text-xs hover:underline font-semibold">
                                        Forgot Password?
                                    </button>
                                </div>
                                <div className="pt-1 sm:pt-2 flex justify-center gap-3">
                                    <button type="submit" className="relative bg-red-900 text-white rounded-full py-3 px-6 sm:px-8 text-sm font-bold hover:bg-red-800 shadow-md">
                                        <span className="relative z-10">LOGIN</span>
                                        <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                                        <span className="absolute inset-0 rounded-full border-4 border-yellow-500" style={{ borderTopWidth: '3px', borderBottomWidth: '5px', borderLeftWidth: '4px', borderRightWidth: '4px' }}></span>
                                    </button>
                                </div>
                                <div className="text-center mt-2 sm:mt-3 text-sm pb-6">
                                    <span className="text-black font-bold">New Here?</span>{" "}
                                    <button type="button" onClick={() => setView('register')} className="text-red-900 font-bold hover:underline">
                                        Create Account
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right side - info boxes */}
                        <div className="w-full md:w-1/2 space-y-3 -mr-56">
                            {/* Empty space to make the image more visible - only on larger screens */}
                            <div className="h-0 md:h-32 hidden md:block"></div>

                            {/* "Why log in?" Box */}
                            <div className="relative item-center bg-amber-50/80 rounded-lg py-4 px-4 space-y-1 text-black shadow hover:shadow-md transition-shadow">
                                <h3 className="font-bold text-md">Why log in?</h3>
                                <p className="text-sm leading-relaxed">
                                    Elevate your experience on our platform. Access your order history, save favorites for quick reordering, and enjoy a seamless checkout.
                                </p>
                            </div>

                            {/* "Just browsing?" Box */}
                            <div className="relative -ml-[45%] bg-[#f9e9d5] rounded-lg p-4 shadow hover:shadow-md transition-shadow mt-8">
                                <p className="text-black text-sm leading-relaxed text-start">
                                    <span className="font-bold">Just browsing?</span> No worries! Order your favorite meals without logging in or creating an account. Delicious food is just a few clicks away, no registration required.
                                </p>
                                <div className="pt-2 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setView('guestSuccess')}
                                        className="relative bg-[#6b2c0c] text-white rounded-full py-1.5 px-6 text-sm font-bold hover:bg-red-800 shadow-md"
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
    }
}