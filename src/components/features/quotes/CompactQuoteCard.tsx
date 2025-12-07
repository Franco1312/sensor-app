/**
 * CompactQuoteCard - Compact card component for displaying quotes in grid layout
 * Used in HomeScreen grid of 2 columns
 */

import React, { useMemo } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Card, Text } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { Quote } from '@/types';
import { formatChangePercent } from '@/utils/formatting';
import { MiniSparklineChart } from '@/components/features/charts/MiniSparklineChart';
import Svg, { Path } from 'react-native-svg';

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

interface CompactQuoteCardProps {
  quote: Quote;
  onPress?: () => void;
}

const CompactQuoteCardComponent: React.FC<CompactQuoteCardProps> = ({ quote, onPress }) => {
  const { theme } = useTheme();
  const isPositive = quote.changePercent >= 0;
  const changeLabel = useMemo(
    () => formatChangePercent(quote.changePercent, isPositive, 2),
    [quote.changePercent, isPositive]
  );
  const trendColor = useMemo(
    () => isPositive ? theme.colors.success : theme.colors.error,
    [isPositive, theme.colors.success, theme.colors.error]
  );
  // Softer green for positive, keep red as is for negative
  const borderColor = useMemo(
    () => isPositive ? (theme.colors.successSoft || '#1FD99A') : trendColor,
    [isPositive, trendColor, theme.colors.successSoft]
  );

  // Determine trend for mini chart
  const chartTrend = useMemo((): 'up' | 'down' | 'neutral' => {
    if (isPositive) return 'up';
    if (quote.changePercent < 0) return 'down';
    return 'neutral';
  }, [isPositive, quote.changePercent]);

  // Always show chart icon and mini chart if quote has detail screen (all quotes do)
  const hasDetailScreen = true;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.card, { borderLeftColor: borderColor, borderRadius: theme.radii.base }]}>
        <Card variant="elevated" padding="sm" style={{ flex: 1 }}>
          <View style={[styles.container, { minHeight: 100 }]}>
            <View style={styles.headerRow}>
            <Text variant="2xs" color="textSecondary" weight="normal" style={styles.label}>
              {quote.name}
            </Text>
              {hasDetailScreen && (
                <View style={styles.chartIconContainer}>
                  <SmallChartIcon color={theme.colors.textTertiary} size={10} />
                </View>
              )}
            </View>
            <Text variant="lg" weight="bold" style={styles.value}>
              {quote.sellPrice}
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
export const CompactQuoteCard = React.memo(CompactQuoteCardComponent, (prevProps, nextProps) => {
  // Custom comparison: only re-render if quote id or onPress changes
  return prevProps.quote.id === nextProps.quote.id && prevProps.onPress === nextProps.onPress;
});

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 2, // More refined, thinner border
    // borderRadius will be set dynamically from theme
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
