"use client";

import { useState } from "react";
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import Register from './register'; // Import the new Register component

// Main component to simulate the entire application flow
export default function App({ onLoginSuccess: onGlobalLoginSuccess }: { onLoginSuccess: () => void; }) {
    // This state will control which top-level component is shown
    const [currentPage, setCurrentPage] = useState('auth'); // 'auth', 'register'

    const navigateToRegister = () => setCurrentPage('register');
    const navigateToAuth = () => setCurrentPage('auth');

    if (currentPage === 'register') {
        return <Register onBackToLogin={navigateToAuth} />;
    }

    // Default to the authentication screen
    return <DriverPortalAuth onLoginSuccess={onGlobalLoginSuccess} onRegisterClick={navigateToRegister} />;
}



// Placeholder for the Driver Portal Screen
const DriverPortalScreen = ({ onLogout }: { onLogout: () => void }) => (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="p-10 bg-white rounded-lg shadow-xl text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to the Driver Portal</h1>
            <p>Your orders and details would be displayed here.</p>
            <button
                onClick={onLogout}
                className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </div>
    </div>
);


// The main authentication component that handles different auth states
interface DriverPortalAuthProps {
    onLoginSuccess: () => void;
    onRegisterClick: () => void;
}

function DriverPortalAuth({ onLoginSuccess, onRegisterClick }: DriverPortalAuthProps) {
    const [authView, setAuthView] = useState('login'); // 'login', 'forgot', 'reset_sent'

    const handleForgotPasswordClick = () => setAuthView('forgot');
    const handleBackToLoginClick = () => setAuthView('login');
    const handleResetSubmit = () => setAuthView('reset_sent');

    // This is the background container shown in the images
    const AuthContainer = ({ children }: { children: React.ReactNode }) => (
        <main className="flex justify-center min-h-screen ">
            <div className="w-full px-32 mx-auto">
                {/* Main Auth Box */}
                <section className="relative bg-white bg-opacity-80  border-2 border-[#f1c232] rounded-lg flex flex-col items-center justify-center p-3 z-10">
                    <div className="w-full">
                        <h1 className="text-center font-bold text-[15px]  px-32 text-red-600 mb-2">
                            EAT AFRICAN DRIVER PORTAL
                        </h1>
                        {children}
                        <div className="text-center mt-2">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onRegisterClick();
                                }}
                                className="text-green-600 font-bold text-[15px] "
                            >
                                Register Your Driver Account
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );

    // Conditional rendering based on the auth state
    switch (authView) {
        case 'forgot':
            return (
                <AuthContainer>
                    <ForgotPasswordView onSubmit={handleResetSubmit} onBackToLogin={handleBackToLoginClick} />
                </AuthContainer>
            );
        case 'reset_sent':
            return (
                <AuthContainer>
                    <ResetPasswordMessageView onBackToLogin={handleBackToLoginClick} />
                </AuthContainer>
            );
        default: // 'login'
            return (
                <AuthContainer>
                    <LoginView
                        onLoginClick={onLoginSuccess}
                        onForgotPasswordClick={handleForgotPasswordClick}
                    />
                </AuthContainer>
            );
    }
}


// View for the Login Form (Image 1)
interface LoginViewProps {
    onLoginClick: () => void;
    onForgotPasswordClick: () => void;
}

function LoginView({ onLoginClick, onForgotPasswordClick }: LoginViewProps) {
    return (
        <div className="w-full flex flex-col items-center">
            <h2 className="text-[15px] font-bold text-green-700 mb-2">LOGIN</h2>
            <form className="w-full px-36">
                <div className="space-y-1">
                    <label htmlFor="email" className="text-[15px] font-bold text-gray-700">Email</label>
                    <input id="email" type="email" className="w-full border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500" />
                </div>
                <div className="space-y-1 mt-3">
                    <label htmlFor="password" className="text-[15px] font-bold text-gray-700">Password</label>
                    <input id="password" type="password" className="w-full border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500" />
                </div>
                <div className="text-center mt-3">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onForgotPasswordClick();
                        }}
                        className="text-[15px] font-bold text-red-600"
                    >
                        Forgot Password?
                    </a>
                </div>
                <div className="flex flex-row text-center justify-center mt-3">
                    <button
                        type="button"
                        onClick={onLoginClick}
                        className=" w-1/2 px-2 py-0.5 text-white font-semibold rounded-lg bg-amber-800 "
                    >
                        LOGIN
                    </button>
                </div>
            </form>
        </div>
    );
}

// View for Forgot Password Form (Image 2) - UPDATED UI
interface ForgotPasswordViewProps {
    onSubmit: () => void;
    onBackToLogin: () => void;
}

function ForgotPasswordView({ onSubmit, onBackToLogin }: ForgotPasswordViewProps) {
    return (
        <div className="w-full flex flex-col items-center text-center">
            <h2 className="text-[15px] font-bold text-green-700 mb-2">RESET PASSWORD</h2>
            <p className="text-black font-semibold mb-4 px-12 text-[16px]">
                Enter the email address associated with your account, and we’ll send you instructions to reset your password.
            </p>
            <form className="w-full px-36 space-y-3">
                <div className="space-y-1 text-left">
                    {/* <label htmlFor="reset-email" className="text-[15px] font-bold text-gray-700">Email</label> */}
                    <input id="reset-email" type="email" className="w-full border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500" />
                </div>
                <div>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onBackToLogin();
                        }}
                        className="text-[15px] font-bold text-blue-400"
                    >
                        Back To Login
                    </a>
                </div>
                <div className="flex flex-row text-center justify-center">
                    <button
                        type="button"
                        onClick={onSubmit}
                        className="w-1/2 px-2 py-0.5 text-white font-semibold rounded-lg bg-amber-800"
                    >
                        SUBMIT
                    </button>
                </div>

            </form>
        </div>
    );
}

// View for Reset Password Message (Image 3) - UPDATED UI
interface ResetPasswordMessageViewProps {
    onBackToLogin: () => void;
}

function ResetPasswordMessageView({ onBackToLogin }: ResetPasswordMessageViewProps) {
    return (
        <div className="w-full flex flex-col items-center text-center">
            <h2 className="text-[15px] font-bold text-green-700 mb-2 uppercase">Password Reset Instructions Sent</h2>
            <div className="text-black space-y-3 font-semibold mb-4 px-12 text-[16px]">
                <p>
                    You will receive an email shortly with a link to reset your password. If you don’t see it, kindly check your spam or junk folder.
                </p>
                <p>For your security, the link will expire in 30 minutes.</p>
            </div>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    onBackToLogin();
                }}
                className="text-[15px] font-bold text-blue-400 mt-3 mb-3"
            >
                Back To Login
            </a>
        </div>
    );
}