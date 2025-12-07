/**
 * HomeScreen - Dashboard principal
 * Based on stitch_home_screen_revamp design
 */

import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Linking } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header } from '@/components/layout';
import { NotificationIcon } from '@/components/common';
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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { setSelectedQuoteCategory } = useIndicatorsFilter();
  const { indicators, loading: indicatorsLoading, refetch: refetchIndicators } = useIndicators();
  const { quotes, loading: quotesLoading, refetch: refetchQuotes } = useQuotes();
  const { cryptos, loading: cryptosLoading } = useCrypto(true, DEFAULT_POLLING_INTERVAL);
  const { news, loading: newsLoading, refetch: refetchNews } = useNews();

  // Reload data when screen is focused
  useFocusEffect(
    useCallback(() => {
      refetchQuotes();
      refetchIndicators();
      refetchNews();
    }, [refetchQuotes, refetchIndicators, refetchNews])
  );

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
      Linking.openURL(newsItem.link).catch(err => {
        console.error('Error opening link:', err);
      });
    }
  }, []);

  const handleQuotePress = useCallback(
    (quoteId: string, quoteName: string) => {
      navigation.navigate('QuoteDetail', { quoteId, quoteName });
    },
    [navigation]
  );

  const handleCryptoPress = useCallback(
    (cryptoId: string, cryptoName: string) => {
      navigation.navigate('CryptoDetail', { cryptoId, cryptoName });
    },
    [navigation]
  );

  const handleIndicatorPress = useCallback(
    (indicatorId: string, indicatorName: string) => {
      navigation.navigate('IndicatorDetail', { indicatorId, indicatorName });
    },
    [navigation]
  );

  return (
    <Screen scrollable={false}>
      <Header
        title={t('screens.home.title')}
        rightIcon={<NotificationIcon size={24} />}
        onRightPress={useCallback(() => {
          // TODO: Handle notifications
          console.log('Notifications pressed');
        }, [])}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: theme.spacing.base, paddingTop: theme.spacing.xs }]}
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
