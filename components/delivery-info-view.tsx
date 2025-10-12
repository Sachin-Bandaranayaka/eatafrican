"use client"

interface DeliveryInfoViewProps {
  onPlaceOrder: () => void
  loading?: boolean
  subtotal?: number
  deliveryFee?: number
  discount?: number
  deliveryTime?: string
  onDeliveryTimeChange?: (value: string) => void
  voucherCode?: string
  onVoucherCodeChange?: (value: string) => void
}

export function DeliveryInfoView({ 
  onPlaceOrder, 
  loading = false,
  subtotal = 0,
  deliveryFee = 0,
  discount = 0,
  deliveryTime = '',
  onDeliveryTimeChange = () => {},
  voucherCode = '',
  onVoucherCodeChange = () => {}
}: DeliveryInfoViewProps) {
  const total = subtotal + deliveryFee - discount;
  return (
    <div className="relative rounded-3xl p-10 md:px-20 py-4 shadow mt-10 md:-mt-16 mt-0">

      {/* overlay */}
      <div
        className="absolute inset-0 border border-[#f1c232]"
        style={{
          borderRadius: '10px',
          opacity: '70%',
          background: '#783f04ff'
        }}
      ></div>

      <h2 className="relative font-bold mt-10 md:mt-0 mb-4 md:text-start text-[#ebeb48]
      text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] ">
        DELIVERY INFORMATION
      </h2>

      <div className="relative space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Firstname"
            className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] 
             p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-black"
          />
          <input
            placeholder="Last Name"
            className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] 
             p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-black"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Email"
            className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] 
             p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-black"
          />
          <input
            placeholder="Phone Number"
            className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] 
             p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-black"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Postal Code"
            className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] 
             p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-black"
          />
          <input
            placeholder="Town"
            className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] 
             p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-black"
          />
        </div>
        <input
          placeholder="Street and Housenumber"
          className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] 
           p-1 rounded border border-gray-300 w-full focus:ring-2 focus:ring-amber-500 focus:outline-none text-black"
        />
      </div>

      {/* delivery time and input field */}
      <div className="flex flex-row justify-between md:mt-4 md:mb-4">
        <div className=" ">
          <label className=" mb-1 text-white relative text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] ">
            Select Delivery Time
          </label>
        </div>
        <div className=" ">
          <input
            type="datetime-local"
            value={deliveryTime}
            onChange={(e) => onDeliveryTimeChange(e.target.value)}
            className="relative p-1 md:p-2 rounded border border-gray-300 w-full focus:ring-2 focus:ring-amber-500 focus:outline-none
            text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] text-black"
          />
        </div>
      </div>

      {/* Order Summary */}
      <div className="flex bg-white  flex-row justify-between">
        <div className="relative w-1/2 md:mb-4 md:mt-4 flex justify-between text-white">
          <div>
            <div className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]  ">Subtotal</div>
            <div className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]  ">Delivery Fee</div>
            {discount > 0 && <div className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]  ">Discount</div>}
            <div className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold">Total</div>
            <div className="text-xs">Inkl. MwSt.</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] ">Fr. {subtotal.toFixed(2)}.-</div>
            <div className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]  ">Fr. {deliveryFee.toFixed(2)}.-</div>
            {discount > 0 && <div className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] text-green-600">-Fr. {discount.toFixed(2)}.-</div>}
            <div className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold  ">Fr. {total.toFixed(2)}.-</div>
            <div className="text-xs">-</div>
          </div>
        </div>

        <div>
          {/* Voucher - Hidden when in payment-error or payment-success state */}
          <div className="flex flex-row justify-between ">
            <div className="flex flex-col justify-end mt-4">
              <input
                placeholder="VOUCHER CODE"
                value={voucherCode}
                onChange={(e) => onVoucherCodeChange(e.target.value)}
                className="relative p-1 md:p-2 rounded border border-gray-300 w-full uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none
                text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] text-black"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={onPlaceOrder}
          disabled={loading}
          className="relative bg-red-900 text-white rounded-full py-2 px-6 text-sm font-bold hover:bg-green-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10
          text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] ">
            {loading ? 'PLACING ORDER...' : 'PLACE YOUR ORDER'}
          </span>
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
  )
}
