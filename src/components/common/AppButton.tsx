/**
 * AppButton - Button component with theme support
 */

import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '@/theme/ThemeProvider';

interface AppButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  style?: ViewStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.radii.base,
      paddingVertical:
        size === 'sm' ? theme.spacing.sm : size === 'md' ? theme.spacing.md : theme.spacing.base,
      paddingHorizontal:
        size === 'sm' ? theme.spacing.base : size === 'md' ? theme.spacing.lg : theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
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
  };

  const getTextColor = (): 'primary' | 'textPrimary' | 'textSecondary' => {
    switch (variant) {
      case 'primary':
        return 'textPrimary';
      case 'secondary':
        return 'textPrimary';
      case 'outline':
        return 'textPrimary';
      case 'ghost':
        return 'textPrimary';
      default:
        return 'textPrimary';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[getButtonStyle(), isDisabled && { opacity: 0.5 }, style]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? theme.colors.textPrimary : theme.colors.primary}
        />
      ) : (
        <AppText weight={variant === 'primary' ? 'bold' : 'medium'} color={getTextColor()}>
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  );
};
