/**
 * Alerts API Client
 * Handles all requests to the alerts-engine-api service
 */

import {
  Alert,
  CreateAlertRequest,
  UpdateAlertRequest,
  AlertEvent,
  PaginatedResult,
  EvaluateAlertsRequest,
  EvaluateAlertsResponse,
  AlertSeriesFrontendConfig,
} from './types';
import { ApiError } from '../common/ApiError';
import { ALERTS_API_BASE_URL } from './config';

/**
 * Generic fetch helper for alerts API
 */
const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const response = await fetch(`${ALERTS_API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      error
    );
  }
};

/**
 * Creates a new alert
 */
export const createAlert = async (request: CreateAlertRequest): Promise<Alert> => {
  return apiFetch<Alert>('/alerts', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

/**
 * Gets all alerts for a user
 */
export const getAlerts = async (userId: string): Promise<Alert[]> => {
  return apiFetch<Alert[]>(`/alerts?userId=${encodeURIComponent(userId)}`);
};

/**
 * Gets a single alert by ID
 */
export const getAlert = async (alertId: string): Promise<Alert> => {
  return apiFetch<Alert>(`/alerts/${encodeURIComponent(alertId)}`);
};

/**
 * Updates an alert
 */
export const updateAlert = async (
  alertId: string,
  request: UpdateAlertRequest
): Promise<Alert> => {
  return apiFetch<Alert>(`/alerts/${encodeURIComponent(alertId)}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
};

/**
 * Deletes an alert
 */
export const deleteAlert = async (alertId: string): Promise<void> => {
  await apiFetch<void>(`/alerts/${encodeURIComponent(alertId)}`, {
    method: 'DELETE',
  });
};

/**
 * Gets events for an alert with pagination
 */
export const getAlertEvents = async (
  alertId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResult<AlertEvent>> => {
  return apiFetch<PaginatedResult<AlertEvent>>(
    `/alerts/${encodeURIComponent(alertId)}/events?page=${page}&limit=${limit}`
  );
};

/**
 * Evaluates alerts manually (for testing)
 */
export const evaluateAlerts = async (
  request: EvaluateAlertsRequest = {}
): Promise<EvaluateAlertsResponse> => {
  return apiFetch<EvaluateAlertsResponse>('/alerts/evaluate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

/**
 * Gets all alert configurations (series with their capabilities and cross-series options)
 */
export const getAlertConfigs = async (): Promise<AlertSeriesFrontendConfig[]> => {
  return apiFetch<AlertSeriesFrontendConfig[]>('/alert-configs');
};

