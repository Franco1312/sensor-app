/**
 * Skeleton - Loading placeholder component with shimmer effect
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle, DimensionValue } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Base Skeleton component with shimmer animation
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const { theme } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.colors.surfaceSecondary,
          overflow: 'hidden',
        },
        style,
      ]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: theme.colors.surface,
            opacity,
          },
        ]}
      />
    </View>
  );
};

/**
 * Skeleton for IndicatorCard (full size)
 */
export const IndicatorCardSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.cardContainer, { gap: theme.spacing.sm }]}>
      <Skeleton width="60%" height={16} />
      <Skeleton width="80%" height={32} />
      <View style={[styles.row, { gap: theme.spacing.sm }]}>
        <Skeleton width={60} height={24} borderRadius={12} />
        <Skeleton width="50%" height={14} />
      </View>
      <Skeleton width="100%" height={60} borderRadius={8} />
    </View>
  );
};

/**
 * Skeleton for QuoteCard (full size)
 */
export const QuoteCardSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.cardContainer, { gap: theme.spacing.sm }]}>
      <Skeleton width="60%" height={16} />
      <Skeleton width="80%" height={32} />
      <View style={[styles.row, { gap: theme.spacing.sm }]}>
        <Skeleton width={60} height={24} borderRadius={12} />
        <Skeleton width="50%" height={14} />
      </View>
      <Skeleton width="100%" height={60} borderRadius={8} />
    </View>
  );
};

/**
 * Skeleton for CompactIndicatorCard - matches the compact card layout
 */
export const CompactIndicatorCardSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.compactCardContainer, { gap: 4 }]}>
      <Skeleton width="70%" height={12} />
      <Skeleton width="85%" height={24} style={{ marginTop: 4 }} />
      <Skeleton width="40%" height={12} style={{ marginTop: 6 }} />
    </View>
  );
};

/**
 * Skeleton for CompactQuoteCard - matches the compact card layout
 */
export const CompactQuoteCardSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.compactCardContainer, { gap: 4 }]}>
      <Skeleton width="70%" height={12} />
      <Skeleton width="85%" height={24} style={{ marginTop: 4 }} />
      <Skeleton width="40%" height={12} style={{ marginTop: 6 }} />
    </View>
  );
};

/**
 * Skeleton for StatCard
 */
export const StatCardSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.cardContainer, { gap: theme.spacing.sm }]}>
      <Skeleton width="70%" height={16} />
      <Skeleton width="90%" height={28} />
      <Skeleton width="60%" height={12} />
    </View>
  );
};

/**
 * Skeleton for Chart
 */
export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 148 }) => {
  return <Skeleton width="100%" height={height} borderRadius={8} />;
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
    borderRadius: 12,
  },
  compactCardContainer: {
    padding: 8, // sm padding
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

