/**
 * Color tokens extracted from design files
 * Primary color: #F4D35E (yellow)
 */

export const lightColors = {
  // Primary
  primary: '#F4D35E',
  primaryDark: '#D4B34E',
  primaryLight: '#F9E88F',

  // Backgrounds
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F5F5',

  // Text
  textPrimary: '#1C1C1E',
  textSecondary: '#636366',
  textTertiary: '#8E8E93',

  // Borders
  border: '#E5E5EA',
  borderLight: '#F0F0F0',

  // Status
  success: '#34C759',
  successLight: 'rgba(52, 199, 89, 0.1)', // ~10% opacity like bg-positive/10
  error: '#FF3B30',
  errorLight: 'rgba(255, 59, 48, 0.1)', // ~10% opacity like bg-negative/10
  warning: '#FF9500',
  info: '#007AFF',

  // Neutral grays (from indicators screen)
  neutral100: '#F5F5F5',
  neutral200: '#E5E5E5',
  neutral400: '#A3A3A3',
  neutral500: '#737373',
  neutral800: '#262626',
  neutral900: '#171717',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const darkColors = {
  // Primary (adjusted for better contrast in dark mode)
  primary: '#D4B34E', // Slightly darker yellow for better readability
  primaryDark: '#B89A3E',
  primaryLight: 'rgba(212, 179, 78, 0.2)', // More subtle background in dark mode

  // Backgrounds
  background: '#121212',
  surface: '#1E1E1E',
  surfaceSecondary: '#2C2C2C',

  // Text
  textPrimary: '#EAEAEA',
  textSecondary: '#A0A0A0',
  textTertiary: '#6E6E6E',

  // Borders
  border: '#38383A',
  borderLight: '#2C2C2C',

  // Status
  success: '#34C759',
  successLight: 'rgba(52, 199, 89, 0.15)', // Slightly more visible in dark mode
  error: '#FF3B30',
  errorLight: 'rgba(255, 59, 48, 0.15)', // Slightly more visible in dark mode
  warning: '#FF9500',
  info: '#0A84FF',

  // Neutral grays
  neutral100: '#2C2C2C',
  neutral200: '#38383A',
  neutral400: '#6E6E6E',
  neutral500: '#8E8E93',
  neutral800: '#D1D1D1',
  neutral900: '#EAEAEA',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export type Colors = typeof lightColors;
