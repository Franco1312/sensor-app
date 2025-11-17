/**
 * Tag - Badge/Tag component for status indicators
 */

import React from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '@/theme/ThemeProvider';

interface TagProps {
  label: string;
  variant?: 'positive' | 'negative' | 'neutral' | 'primary';
  size?: 'sm' | 'md';
}

export const Tag: React.FC<TagProps> = ({ label, variant = 'neutral', size = 'sm' }) => {
  const { theme } = useTheme();

  const getVariantStyle = () => {
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
      <AppText
        variant={size === 'sm' ? 'xs' : 'sm'}
        weight="semibold"
        style={{ color: variantStyle.color }}>
        {label}
      </AppText>
    </View>
  );
};
