/**
 * QuoteDetailScreen - Detalle de cotización con gráfico histórico
 * Similar to IndicatorDetailScreen but for quotes
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Card, Text } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useQuoteHistory } from '@/hooks/useQuoteHistory';
import { useQuotes } from '@/hooks/useQuotes';
import { transformQuoteHistoryToChart } from '@/utils/quotesTransform';
import { formatDate } from '@/utils/dateFormat';
import { formatChangePercent } from '@/utils/formatting';
import { DetailScreenLayout, DetailScreenConfig, StatCardData, TimeRangeOption } from '@/design-system/patterns';
import { useTranslation } from '@/i18n';
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

const CHART_HEIGHT = 148;

// ============================================================================
// Main Component
// ============================================================================

export const QuoteDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const route = useRoute<QuoteDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
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
    if (!currentQuote) return [];
    return [
      {
        title: t('screens.detail.lastValue'),
        value: currentQuote.sellPrice,
        subtitle: lastDataPointDate || undefined,
      },
      {
        title: t('screens.detail.monthlyVariation'),
        value: changeLabel,
        valueColor: isPositive ? theme.colors.success : theme.colors.error,
      },
      {
        title: t('screens.detail.lastUpdate'),
        value: currentQuote.lastUpdate,
      },
    ];
  }, [currentQuote, lastDataPointDate, changeLabel, isPositive, theme.colors.success, theme.colors.error, t]);

  // Prepare additional content (buy price card)
  const additionalContent = useMemo(() => {
    if (!currentQuote?.buyPrice) return null;
    return (
      <Card style={{ marginBottom: theme.spacing.base }}>
        <View style={{ gap: theme.spacing.xs }}>
          <Text variant="sm" weight="semibold" color="textPrimary">
            {t('screens.detail.quote.buyPrice')}
          </Text>
          <Text variant="base" color="textSecondary">
            {currentQuote.buyPrice}
          </Text>
        </View>
      </Card>
    );
  }, [currentQuote, theme.spacing.base, theme.spacing.xs, t]);

  // Prepare DetailScreenLayout config
  const screenConfig: DetailScreenConfig = useMemo(
    () => ({
      title: t('screens.detail.historicalEvolution'),
      value: currentQuote?.sellPrice || '',
      changeLabel,
      changeColor: isPositive ? theme.colors.success : theme.colors.error,
      chartData,
      chartHeight: CHART_HEIGHT,
      chartLoading: historyLoading,
      timeRange,
      timeRangeOptions,
      onTimeRangeChange: (range: string) => setTimeRange(range as TimeRange),
      stats,
      additionalContent,
      loading: quotesLoading || historyLoading || !currentQuote,
      error: !currentQuote && !quotesLoading && !historyLoading ? 'error' : undefined,
      errorTitle: t('screens.detail.notFound.quote'),
      errorMessage: t('screens.detail.error.message'),
    }),
    [
      currentQuote,
      changeLabel,
      isPositive,
      chartData,
      historyLoading,
      timeRange,
      timeRangeOptions,
      stats,
      additionalContent,
      quotesLoading,
      theme.colors.success,
      theme.colors.error,
      t,
    ]
  );

  return <DetailScreenLayout {...screenConfig} />;
};


