/**
 * Card - Reusable card component with theme support
 */

import React, { ReactNode, useMemo } from 'react';
import { View, ViewProps, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';
export type CardPadding = 'none' | 'sm' | 'md' | 'base' | 'lg' | 'xl';

export interface CardProps extends ViewProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: CardVariant;
  padding?: CardPadding;
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

  const paddingValue = useMemo(() => {
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
  }, [padding, theme.spacing]);

  const cardStyle = useMemo((): ViewStyle => {
    return {
      backgroundColor: variant === 'flat' ? 'transparent' : theme.colors.surface,
      borderRadius: theme.radii.base,
      ...(variant !== 'flat' && {
        borderWidth: variant === 'outlined' ? 1 : variant === 'default' ? 1 : 0,
        borderColor: theme.colors.border,
      }),
      padding: paddingValue,
      ...(variant === 'elevated' && theme.shadows.base),
    };
  }, [variant, paddingValue, theme.colors.surface, theme.colors.border, theme.radii.base, theme.shadows.base]);

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
