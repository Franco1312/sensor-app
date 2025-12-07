/**
 * StatCard - Reusable card component for displaying statistics
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../atoms';
import { Card } from '../molecules';
import { InfoIcon } from '../atoms/icons';
import { useTheme } from '@/theme/ThemeProvider';

export interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  valueColor?: string;
  showInfoIcon?: boolean;
  onInfoPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  valueColor,
  showInfoIcon,
  onInfoPress,
}) => {
  const { theme } = useTheme();

  return (
    <Card padding="sm" style={styles.statCard}>
      <View style={{ gap: 4 }}>
        <View style={styles.titleRow}>
          <Text variant="xs" weight="medium" color="textSecondary">
            {title}
          </Text>
          {showInfoIcon && (
            <TouchableOpacity
              onPress={onInfoPress}
              style={styles.infoIconButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <InfoIcon size={14} />
            </TouchableOpacity>
          )}
        </View>
        <Text
          variant="xl"
          weight="bold"
          style={[{ lineHeight: 24 }, valueColor ? { color: valueColor } : {}]}>
          {value}
        </Text>
        {subtitle && (
          <Text variant="2xs" color="textSecondary">
            {subtitle}
          </Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    minWidth: 158,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoIconButton: {
    padding: 2,
    marginLeft: 2,
  },
});

