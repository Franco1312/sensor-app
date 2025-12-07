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
    <View style={{ gap: theme.spacing.xs }}>
      {title && (
        <Text variant="xs" weight="medium" color="textSecondary">
          {title}
        </Text>
      )}
      <Text variant="4xl" weight="bold" style={{ lineHeight: 40, color: valueColor || theme.colors.textPrimary }}>
        {value}
      </Text>
      <Row gap={theme.spacing.sm}>
        {subtitle ? (
          <Text variant="xs" color="textSecondary" weight="normal">
            {subtitle}
          </Text>
        ) : (
          <Text variant="xs" color="textSecondary" weight="normal">
            {t('screens.detail.lastValue')}
          </Text>
        )}
        <Text variant="xs" weight="normal" style={{ color: changeColor || theme.colors.success }}>
          {changeLabel}
        </Text>
      </Row>
    </View>
  );
};

