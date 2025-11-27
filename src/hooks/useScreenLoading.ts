/**
 * useScreenLoading - Hook for managing screen loading states
 * Provides skeleton, error, and empty states
 */

import { useMemo } from 'react';

export interface UseScreenLoadingOptions {
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
}

export interface UseScreenLoadingResult {
  showLoading: boolean;
  showError: boolean;
  showEmpty: boolean;
  showContent: boolean;
  errorMessage: string | null;
}

export function useScreenLoading({
  loading,
  error,
  isEmpty,
}: UseScreenLoadingOptions): UseScreenLoadingResult {
  const showLoading = loading && !error;
  const showError = !!error && !loading;
  const showEmpty = isEmpty && !loading && !error;
  const showContent = !loading && !error && !isEmpty;

  return useMemo(
    () => ({
      showLoading,
      showError,
      showEmpty,
      showContent,
      errorMessage: error,
    }),
    [showLoading, showError, showEmpty, showContent, error]
  );
}

