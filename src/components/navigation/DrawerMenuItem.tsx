/**
 * DrawerMenuItem - Reusable drawer menu item component
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AppText } from '@/components/common/AppText';
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

  // If there's an active subitem, the main item should be less highlighted
  const shouldHighlight = isActive && !hasActiveSubItem;
  const shouldColorIcon = isActive || hasActiveSubItem; // Icon should be colored if item or subitem is active
  const backgroundColor = shouldHighlight
    ? theme.colors.primaryLight
    : hasActiveSubItem
      ? theme.colors.surfaceSecondary
      : 'transparent';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.base,
          paddingHorizontal: theme.spacing.base,
          paddingVertical: theme.spacing.md,
          backgroundColor,
          borderLeftWidth: shouldHighlight ? 3 : 0,
          borderLeftColor: shouldHighlight ? theme.colors.primary : 'transparent',
        },
      ]}>
      <View
        style={[
          styles.iconContainer,
          {
            width: 40,
            height: 40,
            borderRadius: theme.radii.base,
            backgroundColor: shouldHighlight ? theme.colors.primary : theme.colors.surfaceSecondary,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}>
        <MenuIcon name={icon} size={20} color={shouldColorIcon ? theme.colors.primary : theme.colors.textPrimary} />
      </View>
      <AppText
        variant="base"
        weight={shouldHighlight ? 'semibold' : 'medium'}
        style={{
          flex: 1,
          color: theme.colors.textPrimary,
        }}> 
        {label}
      </AppText>
      {hasSubItems && <ChevronIcon expanded={isExpanded} size={18} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles handled by inline style
  },
  iconContainer: {
    // Styles handled by inline style
  },
});

