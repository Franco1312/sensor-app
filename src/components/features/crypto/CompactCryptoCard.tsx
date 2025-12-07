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

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.card, { borderLeftColor: priceColor || trendColor }]}>
        <Card variant="elevated" padding="sm" style={{ flex: 1 }}>
          <View style={[styles.container, { minHeight: 80 }]}>
            <Text variant="2xs" color="textSecondary" weight="normal" style={styles.label}>
              {crypto.name}
            </Text>
            <Text variant="lg" weight="bold" style={[styles.value, { color: priceColor }]}>
              {crypto.lastPrice}
            </Text>
            <View style={[styles.changeContainer, { backgroundColor: `${trendColor}15` }]}>
              <Text variant="2xs" weight="normal" style={{ color: trendColor }}>
                {changeLabel}
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </TouchableOpacity>
  );
};

// Memoize component to prevent unnecessary re-renders
export const CompactCryptoCard = React.memo(CompactCryptoCardComponent, (prevProps, nextProps) => {
  // Custom comparison: only re-render if crypto id or onPress changes
  return prevProps.crypto.id === nextProps.crypto.id && prevProps.onPress === nextProps.onPress;
});

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 2, // More refined, thinner border
    borderRadius: 8,
    overflow: 'hidden',
  },
  container: {
    gap: 2,
    justifyContent: 'space-between',
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    marginTop: 2,
  },
  changeContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

