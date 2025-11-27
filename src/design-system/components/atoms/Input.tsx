/**
 * Input - Reusable input component with icon support
 */

import React, { useMemo } from 'react';
import { View, TextInput, TextInputProps, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from './Text';
import { InputIcon } from './icons';
import { useTheme } from '@/theme/ThemeProvider';

export type InputIconType = 'person' | 'lock';
export type InputRightIconType = 'visibility' | 'visibility_off';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  leftIcon?: InputIconType;
  rightIcon?: InputRightIconType;
  onRightIconPress?: () => void;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  leftIcon,
  rightIcon,
  onRightIconPress,
  error,
  containerStyle,
  inputStyle,
  ...textInputProps
}) => {
  const { theme } = useTheme();

  const inputContainerStyle = useMemo((): TextStyle => {
    return {
      backgroundColor: theme.colors.background,
      borderColor: error ? theme.colors.error : theme.colors.border,
      color: theme.colors.textPrimary,
      paddingLeft: leftIcon ? 40 : theme.spacing.base,
      paddingRight: rightIcon ? 40 : theme.spacing.base,
    };
  }, [theme.colors, error, leftIcon, rightIcon, theme.spacing.base]);

  return (
    <View style={[containerStyle]}>
      {label && (
        <Text
          variant="sm"
          weight="medium"
          style={{ marginBottom: theme.spacing.xs, color: theme.colors.textPrimary }}>
          {label}
        </Text>
      )}
      <View style={styles.inputWrapper}>
        {leftIcon && (
          <View style={styles.iconLeft}>
            <InputIcon name={leftIcon} size={20} />
          </View>
        )}
        <TextInput
          style={[styles.input, inputContainerStyle, inputStyle]}
          placeholderTextColor={theme.colors.textSecondary}
          {...textInputProps}
        />
        {rightIcon && (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={onRightIconPress}
            activeOpacity={0.7}>
            <InputIcon name={rightIcon} size={20} />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text variant="xs" style={{ color: theme.colors.error, marginTop: theme.spacing.xs }}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  iconLeft: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  iconRight: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
});

