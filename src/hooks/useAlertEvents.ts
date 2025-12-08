/**
 * Custom hook for fetching alert events
 */

import { useQuery } from '@tanstack/react-query';
import { getAlertEvents, PaginatedResult, AlertEvent } from '@/services/alerts-api';

export const alertEventsKeys = {
  all: ['alertEvents'] as const,
  lists: () => [...alertEventsKeys.all, 'list'] as const,
  list: (alertId: string) => [...alertEventsKeys.lists(), alertId] as const,
  listWithPagination: (alertId: string, page: number, limit: number) =>
    [...alertEventsKeys.list(alertId), page, limit] as const,
};

/**
 * Hook to fetch events for an alert with pagination
 */
export const useAlertEvents = (
  alertId: string | null,
  page: number = 1,
  limit: number = 20
) => {
  return useQuery<PaginatedResult<AlertEvent>>({
    queryKey: alertEventsKeys.listWithPagination(alertId || '', page, limit),
    queryFn: () => getAlertEvents(alertId!, page, limit),
    enabled: !!alertId,
    staleTime: 60000, // 1 minute
  });
};

