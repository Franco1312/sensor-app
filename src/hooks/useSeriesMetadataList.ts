/**
 * Custom hook for fetching all series metadata from the API using React Query
 */

import { useQuery } from '@tanstack/react-query';
import { getAllSeriesMetadata, SeriesMetadataItem } from '@/services/projections-consumer-api';
import { seriesKeys } from './useSeriesData';

interface UseSeriesMetadataListResult {
  data: SeriesMetadataItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch all series metadata (list of available series)
 * Uses React Query for caching and automatic refetch management
 */
export const useSeriesMetadataList = (): UseSeriesMetadataListResult => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...seriesKeys.all, 'metadata-list'],
    queryFn: async () => {
      const response = await getAllSeriesMetadata();
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour - metadata doesn't change often
  });

  return {
    data: data || [],
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Error al obtener las series disponibles') : null,
    refetch,
  };
};

