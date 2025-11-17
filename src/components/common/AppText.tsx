/**
 * AppText - Typography component that uses theme
 */

import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface AppTextProps extends TextProps {
  variant?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: 'primary' | 'textPrimary' | 'textSecondary' | 'textTertiary' | 'success' | 'error';
  children: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'base',
  weight = 'normal',
  color = 'textPrimary',
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const fontSize = theme.typography.fontSize[variant as keyof typeof theme.typography.fontSize];
  const fontWeight =
    theme.typography.fontWeight[weight as keyof typeof theme.typography.fontWeight];
  const textColor = theme.colors[color as keyof typeof theme.colors];

  // Note: For custom fonts (Inter), you'll need to link them in native code
  // For now, using system fonts with fontWeight
  return (
    <Text
      style={[
        {
          fontSize,
          fontWeight,
          color: textColor,
        },
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
};
