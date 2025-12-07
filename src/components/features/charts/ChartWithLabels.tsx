/**
 * ChartWithLabels - Reusable component that combines Chart with month labels
 */

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Chart } from './Chart';
import { ChartSkeleton, Text } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { LABELS } from '@/constants/labels';
import { ChartDataPoint } from '@/utils/seriesTransform';
import { SeriesCode } from '@/constants/series';

interface ChartWithLabelsProps {
  loading?: boolean;
  chartData?: ChartDataPoint[];
  seriesCode?: SeriesCode;
  height?: number;
  onPointSelect?: (point: ChartDataPoint | null) => void;
}

/**
 * Validates that chart data contains valid values
 * Returns true if data has at least one point with a valid rawValue
 */
const hasValidData = (data?: ChartDataPoint[]): boolean => {
  if (!data || data.length === 0) return false;
  
  // Check if at least one point has a valid rawValue
  return data.some(point => {
    if (!point.rawValue || typeof point.rawValue !== 'string') return false;
    const trimmed = point.rawValue.trim();
    if (trimmed === '') return false;
    
    // Try to parse the value
    const numValue = parseFloat(trimmed);
    return !isNaN(numValue) && isFinite(numValue);
  });
};

export const ChartWithLabels: React.FC<ChartWithLabelsProps> = ({
  loading = false,
  chartData,
  seriesCode,
  height = 148,
  onPointSelect,
}) => {
  const { theme } = useTheme();
  
  // Validate that we have real data
  const isValidData = useMemo(() => hasValidData(chartData), [chartData]);

  return (
    <View style={[styles.container, { marginBottom: theme.spacing.base, paddingTop: theme.spacing.base }]}>
      {loading ? (
        <ChartSkeleton height={height} />
      ) : !isValidData ? (
        <View style={[styles.emptyContainer, { height, paddingVertical: theme.spacing.lg }]}>
          <Text variant="base" color="textSecondary" style={{ textAlign: 'center' }}>
            No hay datos disponibles para este período
          </Text>
        </View>
      ) : (
        <Chart height={height} data={chartData} seriesCode={seriesCode} onPointSelect={onPointSelect} />
      )}
      {isValidData && (
        <View style={[styles.labelsContainer, { marginTop: theme.spacing.sm }]}>
          {LABELS.CHART_MONTHS.map((label, index) => (
            <Text key={index} variant="xs" color="textSecondary" weight="normal">
              {label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 180,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

