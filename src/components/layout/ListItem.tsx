/**
 * ListItem - Reusable list item component
 */

import React, { ReactNode } from 'react';
import { View, TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/design-system/components/atoms/Text';

interface ListItemProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  subtitle?: string;
  leftIcon?: ReactNode;
  rightContent?: ReactNode;
  onPress?: () => void;
  style?: object;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightContent,
  onPress,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const content = (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.base,
          paddingHorizontal: theme.spacing.base,
          paddingVertical: theme.spacing.md,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.base, // Unified with Card component
          // Unified subtle border for depth in both modes
          borderWidth: theme.isDark ? StyleSheet.hairlineWidth : StyleSheet.hairlineWidth,
          borderColor: theme.isDark 
            ? (theme.colors.borderSubtle || 'rgba(255, 255, 255, 0.03)')
            : theme.colors.borderLight,
          minHeight: 64,
        },
        style,
      ]}>
      {leftIcon && (
        <View style={{ flexShrink: 0 }}>{leftIcon}</View>
      )}

      <View style={{ flex: 1, flexGrow: 1, gap: 4 }}>
        <Text variant="base" weight="medium" numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="sm" color="textSecondary" weight="normal" numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>

      {rightContent && <View style={{ flexShrink: 0, maxWidth: '50%' }}>{rightContent}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.6} {...props}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};
