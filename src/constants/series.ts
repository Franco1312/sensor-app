/**
 * Series codes constants - Mapping of indicator names to API series codes
 */

import { Indicator } from '@/types';

export const SERIES_CODES = {
  BASE_MONETARIA: 'BCRA_BASE_MONETARIA_TOTAL_ARS_BN_D',
  RESERVAS_INTERNACIONALES: 'BCRA_RESERVAS_USD_M_D',
  CIRCULANTE_PUBLICO: 'BCRA_CIRCULANTE_PUBLICO_ARS_BN_D',
  IPC_VARIACION_MENSUAL: 'INDEC_IPC_VARIACION_MENSUAL_PCT_M',
  IPC_VARIACION_INTERANUAL: 'INDEC_IPC_VARIACION_INTERANUAL_PCT_M',
  EMAE_ORIGINAL: 'INDEC_EMAE_ORIGINAL_IDX_M',
  EMAE_DESESTACIONALIZADA: 'INDEC_EMAE_DESESTACIONALIZADA_IDX_M',
  EMAE_TENDENCIA_CICLO: 'INDEC_EMAE_TENDENCIA_CICLO_IDX_M',
  EMAE_VARIACION_INTERANUAL: 'INDEC_EMAE_ORIGINAL_VARIACION_INTERANUAL_PCT_M',
  // Add more series codes here as we integrate them
} as const;

export type SeriesCode = typeof SERIES_CODES[keyof typeof SERIES_CODES];

/**
 * Mapping of series codes to indicator metadata
 */
export const SERIES_METADATA: Record<SeriesCode, { name: string; category: Indicator['category'] }> = {
  [SERIES_CODES.BASE_MONETARIA]: {
    name: 'Base Monetaria',
    category: 'monetaria',
  },
  [SERIES_CODES.RESERVAS_INTERNACIONALES]: {
    name: 'Reservas Internacionales',
    category: 'monetaria',
  },
  [SERIES_CODES.CIRCULANTE_PUBLICO]: {
    name: 'Billetes y monedas en manos del público',
    category: 'monetaria',
  },
  [SERIES_CODES.IPC_VARIACION_MENSUAL]: {
    name: 'IPC Mensual',
    category: 'precios',
  },
  [SERIES_CODES.IPC_VARIACION_INTERANUAL]: {
    name: 'IPC Interanual',
    category: 'precios',
  },
  [SERIES_CODES.EMAE_ORIGINAL]: {
    name: 'EMAE Original',
    category: 'actividad',
  },
  [SERIES_CODES.EMAE_DESESTACIONALIZADA]: {
    name: 'EMAE Desestacionalizada',
    category: 'actividad',
  },
  [SERIES_CODES.EMAE_TENDENCIA_CICLO]: {
    name: 'EMAE Tendencia-Ciclo',
    category: 'actividad',
  },
  [SERIES_CODES.EMAE_VARIACION_INTERANUAL]: {
    name: 'EMAE Variación Interanual',
    category: 'actividad',
  },
};

