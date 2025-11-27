/**
 * QuotesScreen - Lista de cotizaciones
 * Based on detalle_cotizacion design
 */

import React, { useMemo, useEffect, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header } from '@/components/layout';
import { Text, Skeleton, Card, EmptyState } from '@/design-system/components';
import { QuoteItem } from '@/components/features/quotes/QuoteItem';
import { CategoryTabs } from '@/components/navigation/CategoryTabs';
import { CategoryPager } from '@/components/navigation/CategoryPager';
import { useTheme } from '@/theme/ThemeProvider';
import { useCategoryPager } from '@/hooks/useCategoryPager';
import { useIndicatorsFilter } from '@/context/IndicatorsFilterContext';
import { useQuotes } from '@/hooks/useQuotes';
import { useCrypto } from '@/hooks/useCrypto';
import { QUOTE_CATEGORY_TABS, DEFAULT_QUOTE_CATEGORY, QuoteCategory } from '@/constants/quotes';
import { Quote } from '@/types';
import { RootStackParamList } from '@/navigation/types';
import { cryptosToQuotes, CryptoQuote } from '@/utils/cryptoToQuote';
import { DEFAULT_POLLING_INTERVAL } from '@/constants/crypto';
import { useTranslation } from '@/i18n';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const QuotesScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { selectedQuoteCategory, setSelectedQuoteCategory, setCurrentQuoteCategory } =
    useIndicatorsFilter();
  const { quotes, loading: quotesLoading, error: quotesError } = useQuotes();
  const { cryptos, loading: cryptosLoading, error: cryptosError } = useCrypto(
    true,
    DEFAULT_POLLING_INTERVAL
  );

  const categories = useMemo(
    () => QUOTE_CATEGORY_TABS.map(tab => tab.value),
    []
  );

  // Use selectedQuoteCategory if available, otherwise use default
  // This ensures the correct category is set on initial mount
  const initialCategory = selectedQuoteCategory 
    ? (selectedQuoteCategory as QuoteCategory)
    : DEFAULT_QUOTE_CATEGORY;

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
    defaultCategory: initialCategory,
  });

  // Combine quotes and cryptos
  const allQuotes = useMemo(() => {
    const cryptoQuotes = cryptosToQuotes(cryptos);
    return [...quotes, ...cryptoQuotes];
  }, [quotes, cryptos]);

  // Determine loading and error state based on active category
  const loading = useMemo(() => {
    return activeCategory === 'cripto' ? cryptosLoading : quotesLoading;
  }, [activeCategory, cryptosLoading, quotesLoading]);

  const error = useMemo(() => {
    return activeCategory === 'cripto' ? cryptosError : quotesError;
  }, [activeCategory, cryptosError, quotesError]);

  // Get the most recent update time from quotes or cryptos
  const lastUpdateTime = useMemo(() => {
    if (activeCategory === 'cripto' && cryptos.length > 0) {
      return cryptos[0]?.lastUpdate || null;
    }
    if (quotes.length === 0) return null;
    return quotes[0]?.lastUpdate || null;
  }, [activeCategory, quotes, cryptos]);

  // Clear the context after initial load (category was already applied via defaultCategory)
  // Also handle case where selectedQuoteCategory changes after mount
  useEffect(() => {
    if (selectedQuoteCategory !== null) {
      // If category is different from current, apply it
      if (selectedQuoteCategory !== activeCategory) {
        handleCategoryChange(selectedQuoteCategory as QuoteCategory);
      }
      // Clear the context to prevent re-triggering
      setSelectedQuoteCategory(null);
    }
  }, [selectedQuoteCategory, activeCategory, handleCategoryChange, setSelectedQuoteCategory]);

  // Update current category in context when active category changes
  useEffect(() => {
    setCurrentQuoteCategory(activeCategory);
  }, [activeCategory, setCurrentQuoteCategory]);

  const handleQuotePress = useCallback((item: Quote | CryptoQuote) => {
    const isCrypto = item.category === 'cripto';
    const cryptoItem = isCrypto ? (item as CryptoQuote) : null;

    if (isCrypto && cryptoItem?.symbol) {
      navigation.navigate('CryptoDetail', {
        cryptoId: cryptoItem.symbol,
        cryptoName: item.name,
      });
    } else {
      const casa = item.id.replace('quote-', '');
      navigation.navigate('QuoteDetail', {
        quoteId: casa,
        quoteName: item.name,
      });
    }
  }, [navigation]);

  const renderQuote = useCallback(({ item }: { item: Quote | CryptoQuote }) => {
    return <QuoteItem item={item} onPress={handleQuotePress} />;
  }, [handleQuotePress]);

  return (
    <Screen scrollable={false}>
      <Header title={t('screens.quotes.title')} />

      <CategoryTabs
        tabs={QUOTE_CATEGORY_TABS}
        activeTab={activeCategory}
        onTabPress={handleCategoryChange}
      />

      {/* Last Update */}
      {lastUpdateTime && (
        <View style={{ padding: theme.spacing.base, alignItems: 'center' }}>
          <Text variant="xs" color="textSecondary">
            {t('screens.quotes.lastUpdate', { time: lastUpdateTime })}
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
          const categoryQuotes = allQuotes.filter(quote => quote.category === category);
          
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
                  title={t('screens.quotes.error.title')}
                  message={t('screens.quotes.error.message', { error })}
                />
              </View>
            );
          }

          if (categoryQuotes.length === 0) {
            return (
              <View style={{ flex: 1, paddingHorizontal: theme.spacing.base }}>
                <EmptyState
                  title={t('screens.quotes.empty.title')}
                  message={t('screens.quotes.empty.message')}
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
