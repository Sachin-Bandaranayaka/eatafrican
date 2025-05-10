"use client"

import { useState } from "react"

interface TribalButtonProps {
  text: string;
  onClick: () => void;
  isActive?: boolean;
}

export default function TribalButton({ text, onClick, isActive = false }: TribalButtonProps) {
  return (
    <div
      className="relative transition-transform duration-300 rounded-xl"
      onClick={onClick}
    >
      <button
        className={`${
          isActive ? 'bg-green-600' : 'bg-amber-900'
        } py-4 px-1 border-2 border-white rounded-xl`}
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
        }}
      >
        <h2 className="text-white text-xs font-bold tracking-wider text-center">
          {text}
        </h2>
      </button>
    </div>
  )
}