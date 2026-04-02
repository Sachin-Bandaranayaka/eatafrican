"use client";

import { Plus, Minus } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  textColor?: string;
  iconSpacing?: string; // distance between text and icon
  titleTextSize?: string;
}

export default function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
  textColor = "#8f301d",
  iconSpacing = "0.5rem",
  titleTextSize = "text-[12px]",
}: CollapsibleSectionProps) {
  return (
    <div className="flex flex-col w-full rounded-lg mt-2">
      <div
        className={`flex items-center justify-start w-full ${titleTextSize} font-semibold`}
        style={{ color: textColor }}
      >
        <span>{title}</span>
        <button
          onClick={onToggle}
          style={{ marginLeft: iconSpacing }}
          className="cursor-pointer hover:opacity-70 transition-opacity duration-200"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <Minus strokeWidth={6} className="w-2 h-2 sm:w-3 sm:h-3 text-black" />
          ) : (
            <Plus strokeWidth={6} className="w-2 h-2 sm:w-3 sm:h-3 text-black" />
          )}
        </button>
      </div>

      <div
        className={`
          grid transition-all duration-300 ease-in-out
          ${isOpen ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}
        `}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
