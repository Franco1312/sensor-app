/**
 * ValueHeader - Reusable header component for displaying large values with change indicators
 */

import React from 'react';
import { View } from 'react-native';
import { Row } from '@/components/layout';
import { AppText } from './AppText';
import { useTheme } from '@/theme/ThemeProvider';
import { LABELS } from '@/constants/labels';

interface ValueHeaderProps {
  title?: string;
  value: string;
  changeLabel: string;
  changeColor?: string;
  subtitle?: string;
}

export const ValueHeader: React.FC<ValueHeaderProps> = ({
  title,
  value,
  changeLabel,
  changeColor,
  subtitle,
}) => {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      {title && (
        <AppText variant="base" weight="medium" color="textSecondary">
          {title}
        </AppText>
      )}
      <AppText variant="5xl" weight="bold" style={{ lineHeight: 48 }}>
        {value}
      </AppText>
      <Row gap={theme.spacing.sm}>
        {subtitle ? (
          <AppText variant="base" color="textSecondary">
            {subtitle}
          </AppText>
        ) : (
          <AppText variant="base" color="textSecondary">
            {LABELS.LAST_YEAR}
          </AppText>
        )}
        <AppText variant="base" weight="medium" style={{ color: changeColor || theme.colors.success }}>
          {changeLabel}
        </AppText>
      </Row>
    </View>
  );
};

