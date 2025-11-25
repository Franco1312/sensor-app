/**
 * HomeScreen - Dashboard principal
 * Based on HOME/_dashboard_principal design
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { ScreenContainer, Header, SectionTitle } from '@/components/layout';
import { IndicatorCard, QuoteCard } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { mockQuotes } from '@/utils/mockData';
import { useIndicators } from '@/hooks/useIndicators';

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const indicators = useIndicators();

  return (
    <ScreenContainer scrollable={false}>
      <Header title="Radar Económico" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: theme.spacing.lg }]}
        showsVerticalScrollIndicator={false}>
        <SectionTitle title="Indicadores Principales" />
        <View style={[styles.section, { paddingHorizontal: theme.spacing.base, marginBottom: theme.spacing.lg, gap: theme.spacing.base }]}>
          {indicators.slice(0, 4).map(indicator => (
            <IndicatorCard key={indicator.id} indicator={indicator} />
          ))}
        </View>

        <SectionTitle title="Cotizaciones de Mercado" />
        <View style={[styles.section, { paddingHorizontal: theme.spacing.base, gap: theme.spacing.base }]}>
          {mockQuotes.slice(0, 4).map(quote => (
            <QuoteCard key={quote.id} quote={quote} />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // Padding handled by inline style
  },
  section: {
    // Styles handled by inline styles
  },
});
