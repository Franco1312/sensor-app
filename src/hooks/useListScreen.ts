/**
 * useListScreen - Hook for common list screen logic
 * Handles filtering, pagination, loading/error states
 */

import { useState, useMemo } from 'react';

export interface UseListScreenOptions<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  filterFn?: (item: T) => boolean;
  defaultFilter?: string;
}

export interface UseListScreenResult<T> {
  filteredData: T[];
  filter: string;
  setFilter: (filter: string) => void;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
}

export function useListScreen<T>({
  data,
  loading,
  error,
  filterFn,
  defaultFilter = 'all',
}: UseListScreenOptions<T>): UseListScreenResult<T> {
  const [filter, setFilter] = useState<string>(defaultFilter);

  const filteredData = useMemo(() => {
    if (!filterFn || filter === defaultFilter) {
      return data;
    }
    return data.filter(filterFn);
  }, [data, filter, filterFn, defaultFilter]);

  return {
    filteredData,
    filter,
    setFilter,
    isLoading: loading,
    hasError: !!error,
    errorMessage: error,
    isEmpty: filteredData.length === 0 && !loading,
  };
}

