/**
 * DataCard - Base reusable card component for displaying data (indicators, quotes, etc.)
 * Extracted common logic from IndicatorCard and QuoteCard
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from '@/components/ui';
import { MiniChart } from '@/components/features/charts';
import { MetaRow } from './MetaRow';
import { useTheme } from '@/theme/ThemeProvider';

interface DataCardProps {
  title: string;
  value: string;
  changeLabel: string;
  changeVariant: 'positive' | 'negative' | 'neutral';
  lastUpdate: string;
  trend: 'up' | 'down' | 'neutral';
  onPress?: () => void;
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  changeLabel,
  changeVariant,
  lastUpdate,
  trend,
  onPress,
}) => {
  const { theme } = useTheme();

  return (
    <Card onPress={onPress}>
      <View style={[styles.container, { gap: theme.spacing.sm }]}>
        <Text variant="sm" color="textSecondary" weight="medium">
          {title}
        </Text>
        <Text variant="3xl" weight="bold" style={styles.value}>
          {value}
        </Text>
        <MetaRow
          changeLabel={changeLabel}
          changeVariant={changeVariant}
          lastUpdate={lastUpdate}
        />
        <View style={[styles.chartContainer, { marginTop: theme.spacing.sm }]}>
          <MiniChart trend={trend} height={60} />
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
  chartContainer: {
    minHeight: 60,
  },
});

