/**
 * Typography system - Binance-inspired
 * Font: Inter (optimized for trading interface)
 * Clean, modern, data-dense typography
 */

export const typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    extrabold: 'Inter-ExtraBold',
    // Monospace for numbers/prices
    mono: 'Inter-Regular', // Can be changed to a monospace font if available
  },
  fontSize: {
    // Trading-focused sizes
    '2xs': 10, // Very small labels
    xs: 12, // Small labels, secondary info
    sm: 13, // Compact text
    base: 14, // Default body text
    md: 16, // Medium text
    lg: 18, // Large text
    xl: 20, // Extra large
    '2xl': 24, // Headings
    '3xl': 28, // Large headings
    '4xl': 32, // Display text
    '5xl': 40, // Hero text
    // Price-specific sizes
    priceXs: 12,
    priceSm: 14,
    priceBase: 16,
    priceLg: 18,
    priceXl: 20,
    price2xl: 24,
  },
  lineHeight: {
    tight: 1.2, // Headings
    normal: 1.4, // Body text (tighter for data-dense UI)
    relaxed: 1.6, // Paragraphs
    loose: 1.8, // Long form content
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
} as const;

export type Typography = typeof typography;
