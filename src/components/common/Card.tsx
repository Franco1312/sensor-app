/**
 * Card - Reusable card component with theme support
 */

import React, { ReactNode } from 'react';
import { View, ViewProps, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface CardProps extends ViewProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  variant = 'default',
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const cardStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.xl, // rounded-xl = 1rem = 16px
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.base, // p-4 = 16px
    ...(variant === 'elevated' && {
      shadowColor: theme.colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
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
