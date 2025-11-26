/**
 * VerMasButton - Button component for "Ver más" actions
 */

import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import Svg, { Path } from 'react-native-svg';

interface VerMasButtonProps {
  onPress: () => void;
}

export const VerMasButton: React.FC<VerMasButtonProps> = ({ onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.surfaceSecondary,
          borderRadius: theme.radii.base,
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.base,
        },
      ]}>
      <View style={styles.content}>
        <Text variant="sm" weight="semibold" color="textPrimary">
          Ver más
        </Text>
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path
            d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
            fill={theme.colors.textPrimary}
          />
        </Svg>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16, // mt-4 = 16px
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

