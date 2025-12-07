/**
 * NewsScreen - Lista de noticias
 * Based on design/newsScreen design
 */

import React, { useCallback } from 'react';
import { View, FlatList, Linking, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Screen, Header } from '@/components/layout';
import { NewsCard } from '@/components/features/news';
import { Text, Skeleton, EmptyState, NotificationIcon } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useNews } from '@/hooks/useNews';
import { News } from '@/types';
import { useTranslation } from '@/i18n';

export const NewsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { news, loading, error, hasMore, loadMore, refetch } = useNews();

  // Reload news when screen is focused
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleNewsPress = useCallback((newsItem: News) => {
    if (newsItem.link) {
      Linking.openURL(newsItem.link).catch(err => {
        console.error('Error opening link:', err);
      });
    }
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  const renderNewsItem = useCallback(({ item }: { item: News }) => {
    return (
      <NewsCard
        news={item}
        onPress={() => handleNewsPress(item)}
        onVerMasPress={() => handleNewsPress(item)}
      />
    );
  }, [handleNewsPress]);

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
            title={t('screens.news.error.title')}
            message={t('screens.news.error.message', { error })}
          />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, paddingHorizontal: theme.spacing.base, paddingTop: theme.spacing.lg }}>
        <EmptyState
          title={t('screens.news.empty.title')}
          message={t('screens.news.empty.message')}
        />
      </View>
    );
  };

  return (
    <Screen scrollable={false}>
      <Header
        title={t('screens.news.title')}
        rightIcon={<NotificationIcon size={24} />}
      />

      <View style={{ flex: 1, paddingHorizontal: theme.spacing.base }}>
        <FlatList
          data={news}
          renderItem={renderNewsItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            paddingTop: theme.spacing.sm,
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

