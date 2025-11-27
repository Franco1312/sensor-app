/**
 * LoadingState - Reusable loading state component with skeleton
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../components/atoms';
import { useTheme } from '@/theme/ThemeProvider';

interface LoadingStateProps {
  /**
   * Number of skeleton items to show
   */
  itemCount?: number;
  /**
   * Custom render function for skeleton items
   */
  renderItem?: (index: number) => React.ReactNode;
  /**
   * Container style
   */
  style?: object;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  itemCount = 6,
  renderItem,
  style,
}) => {
  const { theme } = useTheme();

  const defaultRenderItem = (index: number) => (
    <View key={index} style={{ marginBottom: theme.spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.base }}>
        <Skeleton width={40} height={40} borderRadius={8} />
        <View style={{ flex: 1, gap: theme.spacing.xs }}>
          <Skeleton width="70%" height={16} />
          <Skeleton width="50%" height={14} />
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Skeleton width={80} height={18} />
          <Skeleton width={60} height={14} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingHorizontal: theme.spacing.base, paddingTop: theme.spacing.md }, style]}>
      {Array.from({ length: itemCount }).map((_, index) =>
        renderItem ? renderItem(index) : defaultRenderItem(index)
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

