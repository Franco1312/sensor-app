/**
 * HomeScreen - Dashboard principal
 * Based on HOME/_dashboard_principal design
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { Screen, Header, Section } from '@/components/layout';
import { IndicatorCard, QuoteCard, IndicatorCardSkeleton, QuoteCardSkeleton } from '@/components/common';
import { Card } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { mockQuotes } from '@/utils/mockData';
import { useIndicators } from '@/hooks/useIndicators';
import { LABELS } from '@/constants/labels';

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { indicators, loading } = useIndicators();

  return (
    <Screen scrollable={false}>
      <Header title="Radar Económico" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
        showsVerticalScrollIndicator={false}>
        <Section title={LABELS.MAIN_INDICATORS} />
        <View style={{ paddingHorizontal: theme.spacing.base, marginBottom: theme.spacing.lg, gap: theme.spacing.base }}>
          {loading ? (
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
          {mockQuotes.slice(0, 4).map(quote => (
            <QuoteCard key={quote.id} quote={quote} />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
};
