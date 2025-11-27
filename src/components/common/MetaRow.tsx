/**
 * MetaRow - Reusable component for displaying metadata (tags, dates, etc.)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Badge } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { LABELS, formatUpdatedLabel } from '@/constants/labels';

interface MetaRowProps {
  changeLabel: string;
  changeVariant: 'positive' | 'negative' | 'neutral';
  lastUpdate: string;
}

export const MetaRow: React.FC<MetaRowProps> = ({ changeLabel, changeVariant, lastUpdate }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { gap: theme.spacing.sm }]}>
      <Badge label={changeLabel} variant={changeVariant} />
      <Text variant="xs" color="textSecondary">
        {formatUpdatedLabel(lastUpdate)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});

