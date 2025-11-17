/**
 * IndicatorsScreen - Lista de indicadores con filtros
 * Based on SECCION_INDICADORES design
 */

import React, { useState } from 'react';
import { View, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { ScreenContainer, Header, ListItem } from '@/components/layout';
import { AppText, TrendIcon } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { mockIndicators } from '@/utils/mockData';
import {
  INDICATOR_FREQUENCIES,
  INDICATOR_CATEGORIES,
  DEFAULT_FREQUENCY,
  DEFAULT_CATEGORY,
  IndicatorFrequency,
} from '@/constants/indicators';
import { Indicator } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const IndicatorsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [frequencyFilter, setFrequencyFilter] = useState<IndicatorFrequency>(DEFAULT_FREQUENCY);
  const [categoryFilter, setCategoryFilter] = useState<string>(DEFAULT_CATEGORY);

  const filteredIndicators = mockIndicators.filter(indicator => {
    if (categoryFilter !== DEFAULT_CATEGORY) {
      const categoryValue = INDICATOR_CATEGORIES.find(cat => cat.label === categoryFilter)?.value;
      return categoryValue ? indicator.category === categoryValue : true;
    }
    return true;
  });

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return theme.colors.success;
      case 'down':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getTrendArrow = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '−';
    }
  };

  const renderIndicator = ({ item }: { item: Indicator }) => {
    const changeValue =
      item.changePercent >= 0
        ? `+${item.changePercent.toFixed(1)}%`
        : `${item.changePercent.toFixed(1)}%`;

    return (
      <ListItem
        title={item.name}
        subtitle={`Actualizado: ${item.lastUpdate}`}
        leftIcon={<TrendIcon trend={item.trend} size={24} />}
        rightContent={
          <View style={{ alignItems: 'flex-end', gap: 4 }}>
            <AppText variant="base" weight="medium">
              {item.value}
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <AppText variant="sm" style={{ color: getTrendColor(item.trend) }}>
                {changeValue}
              </AppText>
              <AppText variant="sm" style={{ color: getTrendColor(item.trend) }}>
                {getTrendArrow(item.trend)}
              </AppText>
            </View>
          </View>
        }
        onPress={() =>
          navigation.navigate('IndicatorDetail', {
            indicatorId: item.id,
            indicatorName: item.name,
          })
        }
        style={{ marginBottom: theme.spacing.md }}
      />
    );
  };

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title="Indicadores Económicos"
        leftIcon={<AppText variant="2xl">☰</AppText>}
        rightIcon={<AppText variant="2xl">🔍</AppText>}
        onRightPress={() => {
          // Navigate to search
        }}
      />

      {/* Frequency Filter */}
      <View style={{ paddingHorizontal: theme.spacing.base, paddingVertical: theme.spacing.md }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: theme.colors.surfaceSecondary,
            borderRadius: theme.radii.base,
            padding: 4,
            gap: 4,
          }}>
          {INDICATOR_FREQUENCIES.map(freq => (
            <TouchableOpacity
              key={freq}
              onPress={() => setFrequencyFilter(freq)}
              style={{
                flex: 1,
                paddingVertical: theme.spacing.sm,
                alignItems: 'center',
                borderRadius: theme.radii.base,
                backgroundColor: frequencyFilter === freq ? theme.colors.primary : 'transparent',
              }}>
              <AppText
                variant="sm"
                weight={frequencyFilter === freq ? 'medium' : 'normal'}
                color={frequencyFilter === freq ? 'textPrimary' : 'textSecondary'}>
                {freq}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.base,
          gap: theme.spacing.sm,
          paddingBottom: theme.spacing.sm,
        }}>
        {INDICATOR_CATEGORIES.map(category => (
          <TouchableOpacity
            key={category.label}
            onPress={() => setCategoryFilter(category.label)}
            style={{
              paddingHorizontal: theme.spacing.base,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.radii.full,
              backgroundColor:
                categoryFilter === category.label
                  ? theme.colors.primary
                  : theme.colors.surfaceSecondary,
              minHeight: 32,
              alignSelf: 'flex-start',
            }}>
            <AppText
              variant="sm"
              weight="medium"
              color={categoryFilter === category.label ? 'textPrimary' : 'textSecondary'}>
              {category.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Indicators List */}
      <View style={{ flex: 1, paddingHorizontal: theme.spacing.base }}>
        <FlatList
          data={filteredIndicators}
          renderItem={renderIndicator}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingTop: theme.spacing.md }}
        />
      </View>
    </ScreenContainer>
  );
};
