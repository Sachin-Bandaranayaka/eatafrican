"use client"
import Image from "next/image"

export function PaymentSuccessView() {
  return (
    <div className="bg-amber-50/80 rounded-lg p-4 shadow text-black">
      <div className="md:text-start space-y-3">
        <h3 className="font-bold text-lg text-black">Thank you for your order.</h3>

        <p>Your order has been successfully placed!</p>

        <p className="text-sm text-black">
          We&apos;re excited to bring the rich flavors of Africa to your doorstep. We&apos;ll keep you updated on your
          order status.
        </p>

        <div className="relative item-start text-start space-y-2 mt-4 ml-32 text-black">
          <div className="flex md:items-start gap-2 justify-start">
            <Image src="/placeholder.svg?height=24&width=36" alt="Flag" width={36} height={24} className="rounded" />
            <span>ማእለያም ምግቢ!</span>
          </div>

          <div className="flex md:items-start gap-2 justify-start">
            <Image src="/placeholder.svg?height=24&width=36" alt="Flag" width={36} height={24} className="rounded" />
            <span>Make you chop well-well</span>
          </div>

          <div className="flex md:items-start gap-2 justify-start">
            <Image src="/placeholder.svg?height=24&width=36" alt="Flag" width={36} height={24} className="rounded" />
            <span>Medi wo aduan&quot;</span>
          </div>

          <div className="flex md:items-start gap-2 justify-start">
            <Image src="/placeholder.svg?height=24&width=36" alt="Flag" width={36} height={24} className="rounded" />
            <span>Chakula Chema</span>
          </div>
        </div>

        <p className="font-bold mt-4">Enjoy your meal!</p>
      </div>
    </div>
  )
}
