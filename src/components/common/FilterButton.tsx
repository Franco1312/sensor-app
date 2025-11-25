/**
 * FilterButton - Reusable button component for filters (time range, category, frequency)
 */

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '@/theme/ThemeProvider';

interface FilterButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  fullWidth?: boolean;
  variant?: 'default' | 'transparent';
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  isSelected,
  onPress,
  fullWidth = false,
  variant = 'default',
}) => {
  const { theme } = useTheme();

  const backgroundColor = isSelected
    ? theme.colors.primary
    : variant === 'transparent'
    ? 'transparent'
    : theme.colors.surfaceSecondary;

  const borderRadius = variant === 'transparent' ? theme.radii.base : theme.radii.full;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          flex: fullWidth ? 1 : undefined,
          paddingHorizontal: theme.spacing.base,
          paddingVertical: theme.spacing.sm,
          borderRadius,
          backgroundColor,
          minHeight: 32,
          alignSelf: fullWidth ? undefined : 'flex-start',
        },
      ]}>
      <AppText
        variant="sm"
        weight={isSelected ? 'medium' : 'normal'}
        color={isSelected ? 'textPrimary' : 'textSecondary'}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

