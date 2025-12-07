/**
 * DetailScreenLayout - Generic layout component for detail screens
 * Used by IndicatorDetailScreen, QuoteDetailScreen, and CryptoDetailScreen
 * to eliminate code duplication
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, Container } from '@/components/layout';
import { Card, Text, Skeleton, EmptyState, FilterButton, ValueHeader, StatCard, StatCardSkeleton } from '../components';
import { ChartWithLabels } from '@/components/features/charts';
import { useTheme } from '@/theme/ThemeProvider';
import { useTranslation } from '@/i18n';
import { ChartDataPoint } from '@/utils/seriesTransform';
import { SeriesCode } from '@/constants/series';

// ============================================================================
// Types
// ============================================================================

export interface StatCardData {
  title: string;
  value: string;
  subtitle?: string;
  valueColor?: string;
  showInfoIcon?: boolean;
  onInfoPress?: () => void;
}

export interface InfoSectionData {
  title: string;
  content: string;
}

export interface TimeRangeOption {
  value: string;
  label: string;
}

export interface DetailScreenConfig {
  // Header
  title?: string;
  value: string;
  changeLabel: string;
  changeColor?: string;
  valueColor?: string;

  // Chart
  chartData?: ChartDataPoint[];
  chartHeight?: number;
  chartLoading?: boolean;
  seriesCode?: SeriesCode;

  // Time Range Selector (optional)
  timeRange?: string;
  timeRangeOptions?: TimeRangeOption[];
  onTimeRangeChange?: (range: string) => void;
  renderTimeRangeSelector?: () => ReactNode;

  // Stats
  stats: StatCardData[];

  // Info Sections (optional, mainly for indicators)
  infoSections?: InfoSectionData[];

  // Additional Content (optional, for custom content like crypto stats)
  additionalContent?: ReactNode;

  // States
  loading?: boolean;
  error?: string;
  errorTitle?: string;
  errorMessage?: string;

  // Loading skeleton customization
  renderLoadingSkeleton?: () => ReactNode;
}

// ============================================================================
// Sub-components
// ============================================================================

interface StatsSectionProps {
  stats: StatCardData[];
  theme: ReturnType<typeof useTheme>['theme'];
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats, theme }) => (
  <View style={[styles.statsContainer, { gap: theme.spacing.sm, marginBottom: theme.spacing.base }]}>
    {stats.map((stat, index) => (
      <StatCard
        key={index}
        title={stat.title}
        value={stat.value}
        subtitle={stat.subtitle}
        valueColor={stat.valueColor}
        showInfoIcon={stat.showInfoIcon}
        onInfoPress={stat.onInfoPress}
      />
    ))}
  </View>
);

interface InfoSectionsProps {
  sections: InfoSectionData[];
  theme: ReturnType<typeof useTheme>['theme'];
}

const InfoSections: React.FC<InfoSectionsProps> = ({ sections, theme }) => (
  <>
    {sections.map((section, index) => (
      <Card
        key={index}
        padding="sm"
        style={index < sections.length - 1 ? { marginBottom: theme.spacing.xs } : undefined}>
        <View style={{ gap: 4 }}>
          <Text variant="xs" weight="semibold" color="textPrimary">
            {section.title}
          </Text>
          <Text variant="xs" color="textSecondary" style={{ lineHeight: 16 }}>
            {section.content}
          </Text>
        </View>
      </Card>
    ))}
  </>
);

// ============================================================================
// Main Component
// ============================================================================

export const DetailScreenLayout: React.FC<DetailScreenConfig> = ({
  title,
  value,
  changeLabel,
  changeColor,
  valueColor,
  chartData,
  chartHeight = 148,
  chartLoading = false,
  seriesCode,
  timeRange,
  timeRangeOptions,
  onTimeRangeChange,
  renderTimeRangeSelector,
  stats,
  infoSections,
  additionalContent,
  loading = false,
  error,
  errorTitle,
  errorMessage,
  renderLoadingSkeleton,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Loading state
  if (loading) {
    if (renderLoadingSkeleton) {
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
          {renderLoadingSkeleton()}
        </Screen>
      );
    }

    // Default loading skeleton
    return (
      <Screen
        scrollable={true}
        safeAreaEdges={[]}
        contentContainerStyle={[
          styles.container,
          {
            padding: theme.spacing.base,
            paddingTop: theme.spacing.sm,
            paddingBottom: insets.bottom + theme.spacing.base,
          },
        ]}>
        {/* Header skeleton */}
        <Container gap={theme.spacing.sm} style={{ marginBottom: theme.spacing.lg }}>
          <Skeleton width="40%" height={16} />
          <Skeleton width="60%" height={48} />
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <Skeleton width="30%" height={16} />
            <Skeleton width="20%" height={16} />
          </View>
        </Container>

        {/* Chart skeleton */}
        <ChartWithLabels loading={true} height={chartHeight} />

        {/* Time range selector skeleton */}
        {timeRangeOptions && timeRangeOptions.length > 0 && (
          <View
            style={[
              styles.timeRangeContainer,
              { gap: theme.spacing.sm, marginBottom: theme.spacing.lg, marginTop: theme.spacing.base },
            ]}>
            {timeRangeOptions.map((_, index) => (
              <Skeleton key={index} width={50} height={32} borderRadius={16} />
            ))}
          </View>
        )}

        {/* Stats skeleton */}
        <View style={[styles.statsContainer, { gap: theme.spacing.base, marginBottom: theme.spacing.lg }]}>
          {stats.map((_, index) => (
            <Card key={index} style={styles.statCard}>
              <StatCardSkeleton />
            </Card>
          ))}
        </View>
      </Screen>
    );
  }

  // Error state
  if (error) {
    return (
      <Screen>
        <EmptyState title={errorTitle || t('components.common.error')} message={errorMessage || error} />
      </Screen>
    );
  }

  // Main content
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
      {/* Header */}
      <Container gap={theme.spacing.xs} style={{ marginBottom: theme.spacing.sm }}>
        <ValueHeader
          title={title}
          value={value}
          changeLabel={changeLabel}
          changeColor={changeColor}
          valueColor={valueColor}
        />
      </Container>

      {/* Chart */}
      <ChartWithLabels
        loading={chartLoading}
        chartData={chartData}
        seriesCode={seriesCode}
        height={chartHeight}
      />

      {/* Time Range Selector */}
      {renderTimeRangeSelector ? (
        renderTimeRangeSelector()
      ) : timeRangeOptions && timeRangeOptions.length > 0 && onTimeRangeChange ? (
        <View style={[styles.timeRangeContainer, { gap: theme.spacing.sm, marginBottom: theme.spacing.sm, marginTop: theme.spacing.xs }]}>
          {timeRangeOptions.map(option => (
            <FilterButton
              key={option.value}
              label={option.label}
              isSelected={timeRange === option.value}
              onPress={() => onTimeRangeChange(option.value)}
              fullWidth
            />
          ))}
        </View>
      ) : null}

      {/* Stats */}
      <StatsSection stats={stats} theme={theme} />

      {/* Additional Content (e.g., crypto-specific stats) */}
      {additionalContent}

      {/* Info Sections (e.g., description, methodology, source) */}
      {infoSections && infoSections.length > 0 && <InfoSections sections={infoSections} theme={theme} />}
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

