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
  // USD Quotes - Compra
  USD_OFICIAL_COMPRA: 'USD_OFICIAL_COMPRA_PESOSxUSD_D',
  USD_MAYORISTA_COMPRA: 'USD_MAYORISTA_COMPRA_PESOSxUSD_D',
  USD_TARJETA_COMPRA: 'USD_TARJETA_COMPRA_PESOSxUSD_D',
  USD_BOLSA_COMPRA: 'USD_BOLSA_COMPRA_PESOSxUSD_D',
  USD_CONTADOCONLIQUI_COMPRA: 'USD_CONTADOCONLIQUI_COMPRA_PESOSxUSD_D',
  USD_BLUE_COMPRA: 'USD_BLUE_COMPRA_PESOSxUSD_D',
  USD_CRIPTO_COMPRA: 'USD_CRIPTO_COMPRA_PESOSxUSD_D',
  // USD Quotes - Venta
  USD_OFICIAL_VENTA: 'USD_OFICIAL_VENTA_PESOSxUSD_D',
  USD_MAYORISTA_VENTA: 'USD_MAYORISTA_VENTA_PESOSxUSD_D',
  USD_TARJETA_VENTA: 'USD_TARJETA_VENTA_PESOSxUSD_D',
  USD_BOLSA_VENTA: 'USD_BOLSA_VENTA_PESOSxUSD_D',
  USD_CONTADOCONLIQUI_VENTA: 'USD_CONTADOCONLIQUI_VENTA_PESOSxUSD_D',
  USD_BLUE_VENTA: 'USD_BLUE_VENTA_PESOSxUSD_D',
  USD_CRIPTO_VENTA: 'USD_CRIPTO_VENTA_PESOSxUSD_D',
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
  // USD Quotes - Compra
  [SERIES_CODES.USD_OFICIAL_COMPRA]: {
    name: 'Dólar Oficial (Compra)',
    category: 'externo',
  },
  [SERIES_CODES.USD_MAYORISTA_COMPRA]: {
    name: 'Dólar Mayorista (Compra)',
    category: 'externo',
  },
  [SERIES_CODES.USD_TARJETA_COMPRA]: {
    name: 'Dólar Tarjeta (Compra)',
    category: 'externo',
  },
  [SERIES_CODES.USD_BOLSA_COMPRA]: {
    name: 'Dólar Bolsa (MEP) Compra',
    category: 'externo',
  },
  [SERIES_CODES.USD_CONTADOCONLIQUI_COMPRA]: {
    name: 'Dólar Contado con Liquidación (CCL) Compra',
    category: 'externo',
  },
  [SERIES_CODES.USD_BLUE_COMPRA]: {
    name: 'Dólar Blue (Compra)',
    category: 'externo',
  },
  [SERIES_CODES.USD_CRIPTO_COMPRA]: {
    name: 'Dólar Cripto (Compra)',
    category: 'externo',
  },
  // USD Quotes - Venta
  [SERIES_CODES.USD_OFICIAL_VENTA]: {
    name: 'Dólar Oficial (Venta)',
    category: 'externo',
  },
  [SERIES_CODES.USD_MAYORISTA_VENTA]: {
    name: 'Dólar Mayorista (Venta)',
    category: 'externo',
  },
  [SERIES_CODES.USD_TARJETA_VENTA]: {
    name: 'Dólar Tarjeta (Venta)',
    category: 'externo',
  },
  [SERIES_CODES.USD_BOLSA_VENTA]: {
    name: 'Dólar Bolsa (MEP) Venta',
    category: 'externo',
  },
  [SERIES_CODES.USD_CONTADOCONLIQUI_VENTA]: {
    name: 'Dólar Contado con Liquidación (CCL) Venta',
    category: 'externo',
  },
  [SERIES_CODES.USD_BLUE_VENTA]: {
    name: 'Dólar Blue (Venta)',
    category: 'externo',
  },
  [SERIES_CODES.USD_CRIPTO_VENTA]: {
    name: 'Dólar Cripto (Venta)',
    category: 'externo',
  },
};

