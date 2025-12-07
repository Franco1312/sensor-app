/**
 * React Query Client Configuration
 * Global cache configuration with persistence for optimal performance
 */

import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage persister for React Query cache
 * Persists query cache to AsyncStorage for offline support and instant loading
 */
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

/**
 * Query Client with optimized defaults
 * 
 * Configuration:
 * - staleTime: 5 minutes - Data is considered fresh for 5 minutes, no refetch needed
 * - gcTime: 30 minutes - Cached data stays in memory for 30 minutes
 * - refetchOnWindowFocus: false - Don't refetch when app comes to foreground
 * - refetchOnReconnect: false - Don't refetch on network reconnect (use stale data)
 * - refetchOnMount: false - Don't refetch if data exists in cache
 * - retry: 1 - Only retry once on failure
 * - retryDelay: exponential backoff
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false, // Don't refetch if data exists in cache
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      networkMode: 'online', // Only fetch when online
    },
    mutations: {
      retry: 1,
      networkMode: 'online',
    },
  },
});

