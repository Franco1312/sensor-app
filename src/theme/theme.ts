/**
 * Theme definition combining all design tokens
 */

import { lightColors, darkColors, Colors } from './colors';
import { spacing, Spacing } from './spacing';
import { typography, Typography } from './typography';
import { radii, Radii } from './radii';

export interface Theme {
  colors: Colors;
  spacing: Spacing;
  typography: Typography;
  radii: Radii;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  typography,
  radii,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  typography,
  radii,
  isDark: true,
};
