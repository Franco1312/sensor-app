/**
 * Quotes transformation utilities
 * Transforms API quote data to app's Quote format
 */

import { QuoteApiData } from '@/services/quotes-api';
import { Quote } from '@/types';
import { formatTime } from './dateFormat';

/**
 * Maps API casa values to quote categories
 */
const getQuoteCategory = (casa: string): Quote['category'] => {
  // All quotes from this API are USD dollars
  return 'dolares';
};

/**
 * Formats price value with currency symbol
 * Uses Argentine format: dot for thousands, comma for decimals
 * @param value - Price value
 * @returns Formatted string (e.g., "$1.450" or "$1.450,50")
 */
const formatPrice = (value: number): string => {
  // Use Argentine locale which formats: 1.450,50 (dot for thousands, comma for decimals)
  return `$${value.toLocaleString('es-AR', {
    minimumFractionDigits: value % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Calculates change percentage (placeholder - would need previous value)
 * For now, returns 0 as we don't have historical data
 */
const calculateChange = (current: number, previous?: number): { change: number; changePercent: number } => {
  if (!previous) {
    return { change: 0, changePercent: 0 };
  }
  const change = current - previous;
  const changePercent = previous !== 0 ? (change / previous) * 100 : 0;
  return { change, changePercent };
};

/**
 * Transforms API quote data to app's Quote format
 * @param apiData - Quote data from API
 * @param previousValue - Optional previous value for change calculation
 * @returns Quote object
 */
export const transformQuoteApiData = (
  apiData: QuoteApiData,
  previousValue?: number
): Quote => {
  const { change, changePercent } = calculateChange(apiData.venta, previousValue);

  return {
    id: `quote-${apiData.casa}`,
    name: apiData.nombre,
    buyPrice: apiData.compra ? formatPrice(apiData.compra) : undefined,
    sellPrice: formatPrice(apiData.venta),
    change,
    changePercent,
    lastUpdate: formatTime(apiData.fecha),
    category: getQuoteCategory(apiData.casa),
  };
};

/**
 * Transforms array of API quote data to app's Quote format
 * @param apiDataArray - Array of quote data from API
 * @returns Array of Quote objects
 */
export const transformQuotesApiData = (apiDataArray: QuoteApiData[]): Quote[] => {
  return apiDataArray.map(apiData => transformQuoteApiData(apiData));
};

import { ChartDataPoint } from './seriesTransform';

/**
 * Transforms historical quote data to chart format
 * @param historyData - Array of historical quote data from API
 * @returns Chart data points array compatible with Chart component
 */
export const transformQuoteHistoryToChart = (historyData: QuoteApiData[]): ChartDataPoint[] => {
  return historyData.map(item => ({
    value: item.venta, // Use venta (sell price) as the value
    date: item.fecha, // ISO date string
    rawValue: item.venta.toString(), // Original value as string
  }));
};

