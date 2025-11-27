/**
 * Custom hook for fetching crypto prices from the API
 */

import { useState, useEffect, useCallback } from 'react';
import { getCryptoPrices, CryptoPricesResponse } from '@/services/crypto-api';
import { ApiError } from '@/services/common/ApiError';
import { transformCryptoPricesResponse } from '@/utils/cryptoTransform';
import { getPriceDirection, hasCryptoDataChanged } from '@/utils/cryptoHelpers';
import { Crypto } from '@/types';
import { DEFAULT_POLLING_INTERVAL } from '@/constants/crypto';
import { CRYPTO_ERROR_MESSAGES } from '@/services/crypto-api/errors';

interface UseCryptoResult {
  cryptos: Crypto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

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
 * @param enabled - Whether to fetch immediately (default: true)
 * @param pollingInterval - Interval in milliseconds for polling (default: 1000 = 1 second)
 */
export const useCrypto = (
  enabled: boolean = true,
  pollingInterval: number = DEFAULT_POLLING_INTERVAL
): UseCryptoResult => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptos = useCallback(
    async (isPolling: boolean = false) => {
      if (!enabled) return;

      if (!isPolling) {
        setLoading(true);
      }
      setError(null);

      try {
        const apiData: CryptoPricesResponse = await getCryptoPrices();
        const transformed = transformCryptoPricesResponse(apiData);

        setCryptos(prevCryptos => {
          // Check if data changed
          const hasChanges =
            prevCryptos.length !== transformed.length ||
            transformed.some((current, index) => {
              const prev = prevCryptos[index];
              return !prev || hasCryptoDataChanged(prev, current);
            });

          if (!hasChanges) {
            return prevCryptos;
          }

          // Add price directions
          return addPriceDirections(transformed, prevCryptos);
        });
      } catch (err) {
        const errorMessage =
          err instanceof ApiError ? err.message : CRYPTO_ERROR_MESSAGES.FETCH_PRICES;

        setCryptos(prevCryptos => {
          if (!isPolling || prevCryptos.length === 0) {
            setError(errorMessage);
            return isPolling ? prevCryptos : [];
          }
          return prevCryptos;
        });
      } finally {
        if (!isPolling) {
          setLoading(false);
        }
      }
    },
    [enabled]
  );

  useEffect(() => {
    fetchCryptos(false);

    if (enabled && pollingInterval > 0) {
      const interval = setInterval(() => fetchCryptos(true), pollingInterval);
      return () => clearInterval(interval);
    }
  }, [fetchCryptos, enabled, pollingInterval]);

  return {
    cryptos,
    loading,
    error,
    refetch: () => fetchCryptos(false),
  };
};

