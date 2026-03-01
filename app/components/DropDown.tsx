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

  /* ---------------- Portal dropdown ---------------- */
  const dropdown =
    isOpen && buttonRef.current
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
              width: buttonRef.current.offsetWidth,
              backgroundColor,
              color: textColor
            }}
            className="rounded-lg shadow-lg z-[9999]"
          >
            {options.map((option, index) => (
              <button
                key={option}
                onClick={() => selectOption(option)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={`w-full px-2 h-8 text-[10px] font-bold text-left flex items-center
                  ${
                    focusedIndex === index
                      ? 'bg-gray-600'
                      : 'hover:bg-gray-600'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>,
          document.body
        )
      : null;

  return (
    /* ⬇️ ORIGINAL STYLES PRESERVED */
    <div className="flex items-center gap-1 font-bold text-[10px] mt-8 ml-2 pl-1">
      <div
        ref={wrapperRef}
        style={{ width: computedWidth }}
        onKeyDown={handleKeyDown}
        className="relative"
      >
        <button
          ref={buttonRef}
          onClick={() => setIsOpen((v) => !v)}
          style={{ backgroundColor, color: textColor }}
          className="w-full px-3 py-1 rounded-lg flex items-center justify-between"
        >
          <span className="truncate whitespace-nowrap overflow-hidden">
            {currentView}
          </span>
          <ActiveIcon
            size={18}
            strokeWidth={4}
            className={`transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {dropdown}
      </div>
    </div>
  );
};

export default CustomDropdown;