/**
 * QuotesScreen - Lista de cotizaciones
 * Based on detalle_cotizacion design
 */

import React, { useMemo, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { ScreenContainer, Header, ListItem } from '@/components/layout';
import { AppText } from '@/components/common';
import { CategoryTabs } from '@/components/navigation/CategoryTabs';
import { CategoryPager } from '@/components/navigation/CategoryPager';
import { useTheme } from '@/theme/ThemeProvider';
import { useCategoryPager } from '@/hooks/useCategoryPager';
import { useIndicatorsFilter } from '@/context/IndicatorsFilterContext';
import { mockQuotes } from '@/utils/mockData';
import { QUOTE_CATEGORY_TABS, DEFAULT_QUOTE_CATEGORY, QuoteCategory } from '@/constants/quotes';
import { Quote } from '@/types';

export const QuotesScreen: React.FC = () => {
  const { theme } = useTheme();
  const { selectedQuoteCategory, setSelectedQuoteCategory, setCurrentQuoteCategory } =
    useIndicatorsFilter();
  const categories = useMemo(
    () => QUOTE_CATEGORY_TABS.map(tab => tab.value),
    []
  );

  const {
    pagerRef,
    activeCategory,
    initialIndex,
    handlePageSelected,
    handlePageScroll,
    handlePageScrollStateChanged,
    handleCategoryChange,
    scrollEnabled,
  } = useCategoryPager({
    categories,
    defaultCategory: DEFAULT_QUOTE_CATEGORY,
  });

  // Update category when context category changes
  useEffect(() => {
    if (selectedQuoteCategory !== null) {
      handleCategoryChange(selectedQuoteCategory as QuoteCategory);
      // Clear the context after applying
      setSelectedQuoteCategory(null);
    }
  }, [selectedQuoteCategory, setSelectedQuoteCategory, handleCategoryChange]);

  // Update current category in context when active category changes
  useEffect(() => {
    setCurrentQuoteCategory(activeCategory);
  }, [activeCategory, setCurrentQuoteCategory]);

  const renderQuote = ({ item }: { item: Quote }) => {
    const isPositive = item.changePercent >= 0;
    const changeLabel = `${isPositive ? '+' : ''}${item.changePercent.toFixed(2)}%`;
    const changeValue = `${isPositive ? '+' : ''}$${Math.abs(item.change).toFixed(2)}`;

    return (
      <ListItem
        title={item.name}
        subtitle={`Venta: ${item.sellPrice}`}
        rightContent={
          <View style={{ alignItems: 'flex-end', gap: 4 }}>
            <AppText
              variant="base"
              weight="medium"
              style={{
                color: isPositive ? theme.colors.success : theme.colors.error,
              }}>
              {changeLabel}
            </AppText>
            <AppText
              variant="xs"
              style={{
                color: isPositive ? theme.colors.success : theme.colors.error,
              }}>
              {changeValue}
            </AppText>
          </View>
        }
        style={{
          marginBottom: theme.spacing.md,
          backgroundColor: theme.colors.surface,
        }}
        onPress={() => {
          // Navigate to quote detail
        }}
      />
    );
  };

  return (
    <ScreenContainer scrollable={false}>
      <Header title="Cotizaciones" />

      <CategoryTabs
        tabs={QUOTE_CATEGORY_TABS}
        activeTab={activeCategory}
        onTabPress={handleCategoryChange}
      />

      {/* Last Update */}
      <View style={{ padding: theme.spacing.base, alignItems: 'center' }}>
        <AppText variant="xs" color="textSecondary">
          Actualizado: 14:32:05 hs
        </AppText>
      </View>

      {/* Swipeable Quotes List */}
      <CategoryPager
        pagerRef={pagerRef}
        categories={categories}
        initialIndex={initialIndex}
        scrollEnabled={scrollEnabled}
        onPageSelected={handlePageSelected}
        onPageScroll={handlePageScroll}
        onPageScrollStateChanged={handlePageScrollStateChanged}
        renderPage={(category: QuoteCategory) => {
          const categoryQuotes = mockQuotes.filter(quote => quote.category === category);
          return (
            <View style={{ flex: 1, paddingHorizontal: theme.spacing.base }}>
              <FlatList
                data={categoryQuotes}
                renderItem={renderQuote}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingTop: theme.spacing.md }}
              />
            </View>
          );
        }}
      />
    </ScreenContainer>
  );
};
