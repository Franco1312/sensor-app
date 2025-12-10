/**
 * HomeScreen - Dashboard principal
 * Based on stitch_home_screen_revamp design
 */

import React, { useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { Screen, Header } from '@/components/layout';
import { NotificationIcon, AdBanner } from '@/components/common';
import { DailyQuotesSection, MainIndicatorsSection, FeaturedNewsSection } from '@/components/features/home';
import { useTheme } from '@/theme/ThemeProvider';
import { useQuotes } from '@/hooks/useQuotes';
import { useCrypto } from '@/hooks/useCrypto';
import { useIndicators } from '@/hooks/useIndicators';
import { useNews } from '@/hooks/useNews';
import { useIndicatorsFilter } from '@/context/IndicatorsFilterContext';
import { RootStackParamList } from '@/navigation/types';
import { DEFAULT_POLLING_INTERVAL } from '@/constants/crypto';
import { QUOTE_CATEGORIES } from '@/constants/quotes';
import { useTranslation } from '@/i18n';
import { News } from '@/types';
import { newsKeys } from '@/hooks/useNews';
import { usePrefetchIndicator, usePrefetchQuote, usePrefetchCrypto } from '@/hooks/usePrefetch';
import { SeriesCode } from '@/constants/series';
import { useScreenTracking, SCREEN_NAMES } from '@/core/analytics';
import { analytics } from '@/core/analytics';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();
  const { setSelectedQuoteCategory } = useIndicatorsFilter();
  const { indicators, loading: indicatorsLoading, refetch: refetchIndicators } = useIndicators();
  const { quotes, loading: quotesLoading, refetch: refetchQuotes } = useQuotes();
  const { cryptos, loading: cryptosLoading } = useCrypto(true, DEFAULT_POLLING_INTERVAL);
  const { news, loading: newsLoading, refetch: refetchNews } = useNews();
  const prefetchIndicator = usePrefetchIndicator();
  const prefetchQuote = usePrefetchQuote();
  const prefetchCrypto = usePrefetchCrypto();

  // Track screen view
  useScreenTracking(SCREEN_NAMES.DASHBOARD_HOME);

  // Track home viewed event
  useEffect(() => {
    analytics.trackHomeViewed({
      has_favorites: false, // TODO: implementar detección de favoritos
      has_alerts_enabled: false, // TODO: implementar detección de alertas
    });
  }, []);

  // Prefetch related data for better navigation performance
  useEffect(() => {
    // Prefetch full news list when on home screen
    queryClient.prefetchInfiniteQuery({
      queryKey: newsKeys.lists(),
      queryFn: async ({ pageParam = 0 }) => {
        const { getNews } = await import('@/services/news-api');
        const apiData = await getNews(10, pageParam);
        return apiData
          .filter(item => item && item.id && item.title)
          .map(item => ({
            id: item.id,
            title: item.title,
            summary: item.summary,
            link: item.link,
            sourceName: item.sourceName,
            publishedAt: item.publishedAt,
            fetchedAt: item.fetchedAt,
            categories: item.categories,
            imageUrl: item.imageUrl,
          }));
      },
      getNextPageParam: (lastPage: any[], allPages: any[][]) => {
        if (lastPage.length < 10) return undefined;
        return allPages.length * 10;
      },
      initialPageParam: 0,
    });
  }, [queryClient]);

  // Obtener las dos primeras noticias
  const featuredNews = news.slice(0, 2);

  // Filtrar quotes para mostrar solo dólares
  const dollarQuotes = quotes.filter(quote => quote.category === QUOTE_CATEGORIES.DOLARES);
  
  // Obtener las primeras 2 cryptos
  const featuredCryptos = cryptos.slice(0, 2);

  const handleVerMasDolares = useCallback(() => {
    setSelectedQuoteCategory(QUOTE_CATEGORIES.DOLARES);
    navigation.navigate('Quotes');
  }, [setSelectedQuoteCategory, navigation]);

  const handleVerMasCrypto = useCallback(() => {
    setSelectedQuoteCategory(QUOTE_CATEGORIES.CRIPTO);
    navigation.navigate('Quotes');
  }, [setSelectedQuoteCategory, navigation]);

  const handleVerMasIndicators = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Indicators' });
  }, [navigation]);

  const handleVerMasNews = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'News' });
  }, [navigation]);

  const handleNewsPress = useCallback((newsItem: News) => {
    if (newsItem.link) {
      analytics.trackNewsArticleOpened({
        article_id: newsItem.id,
        url: newsItem.link,
        source: newsItem.sourceName || 'home',
        category: newsItem.categories?.[0],
      });
      
      Linking.openURL(newsItem.link).catch(err => {
        console.error('Error opening link:', err);
      });
    }
  }, []);

  const handleQuotePress = useCallback(
    (quoteId: string, quoteName: string) => {
      // Prefetch quote detail data before navigation
      prefetchQuote(quoteId);
      navigation.navigate('QuoteDetail', { quoteId, quoteName });
    },
    [navigation, prefetchQuote]
  );

  const handleCryptoPress = useCallback(
    (cryptoId: string, cryptoName: string) => {
      // Prefetch crypto detail data before navigation
      prefetchCrypto(cryptoId);
      navigation.navigate('CryptoDetail', { cryptoId, cryptoName });
    },
    [navigation, prefetchCrypto]
  );

  const handleIndicatorPress = useCallback(
    (indicatorId: string, indicatorName: string) => {
      // Track series view
      const indicator = indicators.find(ind => ind.id === indicatorId);
      // Map category to source (category values are: 'precios', 'monetaria', 'actividad', 'externo', 'finanzas')
      const source = indicator?.category === 'precios' ? 'INDEC' : indicator?.category ? 'BCRA' : 'DOLAR_API';
      analytics.trackSeriesViewed({
        series_code: indicatorId,
        source,
        category: indicator?.category || 'other',
      });
      
      // Prefetch indicator detail data before navigation
      prefetchIndicator(indicatorId as SeriesCode);
      navigation.navigate('IndicatorDetail', { indicatorId, indicatorName });
    },
    [navigation, prefetchIndicator, indicators]
  );

  return (
    <Screen scrollable={false}>
      <Header
        showLogo={true}
        rightIcon={<NotificationIcon size={24} />}
        onRightPress={useCallback(() => {
          // TODO: Handle notifications
          console.log('Notifications pressed');
        }, [])}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: theme.spacing.base, paddingTop: theme.spacing.base }]}
        showsVerticalScrollIndicator={false}>
        <DailyQuotesSection
          dollarQuotes={dollarQuotes}
          featuredCryptos={featuredCryptos}
          quotesLoading={quotesLoading}
          cryptosLoading={cryptosLoading}
          onVerMasDolares={handleVerMasDolares}
          onVerMasCrypto={handleVerMasCrypto}
          onQuotePress={handleQuotePress}
          onCryptoPress={handleCryptoPress}
        />

        <MainIndicatorsSection
          indicators={indicators}
          loading={indicatorsLoading}
          onVerMas={handleVerMasIndicators}
          onIndicatorPress={handleIndicatorPress}
                    />

        <AdBanner marginVertical="md" placement="home_footer" />
        <FeaturedNewsSection
          featuredNews={featuredNews}
          loading={newsLoading}
          onVerMas={handleVerMasNews}
          onNewsPress={handleNewsPress}
                  />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    gap: 0,
  },
});
