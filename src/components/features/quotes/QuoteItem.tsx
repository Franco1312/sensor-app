/**
 * QuoteItem - Component for rendering a quote item in the list
 * Handles both regular quotes and crypto quotes
 */

import React, { useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { ListItem } from '@/components/layout';
import { Text } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { Quote } from '@/types';
import { CryptoQuote } from '@/utils/cryptoToQuote';
import { getPriceColor } from '@/hooks/usePriceDirection';

interface QuoteItemProps {
  item: Quote | CryptoQuote;
  onPress: (item: Quote | CryptoQuote) => void;
}

const QuoteItemComponent: React.FC<QuoteItemProps> = ({ item, onPress }) => {
  const { theme } = useTheme();
  const isPositive = item.changePercent >= 0;
  const changeLabel = useMemo(
    () => `${isPositive ? '+' : ''}${item.changePercent.toFixed(2)}%`,
    [item.changePercent, isPositive]
  );
  const isCrypto = item.category === 'cripto';
  const cryptoItem = isCrypto ? (item as CryptoQuote) : null;
  const priceColor = useMemo(
    () => (isCrypto && cryptoItem?.priceDirection 
      ? getPriceColor(cryptoItem.priceDirection, theme) 
      : theme.colors.textPrimary),
    [isCrypto, cryptoItem?.priceDirection, theme]
  );

  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  return (
    <ListItem
      title={item.name}
      subtitle={isCrypto && cryptoItem?.fullName ? cryptoItem.fullName : undefined}
      rightContent={
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text
            variant="base"
            weight="semibold"
            style={{
              color: priceColor,
            }}>
            {item.sellPrice}
          </Text>
            <Text
            variant="xs"
            weight="normal"
            style={{
              color: isPositive ? theme.colors.success : theme.colors.error,
            }}>
            {changeLabel}
          </Text>
        </View>
      }
      style={{
        marginBottom: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
      }}
      onPress={handlePress}
    />
  );
};

// Memoize component to prevent unnecessary re-renders
export const QuoteItem = React.memo(QuoteItemComponent, (prevProps, nextProps) => {
  // Custom comparison: re-render if item data or onPress changes
  const prevItem = prevProps.item;
  const nextItem = nextProps.item;
  
  // Check if onPress changed
  if (prevProps.onPress !== nextProps.onPress) {
    return false; // Re-render
  }
  
  // Check if item id changed
  if (prevItem.id !== nextItem.id) {
    return false; // Re-render
  }
  
  // Check if price-related fields changed (important for crypto price direction)
  if (prevItem.sellPrice !== nextItem.sellPrice) {
    return false; // Re-render
  }
  
  if (prevItem.changePercent !== nextItem.changePercent) {
    return false; // Re-render
  }
  
  // Check if priceDirection changed (critical for crypto color updates)
  const prevCrypto = prevItem.category === 'cripto' ? (prevItem as CryptoQuote) : null;
  const nextCrypto = nextItem.category === 'cripto' ? (nextItem as CryptoQuote) : null;
  
  if (prevCrypto?.priceDirection !== nextCrypto?.priceDirection) {
    return false; // Re-render
  }
  
  // If none of the important fields changed, skip re-render
  return true;
});

