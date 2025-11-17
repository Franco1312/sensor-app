/**
 * SectionTitle - Section heading component
 */

import React from 'react';
import { View } from 'react-native';
import { AppText } from '../common/AppText';
import { useTheme } from '@/theme/ThemeProvider';

interface SectionTitleProps {
  title: string;
  style?: object;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, style }) => {
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
      <AppText variant="lg" weight="bold">
        {title}
      </AppText>
    </View>
  );
};
