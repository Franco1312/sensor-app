/**
 * ChartIcon - Chart icon for login screen logo
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

interface ChartIconProps {
  size?: number;
}

export const ChartIcon: React.FC<ChartIconProps> = ({ size = 32 }) => {
  const { theme } = useTheme();
  const iconColor = theme.colors.primary;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"
        fill={iconColor}
      />
    </Svg>
  );
};

