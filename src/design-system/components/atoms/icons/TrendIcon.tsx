/**
 * TrendIcon - Icon component for trend indicators
 * Uses Material Symbols style icons
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

interface TrendIconProps {
  trend: 'up' | 'down' | 'neutral';
  size?: number;
}

export const TrendIcon: React.FC<TrendIconProps> = ({ trend, size = 24 }) => {
  const { theme } = useTheme();

  const getIconPath = () => {
    switch (trend) {
      case 'up':
        // trending_up icon
        return 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z';
      case 'down':
        // trending_down icon
        return 'M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z';
      case 'neutral':
      default:
        // horizontal_rule icon
        return 'M5 11h14v2H5z';
    }
  };

  const getColor = () => {
    switch (trend) {
      case 'up':
        return theme.colors.success;
      case 'down':
        return theme.colors.error;
      case 'neutral':
      default:
        return theme.colors.textSecondary;
    }
  };

  const getBackgroundColor = () => {
    switch (trend) {
      case 'up':
        return theme.colors.successLight;
      case 'down':
        return theme.colors.errorLight;
      case 'neutral':
      default:
        return theme.colors.surfaceSecondary;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size + 16,
          height: size + 16,
          borderRadius: theme.radii.lg,
          backgroundColor: getBackgroundColor(),
        },
      ]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={getIconPath()} fill={getColor()} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

