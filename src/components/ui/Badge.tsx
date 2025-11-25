/**
 * Badge - Badge component for status indicators
 */

import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { useTheme } from '@/theme/ThemeProvider';

interface BadgeProps {
  label: string;
  variant?: 'positive' | 'negative' | 'neutral' | 'primary';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', size = 'sm' }) => {
  const { theme } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'positive':
        return {
          backgroundColor: theme.colors.successLight, // Using successLight which has opacity
          color: theme.colors.success,
        };
      case 'negative':
        return {
          backgroundColor: theme.colors.errorLight, // Using errorLight which has opacity
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
  };

  const variantStyle = getVariantStyle();

  return (
    <View
      style={[
        {
          backgroundColor: variantStyle.backgroundColor,
          borderRadius: theme.radii.full,
          paddingHorizontal: size === 'sm' ? theme.spacing.sm : theme.spacing.md,
          paddingVertical: size === 'sm' ? 2 : 4,
        },
      ]}>
      <Text
        variant={size === 'sm' ? 'xs' : 'sm'}
        weight="semibold"
        style={{ color: variantStyle.color }}>
        {label}
      </Text>
    </View>
  );
};
