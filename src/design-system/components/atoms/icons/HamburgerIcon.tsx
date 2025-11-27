/**
 * HamburgerIcon - Hamburger menu icon component
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

interface HamburgerIconProps {
  size?: number;
  color?: string;
}

export const HamburgerIcon: React.FC<HamburgerIconProps> = ({ size = 24, color }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.textPrimary;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12h18M3 6h18M3 18h18"
        stroke={iconColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

