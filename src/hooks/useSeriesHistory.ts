/**
 * Custom hook for fetching historical series data from the API using React Query
 * Optimized with caching and automatic refetch management
 */

import { useQuery } from '@tanstack/react-query';
import { getSeriesHistory } from '@/services/projections-consumer-api';
import { SeriesData } from '@/types';
import { SeriesCode } from '@/constants/series';
import { TimeRange, calculateDateRange } from '@/utils/dateRange';
import { seriesKeys } from './useSeriesData';

interface UseSeriesHistoryResult {
  data: SeriesData[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch historical series data from the API
 * Uses React Query for caching and automatic refetch management
 * @param code - The series code to fetch
 * @param timeRange - Time range filter (1M, 3M, or 1A)
 * @param enabled - Whether to fetch immediately (default: true)
 */
export const useSeriesHistory = (
  code: SeriesCode,
  timeRange: TimeRange,
  enabled: boolean = true
): UseSeriesHistoryResult => {
      const { startDate, endDate } = calculateDateRange(timeRange);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...seriesKeys.detail(code), 'history', timeRange, startDate, endDate],
    queryFn: async () => {
      const response = await getSeriesHistory(code, startDate, endDate);
      return response.data;
    },
    enabled: enabled && !!code,
    staleTime: 1000 * 60 * 10, // 10 minutes for historical data
  });

  return {
    data: data || null,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Error al obtener los datos históricos') : null,
    refetch: () => {
      refetch();
    },
  };
};
