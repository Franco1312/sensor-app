/**
 * Hook for intelligent prefetching of related data
 * Prefetches detail screens when user interacts with list items
 */

import { useQueryClient } from '@tanstack/react-query';
import { seriesKeys } from './useSeriesData';
import { quoteKeys } from './useQuotes';
import { cryptoKeys } from './useCrypto';
import { SeriesCode } from '@/constants/series';
import { getSeriesLatest, getSeriesHistory, getSeriesMetadata } from '@/services/projections-consumer-api';
import { mapQuoteIdToUsdType, USD_QUOTE_MAPPING } from '@/utils/usdSeriesToQuotes';
import { getCryptoKlines, KlineInterval } from '@/services/crypto-api';
import { transformSeriesToIndicator } from '@/utils/seriesTransform';
import { calculateDateRange } from '@/utils/dateRange';

/**
 * Hook to prefetch indicator detail data
 */
export const usePrefetchIndicator = () => {
  const queryClient = useQueryClient();

  return (indicatorId: SeriesCode) => {
    // Prefetch indicator data
    queryClient.prefetchQuery({
      queryKey: seriesKeys.detail(indicatorId),
      queryFn: async () => {
        const response = await getSeriesLatest(indicatorId);
        return transformSeriesToIndicator(response.data, indicatorId);
      },
      staleTime: 1000 * 60 * 5,
    });

    // Prefetch metadata
    queryClient.prefetchQuery({
      queryKey: [...seriesKeys.detail(indicatorId), 'metadata'],
      queryFn: async () => {
        const response = await getSeriesMetadata(indicatorId);
        return response.data;
      },
      staleTime: 1000 * 60 * 60,
    });

    // Prefetch history for default time range (1A)
    const { startDate, endDate } = calculateDateRange('1A');
    queryClient.prefetchQuery({
      queryKey: [...seriesKeys.detail(indicatorId), 'history', '1A', startDate, endDate],
      queryFn: async () => {
        const response = await getSeriesHistory(indicatorId, startDate, endDate);
        return response.data;
      },
      staleTime: 1000 * 60 * 10,
    });
  };
};

/**
 * Hook to prefetch quote detail data
 * Now uses projections-consumer-api (series format)
 */
export const usePrefetchQuote = () => {
  const queryClient = useQueryClient();

  return (quoteId: string) => {
    // Map quote ID to USD type and get venta series code
    const usdType = mapQuoteIdToUsdType(quoteId);
    if (!usdType) return;

    const seriesCode = USD_QUOTE_MAPPING[usdType].venta;
    const { startDate, endDate } = calculateDateRange('1A');

    // Prefetch quote history using series format
    queryClient.prefetchQuery({
      queryKey: [...quoteKeys.all, 'history', quoteId, '1A', startDate, endDate],
      queryFn: async () => {
        const response = await getSeriesHistory(seriesCode, startDate, endDate);
        return response.data;
      },
      staleTime: 1000 * 60 * 10,
    });
  };
};

/**
 * Hook to prefetch crypto detail data
 */
export const usePrefetchCrypto = () => {
  const queryClient = useQueryClient();

  return (symbol: string, interval: KlineInterval = '1d', limit: number = 200) => {
    // Prefetch crypto history
    queryClient.prefetchQuery({
      queryKey: [...cryptoKeys.all, 'history', symbol, interval, limit],
      queryFn: async () => {
        const response = await getCryptoKlines(symbol, interval, limit);
        return response.klines;
      },
      staleTime: 1000 * 60 * 10,
    });
  };
};

