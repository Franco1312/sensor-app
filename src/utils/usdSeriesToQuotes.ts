/**
 * USD Series to Quotes transformation
 * Transforms USD series data (from projections-consumer-api) to Quote format
 * Uses standard series structure instead of casa/nombre format
 */

import { SeriesData } from '@/types';
import { Quote } from '@/types';
import { SERIES_CODES } from '@/constants/series';
import { getSeriesLatest } from '@/services/projections-consumer-api';
import { formatValueForSeries } from './seriesTransform';
import { formatDate } from './dateFormat';

/**
 * Mapping of USD quote types to their compra and venta series codes
 */
export const USD_QUOTE_MAPPING = {
  oficial: {
    compra: SERIES_CODES.USD_OFICIAL_COMPRA,
    venta: SERIES_CODES.USD_OFICIAL_VENTA,
    name: 'Dólar Oficial',
  },
  mayorista: {
    compra: SERIES_CODES.USD_MAYORISTA_COMPRA,
    venta: SERIES_CODES.USD_MAYORISTA_VENTA,
    name: 'Dólar Mayorista',
  },
  tarjeta: {
    compra: SERIES_CODES.USD_TARJETA_COMPRA,
    venta: SERIES_CODES.USD_TARJETA_VENTA,
    name: 'Dólar Tarjeta',
  },
  bolsa: {
    compra: SERIES_CODES.USD_BOLSA_COMPRA,
    venta: SERIES_CODES.USD_BOLSA_VENTA,
    name: 'Dólar Bolsa (MEP)',
  },
  contadoconliqui: {
    compra: SERIES_CODES.USD_CONTADOCONLIQUI_COMPRA,
    venta: SERIES_CODES.USD_CONTADOCONLIQUI_VENTA,
    name: 'Dólar Contado con Liquidación (CCL)',
  },
  blue: {
    compra: SERIES_CODES.USD_BLUE_COMPRA,
    venta: SERIES_CODES.USD_BLUE_VENTA,
    name: 'Dólar Blue',
  },
  cripto: {
    compra: SERIES_CODES.USD_CRIPTO_COMPRA,
    venta: SERIES_CODES.USD_CRIPTO_VENTA,
    name: 'Dólar Cripto',
  },
} as const;

export type UsdQuoteType = keyof typeof USD_QUOTE_MAPPING;

/**
 * Maps quote ID (from navigation) to USD quote type
 * @param quoteId - Quote ID (e.g., 'blue', 'oficial')
 * @returns USD quote type or null if not found
 */
export const mapQuoteIdToUsdType = (quoteId: string): UsdQuoteType | null => {
  // Remove 'quote-' prefix if present
  const cleanId = quoteId.replace('quote-', '');
  return cleanId in USD_QUOTE_MAPPING ? (cleanId as UsdQuoteType) : null;
};

/**
 * Transforms USD series data to Quote format
 * @param compraData - Series data for buy price (compra)
 * @param ventaData - Series data for sell price (venta)
 * @param quoteType - Type of USD quote (oficial, blue, etc.)
 * @returns Quote object or null if ventaData is missing
 */
export const transformUsdSeriesToQuote = (
  compraData: SeriesData | null,
  ventaData: SeriesData | null,
  quoteType: UsdQuoteType
): Quote | null => {
  if (!ventaData) return null;

  const mapping = USD_QUOTE_MAPPING[quoteType];
  const lastUpdate = ventaData.obs_time || compraData?.obs_time || '';

  return {
    id: `quote-${quoteType}`,
    name: mapping.name,
    buyPrice: compraData ? formatValueForSeries(compraData.value, mapping.compra) : undefined,
    sellPrice: formatValueForSeries(ventaData.value, mapping.venta),
    change: 0,
    changePercent: 0,
    lastUpdate: formatDate(lastUpdate),
    category: 'dolares',
  };
};

/**
 * Fetches all USD quotes from projections-consumer-api
 * @returns Promise with array of Quote objects
 */
export const fetchUsdQuotesFromSeries = async (): Promise<Quote[]> => {
  // Fetch all USD quote pairs in parallel
  const fetchPromises = Object.entries(USD_QUOTE_MAPPING).map(async ([quoteType, mapping]) => {
    try {
      const [compraResponse, ventaResponse] = await Promise.all([
        getSeriesLatest(mapping.compra).catch(() => null),
        getSeriesLatest(mapping.venta).catch(() => null),
      ]);

      const compraData = compraResponse?.data || null;
      const ventaData = ventaResponse?.data || null;

      return transformUsdSeriesToQuote(compraData, ventaData, quoteType as UsdQuoteType);
    } catch (error) {
      console.warn(`Error fetching USD quote ${quoteType}:`, error);
      return null;
    }
  });

  const results = await Promise.all(fetchPromises);
  
  // Filter out null results
  return results.filter((quote): quote is Quote => quote !== null);
};

