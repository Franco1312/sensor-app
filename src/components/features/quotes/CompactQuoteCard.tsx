/**
 * CompactQuoteCard - Compact card component for displaying quotes in grid layout
 * Used in HomeScreen grid of 2 columns
 */

import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Card, Text } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { Quote } from '@/types';
import { formatChangePercent } from '@/utils/formatting';

interface CompactQuoteCardProps {
  quote: Quote;
  onPress?: () => void;
}

export const CompactQuoteCard: React.FC<CompactQuoteCardProps> = ({ quote, onPress }) => {
  const { theme } = useTheme();
  const isPositive = quote.changePercent >= 0;
  const changeLabel = formatChangePercent(quote.changePercent, isPositive, 2);
  const trendColor = isPositive ? theme.colors.success : theme.colors.error;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card variant="elevated" padding="md">
        <View style={[styles.container, { minHeight: theme.spacing['4xl'] + theme.spacing['2xl'] }]}>
          <Text variant="xs" color="textSecondary">
            {quote.name}
          </Text>
          <Text variant="xl" weight="bold" style={styles.value}>
            {quote.sellPrice}
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

