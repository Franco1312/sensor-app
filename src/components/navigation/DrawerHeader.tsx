/**
 * DrawerHeader - Header component for the drawer
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { AppLogo } from '@/components/brand';

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
      <AppLogo variant="compact" size={48} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
});

