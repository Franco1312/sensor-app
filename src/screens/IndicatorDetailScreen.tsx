/**
 * IndicatorDetailScreen - Detalle de indicador con gráfico
 * Based on detalle_indicador design
 */

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/navigation/types';
import { ScreenContainer } from '@/components/layout';
import { Card, AppText, Chart } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { getIndicatorById } from '@/utils/mockData';

type IndicatorDetailRouteProp = RouteProp<RootStackParamList, 'IndicatorDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type TimeRange = '1M' | '3M' | '1A' | '5A' | 'Máx';

export const IndicatorDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<IndicatorDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { indicatorId } = route.params;
  const [timeRange, setTimeRange] = useState<TimeRange>('1A');

  const indicator = getIndicatorById(indicatorId);

  // Set header title dynamically
  useEffect(() => {
    if (indicator) {
      navigation.setOptions({
        title: indicator.name,
      });
    }
  }, [indicator, navigation]);

  if (!indicator) {
    return (
      <ScreenContainer>
        <AppText>Indicador no encontrado</AppText>
      </ScreenContainer>
    );
  }

  const isPositive = indicator.trend === 'up';
  const changeLabel = `${isPositive ? '+' : ''}${indicator.changePercent.toFixed(1)}%`;

  const timeRanges: TimeRange[] = ['1M', '3M', '1A', '5A', 'Máx'];

  const insets = useSafeAreaInsets();

  return (
    <ScreenContainer 
      safeAreaEdges={[]}
      contentContainerStyle={{ 
        padding: theme.spacing.base,
        paddingTop: theme.spacing.md,
        paddingBottom: insets.bottom + theme.spacing.lg,
      }}>
        {/* Main Value */}
        <View style={{ gap: theme.spacing.sm, marginBottom: theme.spacing.lg }}>
          <AppText variant="base" weight="medium" color="textSecondary">
            Evolución Histórica
          </AppText>
          <AppText variant="5xl" weight="bold" style={{ lineHeight: 48 }}>
            {indicator.value}
          </AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
            <AppText variant="base" color="textSecondary">
              Último Año
            </AppText>
            <AppText variant="base" weight="medium" style={{ color: theme.colors.success }}>
              {changeLabel}
            </AppText>
          </View>
        </View>

        {/* Chart */}
        <View
          style={{
            minHeight: 180,
            marginBottom: theme.spacing.base,
            paddingTop: theme.spacing.base,
          }}>
          <Chart height={148} />
          {/* Chart labels */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: theme.spacing.sm,
            }}>
            {['Ene', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((label, index) => (
              <AppText key={index} variant="xs" color="textSecondary" weight="bold">
                {label}
              </AppText>
            ))}
          </View>
        </View>

        {/* Time Range Selector */}
        <View
          style={{
            flexDirection: 'row',
            gap: theme.spacing.sm,
            marginBottom: theme.spacing.lg,
            justifyContent: 'center',
          }}>
          {timeRanges.map(range => (
            <TouchableOpacity
              key={range}
              onPress={() => setTimeRange(range)}
              style={{
                paddingHorizontal: theme.spacing.base,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.radii.full,
                backgroundColor:
                  timeRange === range ? theme.colors.primary : theme.colors.surfaceSecondary,
              }}>
              <AppText
                variant="sm"
                weight="medium"
                color={timeRange === range ? 'textPrimary' : 'textSecondary'}>
                {range}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Cards */}
        <View
          style={{
            flexDirection: 'row',
            gap: theme.spacing.base,
            marginBottom: theme.spacing.lg,
            flexWrap: 'wrap',
          }}>
          <Card style={{ flex: 1, minWidth: 158 }}>
            <View style={{ gap: theme.spacing.sm }}>
              <AppText variant="base" weight="medium" color="textSecondary">
                Último Valor
              </AppText>
              <AppText variant="2xl" weight="bold" style={{ lineHeight: 32 }}>
                {indicator.value}
              </AppText>
            </View>
          </Card>
          <Card style={{ flex: 1, minWidth: 158 }}>
            <View style={{ gap: theme.spacing.sm }}>
              <AppText variant="base" weight="medium" color="textSecondary">
                Variación Mensual
              </AppText>
              <AppText
                variant="2xl"
                weight="bold"
                style={{ lineHeight: 32, color: theme.colors.success }}>
                {changeLabel}
              </AppText>
            </View>
          </Card>
          <Card style={{ flex: 1, minWidth: 158 }}>
            <View style={{ gap: theme.spacing.sm }}>
              <AppText variant="base" weight="medium" color="textSecondary">
                Última Actualización
              </AppText>
              <AppText variant="2xl" weight="bold" style={{ lineHeight: 32 }}>
                {indicator.lastUpdate}
              </AppText>
            </View>
          </Card>
        </View>

        {/* Methodology Section */}
        {indicator.methodology && (
          <Card style={{ marginBottom: theme.spacing.base }}>
            <AppText variant="sm" weight="medium" style={{ marginBottom: theme.spacing.sm }}>
              Metodología y Notas
            </AppText>
            <AppText variant="sm" color="textSecondary">
              {indicator.methodology}
            </AppText>
          </Card>
        )}

        {/* Source Section */}
        {indicator.source && (
          <Card>
            <AppText variant="sm" weight="medium" style={{ marginBottom: theme.spacing.sm }}>
              Fuente
            </AppText>
            <AppText variant="sm" color="textSecondary">
              {indicator.source}
            </AppText>
          </Card>
        )}
    </ScreenContainer>
  );
};
