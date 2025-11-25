/**
 * Container - Reusable container component with gap support
 */

import React, { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface ContainerProps extends ViewProps {
  children: ReactNode;
  gap?: number;
}

export const Container: React.FC<ContainerProps> = ({ children, gap, style, ...props }) => {
  const { theme } = useTheme();
  const gapValue = gap !== undefined ? gap : theme.spacing.sm;

  return (
    <View
      style={[
        {
          gap: gapValue,
        },
        style,
      ]}
      {...props}>
      {children}
    </View>
  );
};

