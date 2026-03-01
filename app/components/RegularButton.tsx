import React from 'react';

interface RegularButtonProps {
  text: string;
  onClick?: () => void;
  fillColor?: string;
  borderColor?: string;
  fontColor?: string;
  hoverFillColor?: string;
  borderWidth?: string;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  borderRadius?: string;
  uppercase?: boolean;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const RegularButton: React.FC<RegularButtonProps> = ({
  text,
  onClick,
  fillColor = '#2F6B2F',
  borderColor = '#2F6B2F',
  fontColor = '#FFFFFF',
  hoverFillColor,
  borderWidth = '1px',
  fontSize = 'text-[10px]',
  fontWeight = 'font-bold',
  padding = 'py-0.5 px-4',
  borderRadius = 'rounded-lg',
  uppercase = true,
  className = '',
  disabled = false,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${borderRadius} ${fontSize} ${fontWeight} ${padding} ${uppercase ? 'uppercase' : ''} ${className}`}
      style={{
        backgroundColor: fillColor,
        borderColor: borderColor,
        color: fontColor,
        borderWidth: borderWidth,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {text}
    </button>
  );
};

export default RegularButton;
