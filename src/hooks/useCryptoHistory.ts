/**
 * Custom hook for fetching crypto klines (historical data) from the API using React Query
 * Optimized with caching and automatic refetch management
 */

import { useQuery } from '@tanstack/react-query';
import { getCryptoKlines, Kline, KlineInterval } from '@/services/crypto-api';
import { CRYPTO_ERROR_MESSAGES } from '@/services/crypto-api/errors';
import { cryptoKeys } from './useCrypto';

interface UseCryptoHistoryResult {
  data: Kline[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch crypto klines from the API
 * Uses React Query for caching and automatic refetch management
 * @param symbol - Crypto symbol (e.g., 'BTCUSDT', 'ETHUSDT')
 * @param interval - Time interval for each kline
 * @param limit - Maximum number of klines to return (optional, default: 200)
 * @param startTime - Start timestamp in milliseconds (optional)
 * @param endTime - End timestamp in milliseconds (optional)
 * @param enabled - Whether to fetch immediately (default: true)
 */
export const useCryptoHistory = (
  symbol: string,
  interval: KlineInterval,
  limit?: number,
  startTime?: number,
  endTime?: number,
  enabled: boolean = true
): UseCryptoHistoryResult => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...cryptoKeys.all, 'history', symbol, interval, limit, startTime, endTime],
    queryFn: async () => {
      const response = await getCryptoKlines(symbol, interval, limit, startTime, endTime);
      return response.klines;
    },
    enabled: enabled && !!symbol,
    staleTime: 1000 * 60 * 10, // 10 minutes for historical data
  });

  return {
    data: data || null,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : CRYPTO_ERROR_MESSAGES.FETCH_HISTORY) : null,
    refetch: () => {
      refetch();
    },
  };
};
