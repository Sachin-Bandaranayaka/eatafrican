"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

type ModalView =
  | "login"
  | "register"
  | "forgotPassword"
  | "loginSuccess"
  | "registerSuccess"
  | "resetSent"
  | "guestSuccess"

// Helper component for consistent modal layout
const ModalWrapper: React.FC<{ children: React.ReactNode; onClose: () => void; title: string }> = ({
  children,
  onClose,
  title,
}) => (
    // modal wrapper
  <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 z-50 mt-10 md:mt-0">
    {/* Outer container for positioning chef */}
    <div className="relative max-w-4xl w-[85%]  md:w-[35%] h-full -right-6 md:-mr-[950px] mt-10 md:mt-40">
      {/* Main Modal Box - Lighter background with scrolling */}
      <div className="relative bg-amber-600 rounded-2xl w-full h-[50vh] md:h-[80vh] lg:h-[80vh] xl:h-[80vh] 2xl:h-[80vh] overflow-y-auto hide-scrollbar shadow-xl">
        {/* Top-right chef group image - moved behind everything */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-6 right-8 w-48 h-48 md:w-48 md:h-64 sm:w-64 sm:h-80 lg:w-80 lg:h-96 pointer-events-none  sm:block overflow-hidden">
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
          className="bg-amber-600 text-black rounded-full p-1 w-6 h-6 ml-[90%] md:ml-[95%] mt-10 relative z-50"
          type="button"
        >
          <img src="/images/cancelBtn.png" alt="Close" className="w-6 h-6 object-contain" />
        </button>

        {/* Title Section - Consistent across all views */}
        <div className="relative w-[250px] pt-4 sm:pt-6 pl-0 z-10 -mt-14 md:-mt-10">
          <h2 className="text-[10px] md:text-[16px] sm:text-xl font-bold text-white bg-amber-900 py-1.5 sm:py-2 px-2 sm:px-2 sm:pr-6 rounded-r-full rounded-l-none shadow-md uppercase inline-block">
            {title}
          </h2>
        </div>

        {/* Inner Content Area - Adjusted padding */}
        <div className="flex flex-row pt-4 sm:pt-5 p-4 sm:p-6 md:p-8 relative z-10">{children}</div>

        {/* Chef image - Positioned bottom-left relative to outer container */}
        <div className="absolute bottom-0 -left-6 w-32 h-52 md:w-40 md:h-72 sm:left-0 sm:w-48 sm:h-96 lg:w-52 lg:h-80 pointer-events-none z-20">
          <Image src="/images/login-person.png" alt="African chef" fill className="object-contain object-bottom" />
        </div>
      </div>
    </div>
  </div>
)

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [view, setView] = useState<ModalView>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  if (!isOpen) return null

  // --- Handlers ---
  const handleLogin = () => {
    setView("loginSuccess")
  }

  const handleRegister = () => {
    setView("registerSuccess")
  }

  const handleForgotPassword = () => {
    setView("resetSent")
  }

  // --- Render Logic ---
  switch (view) {
    case "register":
      return (
        <ModalWrapper onClose={onClose} title="REGISTER">
          <div className="flex flex-row gap-3 w-full md:-ml-6">
            {/* Left side - registration form */}
            <div className="w-[40%] md:w-[55%]">
              <form
                className="md:space-y-3 space-y-1 bg-amber-50/80 p-1 md:p-2 rounded-lg shadow"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleRegister()
                }}
              >
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="md:mt-2 w-full bg-white border border-gray-300 rounded p-1 md:p-1.5 sm:p-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black"
                    placeholder="E-mail"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded p-1 -mb-4 md:mb-0 md:p-1.5 sm:p-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded p-1 -mb-4 md:mb-0 md:p-1.5 sm:p-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black"
                    placeholder="Confirm Password"
                  />
                </div>
                <div className="text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                  Your password must be at least 8 characters long and include an uppercase letter, a number, and a special character.
                </div>
                <div className="md:pt-1 pt-0 flex justify-center md:gap-3 gap-1">
                  <button
                    type="submit"
                    className="relative bg-red-900 text-white rounded-full md:py-3 py-2 px-6 sm:px-8 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold hover:bg-red-800 shadow-md"
                  >
                    <span className="relative z-10">REGISTER</span>
                    <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                    <span
                      className="absolute inset-0 rounded-full border-4 border-yellow-500"
                      style={{
                        borderTopWidth: "3px",
                        borderBottomWidth: "5px",
                        borderLeftWidth: "4px",
                        borderRightWidth: "4px",
                      }}
                    ></span>
                  </button>
                </div>
              </form>
            </div>
    
            {/* Right side - info boxes */}
            <div className="w-[50%] space-y-3 -mr-24 md:-mr-56">
              {/* Empty space to make the image more visible - only on larger screens */}
              <div className="h-28 md:h-48 block"></div>
    
              {/* "Already have an account?" Box */}
              <div className="relative item-center bg-amber-50/80 rounded-lg md:py-4 py-1 px-1 md:px-4 space-y-1 text-black shadow hover:shadow-md transition-shadow">
                <h3 className="font-bold text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm">Already have an account?</h3>
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="relative bg-red-900 text-white rounded-full py-1.5 px-6 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold hover:bg-red-800 shadow-md"
                  >
                    <span className="relative z-10">LOGIN</span>
                    <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                    <span
                      className="absolute inset-0 rounded-full border-4 border-yellow-500"
                      style={{
                        borderTopWidth: "3px",
                        borderBottomWidth: "5px",
                        borderLeftWidth: "4px",
                        borderRightWidth: "4px",
                      }}
                    ></span>
                  </button>
                </div>
              </div>
    
              {/* "Just browsing?" Box */}
              <div className="relative -ml-[45%] bg-[#f9e9d5] rounded-lg p-2 md:p-4 shadow hover:shadow-md transition-shadow mt-8">
                <p className="text-black text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm leading-relaxed text-start">
                  <span className="font-bold">Just browsing?</span> No worries! Order your favorite meals without
                  logging in or creating an account. Delicious food is just a few clicks away, no registration required.
                </p>
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setView("guestSuccess")}
                    className="relative bg-[#6b2c0c] text-white rounded-full py-1.5 px-6 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold hover:bg-red-800 shadow-md"
                  >
                    <span className="relative z-10">CONTINUE AS GUEST</span>
                    <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                    <span
                      className="absolute inset-0 rounded-full border-4 border-yellow-500"
                      style={{
                        borderTopWidth: "3px",
                        borderBottomWidth: "5px",
                        borderLeftWidth: "4px",
                        borderRightWidth: "4px",
                      }}
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )
      case "forgotPassword":
        return (
          <ModalWrapper onClose={onClose} title="RESET PASSWORD">
            <div className="flex flex-row gap-3 w-full md:-ml-6">
              {/* Left side - Reset Password form */}
              <div className="w-[40%] md:w-[55%]">
                <form
                  className="md:space-y-3 space-y-1 bg-amber-50/80 p-1 md:p-2 rounded-lg shadow"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleForgotPassword()
                  }}
                >
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="md:mt-2 w-full bg-white border border-gray-300 rounded p-1 md:p-1.5 sm:p-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black"
                      placeholder="E-mail"
                    />
                  </div>
                  <div className="md:pt-1 pt-0 flex justify-center md:gap-3 gap-1">
                    <button
                      type="submit"
                      className="relative bg-red-900 text-white rounded-full md:py-3 py-2 px-6 sm:px-8 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold hover:bg-red-800 shadow-md"
                    >
                      <span className="relative z-10">SUBMIT</span>
                      <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                      <span
                        className="absolute inset-0 rounded-full border-4 border-yellow-500"
                        style={{
                          borderTopWidth: "3px",
                          borderBottomWidth: "5px",
                          borderLeftWidth: "4px",
                          borderRightWidth: "4px",
                        }}
                      ></span>
                    </button>
                  </div>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setView("login")}
                      className="text-red-900 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm hover:underline font-semibold"
                    >
                      BACK TO LOGIN
                    </button>
                  </div>
                </form>
              </div>
      
              {/* Right side - info boxes */}
              <div className="w-[50%] space-y-3 -mr-24 md:-mr-56">
                {/* Empty space to make the image more visible - only on larger screens */}
                <div className="h-28 md:h-48 lg:h-48 xl:h-48 2xl:h-48 block"></div>
      
                {/* "Just browsing?" Box */}
                <div className="relative -ml-[45%] bg-[#f9e9d5] rounded-lg p-2 md:p-4 shadow hover:shadow-md transition-shadow mt-8">
                  <p className="text-black text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm leading-relaxed text-start">
                    <span className="font-bold">Just browsing?</span> No worries! Order your favorite meals without
                    logging in or creating an account. Delicious food is just a few clicks away, no registration required.
                  </p>
                  <div className="pt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setView("guestSuccess")}
                      className="relative bg-[#6b2c0c] text-white rounded-full py-1.5 px-6 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold hover:bg-red-800 shadow-md"
                    >
                      <span className="relative z-10">CONTINUE AS GUEST</span>
                      <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                      <span
                        className="absolute inset-0 rounded-full border-4 border-yellow-500"
                        style={{
                          borderTopWidth: "3px",
                          borderBottomWidth: "5px",
                          borderLeftWidth: "4px",
                          borderRightWidth: "4px",
                        }}
                      ></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ModalWrapper>
        )
      case "loginSuccess":
        return (
          <ModalWrapper onClose={onClose} title="WELCOME BACK">
            <div className="flex flex-row gap-3 w-full mt-[25%]">
              {/* Left side - Success message */}
              <div className="w-[100%] md:w-[100%]">
                <div className="bg-amber-50/80 p-1 md:p-2 rounded-lg shadow space-y-1">
                  <p className="text-black text-center text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-semibold">
                    Karibu tena, Akwaaba, Enkwan dehna met'u, T'ena yihabkha, Ekabo o!
                  </p>
                  <p className="text-gray-700 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-start">
                    You've logged in successfully. Redirecting you shortly.
                  </p>
                </div>
              </div>
            </div>
          </ModalWrapper>
        )
      case "registerSuccess":
        return (
          <ModalWrapper onClose={onClose} title="WELCOME">
            <div className="flex flex-row gap-3 w-full md:-ml-6">
              {/* Left side - Welcome message */}
              <div className="w-[40%] md:w-[55%]">
                <div className="bg-amber-50/80 p-1 md:p-2 rounded-lg shadow space-y-1">
                  <p className="text-black text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold">
                    Welcome to your new favorite food destination. Your account is ready!
                  </p>
                  <ul className="space-y-1 pl-1">
                    <li className="flex items-center text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                      <Image
                        src="/flags/kenya.png"
                        alt="Kenya"
                        width={12}
                        height={8}
                        className="mr-2 sm:w-[16px] sm:h-[10px]"
                      />
                      Karibu!
                    </li>
                    <li className="flex items-center text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                      <Image
                        src="/flags/ghana.png"
                        alt="Ghana"
                        width={12}
                        height={8}
                        className="mr-2 sm:w-[16px] sm:h-[10px]"
                      />
                      Akwaaba!
                    </li>
                    <li className="flex items-center text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                      <Image
                        src="/flags/nigeria.png"
                        alt="Nigeria"
                        width={12}
                        height={8}
                        className="mr-2 sm:w-[16px] sm:h-[10px]"
                      />
                      Ekabo!
                    </li>
                    <li className="flex items-center text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                      <Image
                        src="/flags/ethiopia.png"
                        alt="Ethiopia"
                        width={12}
                        height={8}
                        className="mr-2 sm:w-[16px] sm:h-[10px]"
                      />
                      Enkwan dehna met'u!
                    </li>
                    <li className="flex items-center text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                      <Image
                        src="/flags/eritrea.png"
                        alt="Eritrea"
                        width={12}
                        height={8}
                        className="mr-2 sm:w-[16px] sm:h-[10px]"
                      />
                      T'ena yihabkha!
                    </li>
                  </ul>
                </div>
              </div>
      
              {/* Right side - Additional info */}
              <div className="w-[50%] space-y-3 -mr-24 md:-mr-56">
                <div className="h-24 md:h-32 block"></div>
                <div className="bg-amber-50/80 rounded-lg p-2 md:p-4 space-y-1 shadow hover:shadow-md transition-shadow">
                  <p className="text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                    Whether it's spicy suya, soft injera, or smoky tilapia, your next delicious bite is just a click away.
                  </p>
                  <p className="text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black font-bold flex items-start gap-2">
                    <span>📧 We've sent you a confirmation email. Please check it to complete your registration.</span>
                  </p>
                  <p className="text-black text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm">
                    Let's make every meal a celebration of African heritage.
                  </p>
                </div>
              </div>
            </div>
          </ModalWrapper>
        )
      case "resetSent":
        return (
          <ModalWrapper onClose={onClose} title="PASSWORD RESET">
            <div className="flex flex-row gap-3 w-full">
              {/* Left side - Success message */}
              <div className="w-[100%] md:w-[100%] mt-20 mb-32 md:mb-48">
                <div className="bg-amber-50/80 p-4 md:p-10 rounded-2xl shadow space-y-3">
                  <p className="text-black text-start text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-semibold">
                    Check Your Email, Chale!
                  </p>
                  <p className="text-gray-700 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-start">
                    We don dey send password reset link to your email now-now! Abeg, check your inbox (and your spam
                    folder too o). The link go expire after 30 minutes for security reasons. No wahala!
                  </p>
                </div>
              </div>
            </div>
          </ModalWrapper>
        )
      case "guestSuccess":
        return (
          <ModalWrapper onClose={onClose} title="WELCOME GUEST">
            <div className="flex flex-row gap-3 w-full md:-ml-6">
              {/* Left side - Welcome message */}
              <div className="w-[40%] md:w-[55%] mt-4">
                <div className="bg-amber-50/80 p-3 md:p-6 md:pb-20 md:pt-10 rounded-lg shadow space-y-4">
                  <p className="text-black text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold">
                    Welcome to your new favorite food destination.
                  </p>
                  <p className="text-black text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm">
                    You can now enjoy a seamless checkout without logging in!
                  </p>
                  <p className="text-black text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold">
                    Jollof, injera, suya--your plate is just a click away.
                  </p>
                </div>
              </div>
      
              {/* Right side - info boxes */}
              <div className="w-[50%] space-y-3 -mr-24 md:-mr-56">
                {/* Empty space to make the image more visible - only on larger screens */}
                <div className="h-24 md:h-32 block"></div>
      
                {/* "Already have an account?" Box */}
                <div className="relative item-center bg-amber-50/80 rounded-lg md:py-4 py-1 px-1 md:px-4 space-y-1 text-black shadow hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm">Prefer to log or sign up?</h3>
                  <div className="pt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setView("login")}
                      className="relative bg-red-900 text-white rounded-full py-1.5 px-6 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold hover:bg-red-800 shadow-md"
                    >
                      <span className="relative z-10">LOGIN</span>
                      <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                      <span
                        className="absolute inset-0 rounded-full border-4 border-yellow-500"
                        style={{
                          borderTopWidth: "3px",
                          borderBottomWidth: "5px",
                          borderLeftWidth: "4px",
                          borderRightWidth: "4px",
                        }}
                      ></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ModalWrapper>
        )
    case "login":
    default:
      return (
        <ModalWrapper onClose={onClose} title="LOGIN">
          <div className="flex flex-row gap-3 w-full md:-ml-6">
            {/* Left side - login form */}
            <div className="w-[40%] md:w-[55%]">
              <form
                className="md:space-y-3 space-y-1 bg-amber-50/80 p-1 md:p-2  rounded-lg shadow"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleLogin()
                }}
              >
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="md:mt-2 w-full bg-white border border-gray-300 rounded p-1 md:p-1.5 sm:p-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black"
                    placeholder="E-mail"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded p-1 -mb-4 md:mb-0 md:p-1.5 sm:p-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black"
                    placeholder="Password"
                  />
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setView("forgotPassword")}
                    className="text-red-900 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="md:pt-1 pt-0 flex justify-center md:gap-3 gap-1">
                  <button
                    type="submit"
                    className="relative bg-red-900 text-white rounded-full md:py-3 py-2 px-6 sm:px-8 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold hover:bg-red-800 shadow-md"
                  >
                    <span className="relative z-10">LOGIN</span>
                    <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                    <span
                      className="absolute inset-0 rounded-full border-4 border-yellow-500"
                      style={{
                        borderTopWidth: "3px",
                        borderBottomWidth: "5px",
                        borderLeftWidth: "4px",
                        borderRightWidth: "4px",
                      }}
                    ></span>
                  </button>
                </div>
                <div className="text-center mt-1 md:mt-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm pb-1 md:pb-6">
                  <span className="text-black font-bold">New Here?</span>{" "}
                  <button
                    type="button"
                    onClick={() => setView("register")}
                    className="text-red-900 font-bold hover:underline"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>

            {/* Right side - info boxes */}
            <div className="w-[50%] space-y-3 -mr-24 md:-mr-56">
              {/* Empty space to make the image more visible - only on larger screens */}
              <div className="h-24 md:h-32 block"></div>

              {/* "Why log in?" Box */}
              <div className="relative item-center bg-amber-50/80 rounded-lg md:py-4 py-1 px-1 md:px-4 space-y-1 text-black shadow hover:shadow-md transition-shadow">
                <h3 className="font-bold text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm">Why log in?</h3>
                <p className="text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm leading-relaxed">
                  Elevate your experience on our platform. Access your order history, save favorites for quick
                  reordering, and enjoy a seamless checkout.
                </p>
              </div>

              {/* "Just browsing?" Box */}
              <div className="relative -ml-[45%] bg-[#f9e9d5] rounded-lg p-2 md:p-4 shadow hover:shadow-md transition-shadow mt-8">
                <p className="text-black text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm leading-relaxed text-start">
                  <span className="font-bold">Just browsing?</span> No worries! Order your favorite meals without
                  logging in or creating an account. Delicious food is just a few clicks away, no registration required.
                </p>
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setView("guestSuccess")}
                    className="relative bg-[#6b2c0c] text-white rounded-full py-1.5 px-6 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold hover:bg-red-800 shadow-md"
                  >
                    <span className="relative z-10">CONTINUE AS GUEST</span>
                    <span className="absolute inset-0 rounded-full border-2 border-yellow-300"></span>
                    <span
                      className="absolute inset-0 rounded-full border-4 border-yellow-500"
                      style={{
                        borderTopWidth: "3px",
                        borderBottomWidth: "5px",
                        borderLeftWidth: "4px",
                        borderRightWidth: "4px",
                      }}
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )
  }
}
