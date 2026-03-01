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
        className={`text-xs font-bold cursor-pointer hover:opacity-80 ${className}`}
        style={{ color: textColor }}
      >
        {emoji} {text}
      </span>
    );
  }

  return (
    <div className={`p-4 pt-0 ${className}`}>
      <button
        onClick={onClick}
        className="text-xs font-bold flex items-center hover:opacity-80 transition-opacity cursor-pointer"
        style={{ color: textColor }}
      >
        <span className="mr-1">{emoji}</span>
        {text}
      </button>
    </div>
  );
};

export default HandButton;
