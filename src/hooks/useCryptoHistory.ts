/**
 * Custom hook for fetching crypto klines (historical data) from the API
 */

import { useState, useEffect, useCallback } from 'react';
import { getCryptoKlines, Kline, KlineInterval } from '@/services/crypto-api';
import { ApiError } from '@/services/common/ApiError';
import { CRYPTO_ERROR_MESSAGES } from '@/services/crypto-api/errors';

interface UseCryptoHistoryResult {
  data: Kline[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch crypto klines from the API
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
  const [data, setData] = useState<Kline[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!enabled || !symbol) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getCryptoKlines(symbol, interval, limit, startTime, endTime);
      setData(response.klines);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : CRYPTO_ERROR_MESSAGES.FETCH_HISTORY;
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [symbol, interval, limit, startTime, endTime, enabled]);

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

