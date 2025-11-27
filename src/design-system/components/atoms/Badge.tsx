/**
 * Badge - Badge component for status indicators
 */

import React, { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme } from '@/theme/ThemeProvider';

export type BadgeVariant = 'positive' | 'negative' | 'neutral' | 'primary';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', size = 'sm' }) => {
  const { theme } = useTheme();

  const variantStyle = useMemo(() => {
    switch (variant) {
      case 'positive':
        return {
          backgroundColor: theme.colors.successLight,
          color: theme.colors.success,
        };
      case 'negative':
        return {
          backgroundColor: theme.colors.errorLight,
          color: theme.colors.error,
        };
      case 'primary':
        return {
          backgroundColor: theme.colors.primaryLight,
          color: theme.colors.textPrimary,
        };
      case 'neutral':
      default:
        return {
          backgroundColor: theme.colors.surfaceSecondary,
          color: theme.colors.textSecondary,
        };
    }
  }, [variant, theme.colors]);

  const containerStyle = useMemo((): ViewStyle => {
    return {
      backgroundColor: variantStyle.backgroundColor,
      borderRadius: theme.radii.full,
      paddingHorizontal: size === 'sm' ? theme.spacing.sm : theme.spacing.md,
      paddingVertical: size === 'sm' ? 2 : 4,
    };
  }, [variantStyle.backgroundColor, theme.radii.full, size, theme.spacing]);

  const textVariant = useMemo(() => (size === 'sm' ? 'xs' : 'sm'), [size]);

  return (
    <View style={containerStyle}>
      <Text
        variant={textVariant}
        weight="semibold"
        style={{ color: variantStyle.color }}>
        {label}
      </Text>
    </View>
  );
};
