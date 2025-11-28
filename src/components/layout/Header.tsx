/**
 * Header - Reusable header component
 */

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { useDrawerContext } from '@/context/DrawerContext';
import { Text } from '@/design-system/components/atoms/Text';
import { HamburgerIcon } from '@/design-system/components/atoms/icons';

interface HeaderProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  showBorder?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  showBorder = true,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { openDrawer } = useDrawerContext();

  const handleDrawerOpen = () => {
    openDrawer();
  };

  const defaultLeftIcon = leftIcon === undefined ? <HamburgerIcon /> : leftIcon;
  const defaultOnLeftPress = onLeftPress === undefined ? handleDrawerOpen : onLeftPress;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: theme.spacing.base,
          paddingTop: Math.max(insets.top, theme.spacing.md),
          paddingBottom: theme.spacing.md,
          backgroundColor: theme.colors.background,
          ...(showBorder && {
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          }),
        },
      ]}>
      <View style={{ width: 48, alignItems: 'flex-start', justifyContent: 'center' }}>
        {defaultLeftIcon && (
          <TouchableOpacity
            onPress={defaultOnLeftPress}
            activeOpacity={0.7}
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            {defaultLeftIcon}
          </TouchableOpacity>
        )}
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: theme.spacing.sm, minWidth: 0 }}>
        <Text variant="lg" weight="bold" numberOfLines={1} ellipsizeMode="tail" style={{ textAlign: 'center' }}>
          {title}
        </Text>
      </View>

      <View style={{ width: 48, alignItems: 'flex-end', justifyContent: 'center' }}>
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightPress}
            activeOpacity={0.7}
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
