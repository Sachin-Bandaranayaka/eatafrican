"use client";

import { useState } from "react";
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import Register from './register';
import RegularButton from '@/app/components/RegularButton';

// Main component to simulate the entire application flow
export default function App({ onLoginSuccess: onGlobalLoginSuccess }: { onLoginSuccess: () => void; }) {
    const [currentPage, setCurrentPage] = useState('auth'); // 'auth', 'register'

    const navigateToRegister = () => setCurrentPage('register');
    const navigateToAuth = () => setCurrentPage('auth');

    if (currentPage === 'register') {
        return <Register onBackToLogin={navigateToAuth} />;
    }

    return <DriverPortalAuth onLoginSuccess={onGlobalLoginSuccess} onRegisterClick={navigateToRegister} />;
}

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

    // Render the correct view based on the auth state
    switch (authView) {
        case 'forgot':
            return (
                <ForgotPasswordView onSubmit={handleResetSubmit} onBackToLogin={handleBackToLoginClick} />
            );
        case 'reset_sent':
            return (
                <ResetPasswordMessageView onBackToLogin={handleBackToLoginClick} />
            );
        default: // 'login'
            return (
                <LoginView
                    onLoginClick={onLoginSuccess}
                    onForgotPasswordClick={handleForgotPasswordClick}
                    onRegisterClick={onRegisterClick}
                />
            );
    }
}

// View for the Login Form
interface LoginViewProps {
    onLoginClick: () => void;
    onForgotPasswordClick: () => void;
    onRegisterClick: () => void;
}

function LoginView({ onLoginClick, onForgotPasswordClick, onRegisterClick }: LoginViewProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error?.message || 'Login failed');
                setLoading(false);
                return;
            }

            // Check if user is a driver
            if (data.user.role !== 'driver') {
                setError('Access denied. This portal is for drivers only.');
                setLoading(false);
                return;
            }

            // Store authentication data
            localStorage.setItem('accessToken', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Call success callback
            onLoginClick();
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred during login. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 min-h-screen p-4">
            <div className="flex items-center justify-center md:justify-start p-4 md:p-8">
                <div
                    className="w-full max-w-md md:max-w-96 p-2 md:p-8 md:ml-64"
                    style={{ minHeight: '500px' }}
                >
                    <div className="text-left mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2 underline underline-offset-8">
                            DRIVER LOGIN
                        </h1>
                    </div>
                    
                    {error && (
                        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-white mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-white mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900"
                            />
                        </div>
                        <div className="text-left">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onForgotPasswordClick();
                                }}
                                className="text-sm font-bold text-yellow-400 hover:text-yellow-300"
                            >
                                Forgot Password?
                            </a>
                        </div>
                        <div className="flex justify-start">
                            <RegularButton
                                type="submit"
                                text={loading ? 'LOGGING IN...' : 'LOGIN'}
                                fillColor="#00fe3c"
                                fontColor="#000000"
                                borderColor="#fbbf24"
                                // borderWidth="4px"
                                disabled={loading}
                                // borderRadius="rounded-full"
                                // padding="py-2 px-8"
                            />
                        </div>
                        <div className="mt-6">
                            <p className="text-white text-sm">
                                Don't have an account?{' '}
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onRegisterClick();
                                    }}
                                    className="text-yellow-400 font-bold hover:text-yellow-300"
                                >
                                    Register as Driver
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// View for Forgot Password Form
interface ForgotPasswordViewProps {
    onSubmit: () => void;
    onBackToLogin: () => void;
}

function ForgotPasswordView({ onSubmit, onBackToLogin }: ForgotPasswordViewProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onSubmit();
        }, 1000);
    };

    return (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 min-h-screen p-4">
            <div className="flex items-center justify-center md:justify-start p-4 md:p-8">
                <div
                    className="w-full max-w-md md:max-w-96 p-2 md:p-8 md:ml-64"
                    style={{ minHeight: '400px' }}
                >
                    <div className="text-left mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2 underline underline-offset-8">
                            RESET PASSWORD
                        </h1>
                    </div>
                    
                    <p className="text-white mb-6 text-sm">
                        Enter the email address associated with your account, and we'll send you instructions to reset your password.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="reset-email" className="block text-sm font-bold text-white mb-1">
                                Email
                            </label>
                            <input
                                id="reset-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900"
                            />
                        </div>
                        <div className="flex justify-start">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-2 bg-red-900 text-white font-bold rounded-full border-4 border-amber-300 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'SUBMITTING...' : 'SUBMIT'}
                            </button>
                        </div>
                        <div className="mt-4">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onBackToLogin();
                                }}
                                className="text-sm font-bold text-yellow-400 hover:text-yellow-300"
                            >
                                Back To Login
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// View for Reset Password Message
interface ResetPasswordMessageViewProps {
    onBackToLogin: () => void;
}

function ResetPasswordMessageView({ onBackToLogin }: ResetPasswordMessageViewProps) {
    return (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 min-h-screen p-4">
            <div className="flex items-center justify-center md:justify-start p-4 md:p-8">
                <div
                    className="w-full max-w-md md:max-w-96 p-2 md:p-8 md:ml-64"
                    style={{ minHeight: '400px' }}
                >
                    <div className="text-left mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2 underline underline-offset-8">
                            PASSWORD RESET SENT
                        </h1>
                    </div>
                    
                    <div className="text-white space-y-4 mb-6">
                        <p className="text-sm">
                            You will receive an email shortly with a link to reset your password. If you don't see it, kindly check your spam or junk folder.
                        </p>
                        <p className="text-sm">
                            For your security, the link will expire in 30 minutes.
                        </p>
                    </div>
                    
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onBackToLogin();
                        }}
                        className="text-sm font-bold text-yellow-400 hover:text-yellow-300"
                    >
                        Back To Login
                    </a>
                </div>
            </div>
        </div>
    );
}
