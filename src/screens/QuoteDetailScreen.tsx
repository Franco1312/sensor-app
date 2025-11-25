/**
 * QuoteDetailScreen - Detalle de cotización con gráfico histórico
 * Similar to IndicatorDetailScreen but for quotes
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/navigation/types';
import { Screen, Container, Row } from '@/components/layout';
import { Text, StatCardSkeleton, Skeleton, FilterButton, StatCard, Card, ValueHeader, ChartWithLabels, EmptyState } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { Theme } from '@/theme/theme';
import { useQuoteHistory } from '@/hooks/useQuoteHistory';
import { useQuotes } from '@/hooks/useQuotes';
import { transformQuoteHistoryToChart } from '@/utils/quotesTransform';
import { formatDate } from '@/utils/dateFormat';
import { formatChangePercent } from '@/utils/formatting';
import { LABELS } from '@/constants/labels';
import { Quote } from '@/types';

// ============================================================================
// Types
// ============================================================================

type QuoteDetailRouteProp = RouteProp<RootStackParamList, 'QuoteDetail'>;
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

// ============================================================================
// Main Component
// ============================================================================

export const QuoteDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<QuoteDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { quoteId, quoteName } = route.params;
  const [timeRange, setTimeRange] = useState<TimeRange>('1A');

  // Fetch current quote and history
  const { quotes, loading: quotesLoading } = useQuotes();
  const { data: historyData, loading: historyLoading } = useQuoteHistory(quoteId, timeRange);

  // Find current quote
  const currentQuote = useMemo(() => {
    return quotes.find(q => q.id === `quote-${quoteId}`);
  }, [quotes, quoteId]);

  // Transform and compute derived data
  const chartData = useMemo(() => {
    if (!historyData) return undefined;
    try {
      return transformQuoteHistoryToChart(historyData);
    } catch {
      return undefined;
    }
  }, [historyData]);

  const lastDataPoint = useMemo(() => {
    if (!historyData?.length) return null;
    return historyData[historyData.length - 1];
  }, [historyData]);

  const lastDataPointDate = useMemo(() => {
    return lastDataPoint ? formatDate(lastDataPoint.fecha) : null;
  }, [lastDataPoint]);

  const isPositive = currentQuote ? currentQuote.changePercent >= 0 : false;
  const changeLabel = currentQuote
    ? formatChangePercent(currentQuote.changePercent, isPositive)
    : '';

  // Set header title
  useEffect(() => {
    if (quoteName) {
      navigation.setOptions({ title: quoteName });
    }
  }, [quoteName, navigation]);

  // Loading state
  const isLoading = quotesLoading || historyLoading || !currentQuote;
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
      </Screen>
    );
  }

  // Error state
  if (!currentQuote) {
    return (
      <Screen>
        <EmptyState
          title="Cotización no encontrada"
          message="No se pudo cargar la información de la cotización. Por favor, intenta nuevamente."
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
          value={currentQuote.sellPrice}
          changeLabel={changeLabel}
          changeColor={isPositive ? theme.colors.success : theme.colors.error}
        />
      </Container>

      <ChartWithLabels
        loading={historyLoading}
        chartData={chartData}
        height={CHART_HEIGHT}
      />

      <TimeRangeSelector
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        theme={theme}
      />

      <View style={[styles.statsContainer, { gap: theme.spacing.base, marginBottom: theme.spacing.lg }]}>
        <StatCard
          title={LABELS.LAST_VALUE}
          value={currentQuote.sellPrice}
          subtitle={lastDataPointDate || undefined}
        />
        <StatCard
          title={LABELS.MONTHLY_VARIATION}
          value={changeLabel}
          valueColor={isPositive ? theme.colors.success : theme.colors.error}
        />
        <StatCard title={LABELS.LAST_UPDATE} value={currentQuote.lastUpdate} />
      </View>

      {currentQuote.buyPrice && (
        <Card style={{ marginBottom: theme.spacing.base }}>
          <View style={{ gap: theme.spacing.xs }}>
            <Text variant="sm" weight="semibold" color="textPrimary">
              Precio de Compra
            </Text>
            <Text variant="base" color="textSecondary">
              {currentQuote.buyPrice}
            </Text>
          </View>
        </Card>
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
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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

