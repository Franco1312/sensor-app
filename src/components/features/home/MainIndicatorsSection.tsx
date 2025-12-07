/**
 * MainIndicatorsSection - Section component for main indicators in HomeScreen
 */

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Section } from '@/components/layout';
import { Card, CompactIndicatorCard, CompactIndicatorCardSkeleton, VerMasButton } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { useTranslation } from '@/i18n';
import { Indicator } from '@/types';
import { SERIES_CODES } from '@/constants/series';

interface MainIndicatorsSectionProps {
  indicators: Indicator[];
  loading: boolean;
  onVerMas: () => void;
  onIndicatorPress: (indicatorId: string, indicatorName: string) => void;
}

export const MainIndicatorsSection: React.FC<MainIndicatorsSectionProps> = ({
  indicators,
  loading,
  onVerMas,
  onIndicatorPress,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const handleIndicatorPress = useCallback(
    (indicator: Indicator) => {
      onIndicatorPress(indicator.id, indicator.name);
    },
    [onIndicatorPress]
  );

  const featuredIndicators = indicators.filter(
    indicator =>
      indicator.id === SERIES_CODES.IPC_VARIACION_MENSUAL ||
      indicator.id === SERIES_CODES.RESERVAS_INTERNACIONALES
  );

  return (
    <View style={styles.section}>
      <Section 
        title={t('screens.home.sections.mainIndicators')} 
        onVerMasPress={onVerMas}
      />
      <View style={styles.gridContainer}>
        {loading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <View key={`indicator-skeleton-${index}`} style={styles.gridItem}>
              <Card variant="elevated" padding="md">
                <CompactIndicatorCardSkeleton />
              </Card>
            </View>
          ))
        ) : (
          featuredIndicators.map(indicator => (
            <View key={indicator.id} style={styles.gridItem}>
              <CompactIndicatorCard indicator={indicator} onPress={() => handleIndicatorPress(indicator)} />
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  gridItem: {
    flex: 1,
    minWidth: '45%',
    maxWidth: '48%',
  },
});

