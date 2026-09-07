import React from 'react';

interface AppleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'navy' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  pill?: boolean;
}

export const AppleButton: React.FC<AppleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  pill = true,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-xs px-3.5 py-2.5 min-h-[44px] gap-1.5 font-medium',
    md: 'text-sm px-4.5 py-2.5 min-h-[44px] gap-2 font-medium',
    lg: 'text-base px-6 py-3 min-h-[48px] gap-2.5 font-semibold',
  }[size];

  const variantClasses = {
    primary: 'bg-[#3A5982] text-white hover:bg-[#2D476C] shadow-sm hover:shadow active:bg-[#243956]',
    navy: 'bg-[#1B283A] text-white hover:bg-[#25364D] shadow-sm',
    secondary: 'bg-[#F1F5F9] text-[#16212F] hover:bg-[#E2E8F0] border border-[#CBD5E1]/70',
    ghost: 'bg-transparent text-[#3A5982] hover:bg-[#3A5982]/10',
    danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/60',
    gold: 'bg-[#C5A063] text-white hover:bg-[#B28C4E] shadow-sm',
  }[variant];

  const shapeClass = pill ? 'rounded-full' : 'rounded-xl';

  return (
    <button
      className={`inline-flex items-center justify-center transition-all duration-200 select-none whitespace-nowrap active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 ${shapeClass} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
