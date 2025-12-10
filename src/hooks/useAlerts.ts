/**
 * Custom hook for fetching and managing alerts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAlerts,
  getAlert,
  createAlert,
  updateAlert,
  deleteAlert,
  getAlertConfigs,
  CreateAlertRequest,
  UpdateAlertRequest,
  Alert,
  AlertSeriesFrontendConfig,
} from '@/services/alerts-api';

export const alertsKeys = {
  all: ['alerts'] as const,
  lists: () => [...alertsKeys.all, 'list'] as const,
  list: (userId: string) => [...alertsKeys.lists(), userId] as const,
  details: () => [...alertsKeys.all, 'detail'] as const,
  detail: (id: string) => [...alertsKeys.details(), id] as const,
  configs: () => [...alertsKeys.all, 'configs'] as const,
};

/**
 * Hook to fetch all alerts for a user
 */
export const useAlerts = (userId: string | null) => {
  return useQuery({
    queryKey: alertsKeys.list(userId || ''),
    queryFn: () => getAlerts(userId!),
    enabled: !!userId,
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook to fetch a single alert by ID
 */
export const useAlert = (alertId: string | null) => {
  return useQuery({
    queryKey: alertsKeys.detail(alertId || ''),
    queryFn: () => getAlert(alertId!),
    enabled: !!alertId,
  });
};

/**
 * Hook to create a new alert
 */
export const useCreateAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateAlertRequest) => createAlert(request),
    onSuccess: (_, variables) => {
      // Invalidate alerts list for the user
      queryClient.invalidateQueries({ queryKey: alertsKeys.list(variables.userId) });
    },
  });
};

/**
 * Hook to update an alert
 */
export const useUpdateAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ alertId, request }: { alertId: string; request: UpdateAlertRequest }) =>
      updateAlert(alertId, request),
    onSuccess: (data) => {
      // Invalidate the specific alert
      queryClient.invalidateQueries({ queryKey: alertsKeys.detail(data.id) });
      // Invalidate alerts list for the user
      queryClient.invalidateQueries({ queryKey: alertsKeys.list(data.userId) });
    },
  });
};

/**
 * Hook to delete an alert
 */
export const useDeleteAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId: string) => deleteAlert(alertId),
    onSuccess: (_, alertId) => {
      // Invalidate all alerts queries
      queryClient.invalidateQueries({ queryKey: alertsKeys.all });
    },
  });
};

/**
 * Hook to fetch alert configurations (series with their capabilities)
 * This is cached for a longer time since configs don't change frequently
 */
export const useAlertConfigs = () => {
  return useQuery({
    queryKey: alertsKeys.configs(),
    queryFn: () => getAlertConfigs(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });
};

