/**
 * Custom hook for fetching quotes from the API using React Query
 * Now uses projections-consumer-api (series format) instead of cotizaciones-api-connectors
 * Optimized with caching and automatic refetch management
 */

import { useQuery } from '@tanstack/react-query';
import { fetchUsdQuotesFromSeries } from '@/utils/usdSeriesToQuotes';
import { Quote } from '@/types';

interface UseQuotesResult {
  quotes: Quote[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Query key factory for quotes
 */
export const quoteKeys = {
  all: ['quotes'] as const,
  current: () => [...quoteKeys.all, 'current'] as const,
};

/**
 * Hook to fetch and transform quotes from projections-consumer-api
 * Uses React Query for caching and automatic refetch management
 * @param enabled - Whether to fetch immediately (default: true)
 */
export const useQuotes = (enabled: boolean = true): UseQuotesResult => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: quoteKeys.current(),
    queryFn: async () => {
      return await fetchUsdQuotesFromSeries();
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes for quotes (more frequent updates)
  });

  return {
    quotes: data || [],
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Error al obtener las cotizaciones') : null,
    refetch: () => {
      refetch();
    },
  };
};
