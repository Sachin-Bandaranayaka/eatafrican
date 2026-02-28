"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { login, register, requestPasswordReset } from "@/lib/auth/client"
import { getRoleBasedRedirectUrl } from "@/lib/auth/utils"

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
  <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 z-50 mt-10 md:mt-0 ">
    {/* Outer container for positioning chef */}
    <div className="relative max-w-4xl w-[85%]  md:w-[35%] h-full -right-6 md:-mr-[950px] mt-10 md:mt-40">
      {/* Main Modal Box - Transparent background with yellow overlay */}
      <div className="relative border bg-transparent rounded-2xl w-full h-[50vh] md:h-[80vh] lg:h-[80vh] xl:h-[80vh] 2xl:h-[80vh] overflow-y-auto hide-scrollbar shadow-xl " style={{
        backgroundColor: 'rgba(241, 194, 50, 0.1)',
        borderColor: '#f1c232',
        borderRadius: '10px'
      }}>
        {/* Top-right chef group image - moved behind everything */}
        {/* <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-6 right-8 w-48 h-48 md:w-48 md:h-64 sm:w-64 sm:h-80 lg:w-80 lg:h-96 pointer-events-none  sm:block overflow-hidden">
            <Image
              src="/images/login-group-chef.png"
              alt="Group of African chefs"
              fill
              className="object-cover object-center"
            />
          </div>
        </div> */}

        {/* Title and Close Button - Aligned horizontally */}
        <div className="flex flex-row justify-between items-center z-10 mt-4 ">
          <div className="flex items-center gap-1 text-white text-[10px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] font-bold whitespace-nowrap ml-6 inline-block border-b border-white pb-1">
            <Image src="/images/folk_link.png" alt="Folk Link" width={20} height={20} />
            <span style={{color: '#F2C94C'}}>Login</span>
          </div>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="bg-[#ff9920] text-black border rounded-full p-1 z-30"
            type="button"
          >
            <img
              src="/images/cancelBtnBlack.png"
              alt="Close"
              className="w-4 h-4 object-contain"
            />
          </button>
        </div>

        {/* Inner Content Area - Adjusted padding */}
        <div className="flex flex-row pt-4 sm:pt-5 p-4 sm:p-6 md:p-8 relative z-10">{children}</div>

        {/* Chef image - Positioned bottom-left relative to outer container */}
        {/* <div className="absolute bottom-0 -left-6 w-32 h-52 md:w-40 md:h-72 sm:left-0 sm:w-48 sm:h-96 lg:w-52 lg:h-80 pointer-events-none z-20">
          <Image src="/images/login-person.png" alt="African chef" fill className="object-contain object-bottom" />
        </div> */}
      </div>
    </div>
  </div>
)

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [view, setView] = useState<ModalView>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  // --- Handlers ---
  const handleLogin = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await login({ email, password })
      
      if (result.error) {
        setError(result.error.message)
        setLoading(false)
        return
      }

      setView("loginSuccess")
      
      // Redirect based on user role after 2 seconds
      setTimeout(() => {
        const redirectUrl = result.user ? getRoleBasedRedirectUrl(result.user.role as any) : "/restaurants"
        window.location.href = redirectUrl
      }, 2000)
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setLoading(true)
    setError("")

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Validate password requirements
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#]{8,}$/
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters with an uppercase letter, number, and special character")
      setLoading(false)
      return
    }

    try {
      const result = await register({ 
        email, 
        password, 
        firstName, 
        lastName 
      })
      
      if (result.error) {
        setError(result.error.message)
        setLoading(false)
        return
      }

      // Account created successfully - automatically log in since backend returns tokens
      setView("loginSuccess")
      
      // Redirect based on user role after 2 seconds (new customers go to restaurants page)
      setTimeout(() => {
        const redirectUrl = result.user ? getRoleBasedRedirectUrl(result.user.role as any) : "/restaurants"
        window.location.href = redirectUrl
      }, 2000)
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await requestPasswordReset(email)
      
      if (!result.success) {
        setError(result.error?.message || "Failed to send reset email")
        setLoading(false)
        return
      }

      setView("resetSent")
      setLoading(false)
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
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
                className="relative md:space-y-3 space-y-1 border border-[#f1c232] p-1 md:p-2 rounded-lg shadow"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleRegister()
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    borderRadius: '10px',
                    opacity: '70%',
                    background: '#783f04ff'
                  }}
                ></div>
                <div>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="relative md:mt-2 w-full bg-white border border-gray-300 rounded p-1 md:p-1.5 sm:p-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="relative w-full bg-white border border-gray-300 rounded p-1 md:p-1.5 sm:p-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black"
                    placeholder="Last Name"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="relative w-full bg-white border border-gray-300 rounded p-1 md:p-1.5 sm:p-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black"
                    placeholder="E-mail"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="relative w-full bg-white border border-gray-300 rounded p-1 -mb-4 md:mb-0 md:p-1.5 sm:p-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black"
                    placeholder="Password"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="relative w-full bg-white border border-gray-300 rounded p-1 -mb-4 md:mb-0 md:p-1.5 sm:p-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black"
                    placeholder="Confirm Password"
                    required
                  />
                </div>
                {error && (
                  <div className="relative">
                    <p className="text-red-300 text-[8px] md:text-xs">{error}</p>
                  </div>
                )}
                {/* <p className="text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-white">
                  <span className="text-10"> Your password must include</span>
                  
                    least 8 characters long and include an uppercase letter, a number, and a special character.
                  
                </p> */}
                <div className="p-2 relative">
                  <div className="text-white text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm leading-relaxed text-start">
                    <span className="font-bold ">Your password must include</span>
                    <ul className="list-none mt-1">
                      <li>- an uppercase letter</li>
                      <li>- a number</li>
                      <li>- a special character</li>
                    </ul>
                  </div>
                </div>

                <div className="md:pt-1 pt-0 flex justify-center md:gap-3 gap-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative bg-red-900 text-white rounded-full md:py-2 py-2 px-6 sm:px-8 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold hover:bg-red-800 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10">{loading ? "REGISTERING..." : "REGISTER"}</span>
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
              <div className="relative item-center border border-[#f1c232] rounded-lg md:py-4 py-1 px-1 md:px-4 space-y-1 text-white shadow hover:shadow-md transition-shadow">
                <div
                  className="absolute inset-0"
                  style={{
                    borderRadius: '10px',
                    opacity: '70%',
                    background: '#783f04ff'
                  }}
                ></div>

                <h3 className="relative font-bold text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm">Already have an account?</h3>
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

            {/* "No Account? No Worries!" Box */}
            <div className="w-[50%] space-y-3 -mr- md:-mr-48 mt-6 md:mt-0">
              <div className="h-48 md:h-[100%] block"></div>
              <div className="relative -ml-[120%] border border-[#f1c232] rounded-lg p-2 md:p-4 shadow hover:shadow-md transition-shadow mt-8">
                <div
                  className="absolute inset-0"
                  style={{
                    borderRadius: '10px',
                    opacity: '70%',
                    background: '#783f04ff'
                  }}
                ></div>
                <p className="relative text-white text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm leading-relaxed text-start">
                  <span className="font-bold text-[#ebeb48]">No Account? No Worries!</span> Order your favorite meals without logging in or creating an account. As you place your order, simply choose the Guest Checkout option during the checkout stage. Delicious food is just a few clicks away, no registration required.
                </p>
                <div className="pt-2 flex justify-center">
                  {/* <button
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
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )
    case "forgotPassword":
      return (
        <ModalWrapper onClose={onClose} title="RESET PASSWORD">
          <div className="flex flex-row gap-3 w-[90%] md:-ml-6">

            {/* Left side - Reset Password form */}
            <div className="w-[60%] md:w-[100%] ">
              <form
                className="relative md:space-y-3 space-y-1 border border-[#f1c232] p-1 md:p-2 rounded-lg shadow"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleForgotPassword()
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    borderRadius: '10px',
                    opacity: '70%',
                    background: '#783f04ff'
                  }}
                ></div>
                <div className="flex items-center flex-col ">
                  <p className="relative p-2 md:p-10 text-white text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm leading-relaxed text-start">
                    Enter the email address associated with your account, and we’ll send you instructions to reset your password.
                  </p>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="relative md:mt-2 md:w-[50%] bg-white border border-gray-300 rounded p-1 md:p-1.5 sm:p-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black"
                    placeholder="E-mail"
                    required
                  />
                </div>

                {error && (
                  <div className="relative">
                    <p className="text-red-300 text-[8px] md:text-xs text-center">{error}</p>
                  </div>
                )}

                <div className="md:pt-1 pt-0 flex justify-center md:gap-3 gap-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative bg-red-900 text-white rounded-full md:py-3 py-2 px-6 sm:px-8 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold hover:bg-red-800 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10">{loading ? "SUBMITTING..." : "SUBMIT"}</span>
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

                <div className="text-center justify-center flex">
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="relative text-[#0ff502] text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm hover:underline font-semibold"
                  >
                    BACK TO LOGIN
                  </button>
                </div>
              </form>
            </div>

            {/* Right side - info boxes */}
            {/* <div className="relative w-[90%] space-y-3 -mr- md:-mr-6"> */}
            {/* Empty space to make the image more visible - only on larger screens */}
            {/* <div className="h-28 md:h-48 lg:h-48 xl:h-48 2xl:h-48 block"></div> */}

            {/* "Just browsing?" Box */}
            {/* <div className="relative -ml-[60%] bg-black opacity-[75%] border border-[#f1c232] rounded-lg p-2 md:p-4 shadow hover:shadow-md transition-shadow mt-8">
                <p className="text-white text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm leading-relaxed text-start">
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
              </div> */}
            {/* </div> */}
          </div>
        </ModalWrapper>
      )
    case "loginSuccess":
      return (
        <ModalWrapper onClose={onClose} title="WELCOME BACK">
          <div className="flex flex-row gap-3 w-full mt-[10%]">
            {/* Left side - Success message */}
            <div className="w-[100%] md:w-[50%]">

              <div className="relative p-1 md:p-4 rounded-lg shadow space-y-1">
                <div
                  className="absolute inset-0 border border-[#f1c232] "
                  style={{
                    borderRadius: '10px',
                    opacity: '70%',
                    background: '#783f04ff',
                  }}
                ></div>
                <div className="relative md:mb-7">
                  <p className="text-[#ebeb48] text-center text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-semibold">
                    Karibu tena, Akwaaba, Enkwan dehna met'u, T'ena yihabkha, Ekabo o!
                  </p>
                </div>
                <div className="mt-10 relative">
                  <p className="text-white text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-center">
                    You've logged in successfully. Redirecting you shortly.
                  </p>
                </div>
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
              <div className="relative border border-[#f1c232] p-1 py-5 md:p-4 md:py-10 rounded-lg shadow ">
                <div
                  className="absolute inset-0"
                  style={{
                    borderRadius: '10px',
                    opacity: '70%',
                    background: '#783f04ff'
                  }}
                ></div>
                <p className="relative text-white text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold mb-3">
                  🎉 Your account has been created successfully!
                </p>
                <p className="relative text-white text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm">
                  You can now log in and start exploring delicious African cuisine.
                </p>
                <div className="pt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="relative bg-red-900 text-white rounded-full py-1.5 px-6 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold hover:bg-red-800 shadow-md"
                  >
                    <span className="relative z-10">LOGIN NOW</span>
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
                {/* <ul className="space-y-1 pl-1">
                  <li className="flex items-center text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-white">
                    <Image
                      src="/flags/kenya.png"
                      alt="Kenya"
                      width={12}
                      height={8}
                      className="mr-2 sm:w-[16px] sm:h-[10px]"
                    />
                    Karibu!
                  </li>
                  <li className="flex items-center text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-white">
                    <Image
                      src="/flags/ghana.png"
                      alt="Ghana"
                      width={12}
                      height={8}
                      className="mr-2 sm:w-[16px] sm:h-[10px]"
                    />
                    Akwaaba!
                  </li>
                  <li className="flex items-center text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-white">
                    <Image
                      src="/flags/nigeria.png"
                      alt="Nigeria"
                      width={12}
                      height={8}
                      className="mr-2 sm:w-[16px] sm:h-[10px]"
                    />
                    Ekabo!
                  </li>
                  <li className="flex items-center text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-white">
                    <Image
                      src="/flags/ethiopia.png"
                      alt="Ethiopia"
                      width={12}
                      height={8}
                      className="mr-2 sm:w-[16px] sm:h-[10px]"
                    />
                    Enkwan dehna met'u!
                  </li>
                  <li className="flex items-center text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-white">
                    <Image
                      src="/flags/eritrea.png"
                      alt="Eritrea"
                      width={12}
                      height={8}
                      className="mr-2 sm:w-[16px] sm:h-[10px]"
                    />
                    T'ena yihabkha!
                  </li>
                </ul> */}
              </div>
            </div>

            {/* Right side - Additional info */}
            {/* <div className="w-[50%] space-y-3 -mr-24 md:-mr-56">
              <div className="h-24 md:h-32 block"></div>
              <div className="bg-black opacity-[75%] border border-[#f1c232] rounded-lg p-2 md:p-4 space-y-1 shadow hover:shadow-md transition-shadow">
                <p className="text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-white">
                  Whether it's spicy suya, soft injera, or smoky tilapia, your next delicious bite is just a click away.
                </p>
                <p className="text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-white font-bold flex items-start gap-2">
                  <span>📧 We've sent you a confirmation email. Please check it to complete your registration.</span>
                </p>
                <p className="text-white text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm">
                  Let's make every meal a celebration of African heritage.
                </p>
              </div>
            </div> */}
          </div>
        </ModalWrapper>
      )
    case "resetSent":
      return (
        <ModalWrapper onClose={onClose} title="RESET PASSWORD">
          <div className="flex flex-row gap-3 w-full">
            {/* Left side - Success message */}
            <div className="w-[100%] md:w-[70%] mt-6 mb-32 md:mb-48">
              <div className="relative border border-[#f1c232] p-4 md:p-10 rounded-2xl shadow space-y-3">
                <div
                  className="absolute inset-0"
                  style={{
                    borderRadius: '10px',
                    opacity: '70%',
                    background: '#783f04ff'
                  }}
                ></div>
                <div className="relative space-y-2">
                  <p className="text-[#ebeb48] text-start text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-semibold">
                    Reset Instruction Sent!
                  </p>
                  <p className="text-white text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-start">
                    We don dey send password reset link to your email now-now! Abeg, check your inbox (and your spam
                    folder too o). The link go expire after 30 minutes for security reasons. No wahala!
                  </p>
                </div>
                <div className="text-center justify-center flex">
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="mt-6 relative text-[#0ff502] text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm hover:underline font-semibold"
                  >
                    BACK TO LOGIN
                  </button>
                </div>
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
            <div className="relative w-[40%] md:w-[55%] mt-4">
              <div
                className="absolute inset-0 border border-[#f1c232]"
                style={{
                  borderRadius: '10px',
                  opacity: '70%',
                  background: '#783f04ff'
                }}
              ></div>
              <div className="relative p-3 md:p-6 md:pb-20 md:pt-10 rounded-lg shadow space-y-4">
                <p className="text-white text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold">
                  Welcome to your new favorite food destination.
                </p>
                <p className="text-white text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm">
                  You can now enjoy a seamless checkout without logging in!
                </p>
                <p className="text-white text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold">
                  Jollof, injera, suya--your plate is just a click away.
                </p>
              </div>
            </div>

            {/* Right side - info boxes */}
            <div className="w-[50%] space-y-3 -mr-24 md:-mr-56">
              {/* Empty space to make the image more visible - only on larger screens */}
              <div className="h-24 md:h-32 block"></div>

              {/* "Already have an account?" Box */}
              <div className="relative item-center rounded-lg md:py-4 py-1 px-1 md:px-4 space-y-1 text-black shadow hover:shadow-md transition-shadow">
                
                {/* overlay */}
                <div
                  className="absolute inset-0 border border-[#f1c232] "
                  style={{
                    borderRadius: '10px',
                    opacity: '70%',
                    background: '#783f04ff',
                  }}
                ></div>

                <h3 className="relative text-white font-bold text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm">Prefer to log or sign up?</h3>
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
            <div className="w-[40%] md:w-[55%] mx-auto">
              <form
                className="relative md:space-y-3 space-y-1 p-1 md:p-2  rounded-lg shadow"
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
                    className="relative md:mt-2 w-full bg-white border border-gray-300 rounded p-1 md:p-1.5 sm:p-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black"
                    placeholder="E-mail"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="relative w-full bg-white border border-gray-300 rounded p-1 -mb-4 md:mb-0 md:p-1.5 sm:p-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-gray-800 focus:ring-2 focus:ring-amber-500 placeholder-black"
                    placeholder="Password"
                  />
                </div>
                {error && (
                  <div className="relative">
                    <p className="text-red-300 text-[8px] md:text-xs text-center">{error}</p>
                  </div>
                )}
                <div className="text-center relative">
                  <button
                    type="button"
                    onClick={() => setView("forgotPassword")}
                    className="relative text-white text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="md:pt-1 pt-0 flex justify-center md:gap-3 gap-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-900 text-white rounded-full md:py-3 py-2 px-6 sm:px-8 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-bold hover:bg-red-800 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Image src="/images/folk_link.png" alt="Folk Link" width={20} height={20} />
                    <span style={{color: '#F2C94C'}}>{loading ? "LOGGING IN..." : "Login"}</span>
                  </button>
                </div>
                <div className="relative text-center mt-1 md:mt-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm pb-1 md:pb-6">
                  <span className="text-white font-bold">New Here?</span>{" "}
                  <button
                    type="button"
                    onClick={() => setView("register")}
                    className="text-[#0ff502] font-bold hover:underline"
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


            </div>
          </div>
        </ModalWrapper>
      )
  }
}
