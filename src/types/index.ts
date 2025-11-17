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
