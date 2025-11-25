/**
 * InfoSection - Reusable component for displaying information sections (description, methodology, source)
 */

import React from 'react';
import { Card, AppText } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';

interface InfoSectionProps {
  title: string;
  content: string;
  marginBottom?: boolean;
}

export const InfoSection: React.FC<InfoSectionProps> = ({ title, content, marginBottom }) => {
  const { theme } = useTheme();

  return (
    <Card style={marginBottom ? { marginBottom: theme.spacing.base } : undefined}>
      <AppText variant="sm" weight="medium" style={{ marginBottom: theme.spacing.sm }}>
        {title}
      </AppText>
      <AppText variant="sm" color="textSecondary">
        {content}
      </AppText>
    </Card>
  );
};

