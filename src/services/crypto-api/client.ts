/**
 * Crypto API Client
 * Handles all requests to the crypto-api service
 */

import { ApiError } from '../common/ApiError';

const API_BASE_URL = 'https://cotizaciones-api-connectors-ws.onrender.com/api';

/**
 * MiniTicker data from the API
 */
export interface MiniTicker {
  symbol: string;
  lastPrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  eventTime: number;
}

/**
 * Crypto prices response from the API
 */
export interface CryptoPricesResponse {
  [symbol: string]: MiniTicker;
}

/**
 * Kline data from the API
 */
export interface Kline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteVolume: string;
  numberOfTrades: number;
  takerBuyBaseVolume: string;
  takerBuyQuoteVolume: string;
}

/**
 * Klines response from the API
 */
export interface KlinesResponse {
  symbol: string;
  interval: string;
  limit: number;
  klines: Kline[];
}

/**
 * Valid interval values for klines
 */
export type KlineInterval = '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' | '1d' | '3d' | '1w' | '1M';

/**
 * Fetches current crypto prices from the API
 * @returns Promise with the crypto prices data
 * @throws ApiError if the request fails
 */
export const getCryptoPrices = async (): Promise<CryptoPricesResponse> => {
  try {
    const url = `${API_BASE_URL}/crypto/prices`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const data: CryptoPricesResponse = await response.json();

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors or other unexpected errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      error
    );
  }
};

/**
 * Fetches historical klines data from the API
 * @param symbol - Crypto symbol (e.g., 'BTCUSDT', 'ETHUSDT')
 * @param interval - Time interval for each kline
 * @param limit - Maximum number of klines to return (optional, default: 200)
 * @param startTime - Start timestamp in milliseconds (optional)
 * @param endTime - End timestamp in milliseconds (optional)
 * @returns Promise with the klines data
 * @throws ApiError if the request fails
 */
export const getCryptoKlines = async (
  symbol: string,
  interval: KlineInterval,
  limit?: number,
  startTime?: number,
  endTime?: number
): Promise<KlinesResponse> => {
  try {
    const params = new URLSearchParams({
      symbol,
      interval,
    });

    if (limit !== undefined) {
      params.append('limit', limit.toString());
    }

    if (startTime !== undefined) {
      params.append('startTime', startTime.toString());
    }

    if (endTime !== undefined) {
      params.append('endTime', endTime.toString());
    }

    const url = `${API_BASE_URL}/crypto/klines?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const data: KlinesResponse = await response.json();

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors or other unexpected errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      error
    );
  }
};

