/**
 * Utility to transform Crypto to Quote format for QuotesScreen integration
 */

import { Crypto } from '@/types';
import { Quote } from '@/types';
import { getCryptoFullName } from './cryptoHelpers';

/**
 * Extended Quote interface that includes crypto-specific data
 */
export interface CryptoQuote extends Quote {
  symbol?: string;
  priceDirection?: 'up' | 'down' | 'neutral';
  fullName?: string;
}

/**
 * Transforms a Crypto object to Quote format with additional crypto data
 */
export const cryptoToQuote = (crypto: Crypto): CryptoQuote => {
  return {
    id: crypto.id,
    name: crypto.name,
    sellPrice: crypto.lastPrice,
    change: crypto.change,
    changePercent: crypto.changePercent,
    lastUpdate: crypto.lastUpdate,
    category: 'cripto',
    symbol: crypto.symbol,
    priceDirection: crypto.priceDirection,
    fullName: getCryptoFullName(crypto.symbol),
  };
};

/**
 * Transforms an array of Crypto objects to Quote format
 */
export const cryptosToQuotes = (cryptos: Crypto[]): CryptoQuote[] => {
  return cryptos.map(cryptoToQuote);
};

