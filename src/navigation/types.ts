/**
 * Navigation types for React Navigation
 */

import { Alert } from '@/services/alerts-api';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyEmail: { email?: string };
  ResetPassword: { token?: string; email?: string };
  MainTabs: { screen?: keyof MainTabParamList; params?: MainTabParamList[keyof MainTabParamList] } | undefined;
  Quotes: undefined;
  Alerts: undefined;
  AlertForm: { alert?: Alert | null; userId: string };
  IndicatorDetail: { indicatorId: string; indicatorName: string };
  QuoteDetail: { quoteId: string; quoteName: string };
  CryptoDetail: { cryptoId: string; cryptoName: string };
};

export type MainTabParamList = {
  Home: undefined;
  Indicators: { category?: string } | undefined;
  Quotes: undefined;
  News: undefined;
  Settings: undefined;
  Alerts: undefined;
};

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
/* eslint-enable @typescript-eslint/no-namespace */
