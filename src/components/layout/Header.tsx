/**
 * Header - Reusable header component
 */

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { AppText } from '../common/AppText';

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

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: theme.spacing.base,
          paddingVertical: theme.spacing.md,
          backgroundColor: theme.colors.background,
          ...(showBorder && {
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          }),
        },
      ]}>
      <View style={{ width: 48, alignItems: 'flex-start' }}>
        {leftIcon && onLeftPress && (
          <TouchableOpacity onPress={onLeftPress} activeOpacity={0.7}>
            {leftIcon}
          </TouchableOpacity>
        )}
      </View>

      <View style={{ flex: 1, alignItems: 'center' }}>
        <AppText variant="lg" weight="bold">
          {title}
        </AppText>
      </View>

      <View style={{ width: 48, alignItems: 'flex-end' }}>
        {rightIcon && onRightPress && (
          <TouchableOpacity onPress={onRightPress} activeOpacity={0.7}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
