/**
 * Custom hook for fetching quotes from the API
 */

import { useState, useEffect, useCallback } from 'react';
import { getCurrentQuotes, QuoteApiData } from '@/services/quotes-api';
import { ApiError } from '@/services/common/ApiError';
import { transformQuotesApiData, Quote } from '@/utils/quotesTransform';

interface UseQuotesResult {
  quotes: Quote[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and transform quotes from the API
 * @param enabled - Whether to fetch immediately (default: true)
 */
export const useQuotes = (enabled: boolean = true): UseQuotesResult => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiData: QuoteApiData[] = await getCurrentQuotes();
      const transformed = transformQuotesApiData(apiData);
      setQuotes(transformed);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Error al obtener las cotizaciones. Por favor, intenta nuevamente.';
      setError(errorMessage);
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return {
    quotes,
    loading,
    error,
    refetch: fetchQuotes,
  };
};

