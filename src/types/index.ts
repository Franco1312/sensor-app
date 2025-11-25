/**
 * Shared types
 */

export interface Indicator {
  id: string;
  name: string;
  value: string;
  change: number;
  changePercent: number;
  lastUpdate: string;
  category: 'precios' | 'monetaria' | 'actividad' | 'externo' | 'finanzas';
  trend: 'up' | 'down' | 'neutral';
}

export interface Quote {
  id: string;
  name: string;
  buyPrice?: string;
  sellPrice: string;
  change: number;
  changePercent: number;
  lastUpdate: string;
  category: 'dolares' | 'acciones' | 'bonos' | 'cripto';
}

export interface IndicatorDetail extends Indicator {
  description?: string;
  methodology?: string;
  source?: string;
  historicalData?: number[];
}

/**
 * API Types - Series data from projections-consumer-api
 */
export interface SeriesData {
  id: number;
  obs_time: string;
  internal_series_code: string;
  value: string;
  unit: string;
  frequency: string;
  collection_date: string;
  created_at: string;
  updated_at: string;
}

export interface SeriesApiResponse {
  success: boolean;
  data: SeriesData;
}

export interface SeriesHistoryApiResponse {
  success: boolean;
  data: SeriesData[];
  count: number;
}

export interface SeriesMetadata {
  internal_series_code: string;
  description: string;
  methodology: string;
  source: string;
}

export interface SeriesMetadataApiResponse {
  success: boolean;
  data: SeriesMetadata;
}
