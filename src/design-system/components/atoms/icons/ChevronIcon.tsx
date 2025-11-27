/**
 * ChevronIcon - Chevron icon for expandable items
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

interface ChevronIconProps {
  expanded: boolean;
  size?: number;
}

export const ChevronIcon: React.FC<ChevronIconProps> = ({ expanded, size = 20 }) => {
  const { theme } = useTheme();
  const iconColor = theme.colors.textSecondary;

  // Chevron right when collapsed, down when expanded
  const path = expanded
    ? 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'
    : 'M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z';

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={path} fill={iconColor} />
    </Svg>
  );
};

