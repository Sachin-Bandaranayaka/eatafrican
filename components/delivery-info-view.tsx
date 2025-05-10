"use client"

interface DeliveryInfoViewProps {
  onPlaceOrder: () => void
}

export function DeliveryInfoView({ onPlaceOrder }: DeliveryInfoViewProps) {
  return (
    <div className="bg-amber-50/80 rounded-3xl px-20 py-4 shadow">
      <h2 className="font-bold mb-4 md:text-start text-amber-900">DELIVERY INFORMATION</h2>

      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Firstname"
            className="text-sm p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <input
            placeholder="Last Name"
            className="text-sm p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Email"
            className="text-sm p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <input
            placeholder="Phone Number"
            className="text-sm p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Postal Code"
            className="text-sm p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <input
            placeholder="Town"
            className="text-sm p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>
        <input
          placeholder="Street and Housenumber"
          className="text-sm p-1 rounded border border-gray-300 w-full focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
      </div>

      <h2 className="font-bold mb-4 md:text-start text-amber-900">PAYMENT METHOD</h2>

      <div className="space-y-3 mb-4">
        <input
          placeholder="Name on Card"
          className="text-sm p-1 rounded border border-gray-300 w-full focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
        <input
          placeholder="Card Number"
          className="text-sm p-1 rounded border border-gray-300 w-full focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Expiry Date"
            className="text-sm p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <input
            placeholder="CVV"
            className="text-sm p-1 rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onPlaceOrder}
          className="relative bg-[#4a8c3f] text-white rounded-full py-2 px-6 text-sm font-bold hover:bg-green-700 shadow-md"
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
          
        </button>
      </div>
    </div>
  )
}
