/**
 * useDetailScreen - Hook for common detail screen logic
 * Handles loading/error states, data transformation, and time range management
 */

import { useState, useMemo } from 'react';

export interface UseDetailScreenOptions<TData, TChartData> {
  data: TData | undefined;
  loading: boolean;
  error: string | null;
  transformData?: (data: TData) => TChartData | undefined;
  defaultTimeRange?: string;
}

export interface UseDetailScreenResult<TChartData> {
  chartData: TChartData | undefined;
  timeRange: string;
  setTimeRange: (range: string) => void;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export function useDetailScreen<TData, TChartData>({
  data,
  loading,
  error,
  transformData,
  defaultTimeRange = '1A',
}: UseDetailScreenOptions<TData, TChartData>): UseDetailScreenResult<TChartData> {
  const [timeRange, setTimeRange] = useState<string>(defaultTimeRange);

  const chartData = useMemo(() => {
    if (!data || !transformData) return undefined;
    try {
      return transformData(data);
    } catch {
      return undefined;
    }
  }, [data, transformData]);

  return {
    chartData,
    timeRange,
    setTimeRange,
    isLoading: loading,
    hasError: !!error,
    errorMessage: error,
  };
}

