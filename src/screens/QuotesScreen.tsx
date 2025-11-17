/**
 * QuotesScreen - Lista de cotizaciones
 * Based on detalle_cotizacion design
 */

import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { ScreenContainer, Header, ListItem } from '@/components/layout';
import { AppText } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { mockQuotes } from '@/utils/mockData';
import { Quote } from '@/types';

type CategoryTab = 'Dólares' | 'Acciones' | 'Bonos' | 'Cripto';

export const QuotesScreen: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<CategoryTab>('Dólares');

  const tabs: CategoryTab[] = ['Dólares', 'Acciones', 'Bonos', 'Cripto'];

  const categoryMap: Record<CategoryTab, string> = {
    Dólares: 'dolares',
    Acciones: 'acciones',
    Bonos: 'bonos',
    Cripto: 'cripto',
  };

  const filteredQuotes = mockQuotes.filter(quote => quote.category === categoryMap[activeTab]);

  const renderQuote = ({ item }: { item: Quote }) => {
    const isPositive = item.changePercent >= 0;
    const changeLabel = `${isPositive ? '+' : ''}${item.changePercent.toFixed(2)}%`;
    const changeValue = `${isPositive ? '+' : ''}$${Math.abs(item.change).toFixed(2)}`;

    return (
      <ListItem
        title={item.name}
        subtitle={`Venta: ${item.sellPrice}`}
        rightContent={
          <View style={{ alignItems: 'flex-end', gap: 4 }}>
            <AppText
              variant="base"
              weight="medium"
              style={{
                color: isPositive ? theme.colors.success : theme.colors.error,
              }}>
              {changeLabel}
            </AppText>
            <AppText
              variant="xs"
              style={{
                color: isPositive ? theme.colors.success : theme.colors.error,
              }}>
              {changeValue}
            </AppText>
          </View>
        }
        style={{
          marginBottom: theme.spacing.md,
          backgroundColor: theme.colors.surface,
        }}
        onPress={() => {
          // Navigate to quote detail
        }}
      />
    );
  };

  return (
    <ScreenContainer>
      <Header
        title="Cotizaciones"
        leftIcon={<AppText variant="2xl">🔍</AppText>}
        rightIcon={<AppText variant="2xl">☀️</AppText>}
      />

      {/* Category Tabs */}
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          backgroundColor: theme.colors.background,
        }}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{
              flex: 1,
              paddingVertical: theme.spacing.base,
              alignItems: 'center',
              borderBottomWidth: activeTab === tab ? 3 : 0,
              borderBottomColor: activeTab === tab ? theme.colors.primary : 'transparent',
            }}>
            <AppText
              variant="sm"
              weight={activeTab === tab ? 'bold' : 'normal'}
              color={activeTab === tab ? 'textPrimary' : 'textSecondary'}>
              {tab}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Last Update */}
      <View style={{ padding: theme.spacing.base, alignItems: 'center' }}>
        <AppText variant="xs" color="textSecondary">
          Actualizado: 14:32:05 hs
        </AppText>
      </View>

      {/* Quotes List */}
      <View style={{ flex: 1, paddingHorizontal: theme.spacing.base }}>
        <FlatList
          data={filteredQuotes}
          renderItem={renderQuote}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingTop: theme.spacing.md }}
        />
      </View>
    </ScreenContainer>
  );
};
