/**
 * IndicatorDetailScreen - Detalle de indicador con gráfico
 * Based on detalle_indicador design
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { FilterButton, InfoModal, InfoSection } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useSeriesHistory } from '@/hooks/useSeriesHistory';
import { useSeriesData } from '@/hooks/useSeriesData';
import { useSeriesMetadata } from '@/hooks/useSeriesMetadata';
import { SeriesCode } from '@/constants/series';
import { transformSeriesHistoryToChart } from '@/utils/seriesTransform';
import { TimeRange as TimeRangeType } from '@/utils/dateRange';
import { formatDate } from '@/utils/dateFormat';
import { formatChangePercent } from '@/utils/formatting';
import { DetailScreenLayout, DetailScreenConfig, StatCardData, InfoSectionData, TimeRangeOption } from '@/design-system/patterns';
import { useTranslation } from '@/i18n';
import { IndicatorDetail } from '@/types';

// ============================================================================
// Types
// ============================================================================

type IndicatorDetailRouteProp = RouteProp<RootStackParamList, 'IndicatorDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TimeRange = '1M' | '3M' | '1A';

// ============================================================================
// Constants
// ============================================================================

const CHART_HEIGHT = 148;


// ============================================================================
// Main Component
// ============================================================================

export const IndicatorDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const route = useRoute<IndicatorDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { indicatorId } = route.params;
  const [timeRange, setTimeRange] = useState<TimeRange>('1A');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const seriesCode = indicatorId as SeriesCode;

  // Fetch data from API
  const { data: indicatorData, loading: indicatorLoading } = useSeriesData(seriesCode);
  const { data: historyData, loading: historyLoading } = useSeriesHistory(
    seriesCode,
    timeRange as TimeRangeType
  );
  const { data: metadata, loading: metadataLoading } = useSeriesMetadata(seriesCode);

  // Transform and compute derived data
  const chartData = useMemo(() => {
    if (!historyData) return undefined;
    try {
      return transformSeriesHistoryToChart(historyData, seriesCode);
    } catch {
      return undefined;
    }
  }, [historyData, seriesCode]);

  const lastDataPoint = useMemo(() => {
    if (!historyData?.length) return null;
    return historyData[historyData.length - 1];
  }, [historyData]);

  const lastDataPointDate = useMemo(() => {
    return lastDataPoint ? formatDate(lastDataPoint.obs_time) : null;
  }, [lastDataPoint]);

  const indicator: IndicatorDetail | undefined = useMemo(() => {
    if (!indicatorData || !metadata) {
      return undefined;
    }
    return {
      ...indicatorData,
      description: metadata.description,
      methodology: metadata.methodology,
      source: metadata.source,
    };
  }, [indicatorData, metadata]);

  const isPositive = indicator?.trend === 'up';
  const changeLabel = indicator
    ? formatChangePercent(indicator.changePercent, isPositive)
    : '';

  // Set header title
  useEffect(() => {
    if (indicator) {
      navigation.setOptions({ title: indicator.name });
    }
  }, [indicator, navigation]);

  // Prepare time range options
  const timeRangeOptions: TimeRangeOption[] = useMemo(
    () => [
      { value: '1M', label: t('common.timeRanges.1M') },
      { value: '3M', label: t('common.timeRanges.3M') },
      { value: '1A', label: t('common.timeRanges.1A') },
    ],
    [t]
  );

  // Prepare stats
  const stats: StatCardData[] = useMemo(() => {
    if (!indicator) return [];
    return [
      {
        title: t('screens.detail.lastValue'),
        value: indicator.value,
        subtitle: lastDataPointDate || undefined,
        showInfoIcon: true,
        onInfoPress: () => setIsModalVisible(true),
      },
      {
        title: t('screens.detail.monthlyVariation'),
        value: changeLabel,
        valueColor: theme.colors.success,
      },
      {
        title: t('screens.detail.lastUpdate'),
        value: indicator.lastUpdate,
      },
    ];
  }, [indicator, lastDataPointDate, changeLabel, theme.colors.success, t]);

  // Prepare info sections
  const infoSections: InfoSectionData[] = useMemo(() => {
    if (!indicator) return [];
    const sections: InfoSectionData[] = [
      {
        title: t('screens.detail.description'),
        content: indicator.description || t('components.common.noDescription'),
      },
    ];
    if (indicator.methodology) {
      sections.push({
        title: t('screens.detail.methodology'),
        content: indicator.methodology,
      });
    }
    if (indicator.source) {
      sections.push({
        title: t('screens.detail.source'),
        content: indicator.source,
      });
    }
    return sections;
  }, [indicator, t]);

  // Prepare DetailScreenLayout config
  const screenConfig: DetailScreenConfig = useMemo(
    () => ({
      title: t('screens.detail.historicalEvolution'),
      value: indicator?.value || '',
      changeLabel,
      changeColor: theme.colors.success,
      chartData,
      chartHeight: CHART_HEIGHT,
      chartLoading: historyLoading,
      seriesCode,
      timeRange,
      timeRangeOptions,
      onTimeRangeChange: (range: string) => setTimeRange(range as TimeRange),
      stats,
      infoSections,
      loading: indicatorLoading || metadataLoading || !indicator,
      error: !indicator && !indicatorLoading && !metadataLoading ? 'error' : undefined,
      errorTitle: t('screens.detail.notFound.indicator'),
      errorMessage: t('screens.detail.error.message'),
    }),
    [
      indicator,
      changeLabel,
      chartData,
      historyLoading,
      seriesCode,
      timeRange,
      timeRangeOptions,
      stats,
      infoSections,
      indicatorLoading,
      metadataLoading,
      theme.colors.success,
      t,
    ]
  );

  return (
    <>
      <DetailScreenLayout {...screenConfig} />
      <InfoModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title={t('components.common.dataInfoTitle')}
        message={t('components.common.dataInfoMessage', {
          source: indicator?.source || t('components.common.noDescription'),
        })}
      />
    </>
  );
};

