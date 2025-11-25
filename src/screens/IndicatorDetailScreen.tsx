/**
 * IndicatorDetailScreen - Detalle de indicador con gráfico
 * Based on detalle_indicador design
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, ActivityIndicator, StyleSheet, Modal, Pressable } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { RootStackParamList } from '@/navigation/types';
import { ScreenContainer } from '@/components/layout';
import { Card, AppText, Chart, AppButton } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { Theme } from '@/theme/theme';
import { useSeriesHistory } from '@/hooks/useSeriesHistory';
import { useSeriesData } from '@/hooks/useSeriesData';
import { useSeriesMetadata } from '@/hooks/useSeriesMetadata';
import { SeriesCode } from '@/constants/series';
import { transformSeriesHistoryToChart } from '@/utils/seriesTransform';
import { TimeRange as TimeRangeType } from '@/utils/dateRange';
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

const TIME_RANGES: TimeRange[] = ['1M', '3M', '1A'];
const CHART_MONTH_LABELS = ['Ene', 'Mar', 'May', 'Jul', 'Sep', 'Nov'];
const CHART_HEIGHT = 148;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats a date string to DD/MM/YYYY format
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

/**
 * Formats change percentage with sign
 */
const formatChangePercent = (changePercent: number, isPositive: boolean): string => {
  return `${isPositive ? '+' : ''}${changePercent.toFixed(1)}%`;
};

// ============================================================================
// Sub-components
// ============================================================================

/**
 * InfoModal - Custom modal component following app design
 */
interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  theme: Theme;
}

const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose, title, message, theme }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}>
    <Pressable
      style={styles.modalOverlay}
      onPress={onClose}>
      <Pressable onPress={(e) => e.stopPropagation()}>
        <Card style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.modalContent}>
            <AppText variant="lg" weight="bold" style={{ marginBottom: theme.spacing.md }}>
              {title}
            </AppText>
            <AppText variant="base" color="textSecondary" style={{ marginBottom: theme.spacing.lg, lineHeight: 22 }}>
              {message}
            </AppText>
            <View style={styles.modalButtonContainer}>
              <AppButton
                title="Entendido"
                variant="primary"
                onPress={onClose}
              />
            </View>
          </View>
        </Card>
      </Pressable>
    </Pressable>
  </Modal>
);

/**
 * InfoIcon - Small info icon component following Material Design style
 */
interface InfoIconProps {
  size?: number;
  color?: string;
}

const InfoIcon: React.FC<InfoIconProps> = ({ size = 16, color }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.textSecondary;
  const iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={iconPath} fill={iconColor} fillOpacity={0.7} />
    </Svg>
  );
};

interface HeaderSectionProps {
  value: string;
  changeLabel: string;
  theme: Theme;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ value, changeLabel, theme }) => (
  <View style={[styles.section, { marginBottom: theme.spacing.lg }]}>
    <AppText variant="base" weight="medium" color="textSecondary">
      Evolución Histórica
    </AppText>
    <AppText variant="5xl" weight="bold" style={{ lineHeight: 48 }}>
      {value}
    </AppText>
    <View style={[styles.row, { gap: theme.spacing.sm }]}>
      <AppText variant="base" color="textSecondary">
        Último Año
      </AppText>
      <AppText variant="base" weight="medium" style={{ color: theme.colors.success }}>
        {changeLabel}
      </AppText>
    </View>
  </View>
);

interface ChartSectionProps {
  loading: boolean;
  chartData: ReturnType<typeof transformSeriesHistoryToChart> | undefined;
  seriesCode: SeriesCode;
  theme: Theme;
}

const ChartSection: React.FC<ChartSectionProps> = ({ loading, chartData, seriesCode, theme }) => (
  <View style={[styles.chartContainer, { marginBottom: theme.spacing.base, paddingTop: theme.spacing.base }]}>
    {loading ? (
      <View style={[styles.chartLoading, { height: CHART_HEIGHT }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    ) : (
      <Chart height={CHART_HEIGHT} data={chartData} seriesCode={seriesCode} />
    )}
    <View style={[styles.chartLabels, { marginTop: theme.spacing.sm }]}>
      {CHART_MONTH_LABELS.map((label, index) => (
        <AppText key={index} variant="xs" color="textSecondary" weight="bold">
          {label}
        </AppText>
      ))}
    </View>
  </View>
);

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
      <TouchableOpacity
        key={range}
        onPress={() => onTimeRangeChange(range)}
        style={[
          styles.timeRangeButton,
          {
            paddingHorizontal: theme.spacing.base,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.radii.full,
            backgroundColor:
              timeRange === range ? theme.colors.primary : theme.colors.surfaceSecondary,
          },
        ]}>
        <AppText
          variant="sm"
          weight="medium"
          color={timeRange === range ? 'textPrimary' : 'textSecondary'}>
          {range}
        </AppText>
      </TouchableOpacity>
    ))}
  </View>
);

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  valueColor?: string;
  theme: Theme;
  showInfoIcon?: boolean;
  onInfoPress?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  valueColor,
  theme,
  showInfoIcon,
  onInfoPress,
}) => (
  <Card style={styles.statCard}>
    <View style={{ gap: theme.spacing.sm }}>
      <View style={styles.titleRow}>
        <AppText variant="base" weight="medium" color="textSecondary">
          {title}
        </AppText>
        {showInfoIcon && (
          <TouchableOpacity
            onPress={onInfoPress}
            style={styles.infoIconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <InfoIcon size={16} />
          </TouchableOpacity>
        )}
      </View>
      <AppText
        variant="2xl"
        weight="bold"
        style={[{ lineHeight: 32 }, valueColor ? { color: valueColor } : {}]}>
        {value}
      </AppText>
      {subtitle && (
        <AppText variant="xs" color="textSecondary">
          {subtitle}
        </AppText>
      )}
    </View>
  </Card>
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
          title="Último Valor"
          value={indicator.value}
          subtitle={lastDataPointDate || undefined}
          theme={theme}
          showInfoIcon
          onInfoPress={handleInfoPress}
        />
        <StatCard
          title="Variación Mensual"
          value={changeLabel}
          valueColor={theme.colors.success}
          theme={theme}
        />
        <StatCard title="Última Actualización" value={indicator.lastUpdate} theme={theme} />
      </View>
      <InfoModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        title="Información sobre los datos"
        message={message}
        theme={theme}
      />
    </>
  );
};

interface InfoSectionProps {
  title: string;
  content: string;
  theme: Theme;
  marginBottom?: boolean;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, content, theme, marginBottom }) => (
  <Card style={marginBottom ? { marginBottom: theme.spacing.base } : undefined}>
    <AppText variant="sm" weight="medium" style={{ marginBottom: theme.spacing.sm }}>
      {title}
    </AppText>
    <AppText variant="sm" color="textSecondary">
      {content}
    </AppText>
  </Card>
);

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
      console.log('Missing data:', { hasIndicatorData: !!indicatorData, hasMetadata: !!metadata });
      return undefined;
    }
    const result = {
      ...indicatorData,
      description: metadata.description,
      methodology: metadata.methodology,
      source: metadata.source,
    };
    console.log('Indicator created:', {
      hasDescription: !!result.description,
      description: result.description,
      metadata: metadata,
    });
    return result;
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
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  // Error state (should not happen if API is working correctly)
  if (!indicator) {
    return (
      <ScreenContainer>
        <AppText>Indicador no encontrado</AppText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
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
      <HeaderSection value={indicator.value} changeLabel={changeLabel} theme={theme} />

      <ChartSection
        loading={historyLoading}
        chartData={chartData}
        seriesCode={seriesCode}
        theme={theme}
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
        title="Descripción"
        content={indicator.description || 'Sin descripción disponible'}
        theme={theme}
        marginBottom
      />

      {indicator.methodology && (
        <InfoSection
          title="Metodología y Notas"
          content={indicator.methodology}
          theme={theme}
          marginBottom
        />
      )}

      {indicator.source && (
        <InfoSection title="Fuente" content={indicator.source} theme={theme} />
      )}
    </ScreenContainer>
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
  section: {
    gap: 8, // theme.spacing.sm equivalent
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartContainer: {
    minHeight: 180,
  },
  chartLoading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoIconButton: {
    padding: 2,
    marginLeft: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '85%',
    maxWidth: 320,
    borderRadius: 16,
    padding: 0,
  },
  modalContent: {
    padding: 20,
  },
  modalButtonContainer: {
    alignItems: 'center',
  },
});
