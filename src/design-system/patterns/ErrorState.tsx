/**
 * ErrorState - Reusable error state component
 */

import React from 'react';
import { View } from 'react-native';
import { EmptyState } from '../components/molecules';
import { useTheme } from '@/theme/ThemeProvider';
import { useTranslation } from '@/i18n';

interface ErrorStateProps {
  /**
   * Error title
   */
  title?: string;
  /**
   * Error message
   */
  message: string;
  /**
   * Optional action button
   */
  action?: React.ReactNode;
  /**
   * Container style
   */
  style?: object;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  action,
  style,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[{ flex: 1, paddingHorizontal: theme.spacing.base }, style]}>
      <EmptyState title={title || t('components.common.error')} message={message} action={action} />
    </View>
  );
};

