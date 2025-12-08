/**
 * Custom hook for fetching quote history from projections-consumer-api using React Query
 * Now uses series format instead of casa/nombre format
 * Optimized with caching and automatic refetch management
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getSeriesHistory } from '@/services/projections-consumer-api';
import { TimeRange, calculateDateRange } from '@/utils/dateRange';
import { quoteKeys } from './useQuotes';
import { mapQuoteIdToUsdType, USD_QUOTE_MAPPING } from '@/utils/usdSeriesToQuotes';
import { SeriesData } from '@/types';
import { transformSeriesHistoryToChart, ChartDataPoint } from '@/utils/seriesTransform';

interface UseQuoteHistoryResult {
  data: SeriesData[] | null;
  chartData: ChartDataPoint[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch quote history from projections-consumer-api
 * Uses React Query for caching and automatic refetch management
 * @param quoteId - The quote ID (e.g., 'blue', 'oficial', 'bolsa')
 * @param timeRange - Time range filter (1M, 3M, or 1A)
 * @param enabled - Whether to fetch immediately (default: true)
 */
export const useQuoteHistory = (
  quoteId: string,
  timeRange: TimeRange,
  enabled: boolean = true
): UseQuoteHistoryResult => {
  const { startDate, endDate } = calculateDateRange(timeRange);
  
  // Map quote ID to USD type and get venta series code
  const usdType = mapQuoteIdToUsdType(quoteId);
  const seriesCode = usdType ? USD_QUOTE_MAPPING[usdType].venta : null;
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...quoteKeys.all, 'history', quoteId, timeRange, startDate, endDate],
    queryFn: async () => {
      if (!seriesCode) {
        throw new Error(`Invalid quote ID: ${quoteId}`);
      }
      const response = await getSeriesHistory(seriesCode, startDate, endDate);
      return response.data;
    },
    enabled: enabled && !!quoteId && !!seriesCode,
    staleTime: 1000 * 60 * 10, // 10 minutes for historical data
  });

  // Transform to chart data
  const chartData = useMemo(() => {
    if (!data || !seriesCode) return null;
    try {
      return transformSeriesHistoryToChart(data, seriesCode);
    } catch {
      return null;
    }
  }, [data, seriesCode]);

  return {
    data: data || null,
    chartData,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Error al obtener el historial de cotizaciones') : null,
    refetch: () => {
      refetch();
    },
  };
};
