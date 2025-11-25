/**
 * Section - Section heading component
 */

import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';

interface SectionProps {
  title: string;
  style?: object;
}

export const Section: React.FC<SectionProps> = ({ title, style }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          paddingHorizontal: theme.spacing.base,
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing.md,
        },
        style,
      ]}>
      <Text variant="lg" weight="bold">
        {title}
      </Text>
    </View>
  );
};
