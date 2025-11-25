/**
 * QuoteCard - Card component for displaying quotes
 * Uses DataCard base component for reusability
 */

import React from 'react';
import { DataCard } from '@/components/common/DataCard';
import { Quote } from '@/types';
import { formatChangePercent } from '@/utils/formatting';

interface QuoteCardProps {
  quote: Quote;
  onPress?: () => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onPress }) => {
  const isPositive = quote.changePercent >= 0;
  const changeLabel = formatChangePercent(quote.changePercent, isPositive, 2);

  return (
    <DataCard
      title={quote.name}
      value={quote.sellPrice}
      changeLabel={changeLabel}
      changeVariant={isPositive ? 'positive' : 'negative'}
      lastUpdate={quote.lastUpdate}
      trend={isPositive ? 'up' : 'down'}
      onPress={onPress}
    />
  );
};

