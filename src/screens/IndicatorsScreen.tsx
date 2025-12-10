/**
 * IndicatorsScreen - Lista de indicadores con filtros
 * Based on SECCION_INDICADORES design
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, FlatList, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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
import { usePrefetchIndicator } from '@/hooks/usePrefetch';
import { SeriesCode } from '@/constants/series';
import { useScreenTracking, SCREEN_NAMES } from '@/core/analytics';
import { analytics } from '@/core/analytics';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TabNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Indicators'>;

// ============================================================================
// Sub-components
// ============================================================================

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
  theme: Theme;
  indicators: Indicator[];
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onSelect, theme, indicators }) => {
  // Calculate count for each category
  const getCategoryCount = (categoryValue: string) => {
    if (categoryValue === '') return indicators.length;
    return indicators.filter(indicator => indicator.category === categoryValue).length;
  };

  return (
  <View style={{ paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xs }}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: theme.spacing.base,
        gap: theme.spacing.sm,
      }}>
        {INDICATOR_CATEGORIES.map(category => {
          const count = getCategoryCount(category.value);
          const labelWithCount = category.label === 'Todo' 
            ? category.label 
            : `${category.label} (${count})`;
          
          return (
        <FilterButton
          key={category.label}
              label={labelWithCount}
          isSelected={selected === category.label}
          onPress={() => onSelect(category.label)}
        />
          );
        })}
    </ScrollView>
  </View>
);
};

// ============================================================================
// Main Component
// ============================================================================

export const IndicatorsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { selectedCategory, setSelectedCategory, setCurrentCategory } = useIndicatorsFilter();
  const [categoryFilter, setCategoryFilter] = useState<string>(DEFAULT_CATEGORY);
  const prefetchIndicator = usePrefetchIndicator();

  // Track screen view
  useScreenTracking(SCREEN_NAMES.SERIES_LIST);

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

  // No need to reload on focus - React Query handles caching automatically

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
    const handlePress = () => {
      // Track series view
      // Map category to source (category values are: 'precios', 'monetaria', 'actividad', 'externo', 'finanzas')
      const source = item.category === 'precios' ? 'INDEC' : item.category ? 'BCRA' : 'DOLAR_API';
      analytics.trackSeriesViewed({
        series_code: item.id,
        source,
        category: item.category || 'other',
      });
      
      // Prefetch detail data before navigation
      prefetchIndicator(item.id as SeriesCode);
      navigation.navigate('IndicatorDetail', {
        indicatorId: item.id,
        indicatorName: item.name,
      });
    };

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
        onPress={handlePress}
        style={{ marginBottom: theme.spacing.sm }}
      />
    );
    }, [navigation, theme.spacing.md, prefetchIndicator]);

  // Get header title with category breadcrumb
  const headerTitle = useMemo(() => {
    if (categoryFilter === DEFAULT_CATEGORY) {
      return t('screens.indicators.title');
    }
    return `${t('screens.indicators.title')} > ${categoryFilter}`;
  }, [categoryFilter, t]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title={headerTitle} />

      <CategoryFilter 
        selected={categoryFilter} 
        onSelect={setCategoryFilter} 
        theme={theme}
        indicators={indicators}
      />

      {/* Category info section */}
      {!loading && categoryFilter !== DEFAULT_CATEGORY && (
        <View style={{ 
          paddingHorizontal: theme.spacing.base, 
          paddingTop: theme.spacing.xs,
          paddingBottom: theme.spacing.sm 
        }}>
          <Text variant="sm" color="textSecondary">
            {filteredIndicators.length} {filteredIndicators.length === 1 ? 'indicador' : 'indicadores'} en {categoryFilter}
          </Text>
        </View>
      )}

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
          // Performance optimizations
          windowSize={10}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}
          getItemLayout={(data, index) => ({
            length: 80, // Approximate item height
            offset: 80 * index,
            index,
          })}
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
