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
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card variant="elevated" padding="md">
        <View style={[styles.container, { minHeight: theme.spacing['4xl'] + theme.spacing['2xl'] }]}>
          <Text variant="xs" color="textSecondary">
            {crypto.name}
          </Text>
          <Text variant="xl" weight="bold" style={[styles.value, { color: priceColor }]}>
            {crypto.lastPrice}
          </Text>
          <View style={styles.changeContainer}>
            <Text variant="xs" style={{ color: trendColor }}>
              {changeLabel}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

// Memoize component to prevent unnecessary re-renders
export const CompactCryptoCard = React.memo(CompactCryptoCardComponent, (prevProps, nextProps) => {
  // Custom comparison: only re-render if crypto id or onPress changes
  return prevProps.crypto.id === nextProps.crypto.id && prevProps.onPress === nextProps.onPress;
});

const styles = StyleSheet.create({
  container: {
    gap: 4,
    justifyContent: 'space-between',
  },
  value: {
    marginTop: 4,
  },
  changeContainer: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

