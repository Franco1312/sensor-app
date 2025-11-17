/**
 * HomeScreen - Dashboard principal
 * Based on HOME/_dashboard_principal design
 */

import React from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { ScreenContainer, Header, SectionTitle } from '@/components/layout';
import { Card, AppText, Tag } from '@/components/common';
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
        style={{ flex: 1, margin: theme.spacing.sm }}
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Tag
              label={changeLabel}
              variant={isPositive ? 'positive' : item.trend === 'down' ? 'negative' : 'neutral'}
            />
          </View>
          {/* Placeholder for chart - in production use react-native-svg or chart library */}
          <View
            style={{
              height: 60,
              marginTop: theme.spacing.sm,
              backgroundColor: theme.colors.surfaceSecondary,
              borderRadius: theme.radii.base,
            }}
          />
        </View>
      </Card>
    );
  };

  const renderQuoteCard = ({ item }: { item: Quote }) => {
    const isPositive = item.changePercent >= 0;
    const changeLabel = `${isPositive ? '+' : ''}${item.changePercent.toFixed(2)}%`;

    return (
      <Card
        style={{ flex: 1, margin: theme.spacing.sm }}
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Tag label={changeLabel} variant={isPositive ? 'positive' : 'negative'} />
          </View>
          {/* Placeholder for chart */}
          <View
            style={{
              height: 60,
              marginTop: theme.spacing.sm,
              backgroundColor: theme.colors.surfaceSecondary,
              borderRadius: theme.radii.base,
            }}
          />
        </View>
      </Card>
    );
  };

  return (
    <ScreenContainer>
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

      <SectionTitle title="Indicadores Principales" />
      <FlatList
        data={mockIndicators.slice(0, 4)}
        renderItem={renderIndicatorCard}
        keyExtractor={item => item.id}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={{ paddingHorizontal: theme.spacing.base }}
      />

      <SectionTitle title="Cotizaciones de Mercado" />
      <FlatList
        data={mockQuotes.slice(0, 4)}
        renderItem={renderQuoteCard}
        keyExtractor={item => item.id}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={{ paddingHorizontal: theme.spacing.base }}
      />
    </ScreenContainer>
  );
};
