import React from 'react';

interface SWOLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  textColor?: 'dark' | 'light';
  subtext?: string;
  className?: string;
}

export const SWOLogo: React.FC<SWOLogoProps> = ({
  size = 'md',
  showText = true,
  textColor = 'dark',
  subtext = 'Bangalore Yeshwanthpur Campus',
  className = '',
}) => {
  const sizeMap = {
    xs: { icon: 28, text: 'text-xs', sub: 'text-[9px]' },
    sm: { icon: 36, text: 'text-xs', sub: 'text-[9px]' },
    md: { icon: 46, text: 'text-sm font-bold', sub: 'text-[11px]' },
    lg: { icon: 60, text: 'text-base font-bold', sub: 'text-xs' },
    xl: { icon: 84, text: 'text-lg font-bold', sub: 'text-sm' },
    '2xl': { icon: 110, text: 'text-xl font-bold', sub: 'text-sm' },
  };

  const dim = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Circular SWO BYC Logo */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-full shadow-sm ring-1 ring-black/10 overflow-hidden"
        style={{ width: dim.icon, height: dim.icon }}
      >
        <img
          src="/swo-byc-logo.png"
          alt="Student Welfare Office - Bangalore Yeshwanthpur Campus"
          className="w-full h-full object-cover rounded-full select-none"
          loading="eager"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.endsWith('.svg')) {
              target.src = '/swo-byc-logo.svg';
            }
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`tracking-tight leading-tight ${dim.text} ${
                textColor === 'light' ? 'text-white' : 'text-[#16212F] dark:text-white'
              }`}
            >
              STUDENT WELFARE OFFICE
            </span>
            <span
              className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full border ${
                textColor === 'light'
                  ? 'bg-[#C5A063]/25 text-[#E6C98F] border-[#C5A063]/40'
                  : 'bg-[#3A5982]/10 dark:bg-[#C5A063]/20 text-[#2D476C] dark:text-[#E2C78A] border-[#3A5982]/20 dark:border-[#C5A063]/40'
              }`}
            >
              SWO • BYC
            </span>
          </div>
          <span
            className={`font-medium tracking-tight mt-0.5 ${dim.sub} ${
              textColor === 'light' ? 'text-slate-300' : 'text-[#536275] dark:text-slate-200'
            }`}
          >
            {subtext}
          </span>
        </div>
      )}
    </div>
  );
};
