/**
 * Application labels and text constants
 * Centralized labels for consistent text across the app
 */

export const LABELS = {
  // Common labels
  UPDATED: 'Actualizado',
  LAST_VALUE: 'Último Valor',
  MONTHLY_VARIATION: 'Variación Mensual',
  LAST_UPDATE: 'Última Actualización',
  LAST_YEAR: 'Último Año',
  HISTORICAL_EVOLUTION: 'Evolución Histórica',
  
  // Sections
  MAIN_INDICATORS: 'Indicadores Principales',
  MARKET_QUOTES: 'Cotizaciones de Mercado',
  ECONOMIC_INDICATORS: 'Indicadores Económicos',
  
  // Info sections
  DESCRIPTION: 'Descripción',
  METHODOLOGY: 'Metodología y Notas',
  SOURCE: 'Fuente',
  
  // Chart labels
  CHART_MONTHS: ['Ene', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
  
  // Time ranges
  TIME_RANGE_1M: '1M',
  TIME_RANGE_3M: '3M',
  TIME_RANGE_1A: '1A',
  
  // Quotes
  SELL: 'Venta',
  
  // Settings
  APPEARANCE: 'Apariencia',
  DARK_MODE: 'Modo Oscuro',
  ABOUT: 'Acerca de',
  VERSION: 'Versión',
  
  // Errors and states
  INDICATOR_NOT_FOUND: 'Indicador no encontrado',
  NO_DESCRIPTION: 'Sin descripción disponible',
  UNDERSTOOD: 'Entendido',
  DATA_INFO_TITLE: 'Información sobre los datos',
} as const;

/**
 * Helper function to format "Actualizado: {date}" label
 */
export const formatUpdatedLabel = (date: string): string => {
  return `${LABELS.UPDATED}: ${date}`;
};

