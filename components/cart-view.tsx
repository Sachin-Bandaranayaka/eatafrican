"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CartViewProps {
  onCheckout: () => void
}

export function CartView({ onCheckout }: CartViewProps) {
  return (
    <div>
      {/* Cart Items */}
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-start gap-2">
            <div className="bg-gray-100 p-2 rounded-md w-16 h-16 flex items-center justify-center">
              <Image src="/placeholder.svg?height=40&width=40" alt="Food" width={40} height={40} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm">Meal Name</div>
              <div className="text-xs flex items-center gap-1">
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                Ethiopian
              </div>
              <div className="text-xs">Restaurant Name</div>
              <div className="text-xs flex items-center gap-1">
                <span className="inline-block w-3 h-3 bg-gray-500 rounded-full"></span>
                Location
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input type="text" className="w-12 h-8 text-xs" defaultValue="1" />
              <div className="text-sm">Fr. 45.00.-</div>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Image src="/placeholder.svg?height=16&width=16" alt="Delete" width={16} height={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Address */}
      <div className="mt-6">
        <p className="text-xs mb-2">
          Provide Ad for us to calculate Delivery Fees and show available delivery times you can select
        </p>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Input placeholder="Postal Code" className="text-xs" />
          <Input placeholder="Town" className="text-xs" />
        </div>
        <Input placeholder="Street and Housenumber" className="text-xs mb-2" />
        <div>
          <label className="text-xs block mb-1">Select Delivery Time</label>
          <Input placeholder="- - -" className="text-xs" />
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-6 flex justify-between">
        <div>
          <div className="text-sm">Subtotal</div>
          <div className="text-sm">Delivery Fee</div>
          <div className="text-sm font-bold">Total</div>
          <div className="text-xs">Inkl. MwSt.</div>
        </div>
        <div className="text-right">
          <div className="text-sm">Fr. 45.00.-</div>
          <div className="text-sm">-</div>
          <div className="text-sm font-bold">-</div>
          <div className="text-xs">-</div>
        </div>
      </div>

      {/* Voucher */}
      <div className="mt-4">
        <Input placeholder="VOUCHER CODE" className="text-xs" />
      </div>

      {/* Checkout Button */}
      <div className="mt-6">
        <Button onClick={onCheckout} className="w-full bg-[#6b2c0c] hover:bg-[#5a2509] text-white">
          CHECKOUT
        </Button>
      </div>
    </div>
  )
}
