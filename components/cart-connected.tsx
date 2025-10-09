"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { X, ChevronRight } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { DeliveryInfoView } from "./delivery-info-view"
import { PaymentErrorView } from "./payment-error-view"
import { PaymentSuccessView } from "./payment-success-view"

type ViewState = "login" | "delivery" | "payment-error" | "payment-success"

export function CartComponent({ onClose }: { onClose: () => void }) {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  
  const [currentView, setCurrentView] = useState<ViewState>("login")
  const [showCartItems, setShowCartItems] = useState(true)
  const [showCheckout, setShowCheckout] = useState(false)
  
  // Form states
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    postalCode: ''
  });
  const [deliveryTime, setDeliveryTime] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(6.00);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Calculate delivery fee when address changes
  useEffect(() => {
    if (deliveryAddress.postalCode && deliveryAddress.city) {
      // Calculate delivery fee based on postal code
      const postalCode = parseInt(deliveryAddress.postalCode);
      
      if (isNaN(postalCode)) {
        setDeliveryFee(6.00);
        return;
      }
      
      // Swiss postal code based delivery fee calculation
      // Basel area (4000-4999): Fr. 6.00
      // Zurich area (8000-8999): Fr. 8.00
      // Bern area (3000-3999): Fr. 7.00
      // Geneva area (1200-1299): Fr. 9.00
      // Other areas: Fr. 10.00
      
      if (postalCode >= 4000 && postalCode <= 4999) {
        setDeliveryFee(6.00);
      } else if (postalCode >= 8000 && postalCode <= 8999) {
        setDeliveryFee(8.00);
      } else if (postalCode >= 3000 && postalCode <= 3999) {
        setDeliveryFee(7.00);
      } else if (postalCode >= 1200 && postalCode <= 1299) {
        setDeliveryFee(9.00);
      } else {
        setDeliveryFee(10.00);
      }
    } else {
      setDeliveryFee(6.00);
    }
  }, [deliveryAddress]);

  const handleLogin = () => {
    setCurrentView("delivery")
    setShowCheckout(false)
  }

  const validateVoucher = async () => {
    if (!voucherCode) return;
    
    try {
      // Note: You'll need to create a voucher validation endpoint
      // For now, we'll skip validation
      setDiscount(0);
    } catch (error) {
      console.error('Error validating voucher:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.postalCode) {
      alert('Please provide delivery address');
      return;
    }
    
    if (!deliveryTime) {
      alert('Please select delivery time');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      // Convert datetime-local format to ISO 8601
      const scheduledTime = new Date(deliveryTime).toISOString();
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          restaurantId: items[0].restaurantId,
          items: items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            specialInstructions: ''
          })),
          deliveryAddress: deliveryAddress.street,
          deliveryCity: deliveryAddress.city,
          deliveryPostalCode: deliveryAddress.postalCode,
          scheduledDeliveryTime: scheduledTime,
          voucherCode: voucherCode || undefined
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        clearCart();
        setCurrentView('payment-success');
      } else {
        const error = await response.json();
        console.error('Order error:', error);
        setCurrentView('payment-error');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setCurrentView('payment-error');
    } finally {
      setLoading(false);
    }
  }

  const handleRetryPayment = () => {
    handlePlaceOrder();
  }

  const toggleCartItems = () => {
    setShowCartItems(!showCartItems)
  }

  const handleCheckoutClick = () => {
    setShowCartItems(false)
    setShowCheckout(true)
  }

  const subtotal = getTotalPrice();
  const total = subtotal + deliveryFee - discount;

  return (
    <>
      <style jsx>{`
        .cart-container {
          overflow-y: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .cart-container::-webkit-scrollbar {
          display: none;
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

        {/* Desktop Header */}
        <div className="ml-4 hidden mt-10 md:block bg-[url('/images/Content_Title_Background.png')] bg-contain border border-[2px] border-[#fff2ccff] rounded-r-full text-black p-2 px-4 font-bold w-32">
          CART
        </div>

        {/* Mobile Header */}
        <div className="md:hidden w-[50%] flex ml-[50%] justify-end p-4 z-10">
          <div className="w-56 h-56 relative"></div>
          <div className="ml-2 mt-2">
            <button onClick={onClose} className="bg-none text-black rounded-full p-1 w-6 h-6" type="button">
              <img src="/images/cancelBtn.png" alt="Close" />
            </button>
          </div>
        </div>

        <div className="md:hidden -mt-56 z-20 relative w-[50%]">
          <button
            onClick={toggleCartItems}
            className="flex items-center bg-[#4a8c3f] text-white p-2 px-4 font-bold rounded-r-2xl border-l-4 border-[#e68a3e] mb-4 min-w-40 w-auto"
          >
            <span>{currentView === "payment-success" ? "ORDER SUMMARY" : "YOUR CART"}</span>
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row relative">
          {/* Cart Items Section */}
          {showCartItems && (
            <div className="w-full md:w-[40%] p-4 md:p-10" style={{ marginTop: "-10px" }}>
              <div className="relative rounded-3xl p-4 shadow">
                <div
                  className="absolute inset-0 border border-[#f1c232]"
                  style={{
                    borderRadius: '10px',
                    opacity: '70%',
                    background: '#783f04ff',
                  }}
                ></div>

                {/* Cart Items */}
                <div className="relative space-y-4">
                  {items.length === 0 ? (
                    <p className="text-center text-white py-4">Your cart is empty</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex items-start gap-2 border-b border-amber-200 pb-2">
                        <div className="bg-gray-200 p-2 rounded-md w-16 h-16 flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                          ) : (
                            <img src="/placeholder.svg" alt="" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-[#ebeb48] font-bold text-sm">{item.name}</div>
                          <div className="text-xs text-white">{item.restaurantName}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.menuItemId, parseInt(e.target.value) || 1)}
                            className="text-black w-10 h-6 text-xs border border-blue-300 rounded text-center focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                          <div className="text-sm text-white font-bold">Fr. {(item.price * item.quantity).toFixed(2)}.-</div>
                          <button 
                            onClick={() => removeItem(item.menuItemId)}
                            className="h-6 w-6 flex items-center justify-center gap-1 border border-gray-300 rounded bg-white hover:bg-gray-100"
                          >
                            <img src="/images/recycleBin.png" alt="Remove item" className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Delivery Address and Order Summary */}
                <div className="mt-4 flex flex-row justify-between gap-4">
                  {/* Delivery Address */}
                  <div className="relative w-1/2">
                    {currentView !== "payment-error" && currentView !== "payment-success" ? (
                      <div>
                        <p className="text-xs mb-2 text-white">
                          Provide Address for us to calculate Delivery Fees
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <input
                            placeholder="Postal Code"
                            value={deliveryAddress.postalCode}
                            onChange={(e) => setDeliveryAddress({...deliveryAddress, postalCode: e.target.value})}
                            className="text-xs p-2 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-black"
                          />
                          <input
                            placeholder="Town"
                            value={deliveryAddress.city}
                            onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                            className="text-xs p-2 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-black"
                          />
                        </div>
                        <input
                          placeholder="Street and Housenumber"
                          value={deliveryAddress.street}
                          onChange={(e) => setDeliveryAddress({...deliveryAddress, street: e.target.value})}
                          className="text-xs p-2 rounded border border-gray-300 w-full mb-2 focus:ring-2 focus:ring-amber-500 focus:outline-none text-black"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center mb-4 w-full">
                        <div className="flex justify-between w-full">
                          <p className="text-sm text-white">Delivery at:</p>
                          <p className="text-sm text-white">{deliveryTime}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="relative w-1/2 bg-[#cfe2f3] p-4 rounded-3xl flex justify-between text-black">
                    <div>
                      <div className="text-sm mb-2">Subtotal</div>
                      <div className="text-sm mb-2">Delivery Fee</div>
                      {discount > 0 && <div className="text-sm mb-2">Discount</div>}
                      <div className="text-sm font-bold">Total</div>
                      <div className="text-xs">Inkl. MwSt.</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">Fr. {subtotal.toFixed(2)}.-</div>
                      <div className="text-sm mb-2">Fr. {deliveryFee.toFixed(2)}.-</div>
                      {discount > 0 && <div className="text-sm mb-2 text-green-600">-Fr. {discount.toFixed(2)}.-</div>}
                      <div className="text-sm font-bold mb-2">Fr. {total.toFixed(2)}.-</div>
                      <div className="text-xs">-</div>
                    </div>
                  </div>
                </div>

                {/* Voucher and Delivery Time */}
                {currentView !== "payment-error" && currentView !== "payment-success" && (
                  <div className="flex flex-row mt-4 justify-between">
                    <div className="flex flex-col">
                      <label className="text-xs mb-1 text-white relative">Select Delivery Time</label>
                      <input
                        type="datetime-local"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="relative text-xs p-2 rounded border border-gray-300 w-full focus:ring-2 focus:ring-amber-500 focus:outline-none text-black"
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <input
                        placeholder="VOUCHER CODE"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        onBlur={validateVoucher}
                        className="relative text-xs p-2 rounded border border-gray-300 w-full uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none text-black"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Checkout Button - Mobile */}
          <div className="md:hidden mb-4 z-20 relative">
            <button
              onClick={handleCheckoutClick}
              className="flex items-center bg-[#6b2c0c] text-white p-2 px-4 font-bold rounded-r-2xl border-l-4 border-[#e68a3e] min-w-40 w-auto"
            >
              <span>{currentView === "payment-success" ? "ORDER SUCCESSFUL" : "CHECKOUT"}</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>

          {/* Login/Checkout Section - Desktop */}
          <div className="hidden md:block md:w-[25%] p-10 flex flex-col">
            <div className="bg-[url('/images/Content_Title_Background.png')] bg-contain border border-[2px] border-[#fff2ccff] w-full text-black p-2 rounded-r-full px-6 font-bold mb-20 -mt-20 uppercase text-center">
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

          {/* Guest Checkout Info - Desktop */}
          <div className="hidden md:block md:w-[35%] p-4">
            <div className="rounded-2xl p-4">
              <div className="md:-mt-16">
                <button onClick={onClose} className="absolute right-14 bg-[#ff9920] rounded-full p-1 z-10" type="button">
                  <img src="/images/cancelBtnblack.png" alt="Close" className="w-4 h-4 object-contain" />
                </button>
              </div>
              <div className="relative">
                {currentView === "login" && (
                  <div className="relative mt-24 p-4 w-[60%] rounded-2xl z-50">
                    <div
                      className="absolute inset-0 border border-[#f1c232]"
                      style={{
                        borderRadius: '10px',
                        opacity: '70%',
                        background: '#783f04ff'
                      }}
                    ></div>

                    <p className="relative text-sm text-white leading-relaxed">
                      <span className="font-bold text-sm text-white">Just browsing? </span>
                      Order your favorite meals without logging in or creating an account.
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

          {/* Delivery/Payment Views - Desktop */}
          {currentView !== "login" && (
            <div className="hidden md:block w-full md:w-[40%] p-4 absolute top-20 left-[40%] md:left-[42%] z-10">
              {currentView === "delivery" && (
                <DeliveryInfoView 
                  onPlaceOrder={handlePlaceOrder} 
                  loading={loading}
                  subtotal={subtotal}
                  deliveryFee={deliveryFee}
                  discount={discount}
                  deliveryTime={deliveryTime}
                  onDeliveryTimeChange={setDeliveryTime}
                  voucherCode={voucherCode}
                  onVoucherCodeChange={setVoucherCode}
                />
              )}
              {currentView === "payment-error" && <PaymentErrorView onPlaceOrder={handleRetryPayment} />}
              {currentView === "payment-success" && <PaymentSuccessView />}
            </div>
          )}

          {/* Delivery/Payment Views - Mobile */}
          {currentView !== "login" && !showCartItems && (
            <div className="md:hidden w-full p-4" style={{ marginTop: "-64px" }}>
              {currentView === "delivery" && (
                <DeliveryInfoView 
                  onPlaceOrder={handlePlaceOrder} 
                  loading={loading}
                  subtotal={subtotal}
                  deliveryFee={deliveryFee}
                  discount={discount}
                  deliveryTime={deliveryTime}
                  onDeliveryTimeChange={setDeliveryTime}
                  voucherCode={voucherCode}
                  onVoucherCodeChange={setVoucherCode}
                />
              )}
              {currentView === "payment-error" && <PaymentErrorView onPlaceOrder={handleRetryPayment} />}
              {currentView === "payment-success" && <PaymentSuccessView />}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
