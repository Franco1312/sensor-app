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
import { AppText } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { mockIndicators } from '@/utils/mockData';
import { Indicator } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type FrequencyFilter = 'Diaria' | 'Semanal' | 'Mensual';
type CategoryFilter = 'Todo' | 'Precios' | 'Monetaria' | 'Actividad' | 'Externo' | 'Finanzas';

export const IndicatorsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [frequencyFilter, setFrequencyFilter] = useState<FrequencyFilter>('Mensual');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('Todo');

  const categories: CategoryFilter[] = [
    'Todo',
    'Precios',
    'Monetaria',
    'Actividad',
    'Externo',
    'Finanzas',
  ];
  const frequencies: FrequencyFilter[] = ['Diaria', 'Semanal', 'Mensual'];

  const filteredIndicators = mockIndicators.filter(indicator => {
    if (categoryFilter !== 'Todo') {
      const categoryMap: Record<CategoryFilter, string> = {
        Todo: '',
        Precios: 'precios',
        Monetaria: 'monetaria',
        Actividad: 'actividad',
        Externo: 'externo',
        Finanzas: 'finanzas',
      };
      return indicator.category === categoryMap[categoryFilter];
    }
    return true;
  });

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      default:
        return '➖';
    }
  };

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

  const renderIndicator = ({ item }: { item: Indicator }) => {
    const changeValue =
      item.changePercent >= 0
        ? `+${item.changePercent.toFixed(1)}%`
        : `${item.changePercent.toFixed(1)}%`;

    return (
      <ListItem
        title={item.name}
        subtitle={`Actualizado: ${item.lastUpdate}`}
        leftIcon={
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: theme.radii.base,
              backgroundColor:
                item.trend === 'up'
                  ? theme.colors.successLight
                  : item.trend === 'down'
                    ? theme.colors.errorLight
                    : theme.colors.surfaceSecondary,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppText variant="lg">{getTrendIcon(item.trend)}</AppText>
          </View>
        }
        rightContent={
          <View style={{ alignItems: 'flex-end', gap: 4 }}>
            <AppText variant="base" weight="medium">
              {item.value}
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <AppText variant="sm" style={{ color: getTrendColor(item.trend) }}>
                {changeValue}
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
    <ScreenContainer>
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
          {frequencies.map(freq => (
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
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            onPress={() => setCategoryFilter(category)}
            style={{
              paddingHorizontal: theme.spacing.base,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.radii.full,
              backgroundColor:
                categoryFilter === category ? theme.colors.primary : theme.colors.surfaceSecondary,
            }}>
            <AppText
              variant="sm"
              weight="medium"
              color={categoryFilter === category ? 'textPrimary' : 'textSecondary'}>
              {category}
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
