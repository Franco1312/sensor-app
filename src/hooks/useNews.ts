/**
 * Custom hook for fetching news from the API with pagination using React Query
 * Optimized with caching and infinite scroll support
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { getNews, NewsItem } from '@/services/news-api';
import { News } from '@/types';

const ITEMS_PER_PAGE = 10;

interface UseNewsResult {
  news: News[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
}

/**
 * Query key factory for news
 */
export const newsKeys = {
  all: ['news'] as const,
  lists: () => [...newsKeys.all, 'list'] as const,
  list: (filters: { limit: number; offset: number }) => [...newsKeys.lists(), filters] as const,
};

/**
 * Transform news item from API to app format
 */
const transformNewsItem = (item: NewsItem): News => {
  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    link: item.link,
    sourceName: item.sourceName,
    publishedAt: item.publishedAt,
    fetchedAt: item.fetchedAt,
    categories: item.categories,
    imageUrl: item.imageUrl,
  };
};

/**
 * Hook to fetch and transform news from the API with pagination
 * Uses React Query infinite query for efficient pagination
 * @param enabled - Whether to fetch immediately (default: true)
 */
export const useNews = (enabled: boolean = true): UseNewsResult => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: newsKeys.lists(),
    queryFn: async ({ pageParam = 0 }) => {
      const apiData: NewsItem[] = await getNews(ITEMS_PER_PAGE, pageParam);
      return apiData
        .filter(item => item && item.id && item.title)
        .map(transformNewsItem);
    },
    getNextPageParam: (lastPage, allPages) => {
      // If last page has fewer items than ITEMS_PER_PAGE, no more pages
      if (lastPage.length < ITEMS_PER_PAGE) {
        return undefined;
      }
      // Otherwise, return the next offset
      return allPages.length * ITEMS_PER_PAGE;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialPageParam: 0,
  });

  // Flatten all pages into a single array
  const news = data?.pages.flat() || [];

  return {
    news,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Error al obtener las noticias') : null,
    hasMore: hasNextPage ?? false,
    loadMore: () => {
      if (hasNextPage && !isLoading) {
        fetchNextPage();
      }
    },
    refetch: () => {
      refetch();
    },
  };
};
