import React from 'react';

interface AppleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const AppleCard: React.FC<AppleCardProps> = ({
  children,
  hoverEffect = false,
  glass = false,
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingMap = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }[padding];

  const glassClass = glass 
    ? 'bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm' 
    : 'bg-white border border-gray-100 shadow-sm';

  const hoverClass = hoverEffect
    ? 'transition-all duration-300 hover:shadow-md hover:border-gray-200/80 hover:-translate-y-0.5'
    : '';

  return (
    <div
      className={`rounded-[24px] ${glassClass} ${paddingMap} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
