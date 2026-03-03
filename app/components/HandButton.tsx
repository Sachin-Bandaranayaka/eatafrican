import React from 'react';

interface HandButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
  emoji?: string;
  variant?: 'button' | 'inline';
  textColor?: string;
}

const HandButton: React.FC<HandButtonProps> = ({
  text = 'See More',
  onClick,
  className = '',
  emoji = '👉🏿',
  variant = 'button',
  textColor = '#b65f14',
}) => {
  if (variant === 'inline') {
    return (
      <span 
        onClick={onClick}
        className={`inline-flex items-center gap-0 sm:gap-1 max-w-full text-[8px] sm:text-xs leading-none sm:leading-tight break-words font-bold cursor-pointer hover:opacity-80 ${className}`}
        style={{ color: textColor }}
      >
        <span className="shrink-0">{emoji}</span>
        <span>{text}</span>
      </span>
    );
  }

  return (
    <div className={`p-1 sm:p-4 pt-0 ${className}`}>
      <button
        onClick={onClick}
        className="text-[8px] sm:text-xs leading-none sm:leading-tight font-bold flex flex-wrap items-center gap-0 sm:gap-1 hover:opacity-80 transition-opacity cursor-pointer"
        style={{ color: textColor }}
      >
        <span className="shrink-0">{emoji}</span>
        <span>{text}</span>
      </button>
    </div>
  );
};

export default HandButton;
