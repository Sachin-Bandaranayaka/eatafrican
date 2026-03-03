import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  options?: string[];
  defaultOption?: string | null;
  backgroundColor?: string;
  textColor?: string;
  width?: string; // optional manual override
  mobileWidth?: string; // optional mobile-only width override
  OpenIcon?: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  CloseIcon?: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  onOptionSelect?: (option: string) => void;
}

const CustomDropdown: React.FC<DropdownProps> = ({
  options = [],
  defaultOption = null,
  backgroundColor = '#2F6B2F',
  textColor = '#FFFFFF',
  width,
  mobileWidth,
  OpenIcon = ChevronDown,
  CloseIcon = ChevronDown,
  onOptionSelect = () => {}
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [computedWidth, setComputedWidth] = useState<string | undefined>(width);

  const [currentView, setCurrentView] = useState(
    defaultOption || options[0] || ''
  );

  /* ---------------- Auto width (longest option) ---------------- */
  useLayoutEffect(() => {
    if (width) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = 'bold 10px sans-serif';
    const maxTextWidth = Math.max(
      ...options.map((opt) => ctx.measureText(opt).width)
    );

    setComputedWidth(`${Math.ceil(maxTextWidth + 56)}px`);
  }, [options, width]);

  /* ---------------- Click outside to close ---------------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ---------------- Keyboard navigation ---------------- */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setIsOpen(true);
      setFocusedIndex(0);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((i) => (i + 1) % options.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((i) =>
          i <= 0 ? options.length - 1 : i - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0) selectOption(options[focusedIndex]);
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
    }
  };

  const selectOption = (option: string) => {
    setCurrentView(option);
    setIsOpen(false);
    setFocusedIndex(-1);
    onOptionSelect(option);
    buttonRef.current?.focus();
  };

  const ActiveIcon = isOpen ? CloseIcon : OpenIcon;
  const isMobileViewport =
    typeof window !== 'undefined' && window.innerWidth < 640;

  /* ---------------- Portal dropdown ---------------- */
  const dropdown =
    buttonRef.current
      ? createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top:
                buttonRef.current.getBoundingClientRect().bottom +
                window.scrollY,
              left:
                buttonRef.current.getBoundingClientRect().left +
                window.scrollX,
              width: isMobileViewport
                ? Math.max(48, Math.floor(buttonRef.current.offsetWidth * 0.65))
                : buttonRef.current.offsetWidth,
              maxWidth: isMobileViewport ? '20vw' : undefined,
              backgroundColor,
              color: textColor
            }}
            className={`rounded-md sm:rounded-lg shadow-lg z-[9999] origin-top transform transition-all duration-200 ease-out ${
              isOpen
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 -translate-y-1 scale-95 pointer-events-none'
            } max-h-[45vh] sm:max-h-none overflow-y-auto overflow-x-hidden`}
          >
            {options.map((option, index) => (
              <button
                key={option}
                onClick={() => selectOption(option)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={`w-full pl-1 pr-0.5 sm:px-2 h-3.5 sm:h-8 text-[6px] sm:text-[10px] font-bold text-left leading-none flex items-center transition-colors duration-150 ease-out
                  ${
                    focusedIndex === index
                      ? 'bg-black/25'
                      : 'hover:bg-black/15'
                  } overflow-hidden`}
              >
                <span className="block w-full min-w-0 truncate">
                  {option}
                </span>
              </button>
            ))}
          </div>,
          document.body
        )
      : null;

  return (
    /* ⬇️ ORIGINAL STYLES PRESERVED */
    <div className="flex items-center gap-0 sm:gap-1 font-bold text-[8px] sm:text-[10px] mt-5 sm:mt-8 ml-1 sm:ml-2 pl-0 sm:pl-1">
      <div
        ref={wrapperRef}
        style={{ width: isMobileViewport && mobileWidth ? mobileWidth : computedWidth }}
        onKeyDown={handleKeyDown}
        className="relative min-w-[56px] sm:min-w-0 max-w-[20vw] sm:max-w-none"
      >
        <button
          ref={buttonRef}
          onClick={() => setIsOpen((v) => !v)}
          style={{ backgroundColor, color: textColor }}
          className="w-full h-3.5 sm:h-auto pl-1.5 pr-0.5 sm:px-3 py-0 sm:py-1 rounded-[5px] sm:rounded-lg text-[6px] sm:text-[10px] leading-none flex items-center justify-between"
        >
          <span className="truncate whitespace-nowrap overflow-hidden">
            {currentView}
          </span>
          <ActiveIcon
            size={16}
            strokeWidth={4}
            className={`w-[10px] h-[10px] sm:w-[18px] sm:h-[18px] transform transition-transform duration-200 ease-out ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>

        {dropdown}
      </div>
    </div>
  );
};

export default CustomDropdown;
