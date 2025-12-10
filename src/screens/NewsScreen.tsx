/**
 * NewsScreen - Lista de noticias
 * Based on design/newsScreen design
 */

import React, { useCallback, useEffect } from 'react';
import { View, FlatList, Linking, ActivityIndicator } from 'react-native';
import { Screen, Header } from '@/components/layout';
import { NewsCard } from '@/components/features/news';
import { AdBanner } from '@/components/common';
import { Text, Skeleton, EmptyState, NotificationIcon } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useNews } from '@/hooks/useNews';
import { News } from '@/types';
import { useTranslation } from '@/i18n';
import { useScreenTracking, SCREEN_NAMES } from '@/core/analytics';
import { analytics } from '@/core/analytics';

export const NewsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { news, loading, error, hasMore, loadMore, refetch } = useNews();

  // Track screen view
  useScreenTracking(SCREEN_NAMES.NEWS_LIST);

  // Track news list viewed event
  useEffect(() => {
    analytics.trackNewsListViewed();
  }, []);

  // No need to reload on focus - React Query handles caching automatically

  const handleNewsPress = useCallback((newsItem: News) => {
    if (newsItem.link) {
      analytics.trackNewsArticleOpened({
        article_id: newsItem.id,
        url: newsItem.link,
        source: newsItem.sourceName || 'news_list',
        category: newsItem.categories?.[0],
      });
      
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

  const renderNewsItem = useCallback(({ item, index }: { item: News; index: number }) => {
    return (
      <>
        <NewsCard
          news={item}
          onPress={() => handleNewsPress(item)}
          onVerMasPress={() => handleNewsPress(item)}
        />
        {/* Ad after every 3rd news item (non-intrusive) */}
        {(index + 1) % 3 === 0 && index < news.length - 1 && (
          <View style={{ marginVertical: theme.spacing.sm }}>
            <AdBanner marginVertical="sm" placement="news_list_inline" />
          </View>
        )}
      </>
    );
  }, [handleNewsPress, news.length, theme.spacing.sm]);

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
          renderItem={({ item, index }) => renderNewsItem({ item, index })}
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
          // Performance optimizations
          windowSize={10}
          initialNumToRender={8}
          maxToRenderPerBatch={4}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}
        />
      </View>
    </Screen>
  );
};

