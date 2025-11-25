/**
 * InfoIcon - Small info icon component following Material Design style
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

interface InfoIconProps {
  size?: number;
  color?: string;
}

export const InfoIcon: React.FC<InfoIconProps> = ({ size = 16, color }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.textSecondary;
  const iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z';
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={iconPath} fill={iconColor} fillOpacity={0.7} />
    </Svg>
  );
};

