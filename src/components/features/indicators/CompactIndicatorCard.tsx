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

interface CompactIndicatorCardProps {
  indicator: Indicator;
  onPress?: () => void;
}

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
      ? theme.colors.success
      : indicator.trend === 'down'
      ? theme.colors.error
      : theme.colors.textSecondary,
    [isPositive, indicator.trend, theme.colors.success, theme.colors.error, theme.colors.textSecondary]
  );

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

// Memoize component to prevent unnecessary re-renders
export const CompactIndicatorCard = React.memo(CompactIndicatorCardComponent, (prevProps, nextProps) => {
  // Custom comparison: only re-render if indicator id or onPress changes
  return prevProps.indicator.id === nextProps.indicator.id && prevProps.onPress === nextProps.onPress;
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

