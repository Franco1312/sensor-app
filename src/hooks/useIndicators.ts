/**
 * Custom hook for fetching and aggregating all indicators data
 * Eliminates code duplication between HomeScreen and IndicatorsScreen
 */

import { useMemo } from 'react';
import { useSeriesData } from './useSeriesData';
import { SERIES_CODES } from '@/constants/series';
import { Indicator } from '@/types';

interface UseIndicatorsResult {
  indicators: Indicator[];
  loading: boolean;
}

/**
 * Hook to fetch all available indicators from the API
 * @returns Object with indicators array and loading state
 */
export const useIndicators = (): UseIndicatorsResult => {
  const { data: baseMonetariaData, loading: loadingBase } = useSeriesData(SERIES_CODES.BASE_MONETARIA);
  const { data: reservasData, loading: loadingReservas } = useSeriesData(SERIES_CODES.RESERVAS_INTERNACIONALES);
  const { data: circulanteData, loading: loadingCirculante } = useSeriesData(SERIES_CODES.CIRCULANTE_PUBLICO);

  const indicators = useMemo(() => {
    const data: Indicator[] = [];
    if (baseMonetariaData) data.push(baseMonetariaData);
    if (reservasData) data.push(reservasData);
    if (circulanteData) data.push(circulanteData);
    return data;
  }, [baseMonetariaData, reservasData, circulanteData]);

  const loading = loadingBase || loadingReservas || loadingCirculante;

  return { indicators, loading };
};

