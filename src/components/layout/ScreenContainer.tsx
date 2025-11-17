/**
 * ScreenContainer - Wrapper for screens with safe area and theme
 */

import React, { ReactNode } from 'react';
import { View, ScrollView, ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';

interface ScreenContainerProps extends ScrollViewProps {
  children: ReactNode;
  scrollable?: boolean;
  safeAreaEdges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = true,
  safeAreaEdges = ['top', 'bottom'],
  style,
  contentContainerStyle,
  ...scrollProps
}) => {
  const { theme } = useTheme();

  const containerStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
  };

  if (scrollable) {
    return (
      <SafeAreaView style={containerStyle} edges={safeAreaEdges}>
        <ScrollView
          style={[{ flex: 1 }, style]}
          contentContainerStyle={[
            { 
              paddingBottom: theme.spacing.lg,
              paddingTop: safeAreaEdges.includes('top') ? 0 : theme.spacing.sm,
            }, 
            contentContainerStyle
          ]}
          showsVerticalScrollIndicator={false}
          {...scrollProps}>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // When not scrollable, use regular View to avoid any safe area padding
  // The safe area is handled by the tab bar at the bottom
  return (
    <View style={[containerStyle, style, { flex: 1 }]}>
      {children}
    </View>
  );
};
