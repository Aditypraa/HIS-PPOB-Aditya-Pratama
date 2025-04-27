import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'link';
  fullWidth?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  size?: 'small' | 'normal';
  className?: string;
};

// Button component
function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  isLoading = false,
  size = 'normal',
  className = ''
}: ButtonProps) {
  const baseStyle = `font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition duration-200 ease-in-out flex items-center justify-center rounded-md ${fullWidth ? 'w-full' : ''} ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''}`;
  const sizeStyle = size === 'small' ? 'py-2 px-4' : 'py-3 px-6'; // Adjust padding for size
  const primaryStyle = 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-md';
  const secondaryStyle = 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400';
  const linkStyle = 'text-red-500 hover:text-red-700 font-medium text-sm p-0 bg-transparent shadow-none focus:ring-0'; // Link specific style

  let style;
  switch (variant) {
    case 'secondary':
      style = secondaryStyle;
      break;
    case 'link':
      style = linkStyle;
      break;
    default:
      style = primaryStyle;
  }

  // Combine styles, ensuring link variant doesn't get padding unless specified via className
  const finalStyle = variant === 'link' ? `${linkStyle} ${className}` : `${baseStyle} ${sizeStyle} ${style} ${className}`;

  return (
    <button type={type} onClick={onClick} className={finalStyle} disabled={disabled || isLoading}>
      {isLoading && <Loader2 className="animate-spin mr-2" size={18} />}
      {children}
    </button>
  );
}

export default Button;