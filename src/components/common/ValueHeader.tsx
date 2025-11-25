/**
 * ValueHeader - Reusable header component for displaying large values with change indicators
 */

import React from 'react';
import { View } from 'react-native';
import { Row } from '@/components/layout';
import { Text } from '@/components/ui';
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
        <Text variant="base" weight="medium" color="textSecondary">
          {title}
        </Text>
      )}
      <Text variant="5xl" weight="bold" style={{ lineHeight: 48 }}>
        {value}
      </Text>
      <Row gap={theme.spacing.sm}>
        {subtitle ? (
          <Text variant="base" color="textSecondary">
            {subtitle}
          </Text>
        ) : (
          <Text variant="base" color="textSecondary">
            {LABELS.LAST_YEAR}
          </Text>
        )}
        <Text variant="base" weight="medium" style={{ color: changeColor || theme.colors.success }}>
          {changeLabel}
        </Text>
      </Row>
    </View>
  );
};

