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
 * Simple hash function to generate a short hash from a string
 * Used to create unique IDs for news items
 */
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};

/**
 * Transform news item from API to app format
 * Creates a unique ID by combining id with a hash of multiple unique fields to avoid duplicates
 */
const transformNewsItem = (item: NewsItem, pageIndex: number, itemIndex: number): News => {
  // Create a unique ID by combining id with a hash of multiple fields
  // This ensures uniqueness even if the API returns duplicate ids
  const uniqueFields = [
    item.link || '',
    item.publishedAt || '',
    item.title || '',
    item.sourceId || '',
  ].join('|');

  const fieldsHash = simpleHash(uniqueFields);
  // Include pageIndex and itemIndex as additional uniqueness guarantee
  const uniqueId = `${item.id}-${fieldsHash}-${pageIndex}-${itemIndex}`;
  
    return {
    id: uniqueId,
      sourceId: item.sourceId,
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
      // Calculate page index from offset
      const pageIndex = Math.floor(pageParam / ITEMS_PER_PAGE);
      return apiData
        .filter(item => item && item.id && item.title)
        .map((item, itemIndex) => transformNewsItem(item, pageIndex, itemIndex));
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
  const news = data?.pages.reduce((acc, page) => [...acc, ...page], []) || [];

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
