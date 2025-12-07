/**
 * Custom hook for fetching series metadata from the API using React Query
 * Optimized with caching and automatic refetch management
 */

import { useQuery } from '@tanstack/react-query';
import { getSeriesMetadata } from '@/services/projections-consumer-api';
import { SeriesMetadata } from '@/types';
import { SeriesCode } from '@/constants/series';
import { seriesKeys } from './useSeriesData';

interface UseSeriesMetadataResult {
  data: SeriesMetadata | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch series metadata (description and methodology) from the API
 * Uses React Query for caching and automatic refetch management
 * @param code - The series code to fetch metadata for
 * @param enabled - Whether to fetch immediately (default: true)
 */
export const useSeriesMetadata = (
  code: SeriesCode,
  enabled: boolean = true
): UseSeriesMetadataResult => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...seriesKeys.detail(code), 'metadata'],
    queryFn: async () => {
      const response = await getSeriesMetadata(code);
      return response.data;
    },
    enabled: enabled && !!code,
    staleTime: 1000 * 60 * 60, // 1 hour for metadata (rarely changes)
  });

  return {
    data: data || null,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Error al obtener los metadatos') : null,
    refetch: () => {
      refetch();
    },
  };
};
