/**
 * DrawerSubItem - Reusable drawer sub-item component
 */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui';
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
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.sm,
        paddingLeft: theme.spacing.xl + theme.spacing.base,
        marginLeft: theme.spacing.base,
        backgroundColor: isActive ? theme.colors.primaryLight : 'transparent',
        borderLeftWidth: isActive ? 3 : 0,
        borderLeftColor: isActive ? theme.colors.primary : 'transparent',
      }}>
      <Text
        variant="sm"
        weight={isActive ? 'semibold' : 'medium'}
        style={{
          color: isActive ? theme.colors.textPrimary : theme.colors.textSecondary,
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

