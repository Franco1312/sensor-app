/**
 * Custom hook for fetching series data from the API
 */

import { useState, useEffect, useCallback } from 'react';
import { getSeriesLatest, ApiError } from '@/services/projections-consumer-api';
import { transformSeriesToIndicator } from '@/utils/seriesTransform';
import { Indicator, SeriesData } from '@/types';
import { SeriesCode } from '@/constants/series';

interface UseSeriesDataResult {
  data: Indicator | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and transform series data from the API
 * @param code - The series code to fetch
 * @param enabled - Whether to fetch immediately (default: true)
 */
export const useSeriesData = (
  code: SeriesCode,
  enabled: boolean = true
): UseSeriesDataResult => {
  const [data, setData] = useState<Indicator | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getSeriesLatest(code);
      const transformed = transformSeriesToIndicator(response.data, code);
      setData(transformed);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Error al obtener los datos. Por favor, intenta nuevamente.';
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [code, enabled]);

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

