/**
 * CompactIndicatorCard - Compact card component for displaying indicators in grid layout
 * Used in HomeScreen grid of 2 columns
 */

import React, { useMemo } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Card, Text } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { Indicator } from '@/types';
import { formatChangePercent } from '@/utils/formatting';
import { MiniSparklineChart } from '@/components/features/charts/MiniSparklineChart';
import Svg, { Path } from 'react-native-svg';

interface CompactIndicatorCardProps {
  indicator: Indicator;
  onPress?: () => void;
}

// Small chart icon component for indicating clickable chart
const SmallChartIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 10 }) => (
  <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <Path
      d="M1 9L4 6L6.5 8.5L10 5"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const CompactIndicatorCardComponent: React.FC<CompactIndicatorCardProps> = ({
  indicator,
  onPress,
}) => {
  const { theme } = useTheme();
  const isPositive = indicator.trend === 'up';
  const changeLabel = useMemo(
    () => formatChangePercent(indicator.changePercent, isPositive, 2),
    [indicator.changePercent, isPositive]
  );
  const trendColor = useMemo(
    () => isPositive
      ? (theme.colors.successSoft || theme.colors.success)
      : indicator.trend === 'down'
      ? theme.colors.error
      : theme.colors.textSecondary,
    [isPositive, indicator.trend, theme.colors.success, theme.colors.successSoft, theme.colors.error, theme.colors.textSecondary]
  );

  // Determine trend for mini chart based on changePercent
  // (indicator.trend may be 'neutral' by default, so we use changePercent instead)
  const chartTrend = useMemo((): 'up' | 'down' | 'neutral' => {
    if (indicator.changePercent > 0) return 'up';
    if (indicator.changePercent < 0) return 'down';
    return 'neutral';
  }, [indicator.changePercent]);

  // Always show chart icon and mini chart if indicator has detail screen (all indicators do)
  const hasDetailScreen = true; // All indicators have detail screens

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.card, { borderLeftColor: trendColor }]}>
        <Card variant="elevated" padding="sm" style={{ flex: 1 }}>
          <View style={[styles.container, { minHeight: 100 }]}>
            <View style={styles.headerRow}>
            <Text variant="2xs" color="textSecondary" weight="normal" style={styles.label}>
              {indicator.name}
            </Text>
              {hasDetailScreen && (
                <View style={styles.chartIconContainer}>
                  <SmallChartIcon color={theme.colors.textTertiary} size={10} />
                </View>
              )}
            </View>
            <Text variant="lg" weight="bold" style={styles.value}>
              {indicator.value}
            </Text>
            <View style={styles.bottomRow}>
            <View style={[styles.changeContainer, { backgroundColor: `${trendColor}15` }]}>
              <Text variant="2xs" weight="normal" style={{ color: trendColor }}>
                {changeLabel}
              </Text>
              </View>
              {hasDetailScreen && (
                <View style={styles.miniChartContainer}>
                  <MiniSparklineChart
                    trend={chartTrend}
                    color={trendColor}
                    height={20}
                    width={50}
                  />
                </View>
              )}
            </View>
          </View>
        </Card>
      </View>
    </TouchableOpacity>
  );
};

// Memoize component to prevent unnecessary re-renders
export const CompactIndicatorCard = React.memo(CompactIndicatorCardComponent, (prevProps, nextProps) => {
  // Custom comparison: only re-render if indicator id or onPress changes
  return prevProps.indicator.id === nextProps.indicator.id && prevProps.onPress === nextProps.onPress;
});

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 2, // More refined, thinner border
    borderRadius: 8,
    overflow: 'hidden',
  },
  container: {
    gap: 4,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  chartIconContainer: {
    opacity: 0.5,
    marginLeft: 4,
  },
  value: {
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  miniChartContainer: {
    marginLeft: 8,
    opacity: 0.7,
  },
});

