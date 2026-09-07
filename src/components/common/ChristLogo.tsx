import React from 'react';
import { SWOLogo } from './SWOLogo';

interface ChristLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: 'dark' | 'light';
  subtext?: string;
  className?: string;
}

export const ChristLogo: React.FC<ChristLogoProps> = ({
  size = 'md',
  showText = true,
  textColor = 'dark',
  subtext = 'Student Welfare Office • Bangalore Yeshwanthpur Campus',
  className = '',
}) => {
  return (
    <SWOLogo
      size={size}
      showText={showText}
      textColor={textColor}
      subtext={subtext}
      className={className}
    />
  );
};
