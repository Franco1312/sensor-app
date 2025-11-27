/**
 * Quotes API Client
 * Handles all requests to the quotes-api service
 */

import { ApiError } from '../common/ApiError';

const API_BASE_URL = 'https://cotizaciones-api-connectors-ws.onrender.com/api';

/**
 * Quote data from the API
 */
export interface QuoteApiData {
  source: string;
  casa: string;
  nombre: string;
  moneda: string;
  fecha: string;
  compra: number;
  venta: number;
}

/**
 * API Response type
 */
export interface QuotesApiResponse {
  success: boolean;
  data: QuoteApiData[];
}

/**
 * Fetches current quotes from the API
 * @returns Promise with the quotes data
 * @throws ApiError if the request fails
 */
export const getCurrentQuotes = async (): Promise<QuoteApiData[]> => {
  try {
    const url = `${API_BASE_URL}/quotes/current`;
    
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

    const data: QuoteApiData[] = await response.json();

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
 * Fetches historical quotes from the API
 * @param casa - The type of dollar (e.g., 'blue', 'oficial', 'bolsa')
 * @param startDate - Start date in format YYYY-MM-DD
 * @param endDate - End date in format YYYY-MM-DD
 * @returns Promise with the historical quotes data
 * @throws ApiError if the request fails
 */
export const getQuoteHistory = async (
  casa: string,
  startDate: string,
  endDate: string
): Promise<QuoteApiData[]> => {
  try {
    const url = `${API_BASE_URL}/quotes/historical?casa=${encodeURIComponent(casa)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    
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

    const data: QuoteApiData[] = await response.json();

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

