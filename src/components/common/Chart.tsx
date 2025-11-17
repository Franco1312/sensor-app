/**
 * Chart - Main chart component for detail screens
 * Based on design SVG charts with gradient fill
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

interface ChartProps {
  height?: number;
  data?: number[]; // Optional data points for future use
}

export const Chart: React.FC<ChartProps> = ({ height = 180, data }) => {
  const { theme } = useTheme();

  // Sample chart path from design (simplified)
  const chartPath =
    'M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25';

  return (
    <View style={[styles.container, { height }]}>
      <Svg width="100%" height={height} viewBox="0 0 478 150" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.25" />
            <Stop offset="100%" stopColor={theme.colors.primary} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        {/* Gradient fill */}
        <Path
          d={`${chartPath} L472 149 L326.769 149 L0 149 Z`}
          fill="url(#chartGradient)"
        />
        {/* Chart line */}
        <Path
          d={chartPath}
          stroke={theme.colors.primary}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

