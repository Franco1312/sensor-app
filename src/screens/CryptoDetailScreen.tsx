/**
 * CryptoDetailScreen - Detalle de criptomoneda con gráfico histórico
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Text, Card } from '@/design-system/components';
import { Row } from '@/components/layout';
import { useTheme } from '@/theme/ThemeProvider';
import { useCryptoHistory } from '@/hooks/useCryptoHistory';
import { useCrypto } from '@/hooks/useCrypto';
import { usePriceColor } from '@/hooks/usePriceDirection';
import { transformCryptoKlinesToChart } from '@/utils/cryptoTransform';
import { formatDate } from '@/utils/dateFormat';
import { formatChangePercent } from '@/utils/formatting';
import { DetailScreenLayout, DetailScreenConfig, StatCardData, TimeRangeOption } from '@/design-system/patterns';
import { useTranslation } from '@/i18n';
import { Crypto } from '@/types';
import { TIME_INTERVALS, DEFAULT_TIME_INTERVAL, TimeInterval } from '@/constants/cryptoIntervals';
import { CRYPTO_CHART_HEIGHT, DEFAULT_POLLING_INTERVAL } from '@/constants/crypto';

// ============================================================================
// Types
// ============================================================================

type CryptoDetailRouteProp = RouteProp<RootStackParamList, 'CryptoDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


// ============================================================================
// Main Component
// ============================================================================

export const CryptoDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const route = useRoute<CryptoDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { cryptoId, cryptoName } = route.params;
  const [timeInterval, setTimeInterval] = useState<TimeInterval>(DEFAULT_TIME_INTERVAL);

  const intervalConfig = useMemo(
    () => TIME_INTERVALS.find(i => i.value === timeInterval) || TIME_INTERVALS[2],
    [timeInterval]
  );

  const { cryptos, loading: cryptosLoading } = useCrypto(true, DEFAULT_POLLING_INTERVAL);
  const { data: historyData, loading: historyLoading } = useCryptoHistory(
    cryptoId,
    intervalConfig.klineInterval,
    intervalConfig.limit
  );

  const currentCrypto = useMemo(
    () => cryptos.find(c => c.symbol === cryptoId),
    [cryptos, cryptoId]
  );

  const chartData = useMemo(() => {
    if (!historyData) return undefined;
    try {
      return transformCryptoKlinesToChart(historyData);
    } catch {
      return undefined;
    }
  }, [historyData]);

  const lastDataPoint = useMemo(
    () => (historyData?.length ? historyData[historyData.length - 1] : null),
    [historyData]
  );

  const lastDataPointDate = useMemo(
    () => (lastDataPoint ? formatDate(new Date(lastDataPoint.openTime).toISOString()) : null),
    [lastDataPoint]
  );

  const isPositive = currentCrypto ? currentCrypto.changePercent >= 0 : false;
  const changeLabel = currentCrypto
    ? formatChangePercent(currentCrypto.changePercent, isPositive)
    : '';

  // Get price color based on direction
  const priceColor = currentCrypto?.priceDirection
    ? usePriceColor(currentCrypto.priceDirection)
    : undefined;

  // Set header title
  useEffect(() => {
    if (cryptoName) {
      navigation.setOptions({ title: cryptoName });
    }
  }, [cryptoName, navigation]);

  // Prepare time interval options
  const timeRangeOptions: TimeRangeOption[] = useMemo(
    () => TIME_INTERVALS.map(interval => ({ value: interval.value, label: interval.label })),
    []
  );

  // Prepare stats
  const stats: StatCardData[] = useMemo(() => {
    if (!currentCrypto) return [];
    return [
      {
        title: t('screens.detail.crypto.currentPrice'),
        value: currentCrypto.lastPrice,
        subtitle: lastDataPointDate || undefined,
        valueColor: priceColor,
      },
      {
        title: t('screens.detail.crypto.variation24h'),
        value: changeLabel,
        valueColor: isPositive ? theme.colors.success : theme.colors.error,
      },
      {
        title: t('screens.detail.lastUpdate'),
        value: currentCrypto.lastUpdate,
      },
    ];
  }, [currentCrypto, lastDataPointDate, changeLabel, isPositive, priceColor, theme.colors.success, theme.colors.error, t]);

  // Prepare additional content (crypto-specific stats)
  const additionalContent = useMemo(() => {
    if (!currentCrypto) return null;
    return (
      <View style={{ gap: theme.spacing.base }}>
        <Card style={{ marginBottom: theme.spacing.base }}>
          <View style={{ gap: theme.spacing.xs }}>
            <Text variant="sm" weight="semibold" color="textPrimary">
              {t('screens.detail.crypto.openPrice24h')}
            </Text>
            <Text variant="base" color="textSecondary">
              {currentCrypto.openPrice}
            </Text>
          </View>
        </Card>

        <Row gap={theme.spacing.base}>
          <Card style={{ flex: 1 }}>
            <View style={{ gap: theme.spacing.xs }}>
              <Text variant="sm" weight="semibold" color="textPrimary">
                {t('screens.detail.crypto.high24h')}
              </Text>
              <Text variant="base" color="textSecondary">
                {currentCrypto.highPrice}
              </Text>
            </View>
          </Card>

          <Card style={{ flex: 1 }}>
            <View style={{ gap: theme.spacing.xs }}>
              <Text variant="sm" weight="semibold" color="textPrimary">
                {t('screens.detail.crypto.low24h')}
              </Text>
              <Text variant="base" color="textSecondary">
                {currentCrypto.lowPrice}
              </Text>
            </View>
          </Card>
        </Row>

        <Card style={{ marginBottom: theme.spacing.base }}>
          <View style={{ gap: theme.spacing.xs }}>
            <Text variant="sm" weight="semibold" color="textPrimary">
              {t('screens.detail.crypto.volume24h')}
            </Text>
            <Text variant="base" color="textSecondary">
              {parseFloat(currentCrypto.volume).toLocaleString('en-US', {
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </Card>
      </View>
    );
  }, [currentCrypto, theme.spacing.base, theme.spacing.xs, t]);

  // Prepare DetailScreenLayout config
  const screenConfig: DetailScreenConfig = useMemo(
    () => ({
      title: t('screens.detail.historicalEvolution'),
      value: currentCrypto?.lastPrice || '',
      changeLabel,
      changeColor: isPositive ? theme.colors.success : theme.colors.error,
      valueColor: priceColor,
      chartData,
      chartHeight: CRYPTO_CHART_HEIGHT,
      chartLoading: historyLoading,
      timeRange: timeInterval,
      timeRangeOptions,
      onTimeRangeChange: (range: string) => setTimeInterval(range as TimeInterval),
      stats,
      additionalContent,
      loading: cryptosLoading || historyLoading || !currentCrypto,
      error: !currentCrypto && !cryptosLoading && !historyLoading ? 'error' : undefined,
      errorTitle: t('screens.detail.notFound.crypto'),
      errorMessage: t('screens.detail.error.message'),
    }),
    [
      currentCrypto,
      changeLabel,
      isPositive,
      priceColor,
      chartData,
      historyLoading,
      timeInterval,
      timeRangeOptions,
      stats,
      additionalContent,
      cryptosLoading,
      theme.colors.success,
      theme.colors.error,
      t,
    ]
  );

  return <DetailScreenLayout {...screenConfig} />;
};


