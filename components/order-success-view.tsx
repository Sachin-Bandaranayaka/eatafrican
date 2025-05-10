import Image from "next/image"

export function OrderSuccessView() {
  return (
    <div className="text-center">
      <h2 className="font-bold mb-4 bg-[#4a8c3f] text-white py-2 rounded-md">ORDER SUCCESSFUL</h2>

      <div className="space-y-4">
        <h3 className="font-bold text-lg">Thank you for your order.</h3>

        <p>Your order has been successfully placed!</p>

        <p>
          We&apos;re excited to bring the rich flavors of Africa to your doorstep. We&apos;ll keep you updated on your
          order status.
        </p>

        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-2">
            <Image src="/placeholder.svg?height=24&width=36" alt="Flag" width={36} height={24} className="rounded" />
            <span>ማእለያም ምግቢ!</span>
          </div>

          <div className="flex items-center gap-2">
            <Image src="/placeholder.svg?height=24&width=36" alt="Flag" width={36} height={24} className="rounded" />
            <span>Make you chop well-well</span>
          </div>

          <div className="flex items-center gap-2">
            <Image src="/placeholder.svg?height=24&width=36" alt="Flag" width={36} height={24} className="rounded" />
            <span>Medi wo aduan&quot;</span>
          </div>

          <div className="flex items-center gap-2">
            <Image src="/placeholder.svg?height=24&width=36" alt="Flag" width={36} height={24} className="rounded" />
            <span>Chakula Chema</span>
          </div>
        </div>

        <p className="font-bold mt-4">Enjoy your meal!</p>
      </div>
    </div>
  )
}
