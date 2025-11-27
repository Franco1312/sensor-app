/**
 * Hook and utility to get price color based on direction
 */

import { useTheme } from '@/theme/ThemeProvider';
import { PriceDirection } from '@/types';
import { Theme } from '@/theme/theme';

/**
 * Pure function to get price color based on direction and theme
 * Can be used inside useMemo, callbacks, etc.
 */
export const getPriceColor = (direction: PriceDirection | undefined, theme: Theme): string => {
  if (direction === 'up') return theme.colors.success;
  if (direction === 'down') return theme.colors.error;
  return theme.colors.textPrimary;
};

/**
 * Hook to get price color based on direction
 * Uses theme from context
 */
export const usePriceColor = (direction: PriceDirection | undefined): string => {
  const { theme } = useTheme();
  return getPriceColor(direction, theme);
};

