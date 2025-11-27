/**
 * Crypto transformation utilities
 * Transforms API crypto data to app's Crypto format
 */

import { MiniTicker, Kline } from '@/services/crypto-api';
import { Crypto } from '@/types';
import { formatTime } from './dateFormat';
import { ChartDataPoint } from './seriesTransform';
import { getCryptoShortSymbol } from './cryptoHelpers';
import { formatCryptoPrice, calculatePriceChange } from './cryptoPriceFormat';

/**
 * Transforms API MiniTicker data to app's Crypto format
 * @param ticker - MiniTicker data from API
 * @returns Crypto object
 */
export const transformCryptoApiData = (ticker: MiniTicker): Crypto => {
  const { change, changePercent } = calculatePriceChange(ticker.lastPrice, ticker.openPrice);
  const lastPriceValue = parseFloat(ticker.lastPrice);

  return {
    id: `crypto-${ticker.symbol}`,
    symbol: ticker.symbol,
    name: getCryptoShortSymbol(ticker.symbol),
    lastPrice: formatCryptoPrice(ticker.lastPrice),
    lastPriceValue: isNaN(lastPriceValue) ? 0 : lastPriceValue,
    openPrice: formatCryptoPrice(ticker.openPrice),
    highPrice: formatCryptoPrice(ticker.highPrice),
    lowPrice: formatCryptoPrice(ticker.lowPrice),
    volume: ticker.volume,
    quoteVolume: ticker.quoteVolume,
    change,
    changePercent,
    lastUpdate: formatTime(new Date(ticker.eventTime).toISOString()),
  };
};

/**
 * Transforms object of API MiniTicker data to array of Crypto format
 * @param pricesResponse - Object with symbol keys and MiniTicker values
 * @returns Array of Crypto objects
 */
export const transformCryptoPricesResponse = (pricesResponse: Record<string, MiniTicker>): Crypto[] => {
  return Object.values(pricesResponse).map(ticker => transformCryptoApiData(ticker));
};

/**
 * Transforms historical klines data to chart format
 * @param klines - Array of kline data from API
 * @returns Chart data points array compatible with Chart component
 */
export const transformCryptoKlinesToChart = (klines: Kline[]): ChartDataPoint[] => {
  return klines.map(kline => ({
    value: parseFloat(kline.close), // Use close price as the value
    date: new Date(kline.openTime).toISOString(), // Convert timestamp to ISO string
    rawValue: kline.close, // Original value as string
  }));
};

