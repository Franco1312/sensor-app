/**
 * IndicatorCard - Reusable card component for displaying indicators
 */

/**
 * IndicatorCard - Card component for displaying indicators
 * Uses DataCard base component for reusability
 */

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { DataCard } from '@/components/common/DataCard';
import { Indicator } from '@/types';
import { formatChangePercent } from '@/utils/formatting';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface IndicatorCardProps {
  indicator: Indicator;
  onPress?: () => void;
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({ indicator, onPress }) => {
  const navigation = useNavigation<NavigationProp>();

  const isPositive = indicator.trend === 'up';
  const changeLabel = formatChangePercent(indicator.changePercent, isPositive, 2);
  const changeVariant = isPositive
    ? 'positive'
    : indicator.trend === 'down'
    ? 'negative'
    : 'neutral';

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
    <DataCard
      title={indicator.name}
      value={indicator.value}
      changeLabel={changeLabel}
      changeVariant={changeVariant}
      lastUpdate={indicator.lastUpdate}
      trend={indicator.trend}
      onPress={handlePress}
    />
  );
};

