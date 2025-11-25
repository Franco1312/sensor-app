/**
 * IndicatorsScreen - Lista de indicadores con filtros
 * Based on SECCION_INDICADORES design
 */

import React, { useState, useMemo } from 'react';
import { View, FlatList, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { ScreenContainer, Header, ListItem } from '@/components/layout';
import { AppText, TrendIcon } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { Theme } from '@/theme/theme';
import {
  INDICATOR_FREQUENCIES,
  INDICATOR_CATEGORIES,
  DEFAULT_FREQUENCY,
  DEFAULT_CATEGORY,
  IndicatorFrequency,
} from '@/constants/indicators';
import { Indicator } from '@/types';
import { useIndicators } from '@/hooks/useIndicators';
import { formatChangeValue, getTrendColor, getTrendArrow } from '@/utils/formatting';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ============================================================================
// Sub-components
// ============================================================================

interface FrequencyFilterProps {
  selected: IndicatorFrequency;
  onSelect: (freq: IndicatorFrequency) => void;
  theme: Theme;
}

const FrequencyFilter: React.FC<FrequencyFilterProps> = ({ selected, onSelect, theme }) => (
  <View style={[styles.filterContainer, { paddingHorizontal: theme.spacing.base, paddingVertical: theme.spacing.md }]}>
    <View
      style={[
        styles.filterRow,
        {
          backgroundColor: theme.colors.surfaceSecondary,
          borderRadius: theme.radii.base,
          padding: 4,
          gap: 4,
        },
      ]}>
      {INDICATOR_FREQUENCIES.map(freq => (
        <TouchableOpacity
          key={freq}
          onPress={() => onSelect(freq)}
          style={[
            styles.filterButton,
            {
              flex: 1,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.radii.base,
              backgroundColor: selected === freq ? theme.colors.primary : 'transparent',
            },
          ]}>
          <AppText
            variant="sm"
            weight={selected === freq ? 'medium' : 'normal'}
            color={selected === freq ? 'textPrimary' : 'textSecondary'}>
            {freq}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
  theme: Theme;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onSelect, theme }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={[
      styles.categoryFilterContent,
      {
        paddingHorizontal: theme.spacing.base,
        gap: theme.spacing.sm,
        paddingBottom: theme.spacing.sm,
      },
    ]}>
    {INDICATOR_CATEGORIES.map(category => (
      <TouchableOpacity
        key={category.label}
        onPress={() => onSelect(category.label)}
        style={[
          styles.categoryButton,
          {
            paddingHorizontal: theme.spacing.base,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.radii.full,
            backgroundColor:
              selected === category.label ? theme.colors.primary : theme.colors.surfaceSecondary,
            minHeight: 32,
            alignSelf: 'flex-start',
          },
        ]}>
        <AppText
          variant="sm"
          weight="medium"
          color={selected === category.label ? 'textPrimary' : 'textSecondary'}>
          {category.label}
        </AppText>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

// ============================================================================
// Main Component
// ============================================================================

export const IndicatorsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [frequencyFilter, setFrequencyFilter] = useState<IndicatorFrequency>(DEFAULT_FREQUENCY);
  const [categoryFilter, setCategoryFilter] = useState<string>(DEFAULT_CATEGORY);

  const indicators = useIndicators();

  const filteredIndicators = useMemo(() => {
    if (categoryFilter === DEFAULT_CATEGORY) {
      return indicators;
    }
    const categoryValue = INDICATOR_CATEGORIES.find(cat => cat.label === categoryFilter)?.value;
    return categoryValue
      ? indicators.filter(indicator => indicator.category === categoryValue)
      : indicators;
  }, [indicators, categoryFilter]);

  const renderIndicator = ({ item }: { item: Indicator }) => {
    const changeValue = formatChangeValue(item.changePercent);
    const trendColor = getTrendColor(item.trend, theme);
    const trendArrow = getTrendArrow(item.trend);

    return (
      <ListItem
        title={item.name}
        subtitle={`Actualizado: ${item.lastUpdate}`}
        leftIcon={<TrendIcon trend={item.trend} size={24} />}
        rightContent={
          <View style={styles.rightContent}>
            <AppText variant="base" weight="medium">
              {item.value}
            </AppText>
            <View style={styles.changeRow}>
              <AppText variant="sm" style={{ color: trendColor }}>
                {changeValue}
              </AppText>
              <AppText variant="sm" style={{ color: trendColor }}>
                {trendArrow}
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
      <Header title="Indicadores Económicos" />

      <FrequencyFilter selected={frequencyFilter} onSelect={setFrequencyFilter} theme={theme} />

      <CategoryFilter selected={categoryFilter} onSelect={setCategoryFilter} theme={theme} />

      <View style={[styles.listContainer, { flex: 1, paddingHorizontal: theme.spacing.base }]}>
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

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  filterContainer: {
    // Padding handled by inline style
  },
  filterRow: {
    flexDirection: 'row',
  },
  filterButton: {
    alignItems: 'center',
  },
  categoryFilterContent: {
    // Styles handled by inline style
  },
  categoryButton: {
    // Styles handled by inline style
  },
  listContainer: {
    // Styles handled by inline style
  },
  rightContent: {
    alignItems: 'flex-end',
    gap: 4,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
