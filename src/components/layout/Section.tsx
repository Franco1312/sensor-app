/**
 * Section - Section heading component
 */

import React from 'react';
import { View } from 'react-native';
import { Text } from '@/design-system/components/atoms/Text';
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
          paddingBottom: theme.spacing.md,
        },
        style,
      ]}>
      <Text variant="xl" weight="bold">
        {title}
      </Text>
    </View>
  );
};
