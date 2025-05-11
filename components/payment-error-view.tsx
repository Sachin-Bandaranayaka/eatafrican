"use client"

interface PaymentErrorViewProps {
  onPlaceOrder: () => void
}

export function PaymentErrorView({ onPlaceOrder }: PaymentErrorViewProps) {
  return (
    <div className="bg-amber-50/80 rounded-3xl p-4 px-10 shadow md:mt-0 mt-10">
      <div className="text-red-600 font-bold md:text-start mt-6 mb-4 text-[20px]">
        We couldn&apos;t process your payment.
        <p className="font-normal text-black">Please try another card or payment method.</p>
      </div>


      <div className="space-y-3 px-10 mb-4 bg-amber-50/90 rounded-3xl p-4">
        <h2 className="font-bold mb-4 md:text-start text-amber-900">PAYMENT METHOD</h2>

        <input
          placeholder="Name on Card"
          className="text-sm p-2 rounded border border-gray-300 w-full focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
        <input
          placeholder="Card Number"
          className="text-sm p-2 rounded border border-gray-300 w-full focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Expiry Date"
            className="text-sm p-2 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <input
            placeholder="CVV"
            className="text-sm p-2 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>


        <div className="flex justify-center">
          <button
            onClick={onPlaceOrder}
            className="relative mt-6 bg-[#4a8c3f] text-white rounded-full py-2 px-6 text-sm font-bold hover:bg-green-700 shadow-md"
          >
            <span className="relative z-10">PLACE YOUR ORDER</span>
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
  )
}
