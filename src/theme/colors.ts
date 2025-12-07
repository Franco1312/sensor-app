/**
 * Color tokens - Binance-inspired design system
 * Primary color: #F0B90B (Binance yellow/gold)
 * Dark theme optimized for trading interface
 */

export const lightColors = {
  // Primary - Binance yellow/gold
  primary: '#F0B90B',
  primaryDark: '#D4A008',
  primaryLight: '#F5D047',
  primaryHover: '#F8D96A',
  primaryPressed: '#E5A807',

  // Backgrounds - Light mode (less used, but kept for consistency)
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F5F7',
  surfaceElevated: '#FFFFFF',
  surfaceHover: '#F8F9FA',

  // Text
  textPrimary: '#181A20',
  textSecondary: '#5E6673',
  textTertiary: '#848E9C',
  textDisabled: '#B7BDC6',
  textInverse: '#FFFFFF',

  // Borders
  border: '#E6E8EA',
  borderLight: '#F0F2F5',
  borderDark: '#D1D3D6',
  divider: '#E6E8EA',

  // Status - Trading colors
  success: '#0ECB81', // Binance green
  successLight: 'rgba(14, 203, 129, 0.1)',
  successDark: '#0AB270',
  error: '#F6465D', // Binance red
  errorLight: 'rgba(246, 70, 93, 0.1)',
  errorDark: '#E03E52',
  warning: '#F0B90B',
  warningLight: 'rgba(240, 185, 11, 0.1)',
  info: '#1890FF',
  infoLight: 'rgba(24, 144, 255, 0.1)',

  // Market colors
  priceUp: '#0ECB81',
  priceDown: '#F6465D',
  priceNeutral: '#848E9C',

  // Neutral grays
  neutral50: '#FAFAFA',
  neutral100: '#F5F5F7',
  neutral200: '#E6E8EA',
  neutral300: '#D1D3D6',
  neutral400: '#B7BDC6',
  neutral500: '#848E9C',
  neutral600: '#5E6673',
  neutral700: '#474D57',
  neutral800: '#2B3139',
  neutral900: '#181A20',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

export const darkColors = {
  // Primary - Binance yellow/gold (optimized for dark)
  primary: '#F0B90B',
  primaryDark: '#D4A008',
  primaryLight: '#F5D047',
  primaryHover: '#F8D96A',
  primaryPressed: '#E5A807',

  // Backgrounds - Binance dark theme
  background: '#0B0E11', // Deep dark base
  backgroundSecondary: '#131722', // Slightly lighter
  surface: '#1E2329', // Card/surface color
  surfaceSecondary: '#2B3139', // Elevated surface
  surfaceElevated: '#3A3F47', // Highest elevation
  surfaceHover: '#2B3139', // Hover state

  // Text
  textPrimary: '#EAECEF', // Primary text
  textSecondary: '#848E9C', // Secondary text
  textTertiary: '#5E6673', // Tertiary text
  textDisabled: '#474D57', // Disabled text
  textInverse: '#0B0E11', // Text on primary

  // Borders
  border: '#2B3139', // Default border
  borderLight: '#1E2329', // Subtle border
  borderDark: '#3A3F47', // Strong border
  divider: '#2B3139', // Divider lines

  // Status - Trading colors (optimized for dark)
  success: '#0ECB81', // Binance green
  successLight: 'rgba(14, 203, 129, 0.15)',
  successDark: '#0AB270',
  error: '#F6465D', // Binance red
  errorLight: 'rgba(246, 70, 93, 0.15)',
  errorDark: '#E03E52',
  warning: '#F0B90B',
  warningLight: 'rgba(240, 185, 11, 0.15)',
  info: '#1890FF',
  infoLight: 'rgba(24, 144, 255, 0.15)',

  // Market colors
  priceUp: '#0ECB81',
  priceDown: '#F6465D',
  priceNeutral: '#848E9C',

  // Neutral grays (dark mode optimized)
  neutral50: '#1E2329',
  neutral100: '#2B3139',
  neutral200: '#3A3F47',
  neutral300: '#474D57',
  neutral400: '#5E6673',
  neutral500: '#848E9C',
  neutral600: '#B7BDC6',
  neutral700: '#D1D3D6',
  neutral800: '#EAECEF',
  neutral900: '#FFFFFF',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayDark: 'rgba(0, 0, 0, 0.85)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
};

export type Colors = typeof lightColors;
