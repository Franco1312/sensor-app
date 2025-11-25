/**
 * Chart - Main chart component for detail screens
 * Displays historical data as a line chart with gradient fill and interactive point selection
 */

import React, { useState, useRef } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Line, Circle, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';
import { ChartDataPoint, formatValueForSeries } from '@/utils/seriesTransform';
import { SeriesCode } from '@/constants/series';

interface ChartProps {
  height?: number;
  data?: ChartDataPoint[];
  seriesCode?: SeriesCode;
  onPointSelect?: (point: ChartDataPoint | null) => void;
}

// Chart dimensions constants
const CHART_WIDTH = 478;
const CHART_HEIGHT = 150;
const CHART_PADDING = 10;
const FALLBACK_LAST_X = 472;

// Sample path for fallback (when no data)
const FALLBACK_CHART_PATH = 'M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25';

// Types for internal chart calculations
interface ChartPoint {
  x: number;
  y: number;
  date: string;
}

interface ChartPathResult {
  path: string;
  points: ChartPoint[];
}

interface LabelPosition {
  labelX: number;
  textX: number;
  textAnchor: 'start' | 'end';
}

/**
 * Formats a date string to DD/MM/YYYY format
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

/**
 * Calculates the min and max values from data points for normalization
 */
const calculateValueRange = (dataPoints: ChartDataPoint[]): { min: number; max: number; range: number } => {
  const values = dataPoints.map(point => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1; // Avoid division by zero
  
  return { min: minValue, max: maxValue, range: valueRange };
};

/**
 * Converts data points to chart coordinates (normalized to chart dimensions)
 */
const normalizeDataPoints = (dataPoints: ChartDataPoint[]): ChartPoint[] => {
  const { min: minValue, range: valueRange } = calculateValueRange(dataPoints);
  const pointCount = dataPoints.length;
  const pointSpacing = CHART_WIDTH / (pointCount - 1);
  const availableHeight = CHART_HEIGHT - (CHART_PADDING * 2);

  return dataPoints.map((point, index) => {
    const x = index * pointSpacing;
    // Normalize value to 0-1 range, then scale to chart height
    // Invert Y because SVG coordinates start from top
    const normalizedValue = (point.value - minValue) / valueRange;
    const y = CHART_HEIGHT - (normalizedValue * availableHeight) - CHART_PADDING;
    
    return { x, y, date: point.date };
  });
};

/**
 * Generates a smooth SVG path using quadratic curves from chart points
 */
const generateSmoothPath = (points: ChartPoint[]): string => {
  if (points.length === 0) return '';
  
  let path = `M${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const currentPoint = points[i];
    
    if (i === 1) {
      // First curve: use midpoint as control point for smooth start
      const controlX = (prevPoint.x + currentPoint.x) / 2;
      path += ` Q${controlX} ${prevPoint.y} ${currentPoint.x} ${currentPoint.y}`;
    } else {
      // Subsequent curves: use previous point as control for smooth transitions
      path += ` Q${prevPoint.x} ${prevPoint.y} ${currentPoint.x} ${currentPoint.y}`;
    }
  }
  
  return path;
};

/**
 * Generates chart path and points from data, or returns fallback path
 */
const generateChartData = (dataPoints: ChartDataPoint[] | undefined): ChartPathResult | string => {
  if (!dataPoints || dataPoints.length === 0) {
    return FALLBACK_CHART_PATH;
  }

  const points = normalizeDataPoints(dataPoints);
  const path = generateSmoothPath(points);
  
  return { path, points };
};

/**
 * Finds the closest chart point to a touch position
 */
const findClosestPointIndex = (touchX: number, points: ChartPoint[]): number => {
  let closestIndex = 0;
  let minDistance = Math.abs(points[0].x - touchX);

  for (let i = 1; i < points.length; i++) {
    const distance = Math.abs(points[i].x - touchX);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  }

  return closestIndex;
};

/**
 * Converts screen touch coordinates to chart coordinates
 */
const convertTouchToChartCoordinates = (screenX: number): number => {
  const screenWidth = Dimensions.get('window').width;
  const scale = screenWidth / CHART_WIDTH;
  return screenX / scale;
};

/**
 * Calculates the optimal position for the label to avoid going off-screen
 */
const calculateLabelPosition = (pointX: number): LabelPosition => {
  const labelWidth = 120;
  const padding = 8;
  const isNearRightEdge = pointX > CHART_WIDTH - labelWidth - padding;
  const isNearLeftEdge = pointX < labelWidth + padding;
  
  if (isNearRightEdge) {
    return {
      labelX: pointX - labelWidth - padding,
      textX: pointX - padding,
      textAnchor: 'end',
    };
  }
  
  return {
    labelX: pointX + padding,
    textX: pointX + padding + 4,
    textAnchor: 'start',
  };
};

export const Chart: React.FC<ChartProps> = ({ height = 180, data, seriesCode, onPointSelect }) => {
  const { theme } = useTheme();
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const containerRef = useRef<View>(null);

  // Generate chart path and points from data
  const chartResult = generateChartData(data);
  const hasData = typeof chartResult !== 'string';
  const chartPath = hasData ? chartResult.path : chartResult;
  const points = hasData ? chartResult.points : [];
  const lastX = hasData && data && data.length > 0 ? CHART_WIDTH : FALLBACK_LAST_X;

  // Handle touch to select point on chart
  const handleTouch = (event: any) => {
    if (!data || data.length === 0 || !points || points.length === 0) return;

    const { locationX } = event.nativeEvent;
    const touchX = convertTouchToChartCoordinates(locationX);
    const closestIndex = findClosestPointIndex(touchX, points);

    setSelectedPointIndex(closestIndex);
    if (onPointSelect && data[closestIndex]) {
      onPointSelect(data[closestIndex]);
    }
  };

  // Pan responder for touch interactions
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: handleTouch,
    onPanResponderMove: handleTouch,
    onPanResponderRelease: () => {
      // Keep selection on release
    },
  });

  // Get selected point data
  const selectedPoint = selectedPointIndex !== null && points[selectedPointIndex] 
    ? points[selectedPointIndex] 
    : null;
  const selectedDataPoint = selectedPointIndex !== null && data && data[selectedPointIndex] 
    ? data[selectedPointIndex] 
    : null;

  // Calculate label position if point is selected
  const labelPosition = selectedPoint ? calculateLabelPosition(selectedPoint.x) : null;

  return (
    <View style={[styles.container, { height }]} ref={containerRef} {...panResponder.panHandlers}>
      <Svg width="100%" height={height} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.25" />
            <Stop offset="100%" stopColor={theme.colors.primary} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Gradient fill area under the line */}
        <Path
          d={`${chartPath} L${lastX} ${CHART_HEIGHT - 1} L0 ${CHART_HEIGHT - 1} Z`}
          fill="url(#chartGradient)"
        />

        {/* Main chart line */}
        <Path
          d={chartPath}
          stroke={theme.colors.primary}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Interactive selection indicators */}
        {selectedPoint && (
          <>
            {/* Vertical line at selected point */}
            <Line
              x1={selectedPoint.x}
              y1={0}
              x2={selectedPoint.x}
              y2={CHART_HEIGHT}
              stroke={theme.colors.textPrimary}
              strokeWidth="2.5"
              opacity={0.8}
            />

            {/* Circle marker at selected point */}
            <Circle
              cx={selectedPoint.x}
              cy={selectedPoint.y}
              r="5"
              fill={theme.colors.primary}
              stroke={theme.colors.background}
              strokeWidth="2"
            />

            {/* Date and value label */}
            {selectedDataPoint && seriesCode && labelPosition && (
              <>
                {/* Background rectangle for readability */}
                <Path
                  d={`M ${labelPosition.labelX} 8 L ${labelPosition.labelX} 36 L ${labelPosition.labelX + 120} 36 L ${labelPosition.labelX + 120} 8 Z`}
                  fill={theme.colors.surface}
                  opacity={0.95}
                />
                
                {/* Date text */}
                <SvgText
                  x={labelPosition.textX}
                  y={18}
                  fontSize="11"
                  fontWeight="600"
                  fill={theme.colors.textPrimary}
                  textAnchor={labelPosition.textAnchor}
                  opacity={1}>
                  {formatDate(selectedDataPoint.date)}
                </SvgText>
                
                {/* Value text */}
                <SvgText
                  x={labelPosition.textX}
                  y={32}
                  fontSize="11"
                  fontWeight="600"
                  fill={theme.colors.textPrimary}
                  textAnchor={labelPosition.textAnchor}
                  opacity={1}>
                  {formatValueForSeries(selectedDataPoint.rawValue, seriesCode)}
                </SvgText>
              </>
            )}
          </>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});
