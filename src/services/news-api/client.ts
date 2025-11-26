/**
 * News API Client
 * Handles all requests to the news RSS aggregator service
 */

import { ApiError } from '../common/ApiError';

const API_BASE_URL = 'https://rss-aggregator-yxql.onrender.com';

/**
 * News item from the API
 */
export interface NewsItem {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  summary: string;
  link: string;
  publishedAt: string;
  fetchedAt: string;
  categories: string[];
  imageUrl?: string;
}

/**
 * API Response type
 */
export interface NewsApiResponse {
  items: NewsItem[];
}

/**
 * Fetches news from the API with pagination
 * @param limit - Number of items to fetch (default: 10)
 * @param offset - Number of items to skip (default: 0)
 * @returns Promise with the news data
 * @throws ApiError if the request fails
 */
export const getNews = async (limit: number = 10, offset: number = 0): Promise<NewsItem[]> => {
  try {
    const url = `${API_BASE_URL}/news?limit=${limit}&offset=${offset}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
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

    const data: NewsApiResponse = await response.json();

    return data.items || [];
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

