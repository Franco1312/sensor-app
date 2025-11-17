/**
 * Theme Provider with context for light/dark mode
 * Uses useColorScheme by default, allows manual override
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, lightTheme, darkTheme } from './theme';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setThemeMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: 'light' | 'dark' | 'auto';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = 'auto',
}) => {
  const systemColorScheme = useColorScheme();
  const [manualTheme, setManualTheme] = useState<'light' | 'dark' | 'auto'>(initialTheme);

  // Determine current theme based on manual override or system preference
  const isDarkMode = manualTheme === 'auto' ? systemColorScheme === 'dark' : manualTheme === 'dark';

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setManualTheme(prev => {
      if (prev === 'auto') {
        return systemColorScheme === 'dark' ? 'light' : 'dark';
      }
      return prev === 'light' ? 'dark' : 'light';
    });
  };

  const setThemeMode = (isDark: boolean) => {
    setManualTheme(isDark ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        toggleTheme,
        setThemeMode,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access theme
 * @returns {ThemeContextType} Theme context with theme object and utilities
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
