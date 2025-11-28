/**
 * Custom hook for fetching and aggregating all indicators data
 * Eliminates code duplication between HomeScreen and IndicatorsScreen
 */

import { useMemo, useCallback } from 'react';
import { useSeriesData } from './useSeriesData';
import { SERIES_CODES } from '@/constants/series';
import { Indicator } from '@/types';

interface UseIndicatorsResult {
  indicators: Indicator[];
  loading: boolean;
  refetch: () => void;
}

/**
 * Hook to fetch all available indicators from the API
 * @returns Object with indicators array, loading state, and refetch function
 */
export const useIndicators = (): UseIndicatorsResult => {
  const { data: baseMonetariaData, loading: loadingBase, refetch: refetchBase } = useSeriesData(SERIES_CODES.BASE_MONETARIA);
  const { data: reservasData, loading: loadingReservas, refetch: refetchReservas } = useSeriesData(SERIES_CODES.RESERVAS_INTERNACIONALES);
  const { data: circulanteData, loading: loadingCirculante, refetch: refetchCirculante } = useSeriesData(SERIES_CODES.CIRCULANTE_PUBLICO);
  const { data: ipcMensualData, loading: loadingIpcMensual, refetch: refetchIpcMensual } = useSeriesData(SERIES_CODES.IPC_VARIACION_MENSUAL);
  const { data: ipcInteranualData, loading: loadingIpcInteranual, refetch: refetchIpcInteranual } = useSeriesData(SERIES_CODES.IPC_VARIACION_INTERANUAL);
  const { data: emaeOriginalData, loading: loadingEmaeOriginal, refetch: refetchEmaeOriginal } = useSeriesData(SERIES_CODES.EMAE_ORIGINAL);
  const { data: emaeDesestacionalizadaData, loading: loadingEmaeDesestacionalizada, refetch: refetchEmaeDesestacionalizada } = useSeriesData(SERIES_CODES.EMAE_DESESTACIONALIZADA);
  const { data: emaeTendenciaCicloData, loading: loadingEmaeTendenciaCiclo, refetch: refetchEmaeTendenciaCiclo } = useSeriesData(SERIES_CODES.EMAE_TENDENCIA_CICLO);
  const { data: emaeVariacionInteranualData, loading: loadingEmaeVariacionInteranual, refetch: refetchEmaeVariacionInteranual } = useSeriesData(SERIES_CODES.EMAE_VARIACION_INTERANUAL);

  const indicators = useMemo(() => {
    const data: Indicator[] = [];
    if (baseMonetariaData) data.push(baseMonetariaData);
    if (reservasData) data.push(reservasData);
    if (circulanteData) data.push(circulanteData);
    if (ipcMensualData) data.push(ipcMensualData);
    if (ipcInteranualData) data.push(ipcInteranualData);
    if (emaeOriginalData) data.push(emaeOriginalData);
    if (emaeDesestacionalizadaData) data.push(emaeDesestacionalizadaData);
    if (emaeTendenciaCicloData) data.push(emaeTendenciaCicloData);
    if (emaeVariacionInteranualData) data.push(emaeVariacionInteranualData);
    return data;
  }, [baseMonetariaData, reservasData, circulanteData, ipcMensualData, ipcInteranualData, emaeOriginalData, emaeDesestacionalizadaData, emaeTendenciaCicloData, emaeVariacionInteranualData]);

  const loading = loadingBase || loadingReservas || loadingCirculante || loadingIpcMensual || loadingIpcInteranual || loadingEmaeOriginal || loadingEmaeDesestacionalizada || loadingEmaeTendenciaCiclo || loadingEmaeVariacionInteranual;

  const refetch = useCallback(() => {
    refetchBase();
    refetchReservas();
    refetchCirculante();
    refetchIpcMensual();
    refetchIpcInteranual();
    refetchEmaeOriginal();
    refetchEmaeDesestacionalizada();
    refetchEmaeTendenciaCiclo();
    refetchEmaeVariacionInteranual();
  }, [refetchBase, refetchReservas, refetchCirculante, refetchIpcMensual, refetchIpcInteranual, refetchEmaeOriginal, refetchEmaeDesestacionalizada, refetchEmaeTendenciaCiclo, refetchEmaeVariacionInteranual]);

  return { indicators, loading, refetch };
};

