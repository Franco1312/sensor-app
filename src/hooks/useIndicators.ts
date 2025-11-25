/**
 * Custom hook for fetching and aggregating all indicators data
 * Eliminates code duplication between HomeScreen and IndicatorsScreen
 */

import { useMemo } from 'react';
import { useSeriesData } from './useSeriesData';
import { SERIES_CODES } from '@/constants/series';
import { Indicator } from '@/types';

/**
 * Hook to fetch all available indicators from the API
 * @returns Array of Indicator objects
 */
export const useIndicators = (): Indicator[] => {
  const { data: baseMonetariaData } = useSeriesData(SERIES_CODES.BASE_MONETARIA);
  const { data: reservasData } = useSeriesData(SERIES_CODES.RESERVAS_INTERNACIONALES);
  const { data: circulanteData } = useSeriesData(SERIES_CODES.CIRCULANTE_PUBLICO);

  return useMemo(() => {
    const indicators: Indicator[] = [];
    if (baseMonetariaData) indicators.push(baseMonetariaData);
    if (reservasData) indicators.push(reservasData);
    if (circulanteData) indicators.push(circulanteData);
    return indicators;
  }, [baseMonetariaData, reservasData, circulanteData]);
};

