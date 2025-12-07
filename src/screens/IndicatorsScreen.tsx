/**
 * IndicatorsScreen - Lista de indicadores con filtros
 * Based on SECCION_INDICADORES design
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, FlatList, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '@/navigation/types';
import { Header, ListItem } from '@/components/layout';
import { Text, Skeleton, Card, FilterButton, ChangeDisplay, TrendIcon } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { Theme } from '@/theme/theme';
import { formatUpdatedLabel } from '@/constants/labels';
import {
  INDICATOR_CATEGORIES,
  DEFAULT_CATEGORY,
} from '@/constants/indicators';
import { Indicator } from '@/types';
import { useIndicators } from '@/hooks/useIndicators';
import { useIndicatorsFilter } from '@/context/IndicatorsFilterContext';
import { useTranslation } from '@/i18n';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TabNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Indicators'>;

// ============================================================================
// Sub-components
// ============================================================================

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
  theme: Theme;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onSelect, theme }) => (
  <View style={{ paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xs }}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: theme.spacing.base,
        gap: theme.spacing.sm,
      }}>
      {INDICATOR_CATEGORIES.map(category => (
        <FilterButton
          key={category.label}
          label={category.label}
          isSelected={selected === category.label}
          onPress={() => onSelect(category.label)}
        />
      ))}
    </ScrollView>
  </View>
);

// ============================================================================
// Main Component
// ============================================================================

export const IndicatorsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { selectedCategory, setSelectedCategory, setCurrentCategory } = useIndicatorsFilter();
  const [categoryFilter, setCategoryFilter] = useState<string>(DEFAULT_CATEGORY);

  // Update filter when context category changes
  useEffect(() => {
    if (selectedCategory !== null) {
      const categoryLabel = INDICATOR_CATEGORIES.find(cat => cat.value === selectedCategory)?.label || DEFAULT_CATEGORY;
      setCategoryFilter(categoryLabel);
      // Clear the context after applying
      setSelectedCategory(null);
    }
  }, [selectedCategory, setSelectedCategory]);

  // Update current category in context when filter changes
  useEffect(() => {
    const categoryValue = categoryFilter === DEFAULT_CATEGORY
      ? null
      : INDICATOR_CATEGORIES.find(cat => cat.label === categoryFilter)?.value || null;
    setCurrentCategory(categoryValue);
  }, [categoryFilter, setCurrentCategory]);

  const { indicators, loading, refetch: refetchIndicators } = useIndicators();

  // Reload indicators when screen is focused
  useFocusEffect(
    useCallback(() => {
      refetchIndicators();
    }, [refetchIndicators])
  );

  const filteredIndicators = useMemo(() => {
    if (categoryFilter === DEFAULT_CATEGORY) {
      return indicators;
    }
    const categoryValue = INDICATOR_CATEGORIES.find(cat => cat.label === categoryFilter)?.value;
    return categoryValue
      ? indicators.filter(indicator => indicator.category === categoryValue)
      : indicators;
  }, [indicators, categoryFilter]);

  const renderIndicator = useCallback(({ item }: { item: Indicator }) => {
    return (
      <ListItem
        title={item.name}
        subtitle={formatUpdatedLabel(item.lastUpdate)}
        leftIcon={<TrendIcon trend={item.trend} size={24} />}
        rightContent={
          <View style={styles.rightContent}>
            <Text variant="base" weight="medium">
              {item.value}
            </Text>
            <ChangeDisplay changePercent={item.changePercent} trend={item.trend} />
          </View>
        }
        onPress={() =>
          navigation.navigate('IndicatorDetail', {
            indicatorId: item.id,
            indicatorName: item.name,
          })
        }
        style={{ marginBottom: theme.spacing.sm }}
      />
    );
  }, [navigation, theme.spacing.md]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title={t('screens.indicators.title')} />

      <CategoryFilter selected={categoryFilter} onSelect={setCategoryFilter} theme={theme} />

      {loading ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: theme.spacing.base, paddingTop: theme.spacing.sm }}>
          <View style={{ gap: theme.spacing.sm }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={`skeleton-${index}`} style={{ marginBottom: theme.spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.base }}>
                  <Skeleton width={40} height={40} borderRadius={8} />
                  <View style={{ flex: 1, gap: theme.spacing.xs }}>
                    <Skeleton width="70%" height={16} />
                    <Skeleton width="50%" height={14} />
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Skeleton width={80} height={18} />
                    <Skeleton width={60} height={14} />
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={filteredIndicators}
          renderItem={renderIndicator}
          keyExtractor={item => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: theme.spacing.base, paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.lg }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  rightContent: {
    alignItems: 'flex-end',
    gap: 4,
  },
});
