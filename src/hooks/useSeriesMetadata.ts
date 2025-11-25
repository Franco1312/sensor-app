/**
 * Custom hook for fetching series metadata from the API
 */

import { useState, useEffect, useCallback } from 'react';
import { getSeriesMetadata, ApiError } from '@/services/projections-consumer-api';
import { SeriesMetadata } from '@/types';
import { SeriesCode } from '@/constants/series';

interface UseSeriesMetadataResult {
  data: SeriesMetadata | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch series metadata (description and methodology) from the API
 * @param code - The series code to fetch metadata for
 * @param enabled - Whether to fetch immediately (default: true)
 */
export const useSeriesMetadata = (
  code: SeriesCode,
  enabled: boolean = true
): UseSeriesMetadataResult => {
  const [data, setData] = useState<SeriesMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Start as true to show loading initially
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getSeriesMetadata(code);
      setData(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Error al obtener los metadatos. Por favor, intenta nuevamente.';
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

