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

const DailyQuotesSectionComponent: React.FC<DailyQuotesSectionProps> = ({
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
      <Section 
        title={t('screens.home.sections.dailyQuotes')} 
        onVerMasPress={onVerMasDolares}
      />

      {/* Subsección Dólar */}
      <View style={styles.subsection}>
        <View style={styles.subsectionHeader}>
          <Text variant="sm" weight="medium" color="textSecondary">
            {t('screens.home.subsections.dollar')}
          </Text>
        </View>
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
      </View>

      {/* Subsección Crypto */}
      <View style={styles.subsection}>
        <View style={styles.subsectionHeader}>
          <Text variant="sm" weight="medium" color="textSecondary">
            {t('screens.home.subsections.crypto')}
          </Text>
        </View>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  subsection: {
    marginTop: 8,
  },
  subsectionHeader: {
    marginBottom: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  gridItem: {
    flex: 1,
    minWidth: '45%',
    maxWidth: '48%',
  },
});

// Memoize component to prevent unnecessary re-renders
export const DailyQuotesSection = React.memo(DailyQuotesSectionComponent);

