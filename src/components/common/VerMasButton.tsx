/**
 * VerMasButton - Button component for "Ver más" actions
 */

import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useTranslation } from '@/i18n';
import Svg, { Path } from 'react-native-svg';

interface VerMasButtonProps {
  onPress: () => void;
}

export const VerMasButton: React.FC<VerMasButtonProps> = ({ onPress }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.surfaceSecondary,
          borderRadius: theme.radii.md,
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.base,
        },
      ]}>
      <View style={styles.content}>
        <Text variant="xs" weight="semibold" color="textPrimary">
          {t('components.common.verMas')}
        </Text>
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
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
    marginTop: 0, // Removed, handled by parent
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

