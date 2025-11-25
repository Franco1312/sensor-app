/**
 * MiniChart - Small inline chart component for cards
 * Based on design SVG charts
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

interface MiniChartProps {
  trend?: 'up' | 'down' | 'neutral';
  height?: number;
}

export const MiniChart: React.FC<MiniChartProps> = ({ trend = 'up', height = 60 }) => {
  const { theme } = useTheme();

  // Sample chart paths (simplified versions of the design)
  const chartPaths: Record<string, string> = {
    up: 'M0 45.1C20 45.1 20 8.7 40 8.7C60 8.7 60 16.9 80 16.9C100 16.9 100 38.4 120 38.4C140 38.4 140 13.6 160 13.6C180 13.6 180 41.7 200 41.7C220 41.7 220 25.2 240 25.2C260 25.2 260 18.6 280 18.6C300 18.6 300 49.9 320 49.9C340 49.9 340 60 360 60C380 60 380 33.5 400 33.5',
    down: 'M0 18.6C20 18.6 20 49.9 40 49.9C60 49.9 60 60 80 60C100 60 100 33.5 120 33.5C140 33.5 140 8.7 160 8.7C180 8.7 180 41.7 200 41.7C220 41.7 220 25.2 240 25.2C260 25.2 260 16.9 280 16.9C300 16.9 300 38.4 320 38.4C340 38.4 340 13.6 360 13.6C380 13.6 380 45.1 400 45.1',
    neutral: 'M0 30C20 30 20 25 40 25C60 25 60 35 80 35C100 35 100 30 120 30C140 30 140 25 160 25C180 25 180 30 200 30C220 30 220 25 240 25C260 25 260 30 280 30C300 30 300 25 320 25C340 25 340 30 360 30C380 30 380 25 400 25',
  };

  const path = chartPaths[trend] || chartPaths.up;

  return (
    <View style={[styles.container, { height }]}>
      <Svg width="100%" height={height} viewBox="0 0 400 60" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.25" />
            <Stop offset="100%" stopColor={theme.colors.primary} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path
          d={`${path} L400 60 L0 60 Z`}
          fill="url(#chartGradient)"
        />
        <Path
          d={path}
          stroke={theme.colors.primary}
          strokeWidth="2.5"
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
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
});

