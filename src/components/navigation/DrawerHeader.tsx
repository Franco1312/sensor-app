/**
 * DrawerHeader - Header component for the drawer
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';

export const DrawerHeader: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.header,
        {
          paddingBottom: theme.spacing.lg,
          borderBottomColor: theme.colors.border,
          paddingHorizontal: theme.spacing.base,
        },
      ]}>
      <Text variant="2xl" weight="bold" style={{ color: theme.colors.textPrimary }}>
        Radar Económico
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    borderBottomWidth: 1,
  },
});

