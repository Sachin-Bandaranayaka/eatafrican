"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface LoginViewProps {
  onLogin: () => void
  onContinueAsGuest: () => void
}

export function LoginView({ onLogin, onContinueAsGuest }: LoginViewProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md">
        <h2 className="text-center font-bold mb-4">LOGIN</h2>

        <div className="space-y-4">
          <Input placeholder="E-mail" className="w-full" />
          <Input type="password" placeholder="Password" className="w-full" />

          <div className="text-center">
            <a href="#" className="text-sm text-[#6b2c0c] hover:underline">
              Forgot Password?
            </a>
          </div>

          <Button onClick={onLogin} className="w-full bg-[#6b2c0c] hover:bg-[#5a2509] text-white flex items-center gap-1">
            <Image src="/images/folk_link.png" alt="Folk Link" width={20} height={20} />
            <span style={{color: '#F2C94C'}}>LOGIN</span>
          </Button>

          <div className="text-center text-sm">
            <span>New Here? </span>
            <a href="#" className="text-[#6b2c0c] hover:underline">
              Create Account
            </a>
          </div>

          <Button
            onClick={onContinueAsGuest}
            variant="outline"
            className="w-full border-[#6b2c0c] text-[#6b2c0c] hover:bg-[#f9e9d5]"
          >
            CONTINUE AS GUEST
          </Button>
        </div>
      </div>
    </div>
  )
}
