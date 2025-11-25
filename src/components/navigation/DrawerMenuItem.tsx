/**
 * DrawerMenuItem - Reusable drawer menu item component
 */

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui';
import { MenuIcon } from '@/components/common/MenuIcon';
import { ChevronIcon } from '@/components/common/ChevronIcon';
import { useTheme } from '@/theme/ThemeProvider';

interface DrawerMenuItemProps {
  label: string;
  icon: 'profile' | 'indicators' | 'quotes';
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

  // Icon background should be colored only if the item itself is active (not just subitem)
  const shouldColorIconBackground = isActive && !hasActiveSubItem;
  const iconColor = shouldColorIconBackground
    ? theme.colors.textPrimary // Dark icon on yellow background for contrast
    : (isActive || hasActiveSubItem)
      ? theme.colors.primary // Primary color when active but no yellow background
      : theme.colors.textPrimary; // Default text color when inactive

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
          backgroundColor: shouldColorIconBackground ? theme.colors.primary : theme.colors.surfaceSecondary,
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

