/**
 * CompactCryptoCard - Compact card component for displaying crypto in grid layout
 * Used in HomeScreen grid of 2 columns
 */

import React, { useMemo } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Card, Text } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { Crypto } from '@/types';
import { formatChangePercent } from '@/utils/formatting';
import { usePriceColor } from '@/hooks/usePriceDirection';
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

interface CompactCryptoCardProps {
  crypto: Crypto;
  onPress?: () => void;
}

const CompactCryptoCardComponent: React.FC<CompactCryptoCardProps> = ({ crypto, onPress }) => {
  const { theme } = useTheme();
  const isPositive = crypto.changePercent >= 0;
  const changeLabel = useMemo(
    () => formatChangePercent(crypto.changePercent, isPositive, 2),
    [crypto.changePercent, isPositive]
  );
  const trendColor = useMemo(
    () => isPositive ? theme.colors.success : theme.colors.error,
    [isPositive, theme.colors.success, theme.colors.error]
  );
  const priceColor = usePriceColor(crypto.priceDirection);

  // Determine trend for mini chart based on change percent only
  // (not priceDirection which changes with every socket update)
  const chartTrend = useMemo((): 'up' | 'down' | 'neutral' => {
    if (isPositive) return 'up';
    if (crypto.changePercent < 0) return 'down';
    return 'neutral';
  }, [isPositive, crypto.changePercent]);

  // Always show chart icon and mini chart if crypto has detail screen (all cryptos do)
  const hasDetailScreen = true;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.card, { borderLeftColor: priceColor || trendColor }]}>
        <Card variant="elevated" padding="sm" style={{ flex: 1 }}>
          <View style={[styles.container, { minHeight: 100 }]}>
            <View style={styles.headerRow}>
            <Text variant="2xs" color="textSecondary" weight="normal" style={styles.label}>
              {crypto.name}
            </Text>
              {hasDetailScreen && (
                <View style={styles.chartIconContainer}>
                  <SmallChartIcon color={theme.colors.textTertiary} size={10} />
                </View>
              )}
            </View>
            <Text variant="lg" weight="bold" style={[styles.value, { color: priceColor }]}>
              {crypto.lastPrice}
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
export const CompactCryptoCard = React.memo(CompactCryptoCardComponent, (prevProps, nextProps) => {
  // Custom comparison: only re-render if crypto id, changePercent, or onPress changes
  // We ignore priceDirection changes to prevent mini chart from flickering with socket updates
  return (
    prevProps.crypto.id === nextProps.crypto.id &&
    prevProps.crypto.changePercent === nextProps.crypto.changePercent &&
    prevProps.crypto.lastPrice === nextProps.crypto.lastPrice &&
    prevProps.onPress === nextProps.onPress
  );
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

