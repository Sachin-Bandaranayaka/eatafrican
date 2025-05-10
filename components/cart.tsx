"use client"
import { useState } from "react"
import Image from "next/image"
import { X, ChevronRight } from "lucide-react"
import { DeliveryInfoView } from "./delivery-info-view"
import { PaymentErrorView } from "./payment-error-view"
import { PaymentSuccessView } from "./payment-success-view"

type ViewState = "login" | "delivery" | "payment-error" | "payment-success"

export function CartComponent({ onClose }: { onClose: () => void }) {
  const [currentView, setCurrentView] = useState<ViewState>("login")
  const [showCartItems, setShowCartItems] = useState(true)
  const [showCheckout, setShowCheckout] = useState(false)

  const handleLogin = () => {
    setCurrentView("delivery")
    setShowCheckout(false) // Hide checkout view on mobile when proceeding to delivery
  }

  const handlePlaceOrder = () => {
    setCurrentView("payment-error")
  }

  const handleRetryPayment = () => {
    setCurrentView("payment-success")
  }

  const handleCartButtonClick = () => {
    setShowCartItems(true)
    setShowCheckout(false)
  }

  const handleCheckoutClick = () => {
    setShowCartItems(false)
    setShowCheckout(true)
  }

  return (
    <>
      <style jsx>{`
        .cart-container {
          position: static; /* Override fixed positioning to integrate with page flow */
          overflow-y: auto; /* Allow scrolling if content overflows */
          max-height: 85%; /* Limit height to avoid taking up too much space */
          -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
          scrollbar-width: none; /* Hide scrollbar for Firefox */
        }
        .cart-container::-webkit-scrollbar {
          display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
        }
      `}</style>
      <div className="cart-container bg-[#e68a3e] w-full max-w-[100%] mx-auto rounded-2xl relative md:mt-20 md:mb-4 mt-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-200 z-10"
        >
          <X size={20} />
        </button>

        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden mt-10 md:block bg-[#6b2c0c] rounded-r-full text-white p-2 px-4 font-bold w-32">
          YOUR CART
        </div>

        {/* Mobile Header Button - Visible only on mobile */}
        <button
          onClick={handleCartButtonClick}
          className="md:hidden flex items-center bg-[#4a8c3f] text-white p-2 px-4 font-bold rounded-r-md border-l-4 border-[#e68a3e] mb-2"
        >
          <span>YOUR CART</span>
          <ChevronRight size={16} className="ml-1" />
        </button>

        {/* Main Content - Three columns on desktop, stacked on mobile */}
        <div className="bg-[#e68a3e] flex flex-col md:flex-row relative">
          {/* First Component - Cart Items - 40% width on desktop, full width on mobile */}
          <div className={`w-full md:w-[40%] p-10 ${showCartItems ? "block" : "hidden md:block"}`}>
            <div className="bg-amber-50/80 rounded-3xl p-4 shadow">
              {/* Cart Items */}
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start gap-2 border-b border-amber-200 pb-2">
                    <div className="bg-gray-200 p-2 rounded-md w-16 h-16 flex items-center justify-center">
                      <img src="" alt="" />
                    </div>
                    <div className="flex-1">
                      <div className="text-red-600 font-bold text-sm">Meal Name</div>
                      <div className="text-xs flex items-center gap-1 text-black">
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                        Ethiopian
                      </div>
                      <div className="text-xs text-black">Restaurant Name</div>
                      <div className="text-xs flex items-center gap-1 text-black">
                        <span className="inline-block w-2 h-2 bg-gray-500 rounded-full"></span>
                        Location
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="text-black w-10 h-6 text-xs border border-blue-300 rounded text-center focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        defaultValue="1"
                      />
                      <div className="text-sm text-black">Fr. 45.00.-</div>
                      <button className="h-6 w-6 flex items-center justify-center gap-1 border border-gray-300 rounded bg-white hover:bg-gray-100">
                        <img src="/images/recycleBin.png" alt="Remove item" className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row justify-between gap-4">
                {/* Delivery Address - Left Side */}
                <div className="w-full sm:w-[50%]">
                  {currentView !== "payment-error" && currentView !== "payment-success" ? (
                    <div>
                      <p className="text-xs mb-2 text-amber-900">
                        Provide Address for us to calculate Delivery Fees and show available delivery times you can select
                      </p>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          placeholder="Postal Code"
                          className="text-xs p-2 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                        <input
                          placeholder="Town"
                          className="text-xs p-2 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                      <input
                        placeholder="Street and Housenumber"
                        className="text-xs p-2 rounded border border-gray-300 w-full mb-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <div>
                        <label className="text-xs block mb-1 text-amber-900">Select Delivery Time</label>
                        <input
                          placeholder="- - -"
                          className="text-xs p-2 rounded border border-gray-300 w-full focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-amber-900">Your order will be delivered at your specified time</p>
                      <p className="text-sm font-semibold">2. June, at 2:30 pm</p>
                    </div>
                  )}
                </div>

                {/* Order Summary - Right Side */}
                <div className="w-full sm:w-[50%] bg-[#cfe2f3] p-4 rounded-3xl flex justify-between text-black">
                  <div>
                    <div className="text-sm">Subtotal</div>
                    <div className="text-sm">Delivery Fee</div>
                    <div className="text-sm font-bold">Total</div>
                    <div className="text-xs">Inkl. MwSt.</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">Fr. 45.00.-</div>
                    <div className="text-sm">
                      {currentView === "payment-error" || currentView === "payment-success" ? "Fr. 6.00.-" : "-"}
                    </div>
                    <div className="text-sm font-bold">
                      {currentView === "payment-error" || currentView === "payment-success" ? "Fr. 51.00.-" : "-"}
                    </div>
                    <div className="text-xs">-</div>
                  </div>
                </div>
              </div>

              {/* Voucher - Hidden when in payment-error or payment-success state */}
              {currentView !== "payment-error" && currentView !== "payment-success" && (
                <div className="mt-4">
                  <input
                    placeholder="VOUCHER CODE"
                    className="text-xs p-2 rounded border border-gray-300 w-full uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Mobile Checkout Button - Only visible on mobile */}
            <button
              onClick={handleCheckoutClick}
              className="md:hidden w-full flex items-center justify-center bg-[#4a8c3f] text-white p-2 px-4 font-bold rounded-r-md border-l-4 border-[#e68a3e] mt-4"
            >
              <span>CHECKOUT</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>

          {/* Mobile Checkout View - Only visible on mobile when checkout is clicked and we're in login state */}
          {showCheckout && currentView === "login" && (
            <div className="md:hidden">
              {/* Image at the top right */}
              <div className="w-full flex justify-end p-4">
                <div className="w-32 h-32">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="African chefs"
                    width={128}
                    height={128}
                    className="w-full h-full rounded-lg shadow"
                  />
                </div>
              </div>

              {/* Login and Just Browsing sections side by side */}
              <div className="w-full flex flex-wrap">
                {/* Login Section - 50% width on mobile */}
                <div className="w-1/2 p-4">
                  <div className="bg-amber-50/80 rounded-lg p-4 relative shadow">
                    <div className="mb-4 text-center font-bold text-amber-900">LOGIN</div>

                    <div className="space-y-3 mb-4">
                      <input
                        placeholder="E-mail"
                        className="w-full p-2 rounded border border-gray-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 rounded border border-gray-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="text-center mb-4">
                      <a href="#" className="text-xs text-red-900 hover:underline font-semibold">
                        Forgot Password?
                      </a>
                    </div>

                    <div className="flex justify-center mb-3">
                      <button
                        onClick={handleLogin}
                        className="relative bg-red-900 text-white rounded-full py-2 px-6 text-sm font-bold hover:bg-red-800 shadow-md"
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
                        <span
                          className="absolute inset-0 rounded-full outline outline-2 outline-yellow-800"
                          style={{ outlineOffset: "1px" }}
                        ></span>
                      </button>
                    </div>

                    <div className="text-center text-sm mb-4">
                      <span className="text-amber-900">New Here? </span>
                      <a href="#" className="text-red-900 font-bold hover:underline">
                        Create Account
                      </a>
                    </div>
                  </div>
                </div>

                {/* Just Browsing Section - 50% width on mobile */}
                <div className="w-1/2 p-4">
                  <div className="bg-[#f9e9d5] rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-sm text-amber-900">Just browsing?</h3>
                    <p className="text-sm text-black leading-relaxed">
                      Order your favorite meals without logging in or creating an account. Delicious food is just a few
                      clicks away, no registration required.
                    </p>
                    <div className="pt-2 flex justify-center">
                      <button
                        onClick={handleLogin}
                        className="relative bg-[#6b2c0c] text-white rounded-full py-1.5 px-4 text-xs font-bold hover:bg-red-800 shadow-md"
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
                        <span
                          className="absolute inset-0 rounded-full outline outline-2 outline-amber-800"
                          style={{ outlineOffset: "1px" }}
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Layout - Hidden on mobile */}
          <div className="hidden md:block md:w-[25%] p-10 flex flex-col">
            {/* Checkout Div - Changes to ORDER SUMMARY when in payment-success state */}
            <div className="bg-[#6b2c0c] w-[40%] text-white p-2 rounded-r-full px-6 font-bold mb-10 uppercase text-center">
              {currentView === "payment-success" ? "ORDER SUMMARY" : "CHECKOUT"}
            </div>

            {/* Login Form */}
            {currentView === "login" && (
              <div className="bg-amber-50/80 rounded-2xl p-4 relative shadow">
                <div className="mb-4 text-center font-bold text-amber-900">LOGIN</div>

                <div className="space-y-6 px-14 mb-4">
                  <input
                    placeholder="E-mail"
                    className="placeholder-black w-full p-2 rounded border border-gray-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="placeholder-black w-full p-2 rounded border border-gray-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="text-center mb-4">
                  <a href="#" className="text-sm text-red-900 hover:underline font-semibold">
                    Forgot Password?
                  </a>
                </div>

                <div className="flex justify-center mb-3">
                  <button
                    onClick={handleLogin}
                    className="relative bg-red-900 text-white rounded-full py-3 px-8 text-sm font-bold hover:bg-red-800 shadow-md"
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
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{ outlineOffset: "1px" }}
                    ></span>
                  </button>
                </div>

                <div className="text-center text-sm mb-6">
                  <span className="text-black font-bold">New Here? </span>
                  <a href="#" className="text-red-900 font-bold hover:underline">
                    Create Account
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Third Component - Image and Just Browsing - 35% width on desktop - Hidden on mobile */}
          <div className="hidden md:block md:w-[35%] p-4">
            <div className="rounded-2xl p-4">
              {/* Relative wrapper for positioning */}
              <div className="relative">
                <div className="z-20">
                  <Image
                    src="/images/footer.png"
                    alt="African chefs"
                    width={150}
                    height={100}
                    className="w-[65%] h-auto rounded-lg shadow mb-4 z-20 md:ml-20"
                  />
                </div>
                {currentView === "login" && (
                  <div className="absolute bottom-10 -left-4 p-4 bg-amber-50/80 w-[60%] rounded-2xl z-50">
                    <h3 className="font-bold text-sm text-amber-900">Just browsing?</h3>
                    <p className="text-sm text-black leading-relaxed">
                      Order your favorite meals without logging in or creating an account. Delicious food is just a few
                      clicks away, no registration required.
                    </p>
                    <div className="pt-2 flex justify-center">
                      <button
                        onClick={handleLogin}
                        className="relative bg-[#6b2c0c] text-white rounded-full py-1.5 px-6 text-sm font-bold hover:bg-red-800"
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
                        <span
                          className="absolute inset-0 rounded-full"
                          style={{ outlineOffset: "1px" }}
                        ></span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Overlapping Components - These will overlap the image section - Desktop only */}
          {currentView !== "login" && (
            <div className="hidden md:block w-full md:w-[40%] p-4 absolute top-20 left-[40%] md:left-[42%] z-10">
              {currentView === "delivery" && <DeliveryInfoView onPlaceOrder={handlePlaceOrder} />}
              {currentView === "payment-error" && <PaymentErrorView onPlaceOrder={handleRetryPayment} />}
              {currentView === "payment-success" && <PaymentSuccessView />}
            </div>
          )}

          {/* Mobile Next Components - These will be full width on mobile */}
          {currentView !== "login" && (
            <div className="md:hidden w-full p-4">
              {/* Image at the top right for non-login states */}
              <div className="w-full flex justify-end mb-4">
                <div className="w-32 h-32">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="African chefs"
                    width={128}
                    height={128}
                    className="w-full h-full rounded-lg shadow"
                  />
                </div>
              </div>

              {currentView === "delivery" && <DeliveryInfoView onPlaceOrder={handlePlaceOrder} />}
              {currentView === "payment-error" && <PaymentErrorView onPlaceOrder={handleRetryPayment} />}
              {currentView === "payment-success" && <PaymentSuccessView />}
            </div>
          )}
        </div>
      </div>
    </>
  )
}