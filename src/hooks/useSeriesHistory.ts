/**
 * Custom hook for fetching historical series data from the API
 */

import { useState, useEffect, useCallback } from 'react';
import { getSeriesHistory, ApiError } from '@/services/projections-consumer-api';
import { SeriesData } from '@/types';
import { SeriesCode } from '@/constants/series';
import { TimeRange, calculateDateRange } from '@/utils/dateRange';

interface UseSeriesHistoryResult {
  data: SeriesData[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch historical series data from the API
 * @param code - The series code to fetch
 * @param timeRange - Time range filter (1M, 3M, or 1A)
 * @param enabled - Whether to fetch immediately (default: true)
 */
export const useSeriesHistory = (
  code: SeriesCode,
  timeRange: TimeRange,
  enabled: boolean = true
): UseSeriesHistoryResult => {
  const [data, setData] = useState<SeriesData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { startDate, endDate } = calculateDateRange(timeRange);
      const response = await getSeriesHistory(code, startDate, endDate);
      setData(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Error al obtener los datos históricos. Por favor, intenta nuevamente.';
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [code, timeRange, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

