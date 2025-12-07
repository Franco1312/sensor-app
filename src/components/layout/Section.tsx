/**
 * Section - Section heading component with optional "Ver más" button
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/design-system/components/atoms/Text';
import { useTheme } from '@/theme/ThemeProvider';
import Svg, { Path } from 'react-native-svg';

interface SectionProps {
  title: string;
  onVerMasPress?: () => void;
  style?: object;
}

export const Section: React.FC<SectionProps> = ({ title, onVerMasPress, style }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: theme.spacing.xs,
          paddingTop: 0,
        },
        style,
      ]}>
      <Text variant="md" weight="semibold" color="textPrimary" style={{ flex: 1 }}>
        {title}
      </Text>
      {onVerMasPress && (
        <TouchableOpacity
          onPress={onVerMasPress}
          activeOpacity={0.7}
          style={styles.verMasButton}>
          <Text variant="xs" weight="semibold" style={{ color: theme.colors.primary }}>
            Ver más
          </Text>
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
              fill={theme.colors.primary}
            />
          </Svg>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verMasButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
