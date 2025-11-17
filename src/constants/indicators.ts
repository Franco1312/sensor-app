/**
 * Indicators constants - Configuration for indicators filters
 */

export const INDICATOR_FREQUENCIES = ['Diaria', 'Semanal', 'Mensual'] as const;
export type IndicatorFrequency = typeof INDICATOR_FREQUENCIES[number];

export const INDICATOR_CATEGORIES = [
  { label: 'Todo', value: '' },
  { label: 'Precios', value: 'precios' },
  { label: 'Monetaria', value: 'monetaria' },
  { label: 'Actividad', value: 'actividad' },
  { label: 'Externo', value: 'externo' },
  { label: 'Finanzas', value: 'finanzas' },
] as const;

export const DEFAULT_FREQUENCY: IndicatorFrequency = 'Mensual';
export const DEFAULT_CATEGORY = 'Todo';

