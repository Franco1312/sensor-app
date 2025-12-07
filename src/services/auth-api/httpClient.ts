/**
 * HTTP Client for Auth API
 * Handles token management and automatic refresh
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiError } from '../common/ApiError';
import { API_BASE_URL, STORAGE_KEYS } from './config';
import type { RefreshTokenRequest, RefreshTokenResponse } from './types';

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Get stored access token
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

/**
 * Get stored refresh token
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Store tokens
 */
export const storeTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
    ]);
  } catch (error) {
    console.error('Error storing tokens:', error);
    throw error;
  }
};

/**
 * Clear stored tokens
 */
export const clearTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN, STORAGE_KEYS.USER]);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new ApiError('No refresh token available', 401);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken } as RefreshTokenRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || 'Failed to refresh token',
        response.status,
        errorData
      );
    }

    const data: RefreshTokenResponse = await response.json();
    await storeTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch (error) {
    await clearTokens();
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to refresh token', 401, error);
  }
};

/**
 * Make authenticated HTTP request with automatic token refresh
 */
export const authenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  let accessToken = await getAccessToken();

  // Add authorization header if token exists
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // Make initial request
  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If 401, try to refresh token and retry
  if (response.status === 401 && accessToken) {
    // Prevent multiple simultaneous refresh attempts
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken();
    }

    try {
      accessToken = await refreshPromise!;
      isRefreshing = false;
      refreshPromise = null;

      // Retry request with new token
      headers['Authorization'] = `Bearer ${accessToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } catch (refreshError) {
      isRefreshing = false;
      refreshPromise = null;
      await clearTokens();
      throw refreshError;
    }
  }

  return response;
};

/**
 * Make unauthenticated HTTP request
 */
export const unauthenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

