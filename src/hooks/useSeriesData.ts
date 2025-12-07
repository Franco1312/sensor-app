/**
 * Custom hook for fetching series data from the API using React Query
 * Optimized with caching and automatic refetch management
 */

import { useQuery } from '@tanstack/react-query';
import { getSeriesLatest } from '@/services/projections-consumer-api';
import { transformSeriesToIndicator } from '@/utils/seriesTransform';
import { Indicator } from '@/types';
import { SeriesCode } from '@/constants/series';

interface UseSeriesDataResult {
  data: Indicator | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Query key factory for series data
 */
export const seriesKeys = {
  all: ['series'] as const,
  detail: (code: SeriesCode) => [...seriesKeys.all, code] as const,
};

/**
 * Hook to fetch and transform series data from the API
 * Uses React Query for caching and automatic refetch management
 * @param code - The series code to fetch
 * @param enabled - Whether to fetch immediately (default: true)
 */
export const useSeriesData = (
  code: SeriesCode,
  enabled: boolean = true
): UseSeriesDataResult => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: seriesKeys.detail(code),
    queryFn: async () => {
      const response = await getSeriesLatest(code);
      return transformSeriesToIndicator(response.data, code);
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    data: data || null,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Error al obtener los datos') : null,
    refetch: () => {
      refetch();
    },
  };
};
