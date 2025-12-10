/**
 * Analytics Module - Exportación centralizada
 * Punto de entrada único para toda la funcionalidad de analytics
 */

export * from './events';
export * from './analyticsClient';
export * from './hooks';

// Re-export analytics helper functions for convenience
export { analytics } from './analyticsClient';

