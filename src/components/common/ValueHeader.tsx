/**
 * ValueHeader - Reusable header component for displaying large values with change indicators
 */

import React from 'react';
import { View } from 'react-native';
import { Row } from '@/components/layout';
import { Text } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useTranslation } from '@/i18n';

interface ValueHeaderProps {
  title?: string;
  value: string;
  changeLabel: string;
  changeColor?: string;
  valueColor?: string;
  subtitle?: string;
}

export const ValueHeader: React.FC<ValueHeaderProps> = ({
  title,
  value,
  changeLabel,
  changeColor,
  valueColor,
  subtitle,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      {title && (
        <Text variant="base" weight="medium" color="textSecondary">
          {title}
        </Text>
      )}
      <Text variant="5xl" weight="bold" style={{ lineHeight: 48, color: valueColor || theme.colors.textPrimary }}>
        {value}
      </Text>
      <Row gap={theme.spacing.sm}>
        {subtitle ? (
          <Text variant="base" color="textSecondary">
            {subtitle}
          </Text>
        ) : (
          <Text variant="base" color="textSecondary">
            {t('screens.detail.lastValue')}
          </Text>
        )}
        <Text variant="base" weight="medium" style={{ color: changeColor || theme.colors.success }}>
          {changeLabel}
        </Text>
      </Row>
    </View>
  );
};

