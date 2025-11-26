/**
 * CompactIndicatorCard - Compact card component for displaying indicators in grid layout
 * Used in HomeScreen grid of 2 columns
 */

import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Card, Text } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { Indicator } from '@/types';
import { formatChangePercent } from '@/utils/formatting';

interface CompactIndicatorCardProps {
  indicator: Indicator;
  onPress?: () => void;
}

export const CompactIndicatorCard: React.FC<CompactIndicatorCardProps> = ({
  indicator,
  onPress,
}) => {
  const { theme } = useTheme();
  const isPositive = indicator.trend === 'up';
  const changeLabel = formatChangePercent(indicator.changePercent, isPositive, 2);
  const trendColor = isPositive
    ? theme.colors.success
    : indicator.trend === 'down'
    ? theme.colors.error
    : theme.colors.textSecondary;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card variant="elevated" padding="md">
        <View style={[styles.container, { minHeight: theme.spacing['4xl'] + theme.spacing['2xl'] }]}>
          <Text variant="xs" color="textSecondary">
            {indicator.name}
          </Text>
          <Text variant="xl" weight="bold" style={styles.value}>
            {indicator.value}
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

