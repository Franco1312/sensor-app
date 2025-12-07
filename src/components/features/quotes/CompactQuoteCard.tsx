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
  const borderColor = useMemo(
    () => trendColor,
    [trendColor]
  );

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.card, { borderLeftColor: borderColor }]}>
        <Card variant="elevated" padding="sm" style={{ flex: 1 }}>
          <View style={[styles.container, { minHeight: 80 }]}>
            <Text variant="2xs" color="textSecondary" weight="medium" style={styles.label}>
              {quote.name}
            </Text>
            <Text variant="lg" weight="bold" style={styles.value}>
              {quote.sellPrice}
            </Text>
            <View style={[styles.changeContainer, { backgroundColor: `${trendColor}15` }]}>
              <Text variant="2xs" weight="semibold" style={{ color: trendColor }}>
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
export const CompactQuoteCard = React.memo(CompactQuoteCardComponent, (prevProps, nextProps) => {
  // Custom comparison: only re-render if quote id or onPress changes
  return prevProps.quote.id === nextProps.quote.id && prevProps.onPress === nextProps.onPress;
});

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 3,
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

