/**
 * QuotesScreen - Lista de cotizaciones
 * Based on detalle_cotizacion design
 */

import React, { useMemo, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, ListItem } from '@/components/layout';
import { Text, Skeleton, Card, EmptyState } from '@/components/common';
import { CategoryTabs } from '@/components/navigation/CategoryTabs';
import { CategoryPager } from '@/components/navigation/CategoryPager';
import { useTheme } from '@/theme/ThemeProvider';
import { useCategoryPager } from '@/hooks/useCategoryPager';
import { useIndicatorsFilter } from '@/context/IndicatorsFilterContext';
import { useQuotes } from '@/hooks/useQuotes';
import { QUOTE_CATEGORY_TABS, DEFAULT_QUOTE_CATEGORY, QuoteCategory } from '@/constants/quotes';
import { Quote } from '@/types';
import { formatTime } from '@/utils/dateFormat';
import { RootStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const QuotesScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { selectedQuoteCategory, setSelectedQuoteCategory, setCurrentQuoteCategory } =
    useIndicatorsFilter();
  const { quotes, loading, error } = useQuotes();
  const categories = useMemo(
    () => QUOTE_CATEGORY_TABS.map(tab => tab.value),
    []
  );

  // Get the most recent update time from quotes
  const lastUpdateTime = useMemo(() => {
    if (quotes.length === 0) return null;
    // Find the most recent time from all quotes
    // Since all quotes have the same format (HH:MM), we can use any of them
    // In a real scenario, we'd parse the actual dates and find the latest
    return quotes[0]?.lastUpdate || null;
  }, [quotes]);

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

    return (
      <ListItem
        title={item.name}
        rightContent={
          <View style={{ alignItems: 'flex-end', gap: 4 }}>
            <Text
              variant="base"
              weight="medium"
              style={{
                color: theme.colors.textPrimary,
              }}>
              {item.sellPrice}
            </Text>
            <Text
              variant="xs"
              style={{
                color: isPositive ? theme.colors.success : theme.colors.error,
              }}>
              {changeLabel}
            </Text>
          </View>
        }
        style={{
          marginBottom: theme.spacing.md,
          backgroundColor: theme.colors.surface,
        }}
        onPress={() => {
          // Extract casa from quote id (format: "quote-blue")
          const casa = item.id.replace('quote-', '');
          navigation.navigate('QuoteDetail', {
            quoteId: casa,
            quoteName: item.name,
          });
        }}
      />
    );
  };

  return (
    <Screen scrollable={false}>
      <Header title="Cotizaciones" />

      <CategoryTabs
        tabs={QUOTE_CATEGORY_TABS}
        activeTab={activeCategory}
        onTabPress={handleCategoryChange}
      />

      {/* Last Update */}
      {lastUpdateTime && (
        <View style={{ padding: theme.spacing.base, alignItems: 'center' }}>
          <Text variant="xs" color="textSecondary">
            Actualizado: {lastUpdateTime} hs
          </Text>
        </View>
      )}

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
          const categoryQuotes = quotes.filter(quote => quote.category === category);
          
          if (loading) {
            return (
              <View style={{ flex: 1, paddingHorizontal: theme.spacing.base, paddingTop: theme.spacing.md }}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={`skeleton-${index}`} style={{ marginBottom: theme.spacing.md }}>
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
            );
          }

          if (error) {
            return (
              <View style={{ flex: 1, paddingHorizontal: theme.spacing.base }}>
                <EmptyState
                  title="Error al cargar cotizaciones"
                  message={error}
                />
              </View>
            );
          }

          if (categoryQuotes.length === 0) {
            return (
              <View style={{ flex: 1, paddingHorizontal: theme.spacing.base }}>
                <EmptyState
                  title="No hay cotizaciones disponibles"
                  message="No se encontraron cotizaciones para esta categoría."
                />
              </View>
            );
          }

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
    </Screen>
  );
};
