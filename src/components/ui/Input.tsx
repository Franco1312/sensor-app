/**
 * Input - Reusable input component with icon support
 */

import React from 'react';
import { View, TextInput, TextInputProps, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from './Text';
import { InputIcon } from '@/components/common/InputIcon';
import { useTheme } from '@/theme/ThemeProvider';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  leftIcon?: 'person' | 'lock';
  rightIcon?: 'visibility' | 'visibility_off';
  onRightIconPress?: () => void;
  error?: string;
  containerStyle?: object;
  inputStyle?: object;
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
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.background,
              borderColor: error ? theme.colors.error : theme.colors.border,
              color: theme.colors.textPrimary,
              paddingLeft: leftIcon ? 40 : theme.spacing.base,
              paddingRight: rightIcon ? 40 : theme.spacing.base,
            },
            inputStyle,
          ]}
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

