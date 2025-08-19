"use client";

import { useState } from "react";

// Props interface for the component
interface SuperAdminLoginProps {
  onLoginSuccess: () => void;
}

// Main component for Super Admin Authentication
export default function SuperAdminLogin({ onLoginSuccess }: SuperAdminLoginProps) {
  // State to manage which auth view is shown: 'login', 'forgot', or 'reset_sent'
  const [authView, setAuthView] = useState('login');

  const handleForgotPasswordClick = () => setAuthView('forgot');
  const handleBackToLoginClick = () => setAuthView('login');
  const handleResetSubmit = () => setAuthView('reset_sent');

  // A styled container for the authentication forms
  const AuthContainer = ({ children }: { children: React.ReactNode }) => (
    <main className="flex justify-center min-h-screen ">
      <div className="w-5/6 md:w-1/2 px-2 md:px-32 md:mx-auto">
        {/* Main Auth Box */}
        <section className="relative bg-white bg-opacity-80 border-2 border-[#f1c232] rounded-lg flex flex-col items-center justify-center p-3 z-10">
          <div className="md:w-full">
            <h1 className="text-center font-bold text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] md:px-32 text-red-600 mb-2">
              EAT AFRICAN SUPER ADMIN PORTAL
            </h1>
            {children}
          </div>
        </section>
      </div>
    </main>
  );

  // Render the correct view based on the auth state
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

// View for the Login Form
interface LoginViewProps {
  onLoginClick: () => void;
  onForgotPasswordClick: () => void;
}

function LoginView({ onLoginClick, onForgotPasswordClick }: LoginViewProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold text-green-700 mb-2">LOGIN</h2>
      <form className="w-full md:px-36">
        <div className="space-y-1">
          <label htmlFor="email" className="text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] font-bold text-gray-700">Email</label>
          <input id="email" type="email" className="w-full border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500" />
        </div>
        <div className="space-y-1 mt-3">
          <label htmlFor="password" className="text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] font-bold text-gray-700">Password</label>
          <input id="password" type="password" className="w-full border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500" />
        </div>
        <div className="text-center mt-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onForgotPasswordClick();
            }}
            className="text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] font-bold text-red-600"
          >
            Forgot Password?
          </a>
        </div>
        <div className="flex flex-row text-center justify-center mt-3">
          <button
            type="button"
            onClick={onLoginClick}
            className="w-1/2 px-2 py-0.5 text-white font-semibold rounded-lg bg-amber-800 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]"
          >
            LOGIN
          </button>
        </div>
      </form>
    </div>
  );
}

// View for Forgot Password Form
interface ForgotPasswordViewProps {
  onSubmit: () => void;
  onBackToLogin: () => void;
}

function ForgotPasswordView({ onSubmit, onBackToLogin }: ForgotPasswordViewProps) {
  return (
    <div className="w-full flex flex-col items-center text-center">
      <h2 className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold text-green-700 mb-2">RESET PASSWORD</h2>
      <p className="text-black font-semibold mb-4 px-12 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">
        Enter the email address associated with your account, and we’ll send you instructions to reset your password.
      </p>
      <form className="w-full px-24 md:px-36 space-y-3">
        <div className="space-y-1 text-left">
          <input id="reset-email" type="email" className="w-full border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500" />
        </div>
        <div className="md:w-full">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onBackToLogin();
            }}
            className="w-full text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] font-bold text-blue-400"
          >
            Back To Login
          </a>
        </div>
        <div className="flex flex-row text-center justify-center">
          <button
            type="button"
            onClick={onSubmit}
            className="md:w-1/2 px-2 py-0.5 text-white font-semibold rounded-lg bg-amber-800 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]"
          >
            SUBMIT
          </button>
        </div>
      </form>
    </div>
  );
}

// View for Reset Password Message
interface ResetPasswordMessageViewProps {
  onBackToLogin: () => void;
}

function ResetPasswordMessageView({ onBackToLogin }: ResetPasswordMessageViewProps) {
  return (
    <div className="w-full flex flex-col items-center text-center">
      <h2 className="text-[9px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold text-green-700 mb-2 uppercase">Password Reset Instructions Sent</h2>
      <div className="text-black space-y-3 font-semibold mb-4 px-12 text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px]">
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
        className="text-[7px] md:text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] font-bold text-blue-400 mt-3 mb-3"
      >
        Back To Login
      </a>
    </div>
  );
}