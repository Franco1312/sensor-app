/**
 * Navigation types for React Navigation
 */

export type RootStackParamList = {
  MainTabs: undefined;
  IndicatorDetail: { indicatorId: string; indicatorName: string };
  QuoteDetail: { quoteId: string; quoteName: string };
};

export type MainTabParamList = {
  Home: undefined;
  Indicators: undefined;
  Quotes: undefined;
  Settings: undefined;
};

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
/* eslint-enable @typescript-eslint/no-namespace */
