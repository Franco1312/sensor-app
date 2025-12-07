/**
 * Custom hook for fetching quote history from the API using React Query
 * Optimized with caching and automatic refetch management
 */

import { useQuery } from '@tanstack/react-query';
import { getQuoteHistory, QuoteApiData } from '@/services/quotes-api';
import { TimeRange, calculateDateRange } from '@/utils/dateRange';
import { quoteKeys } from './useQuotes';

interface UseQuoteHistoryResult {
  data: QuoteApiData[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch quote history from the API
 * Uses React Query for caching and automatic refetch management
 * @param casa - The type of dollar (e.g., 'blue', 'oficial', 'bolsa')
 * @param timeRange - Time range filter (1M, 3M, or 1A)
 * @param enabled - Whether to fetch immediately (default: true)
 */
export const useQuoteHistory = (
  casa: string,
  timeRange: TimeRange,
  enabled: boolean = true
): UseQuoteHistoryResult => {
      const { startDate, endDate } = calculateDateRange(timeRange);
      // Convert ISO format to YYYY-MM-DD format for the API
      const startDateFormatted = startDate.split('T')[0];
      const endDateFormatted = endDate.split('T')[0];
      
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...quoteKeys.all, 'history', casa, timeRange, startDateFormatted, endDateFormatted],
    queryFn: async () => {
      return await getQuoteHistory(casa, startDateFormatted, endDateFormatted);
    },
    enabled: enabled && !!casa,
    staleTime: 1000 * 60 * 10, // 10 minutes for historical data
  });

  return {
    data: data || null,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Error al obtener el historial de cotizaciones') : null,
    refetch: () => {
      refetch();
    },
  };
};
