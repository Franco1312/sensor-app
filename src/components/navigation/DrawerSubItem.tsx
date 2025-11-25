/**
 * DrawerSubItem - Reusable drawer sub-item component
 */

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { AppText } from '@/components/common/AppText';
import { useTheme } from '@/theme/ThemeProvider';

interface DrawerSubItemProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export const DrawerSubItem: React.FC<DrawerSubItemProps> = ({ label, isActive, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: theme.spacing.base,
          paddingVertical: theme.spacing.sm,
          paddingLeft: theme.spacing.xl + theme.spacing.base,
          marginLeft: theme.spacing.base,
          backgroundColor: isActive ? theme.colors.primaryLight : 'transparent',
          borderLeftWidth: isActive ? 3 : 0,
          borderLeftColor: isActive ? theme.colors.primary : 'transparent',
        },
      ]}>
      <AppText
        variant="sm"
        weight={isActive ? 'semibold' : 'medium'}
        style={{
          color: isActive ? theme.colors.textPrimary : theme.colors.textSecondary,
        }}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles handled by inline style
  },
});

