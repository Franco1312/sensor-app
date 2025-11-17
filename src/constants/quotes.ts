/**
 * Quotes constants - Configuration for quotes categories
 */

export const QUOTE_CATEGORIES = {
  DOLARES: 'dolares',
  ACCIONES: 'acciones',
  BONOS: 'bonos',
  CRIPTO: 'cripto',
} as const;

export type QuoteCategory = typeof QUOTE_CATEGORIES[keyof typeof QUOTE_CATEGORIES];

export const QUOTE_CATEGORY_TABS = [
  { label: 'Dólares', value: QUOTE_CATEGORIES.DOLARES },
  { label: 'Acciones', value: QUOTE_CATEGORIES.ACCIONES },
  { label: 'Bonos', value: QUOTE_CATEGORIES.BONOS },
  { label: 'Cripto', value: QUOTE_CATEGORIES.CRIPTO },
] as const;

export const DEFAULT_QUOTE_CATEGORY = QUOTE_CATEGORIES.DOLARES;

