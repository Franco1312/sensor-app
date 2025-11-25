/**
 * IndicatorDetailScreen - Detalle de indicador con gráfico
 * Based on detalle_indicador design
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/navigation/types';
import { Screen, Container, Row } from '@/components/layout';
import { Text, StatCardSkeleton, Skeleton, FilterButton, InfoModal, InfoSection, StatCard, Card, ValueHeader, ChartWithLabels, EmptyState } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { Theme } from '@/theme/theme';
import { useSeriesHistory } from '@/hooks/useSeriesHistory';
import { useSeriesData } from '@/hooks/useSeriesData';
import { useSeriesMetadata } from '@/hooks/useSeriesMetadata';
import { SeriesCode } from '@/constants/series';
import { transformSeriesHistoryToChart } from '@/utils/seriesTransform';
import { TimeRange as TimeRangeType } from '@/utils/dateRange';
import { formatDate } from '@/utils/dateFormat';
import { formatChangePercent } from '@/utils/formatting';
import { LABELS } from '@/constants/labels';
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

const TIME_RANGES: TimeRange[] = [LABELS.TIME_RANGE_1M, LABELS.TIME_RANGE_3M, LABELS.TIME_RANGE_1A] as TimeRange[];
const CHART_HEIGHT = 148;

// ============================================================================
// Sub-components
// ============================================================================



interface TimeRangeSelectorProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  theme: Theme;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  timeRange,
  onTimeRangeChange,
  theme,
}) => (
  <View style={[styles.timeRangeContainer, { gap: theme.spacing.sm, marginBottom: theme.spacing.lg }]}>
    {TIME_RANGES.map(range => (
      <FilterButton
        key={range}
        label={range}
        isSelected={timeRange === range}
        onPress={() => onTimeRangeChange(range)}
        fullWidth
      />
    ))}
  </View>
);


interface StatsSectionProps {
  indicator: IndicatorDetail;
  lastDataPointDate: string | null;
  changeLabel: string;
  theme: Theme;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  indicator,
  lastDataPointDate,
  changeLabel,
  theme,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleInfoPress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const message = `Los datos provienen de publicaciones oficiales de ${indicator.source || 'la fuente oficial'}.\n\nLa actualización de los valores depende exclusivamente de la frecuencia de publicación establecida por la fuente oficial.`;

  return (
    <>
      <View style={[styles.statsContainer, { gap: theme.spacing.base, marginBottom: theme.spacing.lg }]}>
        <StatCard
          title={LABELS.LAST_VALUE}
          value={indicator.value}
          subtitle={lastDataPointDate || undefined}
          showInfoIcon
          onInfoPress={handleInfoPress}
        />
        <StatCard
          title={LABELS.MONTHLY_VARIATION}
          value={changeLabel}
          valueColor={theme.colors.success}
        />
        <StatCard title={LABELS.LAST_UPDATE} value={indicator.lastUpdate} />
      </View>
      <InfoModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        title={LABELS.DATA_INFO_TITLE}
        message={message}
      />
    </>
  );
};


// ============================================================================
// Main Component
// ============================================================================

export const IndicatorDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<IndicatorDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { indicatorId } = route.params;
  const [timeRange, setTimeRange] = useState<TimeRange>('1A');

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

  // Loading state
  const isLoading = indicatorLoading || metadataLoading || !indicator;
  if (isLoading) {
    return (
      <Screen
        scrollable={true}
        safeAreaEdges={[]}
        contentContainerStyle={[
          styles.container,
          {
            padding: theme.spacing.base,
            paddingTop: theme.spacing.md,
            paddingBottom: insets.bottom + theme.spacing.lg,
          },
        ]}>
        {/* Header skeleton */}
        <Container gap={theme.spacing.sm} style={{ marginBottom: theme.spacing.lg }}>
          <Skeleton width="40%" height={16} />
          <Skeleton width="60%" height={48} />
          <Row gap={theme.spacing.sm}>
            <Skeleton width="30%" height={16} />
            <Skeleton width="20%" height={16} />
          </Row>
        </Container>

        {/* Chart skeleton */}
        <ChartWithLabels loading={true} height={CHART_HEIGHT} />

        {/* Time range selector skeleton */}
        <View style={[styles.timeRangeContainer, { gap: theme.spacing.sm, marginBottom: theme.spacing.lg, marginTop: theme.spacing.base }]}>
          <Skeleton width={50} height={32} borderRadius={16} />
          <Skeleton width={50} height={32} borderRadius={16} />
          <Skeleton width={50} height={32} borderRadius={16} />
        </View>

        {/* Stats skeleton */}
        <View style={[styles.statsContainer, { gap: theme.spacing.base, marginBottom: theme.spacing.lg }]}>
          <Card style={styles.statCard}>
            <StatCardSkeleton />
          </Card>
          <Card style={styles.statCard}>
            <StatCardSkeleton />
          </Card>
          <Card style={styles.statCard}>
            <StatCardSkeleton />
          </Card>
        </View>

        {/* Info sections skeleton */}
        <Card style={{ marginBottom: theme.spacing.base }}>
          <Skeleton width="50%" height={16} style={{ marginBottom: theme.spacing.sm }} />
          <Skeleton width="100%" height={14} style={{ marginBottom: 4 }} />
          <Skeleton width="90%" height={14} style={{ marginBottom: 4 }} />
          <Skeleton width="80%" height={14} />
        </Card>
      </Screen>
    );
  }

  // Error state (should not happen if API is working correctly)
  if (!indicator) {
    return (
      <Screen>
        <EmptyState
          title={LABELS.INDICATOR_NOT_FOUND}
          message="No se pudo cargar la información del indicador. Por favor, intenta nuevamente."
        />
      </Screen>
    );
  }

  return (
    <Screen
      scrollable={true}
      safeAreaEdges={[]}
      contentContainerStyle={[
        styles.container,
        {
          padding: theme.spacing.base,
          paddingTop: theme.spacing.md,
          paddingBottom: insets.bottom + theme.spacing.lg,
        },
      ]}>
      <Container gap={theme.spacing.sm} style={{ marginBottom: theme.spacing.lg }}>
        <ValueHeader
          title={LABELS.HISTORICAL_EVOLUTION}
          value={indicator.value}
          changeLabel={changeLabel}
          changeColor={theme.colors.success}
        />
      </Container>

      <ChartWithLabels
        loading={historyLoading}
        chartData={chartData}
        seriesCode={seriesCode}
        height={CHART_HEIGHT}
      />

      <TimeRangeSelector
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        theme={theme}
      />

      <StatsSection
        indicator={indicator}
        lastDataPointDate={lastDataPointDate}
        changeLabel={changeLabel}
        theme={theme}
      />

      {/* Description section - appears right after stats */}
      <InfoSection
        title={LABELS.DESCRIPTION}
        content={indicator.description || LABELS.NO_DESCRIPTION}
        marginBottom
      />

      {indicator.methodology && (
        <InfoSection
          title={LABELS.METHODOLOGY}
          content={indicator.methodology}
          marginBottom
        />
      )}

      {indicator.source && (
        <InfoSection title={LABELS.SOURCE} content={indicator.source} />
      )}
    </Screen>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    // Remove flex: 1 to allow proper scrolling
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timeRangeButton: {
    // Styles applied inline with theme
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 158,
  },
});
