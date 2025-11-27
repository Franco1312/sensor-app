/**
 * DrawerOverlay - Overlay component for the drawer
 */

import React from 'react';
import { Pressable, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface DrawerOverlayProps {
  overlayOpacity: Animated.Value;
  onPress: () => void;
}

export const DrawerOverlay: React.FC<DrawerOverlayProps> = ({ overlayOpacity, onPress }) => {
  const { theme } = useTheme();

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onPress}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: theme.colors.overlay,
            opacity: overlayOpacity,
          },
        ]}
      />
    </Pressable>
  );
};

