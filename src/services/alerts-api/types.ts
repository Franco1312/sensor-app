/**
 * Alerts API Types
 * Types for alerts and events management endpoints
 */

export type RuleType =
  | 'VALUE_ABOVE_THRESHOLD'
  | 'VALUE_BELOW_THRESHOLD'
  | 'PERCENT_CHANGE_ABOVE_THRESHOLD'
  | 'PERCENT_CHANGE_BELOW_THRESHOLD';

export type DataSource = 'BCRA' | 'INDEC' | 'LOCAL_DB' | 'projections-consumer';

export interface RuleConfig {
  threshold: number;
  window?: string; // e.g., "7d", "2w", "1m"
  direction?: 'UP' | 'DOWN';
}

export interface Alert {
  id: string;
  userId: string;
  name: string;
  isActive: boolean;
  seriesCode: string;
  dataSource: DataSource;
  ruleType: RuleType;
  ruleConfig: RuleConfig;
  createdAt: string;
  updatedAt: string;
  lastTriggeredAt: string | null;
}

export interface CreateAlertRequest {
  userId: string;
  name: string;
  seriesCode: string;
  dataSource: DataSource;
  ruleType: RuleType;
  ruleConfig: RuleConfig;
}

export interface UpdateAlertRequest {
  name?: string;
  isActive?: boolean;
  ruleType?: RuleType;
  ruleConfig?: RuleConfig;
}

export interface AlertEvent {
  id: string;
  alertId: string;
  triggeredAt: string;
  payload: Record<string, unknown>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EvaluationResult {
  alertId: string;
  triggered: boolean;
  error: string | null;
}

export interface EvaluateAlertsRequest {
  alertId?: string;
}

export interface EvaluateAlertsResponse {
  results: EvaluationResult[];
}

export interface ApiErrorResponse {
  error: string | Array<{
    code?: string;
    expected?: string;
    received?: string;
    path?: string[];
    message?: string;
    validation?: string;
  }>;
}

