/**
 * Button - Button component with theme support
 */

import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { useTheme } from '@/theme/ThemeProvider';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const buttonStyle = useMemo((): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.radii.md, // Slightly more rounded
      paddingVertical:
        size === 'sm' ? theme.spacing.sm : size === 'md' ? theme.spacing.md : theme.spacing.base,
      paddingHorizontal:
        size === 'sm' ? theme.spacing.base : size === 'md' ? theme.spacing.lg : theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: size === 'sm' ? 32 : size === 'md' ? 40 : 48,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.surfaceSecondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  }, [variant, size, theme.radii.md, theme.spacing, theme.colors]);

  const textColor = useMemo((): 'primary' | 'textPrimary' | 'textSecondary' | 'textInverse' => {
    if (variant === 'primary') {
      return 'textInverse'; // White text on primary
    }
    return 'textPrimary';
  }, [variant]);

  const textWeight = useMemo(() => {
    return variant === 'primary' ? 'semibold' : 'medium';
  }, [variant]);

  const indicatorColor = useMemo(() => {
    return variant === 'primary' ? theme.colors.textInverse : theme.colors.primary;
  }, [variant, theme.colors]);

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[buttonStyle, isDisabled && { opacity: 0.5 }, style]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}>
      {loading ? (
        <ActivityIndicator size="small" color={indicatorColor} />
      ) : (
        <Text weight={textWeight} color={textColor}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
