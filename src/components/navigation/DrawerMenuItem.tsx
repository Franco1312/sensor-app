/**
 * DrawerMenuItem - Reusable drawer menu item component
 */

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/design-system/components';
import { MenuIcon, ChevronIcon } from '@/design-system/components/atoms/icons';
import { useTheme } from '@/theme/ThemeProvider';

interface DrawerMenuItemProps {
  label: string;
  icon: 'home' | 'profile' | 'indicators' | 'quotes';
  isActive: boolean;
  isExpanded?: boolean;
  hasSubItems?: boolean;
  hasActiveSubItem?: boolean;
  onPress: () => void;
}

export const DrawerMenuItem: React.FC<DrawerMenuItemProps> = ({
  label,
  icon,
  isActive,
  isExpanded = false,
  hasSubItems = false,
  hasActiveSubItem = false,
  onPress,
}) => {
  const { theme } = useTheme();

  // Icon should be colored (yellow) when item or subitem is active
  // Background always stays gray - never yellow
  const isIconActive = isActive || hasActiveSubItem;
  const iconColor = isIconActive
    ? theme.colors.primary // Yellow icon when active
    : theme.colors.textPrimary; // Dark icon when inactive

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.base,
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.md,
        backgroundColor: 'transparent', // Items del drawer no se pintan
      }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: theme.radii.base,
          backgroundColor: theme.colors.surfaceSecondary, // Always gray background
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MenuIcon name={icon} size={20} color={iconColor} />
      </View>
      <Text
        variant="base"
        weight={isActive && !hasActiveSubItem ? 'semibold' : 'medium'}
        style={{
          flex: 1,
          color: theme.colors.textPrimary,
        }}> 
        {label}
      </Text>
      {hasSubItems && <ChevronIcon expanded={isExpanded} size={18} />}
    </TouchableOpacity>
  );
};

