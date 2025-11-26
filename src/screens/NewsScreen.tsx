/**
 * NewsScreen - Lista de noticias
 * Based on design/newsScreen design
 */

import React from 'react';
import { View, FlatList, Linking, ActivityIndicator } from 'react-native';
import { Screen, Header } from '@/components/layout';
import { NewsCard } from '@/components/features/news';
import { Text, Skeleton } from '@/components/ui';
import { EmptyState, NotificationIcon } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { useNews } from '@/hooks/useNews';
import { News } from '@/types';

export const NewsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { news, loading, error, hasMore, loadMore } = useNews();

  const handleNewsPress = (newsItem: News) => {
    if (newsItem.link) {
      Linking.openURL(newsItem.link).catch(err => {
        console.error('Error opening link:', err);
      });
    }
  };

  const handleEndReached = () => {
    if (hasMore && !loading) {
      loadMore();
    }
  };

  const renderNewsItem = ({ item }: { item: News }) => {
    return (
      <NewsCard
        news={item}
        onPress={() => handleNewsPress(item)}
        onVerMasPress={() => handleNewsPress(item)}
      />
    );
  };

  const renderFooter = () => {
    if (!loading || !hasMore) {
      return null;
    }
    return (
      <View style={{ paddingVertical: theme.spacing.lg, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={{ paddingHorizontal: theme.spacing.base, paddingTop: theme.spacing.md }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <View key={`skeleton-${index}`} style={{ marginBottom: theme.spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.base }}>
                <View style={{ flex: 1, gap: theme.spacing.xs }}>
                  <Skeleton width="30%" height={12} />
                  <Skeleton width="90%" height={16} />
                  <Skeleton width="100%" height={14} />
                  <Skeleton width="80%" height={14} />
                </View>
                <Skeleton width={96} height={96} borderRadius={theme.radii.base} />
              </View>
              <Skeleton width="100%" height={40} borderRadius={theme.radii.base} style={{ marginTop: theme.spacing.sm }} />
            </View>
          ))}
        </View>
      );
    }

    if (error) {
      return (
        <View style={{ flex: 1, paddingHorizontal: theme.spacing.base, paddingTop: theme.spacing.lg }}>
          <EmptyState
            title="Error al cargar noticias"
            message={error}
          />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, paddingHorizontal: theme.spacing.base, paddingTop: theme.spacing.lg }}>
        <EmptyState
          title="No hay noticias disponibles"
          message="No se encontraron noticias en este momento."
        />
      </View>
    );
  };

  return (
    <Screen scrollable={false}>
      <Header
        title="Noticias"
        rightIcon={<NotificationIcon size={24} />}
      />

      <View style={{ flex: 1, paddingHorizontal: theme.spacing.base }}>
        <FlatList
          data={news}
          renderItem={renderNewsItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            paddingTop: theme.spacing.md,
            paddingBottom: theme.spacing.xl,
          }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Screen>
  );
};

