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
    setShowCheckout(false)
  }

  const handlePlaceOrder = () => {
    setCurrentView("payment-error")
  }

  const handleRetryPayment = () => {
    setCurrentView("payment-success")
  }

  const toggleCartItems = () => {
    setShowCartItems(!showCartItems)
  }

  const handleCheckoutClick = () => {
    setShowCartItems(false)
    setShowCheckout(true)
  }

  return (
    <>
      <style jsx>{`
        .cart-container {
          overflow-y: auto; /* Enable vertical scrolling */
          -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
          scrollbar-width: none; /* Hide scrollbar for Firefox */
        }
        .cart-container::-webkit-scrollbar {
          display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
        }
      `}</style>
      <div className="cart-container h-[90%] md:h-[85%] w-full max-w-[100%] mx-auto rounded-2xl relative z-60 md:mt-24 md:mb-4 mb-10 mt-20"
        style={{
          backgroundImage: `url('/images/cartdesktop.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          borderColor: '#f1c232',
          borderRadius: '10px',
        }}>

        {/* Desktop Header - Hidden on mobile */}
        <div className="ml-4 hidden mt-10 md:block bg-[url('/images/Content_Title_Background.png')] bg-contain border border-[2px] border-[#fff2ccff] rounded-r-full text-black p-2 px-4 font-bold w-32">
          CART
        </div>

        {/* Mobile Image at the top right - Only visible on mobile */}
        <div className="md:hidden w-[50%] flex ml-[50%] justify-end p-4 z-10">
          <div className="w-56 h-56 relative">
            {/* <Image
              src="/images/footer.png"
              alt="African chefs"
              width={128}
              height={128}
              className="w-full h-full rounded-lg shadow"
            /> */}
          </div>
          {/* Close Button - Positioned at the top right of the image */}
          <div className="ml-2 mt-2">
            <button
              onClick={onClose}
              className="bg-none text-black rounded-full p-1 w-6 h-6"
              type="button"
            >
              <img src="/images/cancelBtn.png" alt="Close" />
            </button>
          </div>
        </div>

        {/* Mobile Header Button - YOUR CART - Visible only on mobile */}
        <div className="md:hidden -mt-56 z-20 relative w-[50%]">
          <button
            onClick={toggleCartItems}
            className="flex items-center bg-[#4a8c3f] text-white p-2 px-4 font-bold rounded-r-2xl border-l-4 border-[#e68a3e] mb-4 min-w-40 w-auto"
          >
            <span>{currentView === "payment-success" ? "ORDER SUMMARY" : "YOUR CART"}</span>
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>

        {/* Main Content - Three columns on desktop, stacked on mobile */}
        <div className="flex flex-col md:flex-row relative">
          {/* First Component - Cart Items - 40% width on desktop, full width on mobile */}
          {showCartItems && (
            <div className="w-full md:w-[40%] p-4 md:p-10" style={{ marginTop: "-10px" }}>
              <div className="relative rounded-3xl p-4 shadow">
                {/* overlay */}
                <div
                  className="absolute inset-0 border border-[#f1c232] "
                  style={{
                    borderRadius: '10px',
                    opacity: '70%',
                    background: '#783f04ff',
                  }}
                ></div>

                {/* Cart Items */}
                <div className="relative space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start gap-2 border-b border-amber-200 pb-2">
                      <div className="bg-gray-200 p-2 rounded-md w-16 h-16 flex items-center justify-center">
                        <img src="/placeholder.svg" alt="" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[#ebeb48] font-bold text-sm">Meal Name</div>
                        <div className="text-xs text-white flex items-center gap-1 text-black">
                          {/* <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span> */}
                          Ethiopian
                        </div>
                        <div className="text-xs text-white">Restaurant Name</div>
                        <div className="text-xs flex items-center gap-1 text-white">
                          {/* <span className="inline-block w-2 h-2 bg-gray-500 rounded-full"></span> */}
                          Location
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          className="text-white w-10 h-6 text-xs border border-blue-300 rounded text-center focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          defaultValue="1"
                        />
                        <div className="text-sm text-white font-bold">Fr. 45.00.-</div>
                        <button className="h-6 w-6 flex items-center justify-center gap-1 border border-gray-300 rounded bg-white hover:bg-gray-100">
                          <img src="/images/recycleBin.png" alt="Remove item" className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Address and Order Summary side by side */}
                <div className="mt-4 flex flex-row justify-between gap-4">
                  {/* Delivery Address - Left Side */}
                  <div className="relative w-1/2">
                    {currentView !== "payment-error" && currentView !== "payment-success" ? (
                      <div>
                        <p className="text-xs mb-2 text-white">
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
                      </div>
                    ) : (
                      <div className="flex flex-col items-center mb-4 w-full">
                        <div className="flex justify-between w-full">
                          <p className="text-sm text-black">Your order will be delivered at your specified time</p>
                          <p className="text-sm text-black">2. June, at 2:30 pm</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Summary - Right Side */}
                  {currentView !== "payment-error" && currentView !== "payment-success" ? (
                    <div className="relative w-1/2 bg-[#cfe2f3] p-4 rounded-3xl flex justify-between text-black">
                      <div>
                        <div className="text-sm mb-2">Subtotal</div>
                        <div className="text-sm mb-2">Delivery Fee</div>
                        <div className="text-sm font-bold">Total</div>
                        <div className="text-xs">Inkl. MwSt.</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm">Fr. 45.00.-</div>
                        <div className="text-sm mb-2">-</div>
                        <div className="text-sm font-bold mb-2">-</div>
                        <div className="text-xs">-</div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-1/2 flex justify-between text-black">
                      <div>
                        <div className="text-sm mb-2">Subtotal</div>
                        <div className="text-sm mb-2">Delivery Fee</div>
                        <div className="text-sm font-bold">Total</div>
                        <div className="text-xs">Inkl. MwSt.</div>
                      </div>
                      <div>
                        <div className="text-sm">Fr. 45.00.-</div>
                        <div className="text-sm mb-2">Fr. 6.00.-</div>
                        <div className="text-sm font-bold mb-2">Fr. 51.00.-</div>
                        <div className="text-xs">-</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Voucher - Hidden when in payment-error or payment-success state */}
                {currentView !== "payment-error" && currentView !== "payment-success" && (
                  <div className="flex flex-row mt-4 justify-between">
                    <div className="flex flex-col">
                      <label className="text-xs mb-1 text-white relative">Select Delivery Time</label>
                      <input
                        placeholder="- - -"
                        className="relative text-xs p-2 rounded border border-gray-300 w-full focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <input
                        placeholder="VOUCHER CODE"
                        className="relative text-xs p-2 rounded border border-gray-300 w-full uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile CHECKOUT Button - Only visible on mobile */}
          <div className="md:hidden mb-4 z-20 relative">
            <button
              onClick={handleCheckoutClick}
              className="flex items-center bg-[#6b2c0c] text-white p-2 px-4 font-bold rounded-r-2xl border-l-4 border-[#e68a3e] min-w-40 w-auto"
            >
              <span>{currentView === "payment-success" ? "ORDER SUCCESSFUL" : "CHECKOUT"}</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>

          {/* Mobile Checkout View - Only visible on mobile when checkout is clicked and we're in login state */}
          {showCheckout && currentView === "login" && (
            <div className="md:hidden">
              {/* Login and Just Browsing sections side by side */}
              <div className="w-full flex flex-wrap">
                {/* Login Section - 50% width on mobile */}
                <div className="w-1/2 p-4 -mt-6">

                  <div className="relative rounded-lg p-4 relative shadow">
                    {/* overlay */}
                    <div
                      className="absolute inset-0 border border-[#f1c232] "
                      style={{
                        borderRadius: '10px',
                        opacity: '70%',
                        background: '#783f04ff',
                      }}
                    ></div>

                    <div className="relative">

                      <div className="relative mb-4 text-center font-bold text-[#ebeb48]">LOGIN</div>

                      <div className="relative space-y-3 mb-4">
                        <input
                          placeholder="E-mail"
                          className="w-full p-1 md:p-1.5 sm:p-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          className="w-full p-1 -mb-4 md:mb-0 md:p-1.5 sm:p-2 text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>

                      <div className="relative text-center mb-4">
                        <a href="#" className="text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-[#ebeb48] hover:underline font-semibold">
                          Forgot Password?
                        </a>
                      </div>

                      <div className="flex justify-center md:gap-3 gap-1 md:pt-1 pt-0">
                        <button
                          onClick={handleLogin}
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

                      <div className="text-center text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm md:mt-2 mt-1 md:pb-6 pb-1">
                        <span className="text-black font-bold">New Here? </span>
                        <a href="#" className="text-[#ebeb48] font-bold hover:underline">
                          Create Account
                        </a>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Just Browsing Section - 50% width on mobile */}
                <div className="w-1/2 p-4">
                  <div className="bg-[#fce5bb]/60 rounded-lg p-2 md:p-4 shadow hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-amber-900">Just browsing?</h3>
                    <p className="text-[8px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black leading-relaxed">
                      Order your favorite meals without logging in or creating an account. Delicious food is just a few clicks away, no registration required.
                    </p>
                    <div className="pt-2 flex justify-center">
                      <button
                        onClick={handleLogin}
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
            </div>
          )}

          {/* second component Desktop Layout - Hidden on mobile */}
          <div className="hidden md:block md:w-[25%] p-10 flex flex-col">
            <div className=" bg-[url('/images/Content_Title_Background.png')] bg-contain border border-[2px] border-[#fff2ccff]  w-full text-black p-2 rounded-r-full px-6 font-bold mb-20 -mt-20 uppercase text-center">
              {currentView === "payment-success" ? "ORDER SUMMARY" : "CHECKOUT"}
            </div>

            {currentView === "login" && (
              <div className="rounded-2xl p-4 relative shadow">
                <div
                  className="absolute inset-0 border border-[#f1c232]"
                  style={{
                    borderRadius: '10px',
                    opacity: '70%',
                    background: '#783f04ff'
                  }}
                ></div>

                <div className="relative mb-4 text-center font-bold text-white">LOGIN</div>

                <div className="relative space-y-6 px-14 mb-4">
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

                <div className="relative text-center mb-4">
                  <a href="#" className="text-sm text-[#0ff502] hover:underline font-semibold">
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
                  </button>
                </div>

                <div className="relative text-center text-sm mb-6">
                  <span className="text-white font-bold">New Here? </span>
                  <a href="#" className="text-[#0ff502] font-bold hover:underline">
                    Create Account
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Third Component - Image and Just Browsing - 35% width on desktop - Hidden on mobile */}
          <div className="hidden md:block md:w-[35%] p-4">
            <div className="rounded-2xl p-4">
              <div className="md:-mt-16">
                <button onClick={onClose} className="absolute right-14 bg-[#ff9920] rounded-full p-1 z-10" type="button">
                  <img src="/images/cancelBtnblack.png" alt="Close" className="w-4 h-4 object-contain" />
                </button>
              </div>
              <div className="relative">
                {/* <div className="z-20">
                  <Image
                    // src="/images/footer.png"
                    alt="African chefs"
                    width={150}
                    height={100}
                    className="w-[65%] h-auto rounded-lg shadow mb-4 z-20 md:ml-20"
                  />
                </div> */}

                {currentView === "login" && (
                  <div className="relative   mt-24 p-4 w-[60%] rounded-2xl z-50">
                    {/* overlay */}
                    <div
                      className="absolute inset-0 border border-[#f1c232]"
                      style={{
                        borderRadius: '10px',
                        opacity: '70%',
                        background: '#783f04ff'
                      }}
                    ></div>

                    <p className="relative text-sm text-white leading-relaxed">
                      <span className="font-bold text-sm text-white">Just browsing?  </span>
                      Order your favorite meals without logging in or creating an account. Delicious food is just a few clicks away, no registration required.
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
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Overlapping Components - Desktop only */}
          {currentView !== "login" && (
            <div className="hidden md:block w-full md:w-[40%] p-4 absolute top-20 left-[40%] md:left-[42%] z-10">
              {currentView === "delivery" && <DeliveryInfoView onPlaceOrder={handlePlaceOrder} />}
              {currentView === "payment-error" && <PaymentErrorView onPlaceOrder={handleRetryPayment} />}
              {currentView === "payment-success" && <PaymentSuccessView />}
            </div>
          )}

          {/* Mobile Next Components - Full width on mobile */}
          {currentView !== "login" && !showCartItems && (
            <div className="md:hidden w-full p-4" style={{ marginTop: "-64px" }}>
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