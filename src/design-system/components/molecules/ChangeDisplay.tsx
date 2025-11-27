/**
 * ChangeDisplay - Reusable component for displaying change values with trend arrow and color
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../atoms';
import { useTheme } from '@/theme/ThemeProvider';
import { getTrendColor, getTrendArrow } from '@/utils/formatting';

export interface ChangeDisplayProps {
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
  variant?: 'base' | 'sm';
  showArrow?: boolean;
}

export const ChangeDisplay: React.FC<ChangeDisplayProps> = ({
  changePercent,
  trend,
  variant = 'sm',
  showArrow = true,
}) => {
  const { theme } = useTheme();
  const trendColor = getTrendColor(trend, theme);
  const trendArrow = showArrow ? getTrendArrow(trend) : '';
  const changeValue = changePercent >= 0
    ? `+${changePercent.toFixed(1)}%`
    : `${changePercent.toFixed(1)}%`;

  return (
    <View style={styles.container}>
      <Text variant={variant} style={{ color: trendColor }}>
        {changeValue}
      </Text>
      {showArrow && (
        <Text variant={variant} style={{ color: trendColor }}>
          {trendArrow}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

