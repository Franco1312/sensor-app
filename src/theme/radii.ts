/**
 * Border radius tokens
 */

export const radii = {
  none: 0,
  sm: 4, // 0.25rem
  base: 8, // 0.5rem (DEFAULT in design)
  md: 12, // 0.75rem (lg in design)
  lg: 12, // 0.75rem
  xl: 16, // 1rem (xl in design)
  '2xl': 24,
  full: 9999, // full in design
} as const;

export type Radii = typeof radii;
