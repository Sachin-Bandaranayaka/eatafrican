"use client"

interface DeliveryInfoViewProps {
  onPlaceOrder: () => void
}

export function DeliveryInfoView({ onPlaceOrder }: DeliveryInfoViewProps) {
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
             p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <input
            placeholder="Last Name"
            className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] 
             p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Email"
            className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] 
             p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <input
            placeholder="Phone Number"
            className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] 
             p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Postal Code"
            className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] 
             p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <input
            placeholder="Town"
            className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] 
             p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>
        <input
          placeholder="Street and Housenumber"
          className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] 
           p-1 rounded border border-gray-300 w-full focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
            placeholder="- - -"
            className="relative p-1 md:p-2 rounded border border-gray-300 w-full focus:ring-2 focus:ring-amber-500 focus:outline-none
            text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] "
          />
        </div>
      </div>

      {/* Order Summary */}
      <div className="flex bg-white  flex-row justify-between">
        <div className="relative w-1/2 md:mb-4 md:mt-4 flex justify-between text-white">
          <div>
            <div className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]  ">Subtotal</div>
            <div className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]  ">Delivery Fee</div>
            <div className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold">Total</div>
            <div className="text-xs">Inkl. MwSt.</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] ">Fr. 45.00.-</div>
            <div className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px]  ">-</div>
            <div className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] font-bold  ">-</div>
            <div className="text-xs">-</div>
          </div>
        </div>

        <div>
          {/* Voucher - Hidden when in payment-error or payment-success state */}
          <div className="flex flex-row justify-between ">
            <div className="flex flex-col justify-end mt-4">
              <input
                placeholder="VOUCHER CODE"
                className="relative p-1 md:p-2 rounded border border-gray-300 w-full uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none
                text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] "
              />
            </div>
          </div>
        </div>
      </div>

      <h2 className="relative font-bold mb-4 mt-4 md:text-start text-[#ebeb48]
      text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] ">
        PAYMENT METHOD
      </h2>

      <div className="relative space-y-3 mb-4">
        <input
          placeholder="Name on Card"
          className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] 
          p-1 rounded border border-gray-300 w-full focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
        <input
          placeholder="Card Number"
          className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] 
          p-1 rounded border border-gray-300 w-full focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Expiry Date"
            className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] 
            p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <input
            placeholder="CVV"
            className="text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] 
            p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onPlaceOrder}
          className="relative bg-red-900 text-white rounded-full py-2 px-6 text-sm font-bold hover:bg-green-700 shadow-md"
        >
          <span className="relative z-10
          text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] ">
            PLACE YOUR ORDER
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
