/**
 * InfoSection - Reusable component for displaying information sections (description, methodology, source)
 */

import React from 'react';
import { Text } from '../atoms';
import { Card } from './Card';
import { useTheme } from '@/theme/ThemeProvider';

export interface InfoSectionProps {
  title: string;
  content: string;
  marginBottom?: boolean;
}

export const InfoSection: React.FC<InfoSectionProps> = ({ title, content, marginBottom }) => {
  const { theme } = useTheme();

  return (
    <Card style={marginBottom ? { marginBottom: theme.spacing.base } : undefined}>
      <Text variant="sm" weight="medium" style={{ marginBottom: theme.spacing.sm }}>
        {title}
      </Text>
      <Text variant="sm" color="textSecondary">
        {content}
      </Text>
    </Card>
  );
};

