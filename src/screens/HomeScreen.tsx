/**
 * HomeScreen - Dashboard principal
 * Based on stitch_home_screen_revamp design
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Section } from '@/components/layout';
import {
  CompactIndicatorCard,
  CompactQuoteCard,
  VerMasButton,
  NotificationIcon,
  CompactIndicatorCardSkeleton,
  CompactQuoteCardSkeleton,
} from '@/components/common';
import { NewsCard } from '@/components/features/news';
import { Skeleton } from '@/components/ui';
import { Card } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { useQuotes } from '@/hooks/useQuotes';
import { useIndicators } from '@/hooks/useIndicators';
import { useNews } from '@/hooks/useNews';
import { RootStackParamList } from '@/navigation/types';
import { SERIES_CODES } from '@/constants/series';
import { Linking } from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { indicators, loading: indicatorsLoading } = useIndicators();
  const { quotes, loading: quotesLoading } = useQuotes();
  const { news, loading: newsLoading } = useNews();

  // Obtener las dos primeras noticias
  const featuredNews = news.slice(0, 2);

  const handleVerMasQuotes = () => {
    navigation.navigate('MainTabs', { screen: 'Quotes' });
  };

  const handleVerMasIndicators = () => {
    navigation.navigate('MainTabs', { screen: 'Indicators' });
  };

  const handleVerMasNews = () => {
    navigation.navigate('MainTabs', { screen: 'Quotes' }); // Quotes tab ahora muestra NewsScreen
  };

  const handleNewsPress = (newsItem: typeof news[0]) => {
    if (newsItem.link) {
      Linking.openURL(newsItem.link).catch(err => {
        console.error('Error opening link:', err);
      });
    }
  };

  return (
    <Screen scrollable={false}>
      <Header
        title="Radar Económico"
        rightIcon={<NotificationIcon size={24} />}
        onRightPress={() => {
          // TODO: Handle notifications
          console.log('Notifications pressed');
        }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: theme.spacing.xl }]}
        showsVerticalScrollIndicator={false}>
        {/* Cotizaciones del Día */}
        <View style={styles.section}>
          <Section title="Cotizaciones del Día" />
          <View style={styles.gridContainer}>
            {quotesLoading ? (
              // Show 2 skeleton cards while loading
              Array.from({ length: 2 }).map((_, index) => (
                <View key={`quote-skeleton-${index}`} style={styles.gridItem}>
                  <Card variant="elevated" padding="sm">
                    <CompactQuoteCardSkeleton />
                  </Card>
                </View>
              ))
            ) : (
              quotes.slice(0, 2).map(quote => (
                <View key={quote.id} style={styles.gridItem}>
                  <CompactQuoteCard
                    quote={quote}
                    onPress={() => {
                      const casa = quote.id.replace('quote-', '');
                      navigation.navigate('QuoteDetail', {
                        quoteId: casa,
                        quoteName: quote.name,
                      });
                    }}
                  />
                </View>
              ))
            )}
          </View>
          <View style={styles.verMasContainer}>
            <VerMasButton onPress={handleVerMasQuotes} />
          </View>
        </View>

        {/* Indicadores Principales */}
        <View style={styles.section}>
          <Section title="Indicadores Principales" />
          <View style={styles.gridContainer}>
            {indicatorsLoading ? (
              // Show 2 skeleton cards while loading
              Array.from({ length: 2 }).map((_, index) => (
                <View key={`indicator-skeleton-${index}`} style={styles.gridItem}>
                  <Card variant="elevated" padding="sm">
                    <CompactIndicatorCardSkeleton />
                  </Card>
                </View>
              ))
            ) : (
              indicators
                .filter(
                  indicator =>
                    indicator.id === SERIES_CODES.IPC_VARIACION_MENSUAL ||
                    indicator.id === SERIES_CODES.RESERVAS_INTERNACIONALES
                )
                .map(indicator => (
                  <View key={indicator.id} style={styles.gridItem}>
                    <CompactIndicatorCard
                      indicator={indicator}
                      onPress={() => {
                        navigation.navigate('IndicatorDetail', {
                          indicatorId: indicator.id,
                          indicatorName: indicator.name,
                        });
                      }}
                    />
                  </View>
                ))
            )}
          </View>
          <View style={styles.verMasContainer}>
            <VerMasButton onPress={handleVerMasIndicators} />
          </View>
        </View>

        {/* Noticias Destacadas */}
        <View style={styles.section}>
          <Section title="Noticias Destacadas" />
          <View style={styles.newsContainer}>
            {newsLoading ? (
              // Show 2 skeleton cards while loading
              Array.from({ length: 2 }).map((_, index) => (
                <View key={`news-skeleton-${index}`} style={styles.newsItem}>
                  <Card variant="elevated" padding="base">
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.base }}>
                      <View style={{ flex: 1, gap: theme.spacing.xs }}>
                        <Skeleton width="30%" height={12} />
                        <Skeleton width="90%" height={16} />
                        <Skeleton width="100%" height={14} />
                        <Skeleton width="80%" height={14} />
                      </View>
                      <Skeleton width={96} height={96} borderRadius={theme.radii.base} />
                    </View>
                    <Skeleton width="100%" height={40} borderRadius={theme.radii.base} style={{ marginTop: theme.spacing.sm }} />
                  </Card>
                </View>
              ))
            ) : featuredNews.length > 0 ? (
              featuredNews.map(newsItem => (
                <View key={newsItem.id} style={styles.newsItem}>
                  <NewsCard
                    news={newsItem}
                    onVerMasPress={() => handleNewsPress(newsItem)}
                    showVisitButton={false}
                  />
                </View>
              ))
            ) : null}
          </View>
          {featuredNews.length > 0 && (
            <View style={styles.verMasContainer}>
              <VerMasButton onPress={handleVerMasNews} />
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 12,
  },
  gridItem: {
    flex: 1,
    minWidth: '45%',
    maxWidth: '48%',
  },
  newsContainer: {
    gap: 12,
    marginTop: 12,
  },
  newsItem: {
    width: '100%',
  },
  verMasContainer: {
    marginTop: 4,
  },
});
