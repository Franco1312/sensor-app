/**
 * MetaRow - Reusable component for displaying metadata (tags, dates, etc.)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { Tag } from './Tag';
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
      <Tag label={changeLabel} variant={changeVariant} />
      <AppText variant="xs" color="textSecondary">
        {formatUpdatedLabel(lastUpdate)}
      </AppText>
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

