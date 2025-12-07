/**
 * Card - Reusable card component with theme support
 */

import React, { ReactNode } from 'react';
import { View, ViewProps, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface CardProps extends ViewProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'base' | 'lg' | 'xl';
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  variant = 'default',
  padding = 'base',
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return theme.spacing.sm;
      case 'md':
        return theme.spacing.md;
      case 'base':
        return theme.spacing.base;
      case 'lg':
        return theme.spacing.lg;
      case 'xl':
        return theme.spacing.xl;
      default:
        return theme.spacing.base;
    }
  };

  const cardStyle = {
    backgroundColor: variant === 'flat' ? 'transparent' : theme.colors.surface,
    borderRadius: theme.radii.md, // More rounded corners
    ...(variant !== 'flat' && {
      borderWidth: variant === 'outlined' ? 1 : variant === 'default' ? 0 : 0, // No default border
      borderColor: theme.colors.border,
    }),
    padding: getPadding(),
    ...(variant === 'elevated' && (theme.isDark ? theme.shadows.dark.base : theme.shadows.base)),
    // Subtle background difference for elevated cards
    ...(variant === 'elevated' && {
      backgroundColor: theme.colors.surfaceElevated,
    }),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[cardStyle, style]}
        onPress={onPress}
        activeOpacity={0.7}
        {...(props as TouchableOpacityProps)}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
};
