/**
 * Row - Reusable row container component
 */

import React, { ReactNode } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface RowProps extends ViewProps {
  children: ReactNode;
  gap?: number;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
}

export const Row: React.FC<RowProps> = ({
  children,
  gap,
  alignItems = 'center',
  justifyContent,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const gapValue = gap !== undefined ? gap : theme.spacing.sm;

  return (
    <View
      style={[
        styles.row,
        {
          gap: gapValue,
          alignItems,
          ...(justifyContent && { justifyContent }),
        },
        style,
      ]}
      {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});

