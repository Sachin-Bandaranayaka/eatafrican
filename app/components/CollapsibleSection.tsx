"use client";

import { Plus, Minus } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;

  /* 👇 new optional props */
  textColor?: string;
  iconSpacing?: string; // distance between text & icon
}

export default function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
  textColor = "#8f301d",   // default preserved
  iconSpacing = "0.5rem",  // default ≈ ml-2
}: CollapsibleSectionProps) {
  return (
    <div className="flex flex-col w-full rounded-lg mt-2">
      {/* Header */}
      <div
        className="flex items-center justify-start w-full text-[12px] font-semibold"
        style={{ color: textColor }}
      >
        <span>{title}</span>

        {/* Icon always on the right */}
        <button
          onClick={onToggle}
          style={{ marginLeft: iconSpacing }}
          className="cursor-pointer hover:opacity-70 transition-opacity duration-200"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <Minus strokeWidth={6} className="w-3 h-3 text-black" />
          ) : (
            <Plus strokeWidth={6} className="w-3 h-3 text-black" />
          )}
        </button>
      </div>

      {/* Animated content */}
      <div
        className={`
          grid transition-all duration-300 ease-in-out
          ${isOpen ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}
        `}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}