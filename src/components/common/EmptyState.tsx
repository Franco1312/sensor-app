/**
 * EmptyState - Reusable component for displaying empty states
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '@/theme/ThemeProvider';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  action,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { padding: theme.spacing.xl }]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <AppText variant="lg" weight="bold" style={{ marginBottom: theme.spacing.sm, textAlign: 'center' }}>
        {title}
      </AppText>
      {message && (
        <AppText variant="base" color="textSecondary" style={{ textAlign: 'center', marginBottom: theme.spacing.md }}>
          {message}
        </AppText>
      )}
      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  iconContainer: {
    marginBottom: 16,
  },
  actionContainer: {
    marginTop: 8,
  },
});

