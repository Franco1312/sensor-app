/**
 * ChartWithLabels - Reusable component that combines Chart with month labels
 */

import React from 'react';
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

export const ChartWithLabels: React.FC<ChartWithLabelsProps> = ({
  loading = false,
  chartData,
  seriesCode,
  height = 148,
  onPointSelect,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { marginBottom: theme.spacing.base, paddingTop: theme.spacing.base }]}>
      {loading ? (
        <ChartSkeleton height={height} />
      ) : (
        <Chart height={height} data={chartData} seriesCode={seriesCode} onPointSelect={onPointSelect} />
      )}
      <View style={[styles.labelsContainer, { marginTop: theme.spacing.sm }]}>
        {LABELS.CHART_MONTHS.map((label, index) => (
          <Text key={index} variant="xs" color="textSecondary" weight="bold">
            {label}
          </Text>
        ))}
      </View>
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
});

