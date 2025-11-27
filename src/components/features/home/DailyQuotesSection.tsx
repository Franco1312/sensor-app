/**
 * DailyQuotesSection - Section component for daily quotes in HomeScreen
 */

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Section } from '@/components/layout';
import { Text, Card, CompactQuoteCard, CompactQuoteCardSkeleton, VerMasButton } from '@/components/common';
import { CompactCryptoCard } from '@/components/features/crypto';
import { useTheme } from '@/theme/ThemeProvider';
import { useTranslation } from '@/i18n';
import { Quote, Crypto } from '@/types';
import { RootStackParamList } from '@/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface DailyQuotesSectionProps {
  dollarQuotes: Quote[];
  featuredCryptos: Crypto[];
  quotesLoading: boolean;
  cryptosLoading: boolean;
  onVerMasDolares: () => void;
  onVerMasCrypto: () => void;
  onQuotePress: (quoteId: string, quoteName: string) => void;
  onCryptoPress: (cryptoId: string, cryptoName: string) => void;
}

export const DailyQuotesSection: React.FC<DailyQuotesSectionProps> = ({
  dollarQuotes,
  featuredCryptos,
  quotesLoading,
  cryptosLoading,
  onVerMasDolares,
  onVerMasCrypto,
  onQuotePress,
  onCryptoPress,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const handleQuotePress = useCallback(
    (quote: Quote) => {
      const casa = quote.id.replace('quote-', '');
      onQuotePress(casa, quote.name);
    },
    [onQuotePress]
  );

  const handleCryptoPress = useCallback(
    (crypto: Crypto) => {
      onCryptoPress(crypto.symbol, crypto.name);
    },
    [onCryptoPress]
  );

  return (
    <View style={styles.section}>
      <Section title={t('screens.home.sections.dailyQuotes')} />

      {/* Subsección Dólar */}
      <View style={styles.subsection}>
        <Text variant="sm" weight="semibold" color="textSecondary" style={styles.subsectionTitle}>
          {t('screens.home.subsections.dollar')}
        </Text>
        <View style={styles.gridContainer}>
          {quotesLoading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <View key={`dollar-skeleton-${index}`} style={styles.gridItem}>
                <Card variant="elevated" padding="md">
                  <CompactQuoteCardSkeleton />
                </Card>
              </View>
            ))
          ) : (
            dollarQuotes.slice(0, 2).map(quote => (
              <View key={quote.id} style={styles.gridItem}>
                <CompactQuoteCard quote={quote} onPress={() => handleQuotePress(quote)} />
              </View>
            ))
          )}
        </View>
        <View style={styles.verMasContainer}>
          <VerMasButton onPress={onVerMasDolares} />
        </View>
      </View>

      {/* Subsección Crypto */}
      <View style={styles.subsection}>
        <Text variant="sm" weight="semibold" color="textSecondary" style={styles.subsectionTitle}>
          {t('screens.home.subsections.crypto')}
        </Text>
        <View style={styles.gridContainer}>
          {cryptosLoading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <View key={`crypto-skeleton-${index}`} style={styles.gridItem}>
                <Card variant="elevated" padding="md">
                  <CompactQuoteCardSkeleton />
                </Card>
              </View>
            ))
          ) : (
            featuredCryptos.map(crypto => (
              <View key={crypto.id} style={styles.gridItem}>
                <CompactCryptoCard crypto={crypto} onPress={() => handleCryptoPress(crypto)} />
              </View>
            ))
          )}
        </View>
        <View style={styles.verMasContainer}>
          <VerMasButton onPress={onVerMasCrypto} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
    paddingBottom: 16,
  },
  subsection: {
    marginTop: 16,
  },
  subsectionTitle: {
    marginBottom: 12,
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
  verMasContainer: {
    marginTop: 0,
  },
});

