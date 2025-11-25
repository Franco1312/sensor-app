/**
 * HomeScreen - Dashboard principal
 * Based on HOME/_dashboard_principal design
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Section } from '@/components/layout';
import { IndicatorCard, QuoteCard, IndicatorCardSkeleton, QuoteCardSkeleton } from '@/components/common';
import { Card } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { useQuotes } from '@/hooks/useQuotes';
import { useIndicators } from '@/hooks/useIndicators';
import { LABELS } from '@/constants/labels';
import { RootStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { indicators, loading: indicatorsLoading } = useIndicators();
  const { quotes, loading: quotesLoading } = useQuotes();

  return (
    <Screen scrollable={false}>
      <Header title="Radar Económico" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
        showsVerticalScrollIndicator={false}>
        <Section title={LABELS.MAIN_INDICATORS} />
        <View style={{ paddingHorizontal: theme.spacing.base, marginBottom: theme.spacing.lg, gap: theme.spacing.base }}>
          {indicatorsLoading ? (
            // Show 4 skeleton cards while loading
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={`skeleton-${index}`}>
                <IndicatorCardSkeleton />
              </Card>
            ))
          ) : (
            indicators.slice(0, 4).map(indicator => (
              <IndicatorCard key={indicator.id} indicator={indicator} />
            ))
          )}
        </View>

        <Section title={LABELS.MARKET_QUOTES} />
        <View style={{ paddingHorizontal: theme.spacing.base, gap: theme.spacing.base }}>
          {quotesLoading ? (
            // Show 4 skeleton cards while loading
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={`quote-skeleton-${index}`}>
                <QuoteCardSkeleton />
              </Card>
            ))
          ) : (
            quotes.slice(0, 4).map(quote => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                onPress={() => {
                  // Extract casa from quote id (format: "quote-blue")
                  const casa = quote.id.replace('quote-', '');
                  navigation.navigate('QuoteDetail', {
                    quoteId: casa,
                    quoteName: quote.name,
                  });
                }}
              />
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
};
