/**
 * Crypto time interval constants
 */

import { KlineInterval } from '@/services/crypto-api';

export type TimeInterval = '1h' | '4h' | '1d' | '1w';

export interface TimeIntervalConfig {
  label: string;
  value: TimeInterval;
  klineInterval: KlineInterval;
  limit: number;
}

export const TIME_INTERVALS: TimeIntervalConfig[] = [
  { label: '24h', value: '1h', klineInterval: '1h', limit: 24 },
  { label: '7d', value: '4h', klineInterval: '4h', limit: 42 },
  { label: '30d', value: '1d', klineInterval: '1d', limit: 30 },
  { label: '90d', value: '1w', klineInterval: '1w', limit: 13 },
] as const;

export const DEFAULT_TIME_INTERVAL: TimeInterval = '1d';

