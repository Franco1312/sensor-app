/**
 * Navigation types for React Navigation
 */

export type RootStackParamList = {
  Login: undefined;
  MainTabs: { screen?: keyof MainTabParamList; params?: MainTabParamList[keyof MainTabParamList] } | undefined;
  Quotes: undefined;
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
};

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
/* eslint-enable @typescript-eslint/no-namespace */
