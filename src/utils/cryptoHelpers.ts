/**
 * Crypto helper utilities
 * Reusable functions for crypto-related operations
 */

import { Crypto } from '@/types';
import { CRYPTO_NAMES } from '@/constants/crypto';

/**
 * Extracts short symbol from full symbol (e.g., BTCUSDT -> BTC)
 */
export const getCryptoShortSymbol = (symbol: string): string => {
  return symbol.replace('USDT', '');
};

/**
 * Gets full display name for a crypto symbol
 */
export const getCryptoFullName = (symbol: string): string => {
  return CRYPTO_NAMES[symbol] || getCryptoShortSymbol(symbol);
};

/**
 * Determines price direction by comparing current and previous prices
 */
export const getPriceDirection = (
  currentPrice: number,
  previousPrice: number | undefined
): 'up' | 'down' | 'neutral' => {
  if (previousPrice === undefined || previousPrice === currentPrice) {
    return 'neutral';
  }
  return currentPrice > previousPrice ? 'up' : 'down';
};

/**
 * Checks if crypto data has changed
 */
export const hasCryptoDataChanged = (prev: Crypto, current: Crypto): boolean => {
  return (
    prev.lastPriceValue !== current.lastPriceValue ||
    prev.changePercent !== current.changePercent ||
    prev.symbol !== current.symbol
  );
};

