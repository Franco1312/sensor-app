/**
 * Formatting utilities for indicators, quotes, and trends
 */

import { Theme } from '@/theme/theme';

/**
 * Formats change percentage with sign
 * @param changePercent - Percentage value (can be positive or negative)
 * @param isPositive - Whether the change is positive
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string (e.g., "+5.2%" or "-3.1%")
 */
export const formatChangePercent = (
  changePercent: number,
  isPositive: boolean,
  decimals: number = 1
): string => {
  return `${isPositive ? '+' : ''}${changePercent.toFixed(decimals)}%`;
};

/**
 * Gets the color for a trend indicator
 * @param trend - Trend direction ('up', 'down', or 'neutral')
 * @param theme - Theme object with colors
 * @returns Color string from theme
 */
export const getTrendColor = (
  trend: 'up' | 'down' | 'neutral',
  theme: Theme
): string => {
  switch (trend) {
    case 'up':
      return theme.colors.success;
    case 'down':
      return theme.colors.error;
    default:
      return theme.colors.textSecondary;
  }
};

/**
 * Gets the arrow symbol for a trend indicator
 * @param trend - Trend direction ('up', 'down', or 'neutral')
 * @returns Arrow symbol string
 */
export const getTrendArrow = (trend: 'up' | 'down' | 'neutral'): string => {
  switch (trend) {
    case 'up':
      return '↑';
    case 'down':
      return '↓';
    default:
      return '−';
  }
};

/**
 * Formats a change value with sign
 * @param changePercent - Percentage value
 * @returns Formatted string (e.g., "+5.2%" or "-3.1%")
 */
export const formatChangeValue = (changePercent: number): string => {
  return changePercent >= 0
    ? `+${changePercent.toFixed(1)}%`
    : `${changePercent.toFixed(1)}%`;
};

