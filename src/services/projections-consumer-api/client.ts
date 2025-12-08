/**
 * Projections Consumer API Client
 * Handles all requests to the projections-consumer-api service
 */

import { SeriesApiResponse, SeriesHistoryApiResponse, SeriesMetadataApiResponse } from '@/types';
import { ApiError } from '../common/ApiError';

export interface SeriesMetadataItem {
  internal_series_code: string;
  title: string;
  description?: string;
  methodology?: string;
  source?: string;
}

export interface SeriesMetadataListResponse {
  success: boolean;
  data: SeriesMetadataItem[];
  count?: number;
}

const API_BASE_URL = 'https://projections-consumer-api.onrender.com/api/v1';

/**
 * Fetches the latest value for a series by its code
 * @param code - The internal series code (e.g., 'BCRA_BASE_MONETARIA_TOTAL_ARS_BN_D')
 * @returns Promise with the series data
 * @throws ApiError if the request fails
 */
export const getSeriesLatest = async (code: string): Promise<SeriesApiResponse> => {
  try {
    const url = `${API_BASE_URL}/series/latest?code=${encodeURIComponent(code)}`;
    
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

    const data: SeriesApiResponse = await response.json();

    if (!data.success) {
      throw new ApiError('API returned unsuccessful response', response.status, data);
    }

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
 * Fetches historical series data for a date range
 * @param code - The internal series code (e.g., 'BCRA_BASE_MONETARIA_TOTAL_ARS_BN_D')
 * @param startDate - Start date in ISO format with timezone (e.g., '2025-03-01T00:00:00-03:00')
 * @param endDate - End date in ISO format with timezone (e.g., '2025-03-31T23:59:59-03:00')
 * @returns Promise with the series historical data
 * @throws ApiError if the request fails
 */
export const getSeriesHistory = async (
  code: string,
  startDate: string,
  endDate: string
): Promise<SeriesHistoryApiResponse> => {
  try {
    const url = `${API_BASE_URL}/series?code=${encodeURIComponent(code)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    
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

    const data: SeriesHistoryApiResponse = await response.json();

    if (!data.success) {
      throw new ApiError('API returned unsuccessful response', response.status, data);
    }

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
 * Fetches metadata (description and methodology) for a series by its code
 * @param code - The internal series code (e.g., 'BCRA_BASE_MONETARIA_TOTAL_ARS_BN_D')
 * @returns Promise with the series metadata
 * @throws ApiError if the request fails
 */
export const getSeriesMetadata = async (code: string): Promise<SeriesMetadataApiResponse> => {
  try {
    const url = `${API_BASE_URL}/series/${encodeURIComponent(code)}/metadata`;
    
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

    const data: SeriesMetadataApiResponse = await response.json();

    if (!data.success) {
      throw new ApiError('API returned unsuccessful response', response.status, data);
    }

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
 * Fetches all series metadata (list of all available series with their codes and titles)
 * @returns Promise with the list of series metadata
 * @throws ApiError if the request fails
 */
export const getAllSeriesMetadata = async (): Promise<SeriesMetadataListResponse> => {
  try {
    const url = `${API_BASE_URL}/series/metadata`;
    
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

    const data: SeriesMetadataListResponse = await response.json();

    if (!data.success) {
      throw new ApiError('API returned unsuccessful response', response.status, data);
    }

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

