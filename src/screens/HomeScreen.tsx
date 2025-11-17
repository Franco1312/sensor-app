/**
 * HomeScreen - Dashboard principal
 * Based on HOME/_dashboard_principal design
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { ScreenContainer, Header, SectionTitle } from '@/components/layout';
import { Card, AppText, Tag, MiniChart } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { mockIndicators, mockQuotes } from '@/utils/mockData';
import { Indicator, Quote } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const renderIndicatorCard = ({ item }: { item: Indicator }) => {
    const isPositive = item.trend === 'up';
    const changeLabel = `${isPositive ? '+' : ''}${item.changePercent.toFixed(2)}%`;

    return (
      <Card
        onPress={() =>
          navigation.navigate('IndicatorDetail', {
            indicatorId: item.id,
            indicatorName: item.name,
          })
        }>
        <View style={{ gap: theme.spacing.sm }}>
          <AppText variant="sm" color="textSecondary" weight="medium">
            {item.name}
          </AppText>
          <AppText variant="3xl" weight="bold" style={{ lineHeight: 32 }}>
            {item.value}
          </AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, flexWrap: 'wrap' }}>
            <Tag
              label={changeLabel}
              variant={isPositive ? 'positive' : item.trend === 'down' ? 'negative' : 'neutral'}
            />
            <AppText variant="xs" color="textSecondary">
              Actualizado: {item.lastUpdate}
            </AppText>
          </View>
          <View style={{ minHeight: 60, marginTop: theme.spacing.sm }}>
            <MiniChart trend={item.trend} height={60} />
          </View>
        </View>
      </Card>
    );
  };

  const renderQuoteCard = ({ item }: { item: Quote }) => {
    const isPositive = item.changePercent >= 0;
    const changeLabel = `${isPositive ? '+' : ''}${item.changePercent.toFixed(2)}%`;

    return (
      <Card
        onPress={() => {
          // Navigate to quote detail if needed
        }}>
        <View style={{ gap: theme.spacing.sm }}>
          <AppText variant="sm" color="textSecondary" weight="medium">
            {item.name}
          </AppText>
          <AppText variant="3xl" weight="bold" style={{ lineHeight: 32 }}>
            {item.sellPrice}
          </AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, flexWrap: 'wrap' }}>
            <Tag label={changeLabel} variant={isPositive ? 'positive' : 'negative'} />
            <AppText variant="xs" color="textSecondary">
              Actualizado: {item.lastUpdate}
            </AppText>
          </View>
          <View style={{ minHeight: 60, marginTop: theme.spacing.sm }}>
            <MiniChart trend={isPositive ? 'up' : 'down'} height={60} />
          </View>
        </View>
      </Card>
    );
  };

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title="Radar Económico"
        leftIcon={
          <AppText variant="2xl" style={{ color: theme.colors.primary }}>
            📊
          </AppText>
        }
        rightIcon={
          <AppText variant="2xl" style={{ color: theme.colors.textPrimary }}>
            ☀️
          </AppText>
        }
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
        showsVerticalScrollIndicator={false}>
        <SectionTitle title="Indicadores Principales" />
        <View
          style={{
            paddingHorizontal: theme.spacing.base,
            marginBottom: theme.spacing.lg,
            gap: theme.spacing.base,
          }}>
          {mockIndicators.slice(0, 4).map(item => (
            <View key={item.id}>
              {renderIndicatorCard({ item })}
            </View>
          ))}
        </View>

        <SectionTitle title="Cotizaciones de Mercado" />
        <View
          style={{
            paddingHorizontal: theme.spacing.base,
            gap: theme.spacing.base,
          }}>
          {mockQuotes.slice(0, 4).map(item => (
            <View key={item.id}>
              {renderQuoteCard({ item })}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};
