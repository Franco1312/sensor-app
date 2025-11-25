/**
 * Series transformation utilities
 * 
 * This module handles the transformation of raw API data into the app's data models.
 * Each series has specific formatting requirements (units, currency, decimals, etc.)
 */

import { SeriesData, Indicator } from '@/types';
import { SERIES_METADATA, SeriesCode, SERIES_CODES } from '@/constants/series';

// ============================================================================
// Constants
// ============================================================================

/** Conversion factor: millions to billions (1,000,000) */
const MILLIONS_TO_BILLIONS = 1_000_000;

/** Number of decimal places for billions display */
const BILLIONS_DECIMALS = 1;

// ============================================================================
// Types
// ============================================================================

/**
 * Chart data point with normalized value for charting and raw value for formatting
 */
export interface ChartDataPoint {
  value: number; // Normalized value for chart display (billions/millions)
  date: string; // obs_time from API (ISO date string)
  rawValue: string; // Original value from API for formatting
}

type SeriesTransformer = (seriesData: SeriesData) => Omit<Indicator, 'change' | 'changePercent' | 'trend'>;
type SeriesHistoryTransformer = (seriesData: SeriesData[]) => ChartDataPoint[];

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Formats a date string to DD/MM/YYYY format
 * @param dateString - ISO date string from API
 * @returns Formatted date string (DD/MM/YYYY) or original string if invalid
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

// ============================================================================
// Value Formatting Helpers
// ============================================================================

/**
 * Safely parses a string value to a number
 * @param value - String value from API
 * @returns Parsed number or 0 if invalid
 */
const parseValue = (value: string): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Formats a value in billions (ARS) with currency symbol
 * @param value - Value in millions
 * @returns Formatted string (e.g., "$33.0B")
 */
const formatBillions = (value: number): string => {
  const billions = value / MILLIONS_TO_BILLIONS;
  return `$${billions.toFixed(BILLIONS_DECIMALS)}B`;
};

/**
 * Formats a value in millions (USD) with currency symbol
 * @param value - Value in millions
 * @returns Formatted string (e.g., "$40,356M U$S")
 */
const formatMillionsUSD = (value: number): string => {
  if (value === 0) return '$0M U$S';
  return `$${value.toLocaleString('es-AR', { maximumFractionDigits: 0 })}M U$S`;
};

// ============================================================================
// Series-Specific Transformations
// ============================================================================

/**
 * Creates a base indicator object with common fields
 * @param code - Series code
 * @param value - Formatted value string
 * @param collectionDate - Collection date from API
 * @returns Partial indicator object (without change/changePercent/trend)
 */
const createIndicatorBase = (
  code: SeriesCode,
  value: string,
  collectionDate: string
): Omit<Indicator, 'change' | 'changePercent' | 'trend'> => {
  return {
    id: code,
    name: SERIES_METADATA[code].name,
    value,
    lastUpdate: formatDate(collectionDate),
    category: SERIES_METADATA[code].category,
  };
};

/**
 * Transforms Base Monetaria data
 * Input: ARS in millions (e.g., 33019446.000000)
 * Output: Formatted as billions (e.g., "$33.0B")
 */
const transformBaseMonetaria = (seriesData: SeriesData): Omit<Indicator, 'change' | 'changePercent' | 'trend'> => {
  const numValue = parseValue(seriesData.value);
  const formattedValue = formatBillions(numValue);
  return createIndicatorBase(SERIES_CODES.BASE_MONETARIA, formattedValue, seriesData.collection_date);
};

/**
 * Transforms Reservas Internacionales data
 * Input: USD in millions (e.g., 40356.000000)
 * Output: Formatted as millions with USD symbol (e.g., "$40,356M U$S")
 */
const transformReservasInternacionales = (seriesData: SeriesData): Omit<Indicator, 'change' | 'changePercent' | 'trend'> => {
  const numValue = parseValue(seriesData.value);
  const formattedValue = formatMillionsUSD(numValue);
  return createIndicatorBase(
    SERIES_CODES.RESERVAS_INTERNACIONALES,
    formattedValue,
    seriesData.collection_date
  );
};

/**
 * Transforms Circulante Público data
 * Input: ARS in millions (e.g., 21397633.000000)
 * Output: Formatted as billions (e.g., "$21.4B")
 */
const transformCirculantePublico = (seriesData: SeriesData): Omit<Indicator, 'change' | 'changePercent' | 'trend'> => {
  const numValue = parseValue(seriesData.value);
  const formattedValue = formatBillions(numValue);
  return createIndicatorBase(SERIES_CODES.CIRCULANTE_PUBLICO, formattedValue, seriesData.collection_date);
};

// ============================================================================
// Historical Data Transformations
// ============================================================================

/**
 * Creates a chart data point from a series data item
 * @param item - Series data item from API
 * @param transformValue - Function to transform the raw value to chart value
 * @returns ChartDataPoint with normalized value for charting
 */
const createChartDataPoint = (
  item: SeriesData,
  transformValue: (value: number) => number
): ChartDataPoint => {
  const numValue = parseValue(item.value);
  const transformedValue = transformValue(numValue);
  return {
    value: transformedValue,
    date: item.obs_time,
    rawValue: item.value,
  };
};

/**
 * Transforms Base Monetaria historical data to chart format
 * Converts millions to billions for chart display
 */
const transformBaseMonetariaHistory = (seriesData: SeriesData[]): ChartDataPoint[] => {
  return seriesData.map(item =>
    createChartDataPoint(item, value => value / MILLIONS_TO_BILLIONS)
  );
};

/**
 * Transforms Reservas Internacionales historical data to chart format
 * Values are already in millions, used directly
 */
const transformReservasInternacionalesHistory = (seriesData: SeriesData[]): ChartDataPoint[] => {
  return seriesData.map(item =>
    createChartDataPoint(item, value => value)
  );
};

/**
 * Transforms Circulante Público historical data to chart format
 * Converts millions to billions for chart display
 */
const transformCirculantePublicoHistory = (seriesData: SeriesData[]): ChartDataPoint[] => {
  return seriesData.map(item =>
    createChartDataPoint(item, value => value / MILLIONS_TO_BILLIONS)
  );
};

// ============================================================================
// Transformer Maps
// ============================================================================

const SERIES_TRANSFORMERS: Record<SeriesCode, SeriesTransformer> = {
  [SERIES_CODES.BASE_MONETARIA]: transformBaseMonetaria,
  [SERIES_CODES.RESERVAS_INTERNACIONALES]: transformReservasInternacionales,
  [SERIES_CODES.CIRCULANTE_PUBLICO]: transformCirculantePublico,
};

const SERIES_HISTORY_TRANSFORMERS: Record<SeriesCode, SeriesHistoryTransformer> = {
  [SERIES_CODES.BASE_MONETARIA]: transformBaseMonetariaHistory,
  [SERIES_CODES.RESERVAS_INTERNACIONALES]: transformReservasInternacionalesHistory,
  [SERIES_CODES.CIRCULANTE_PUBLICO]: transformCirculantePublicoHistory,
};

// ============================================================================
// Public API
// ============================================================================

/**
 * Formats a raw value using the same transformation logic as the series transformers
 * This ensures consistency between displayed values and chart labels
 * 
 * @param rawValue - Original string value from API
 * @param code - Series code to determine formatting rules
 * @returns Formatted value string matching the series display format
 */
export const formatValueForSeries = (rawValue: string, code: SeriesCode): string => {
  const numValue = parseValue(rawValue);
  
  switch (code) {
    case SERIES_CODES.BASE_MONETARIA:
    case SERIES_CODES.CIRCULANTE_PUBLICO:
      return formatBillions(numValue);
    
    case SERIES_CODES.RESERVAS_INTERNACIONALES:
      return formatMillionsUSD(numValue);
    
    default:
      return numValue.toFixed(1);
  }
};

/**
 * Transforms historical series data to chart format
 * 
 * @param seriesData - Array of series data from API
 * @param code - Series code to determine transformation rules
 * @returns Array of ChartDataPoint for chart rendering
 * @throws Error if no transformer is found for the series code
 */
export const transformSeriesHistoryToChart = (
  seriesData: SeriesData[],
  code: SeriesCode
): ChartDataPoint[] => {
  const transformer = SERIES_HISTORY_TRANSFORMERS[code];
  
  if (!transformer) {
    throw new Error(`No history transformer found for series code: ${code}`);
  }

  return transformer(seriesData);
};

/**
 * Transforms API series data to Indicator format
 * 
 * Note: change, changePercent, and trend are set to default values.
 * These would need to be calculated from previous values in a production scenario.
 * 
 * @param seriesData - Single series data item from API
 * @param code - Series code to determine transformation rules
 * @returns Complete Indicator object
 * @throws Error if no transformer is found for the series code
 */
export const transformSeriesToIndicator = (
  seriesData: SeriesData,
  code: SeriesCode
): Indicator => {
  const transformer = SERIES_TRANSFORMERS[code];
  
  if (!transformer) {
    throw new Error(`No transformer found for series code: ${code}`);
  }

  const transformed = transformer(seriesData);

  return {
    ...transformed,
    change: 0, // TODO: Calculate from previous value
    changePercent: 0, // TODO: Calculate from previous value
    trend: 'neutral', // TODO: Calculate from previous value
  };
};
