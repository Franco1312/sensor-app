/**
 * FeaturedNewsSection - Section component for featured news in HomeScreen
 */

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Section } from '@/components/layout';
import { Card, Skeleton, VerMasButton } from '@/components/common';
import { NewsCard } from '@/components/features/news';
import { useTheme } from '@/theme/ThemeProvider';
import { useTranslation } from '@/i18n';
import { News } from '@/types';

interface FeaturedNewsSectionProps {
  featuredNews: News[];
  loading: boolean;
  onVerMas: () => void;
  onNewsPress: (news: News) => void;
}

export const FeaturedNewsSection: React.FC<FeaturedNewsSectionProps> = ({
  featuredNews,
  loading,
  onVerMas,
  onNewsPress,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const handleNewsPress = useCallback(
    (news: News) => {
      onNewsPress(news);
    },
    [onNewsPress]
  );

  return (
    <View style={styles.section}>
      <Section 
        title={t('screens.home.sections.featuredNews')} 
        onVerMasPress={featuredNews.length > 0 ? onVerMas : undefined}
      />
      <View style={styles.newsContainer}>
        {loading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <View key={`news-skeleton-${index}`} style={styles.newsItem}>
              <Card variant="elevated" padding="base">
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
              </Card>
            </View>
          ))
        ) : featuredNews.length > 0 ? (
          featuredNews.map(newsItem => (
            <View key={newsItem.id} style={styles.newsItem}>
              <NewsCard news={newsItem} onVerMasPress={() => handleNewsPress(newsItem)} showVisitButton={false} />
            </View>
          ))
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 12,
    paddingBottom: 0,
  },
  newsContainer: {
    gap: 12,
    marginTop: 8,
  },
  newsItem: {
    width: '100%',
  },
});

