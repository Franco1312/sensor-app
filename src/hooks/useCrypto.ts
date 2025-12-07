/**
 * Custom hook for fetching crypto prices from the API using React Query
 * Optimized with caching, polling, and automatic refetch management
 */

import { useQuery } from '@tanstack/react-query';
import { getCryptoPrices, CryptoPricesResponse } from '@/services/crypto-api';
import { transformCryptoPricesResponse } from '@/utils/cryptoTransform';
import { getPriceDirection } from '@/utils/cryptoHelpers';
import { Crypto } from '@/types';
import { DEFAULT_POLLING_INTERVAL } from '@/constants/crypto';
import { CRYPTO_ERROR_MESSAGES } from '@/services/crypto-api/errors';
import { useRef } from 'react';

interface UseCryptoResult {
  cryptos: Crypto[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Query key factory for crypto
 */
export const cryptoKeys = {
  all: ['crypto'] as const,
  prices: () => [...cryptoKeys.all, 'prices'] as const,
};

/**
 * Adds price direction to crypto items by comparing with previous values
 */
const addPriceDirections = (current: Crypto[], previous: Crypto[]): Crypto[] => {
  return current.map(crypto => {
    const prevCrypto = previous.find(p => p.symbol === crypto.symbol);
    const direction = getPriceDirection(crypto.lastPriceValue, prevCrypto?.lastPriceValue);
    return { ...crypto, priceDirection: direction };
  });
};

/**
 * Hook to fetch and transform crypto prices from the API
 * Uses React Query with polling for real-time updates
 * @param enabled - Whether to fetch immediately (default: true)
 * @param pollingInterval - Interval in milliseconds for polling (default: 1000 = 1 second)
 */
export const useCrypto = (
  enabled: boolean = true,
  pollingInterval: number = DEFAULT_POLLING_INTERVAL
): UseCryptoResult => {
  const previousCryptosRef = useRef<Crypto[]>([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: cryptoKeys.prices(),
    queryFn: async () => {
      const apiData: CryptoPricesResponse = await getCryptoPrices();
      const transformed = transformCryptoPricesResponse(apiData);
      
      // Add price directions by comparing with previous data
      const withDirections = addPriceDirections(transformed, previousCryptosRef.current);
      previousCryptosRef.current = transformed;
      
      return withDirections;
    },
    enabled,
    refetchInterval: enabled && pollingInterval > 0 ? pollingInterval : false,
    staleTime: 0, // Always consider stale for real-time updates
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
  });

  return {
    cryptos: data || [],
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : CRYPTO_ERROR_MESSAGES.FETCH_PRICES) : null,
    refetch: () => {
      refetch();
    },
  };
};
