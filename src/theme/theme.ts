/**
 * Theme definition combining all design tokens
 */

import { lightColors, darkColors, Colors } from './colors';
import { spacing, Spacing } from './spacing';
import { typography, Typography } from './typography';
import { radii, Radii } from './radii';
import { shadows, Shadows } from './shadows';

export interface Theme {
  colors: Colors;
  spacing: Spacing;
  typography: Typography;
  radii: Radii;
  shadows: Shadows;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  typography,
  radii,
  shadows,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  typography,
  radii,
  shadows,
  isDark: true,
};
