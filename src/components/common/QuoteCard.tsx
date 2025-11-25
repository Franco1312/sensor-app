/**
 * QuoteCard - Reusable card component for displaying quotes
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, AppText, Tag, MiniChart } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { Quote } from '@/types';
import { formatChangePercent } from '@/utils/formatting';

interface QuoteCardProps {
  quote: Quote;
  onPress?: () => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onPress }) => {
  const { theme } = useTheme();

  const isPositive = quote.changePercent >= 0;
  const changeLabel = formatChangePercent(quote.changePercent, isPositive, 2);

  return (
    <Card onPress={onPress}>
      <View style={[styles.container, { gap: theme.spacing.sm }]}>
        <AppText variant="sm" color="textSecondary" weight="medium">
          {quote.name}
        </AppText>
        <AppText variant="3xl" weight="bold" style={styles.value}>
          {quote.sellPrice}
        </AppText>
        <View style={[styles.metaRow, { gap: theme.spacing.sm }]}>
          <Tag label={changeLabel} variant={isPositive ? 'positive' : 'negative'} />
          <AppText variant="xs" color="textSecondary">
            Actualizado: {quote.lastUpdate}
          </AppText>
        </View>
        <View style={[styles.chartContainer, { marginTop: theme.spacing.sm }]}>
          <MiniChart trend={isPositive ? 'up' : 'down'} height={60} />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    // Gap handled by inline style
  },
  value: {
    lineHeight: 32,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  chartContainer: {
    minHeight: 60,
  },
});

