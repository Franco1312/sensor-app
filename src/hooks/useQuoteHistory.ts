/**
 * Custom hook for fetching quote history from the API
 */

import { useState, useEffect, useCallback } from 'react';
import { getQuoteHistory, QuoteApiData } from '@/services/quotes-api';
import { ApiError } from '@/services/common/ApiError';
import { TimeRange, calculateDateRange } from '@/utils/dateRange';

interface UseQuoteHistoryResult {
  data: QuoteApiData[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch quote history from the API
 * @param casa - The type of dollar (e.g., 'blue', 'oficial', 'bolsa')
 * @param timeRange - Time range filter (1M, 3M, or 1A)
 * @param enabled - Whether to fetch immediately (default: true)
 */
export const useQuoteHistory = (
  casa: string,
  timeRange: TimeRange,
  enabled: boolean = true
): UseQuoteHistoryResult => {
  const [data, setData] = useState<QuoteApiData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!enabled || !casa) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { startDate, endDate } = calculateDateRange(timeRange);
      // Convert ISO format to YYYY-MM-DD format for the API
      const startDateFormatted = startDate.split('T')[0];
      const endDateFormatted = endDate.split('T')[0];
      
      const historyData: QuoteApiData[] = await getQuoteHistory(casa, startDateFormatted, endDateFormatted);
      setData(historyData);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Error al obtener el historial de cotizaciones. Por favor, intenta nuevamente.';
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [casa, timeRange, enabled]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    data,
    loading,
    error,
    refetch: fetchHistory,
  };
};

