/**
 * IndicatorCard - Reusable card component for displaying indicators
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Card, AppText, Tag, MiniChart } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { Indicator } from '@/types';
import { formatChangePercent } from '@/utils/formatting';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface IndicatorCardProps {
  indicator: Indicator;
  onPress?: () => void;
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({ indicator, onPress }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const isPositive = indicator.trend === 'up';
  const changeLabel = formatChangePercent(indicator.changePercent, isPositive, 2);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('IndicatorDetail', {
        indicatorId: indicator.id,
        indicatorName: indicator.name,
      });
    }
  };

  return (
    <Card onPress={handlePress}>
      <View style={[styles.container, { gap: theme.spacing.sm }]}>
        <AppText variant="sm" color="textSecondary" weight="medium">
          {indicator.name}
        </AppText>
        <AppText variant="3xl" weight="bold" style={styles.value}>
          {indicator.value}
        </AppText>
        <View style={[styles.metaRow, { gap: theme.spacing.sm }]}>
          <Tag
            label={changeLabel}
            variant={isPositive ? 'positive' : indicator.trend === 'down' ? 'negative' : 'neutral'}
          />
          <AppText variant="xs" color="textSecondary">
            Actualizado: {indicator.lastUpdate}
          </AppText>
        </View>
        <View style={[styles.chartContainer, { marginTop: theme.spacing.sm }]}>
          <MiniChart trend={indicator.trend} height={60} />
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

