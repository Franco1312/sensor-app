/**
 * MiniSparklineChart - Mini chart component for indicator/quote/crypto cards
 * Shows a small predefined sparkline chart based on trend (up/down/neutral)
 * Uses real data paths from dollar blue (upward) and SOL (downward) APIs
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface MiniSparklineChartProps {
  trend: 'up' | 'down' | 'neutral';
  color: string;
  height?: number;
  width?: number;
}

const CHART_HEIGHT = 20;
const CHART_WIDTH = 50;
const CHART_PADDING = 2;

// Upward trend path (from dollar blue real data - last month)
// Cleaned path without line breaks
const UPWARD_TREND_PATH = "M2 13.43 L4.42 15.71 L6.84 15.71 L9.26 18 L11.68 18 L14.11 18 L16.53 18 L18.95 18 L21.37 2 L23.79 6.57 L26.21 11.14 L28.63 13.43 L31.05 13.43 L33.47 13.43 L35.89 8.86 L38.32 8.86 L40.74 11.14 L43.16 15.71 L45.58 13.43 L48 13.43";

// Downward trend path (from SOL real data - last month)
// Cleaned path without line breaks
const DOWNWARD_TREND_PATH = "M2 5.00 L4.42 5.30 L6.84 6.04 L9.26 5.93 L11.68 5.36 L14.11 5.57 L16.53 2.66 L18.95 2 L21.37 3.44 L23.79 4.04 L26.21 3.20 L28.63 6.25 L31.05 6.79 L33.47 6.82 L35.89 5.69 L38.32 5.18 L40.74 3.80 L43.16 7.30 L45.58 18 L48 13.27";

// Neutral trend path (flat line in the middle)
const NEUTRAL_TREND_PATH = `M${CHART_PADDING} ${CHART_HEIGHT / 2} L${CHART_WIDTH - CHART_PADDING} ${CHART_HEIGHT / 2}`;

export const MiniSparklineChart: React.FC<MiniSparklineChartProps> = ({
  trend,
  color,
  height = CHART_HEIGHT,
  width = CHART_WIDTH,
}) => {
  // Select path based on trend
  let path: string;
  switch (trend) {
    case 'up':
      path = UPWARD_TREND_PATH;
      break;
    case 'down':
      path = DOWNWARD_TREND_PATH;
      break;
    case 'neutral':
    default:
      path = NEUTRAL_TREND_PATH;
      break;
  }

  return (
    <View style={[styles.container, { height, width }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} preserveAspectRatio="none">
        <Path
          d={path}
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
