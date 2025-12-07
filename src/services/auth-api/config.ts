/**
 * Auth API Configuration
 */

// Base URL for the auth service
// Override by setting API_BASE_URL environment variable
export const API_BASE_URL = process.env.API_BASE_URL || 'https://key-pass.onrender.com';

/**
 * Storage keys for AsyncStorage
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@auth:accessToken',
  REFRESH_TOKEN: '@auth:refreshToken',
  USER: '@auth:user',
} as const;

