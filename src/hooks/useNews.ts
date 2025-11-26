/**
 * Custom hook for fetching news from the API with pagination
 */

import { useState, useEffect, useCallback } from 'react';
import { getNews, NewsItem } from '@/services/news-api';
import { ApiError } from '@/services/common/ApiError';
import { News } from '@/types';

interface UseNewsResult {
  news: News[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

const ITEMS_PER_PAGE = 10;

/**
 * Hook to fetch and transform news from the API with pagination
 * @param enabled - Whether to fetch immediately (default: true)
 */
export const useNews = (enabled: boolean = true): UseNewsResult => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const transformNewsItem = useCallback((item: NewsItem): News => {
    return {
      id: item.id,
      sourceId: item.sourceId,
      sourceName: item.sourceName,
      title: item.title,
      summary: item.summary,
      link: item.link,
      publishedAt: item.publishedAt,
      fetchedAt: item.fetchedAt,
      categories: item.categories,
      imageUrl: item.imageUrl,
    };
  }, []);

  const fetchNews = useCallback(async (currentOffset: number, append: boolean = false) => {
    if (!enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiData: NewsItem[] = await getNews(ITEMS_PER_PAGE, currentOffset);
      // Filtrar elementos inválidos y transformar
      const transformed = apiData
        .filter(item => item && item.id && item.title) // Validar que tenga datos mínimos
        .map(transformNewsItem);
      
      if (append) {
        setNews(prev => [...prev, ...transformed]);
      } else {
        setNews(transformed);
      }

      // Check if there are more items to load
      setHasMore(apiData.length === ITEMS_PER_PAGE);
      setOffset(currentOffset + apiData.length);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Error al obtener las noticias. Por favor, intenta nuevamente.';
      setError(errorMessage);
      if (!append) {
        setNews([]);
      }
    } finally {
      setLoading(false);
    }
  }, [enabled, transformNewsItem]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore && !error) {
      await fetchNews(offset, true);
    }
  }, [loading, hasMore, error, offset, fetchNews]);

  const refetch = useCallback(async () => {
    setOffset(0);
    setHasMore(true);
    await fetchNews(0, false);
  }, [fetchNews]);

  useEffect(() => {
    fetchNews(0, false);
  }, [fetchNews]);

  return {
    news,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
  };
};

