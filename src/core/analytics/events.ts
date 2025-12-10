/**
 * Analytics Events - Definiciones tipadas de eventos y parámetros
 * Centraliza todos los nombres de eventos y sus tipos de parámetros
 */

// ============================================================================
// Screen Names
// ============================================================================

export const SCREEN_NAMES = {
  DASHBOARD_HOME: 'Dashboard_Home',
  SERIES_LIST: 'Series_List',
  SERIES_DETAIL: 'Series_Detail',
  QUOTES_LIST: 'Quotes_List',
  QUOTE_DETAIL: 'Quote_Detail',
  CRYPTO_DETAIL: 'Crypto_Detail',
  NEWS_LIST: 'News_List',
  ALERTS_LIST: 'Alerts_List',
  ALERT_FORM: 'Alert_Form',
  PROFILE: 'Profile_Settings',
  LOGIN: 'Login',
  REGISTER: 'Register',
  VERIFY_EMAIL: 'Verify_Email',
  RESET_PASSWORD: 'Reset_Password',
} as const;

export type ScreenName = typeof SCREEN_NAMES[keyof typeof SCREEN_NAMES];

// ============================================================================
// Event Names
// ============================================================================

export const EVENT_NAMES = {
  // App lifecycle
  APP_OPENED: 'app_opened',
  
  // Screen views (as events for product analytics)
  HOME_VIEWED: 'home_viewed',
  NEWS_LIST_VIEWED: 'news_list_viewed',
  ALERTS_SCREEN_VIEWED: 'alerts_screen_viewed',
  
  // Series/Indicators
  SERIES_VIEWED: 'series_viewed',
  SERIES_GRAPH_INTERACTED: 'series_graph_interacted',
  SERIES_TIME_RANGE_CHANGED: 'series_time_range_changed',
  
  // Quotes
  VIEW_QUOTE: 'view_quote',
  CHANGE_QUOTE_CONFIG: 'change_quote_config',
  
  // Crypto
  VIEW_CRYPTO: 'view_crypto',
  CHANGE_CRYPTO_CONFIG: 'change_crypto_config',
  
  // Favorites
  FAVORITES_TOGGLED: 'favorites_toggled',
  
  // Alerts
  TOGGLE_ALERT: 'toggle_alert',
  ALERT_CREATED: 'alert_created',
  UPDATE_ALERT: 'update_alert',
  DELETE_ALERT: 'delete_alert',
  
  // News
  NEWS_ARTICLE_OPENED: 'news_article_opened',
  
  // Ads
  AD_IMPRESSION: 'ad_impression',
  
  // Navigation (legacy, mantener para compatibilidad)
  NAVIGATE_TO_QUOTES: 'navigate_to_quotes',
  NAVIGATE_TO_INDICATORS: 'navigate_to_indicators',
  NAVIGATE_TO_NEWS: 'navigate_to_news',
  
  // Category filters
  FILTER_BY_CATEGORY: 'filter_by_category',
} as const;

export type EventName = typeof EVENT_NAMES[keyof typeof EVENT_NAMES];

// ============================================================================
// Event Parameters Types
// ============================================================================

export interface AppOpenedEventParams {
  from_notification?: boolean;
}

export interface HomeViewedEventParams {
  has_favorites?: boolean;
  has_alerts_enabled?: boolean;
}

export interface SeriesViewedEventParams {
  series_code: string;
  source: string; // 'INDEC', 'BCRA', 'DOLAR_API', etc.
  category: string; // 'inflation', 'fx', 'reserves', 'rates', etc.
}

export interface SeriesGraphInteractedEventParams {
  series_code: string;
  interaction_type: string; // 'zoom', 'pan', 'change_chart_type', etc.
}

export interface SeriesTimeRangeChangedEventParams {
  series_code: string;
  time_range: string; // '1M', '3M', '1Y', '5Y', 'MAX'
}

export interface FavoritesToggledEventParams {
  series_code: string;
  is_favorite_now: boolean;
}

export interface NewsListViewedEventParams {
  source?: string; // 'rss_ambito', 'rss_infobae', etc.
}

export interface NewsArticleOpenedEventParams {
  article_id?: string;
  url?: string;
  source: string;
  category?: string;
}

export interface AlertsScreenViewedEventParams {
  // Empty or simple params
}

export interface AlertCreatedEventParams {
  series_code: string;
  condition_type: string; // 'greater_than', 'less_than', 'change_percent', etc.
  threshold?: number;
}

export interface AdImpressionEventParams {
  placement: string; // 'home_footer', 'series_footer', 'news_list_inline', etc.
  ad_format: string; // 'banner', 'inline', 'native'
}

// Legacy event params (mantener para compatibilidad)
export interface ViewSeriesEventParams {
  series_code: string;
  series_name: string;
  source: string;
  category?: string;
  has_alerts_enabled?: boolean;
}

export interface ChangeSeriesConfigEventParams {
  series_code: string;
  period: string;
  aggregation?: string;
  view_type?: string;
}

export interface ViewQuoteEventParams {
  quote_id: string;
  quote_name: string;
  source: string;
  category?: string;
}

export interface ChangeQuoteConfigEventParams {
  quote_id: string;
  period: string;
}

export interface ViewCryptoEventParams {
  crypto_id: string;
  crypto_name: string;
  source: string;
  symbol: string;
}

export interface ChangeCryptoConfigEventParams {
  crypto_id: string;
  time_interval: string; // '1h', '4h', '1d', etc.
}

export interface ToggleAlertEventParams {
  alert_id: string;
  series_code: string;
  enabled: boolean;
  condition_type: string; // 'VALUE_ABOVE_THRESHOLD', etc.
}

// Legacy - usar AlertCreatedEventParams
export interface CreateAlertEventParams {
  series_code: string;
  rule_type: string;
  threshold: number;
  window?: string;
}

export interface UpdateAlertEventParams {
  alert_id: string;
  series_code: string;
  rule_type?: string;
  is_active?: boolean;
}

export interface DeleteAlertEventParams {
  alert_id: string;
  series_code: string;
}

// Legacy - usar NewsArticleOpenedEventParams
export interface OpenNewsArticleEventParams {
  article_id: string;
  article_title: string;
  source: string;
  category?: string;
  url?: string;
}

export interface FilterByCategoryEventParams {
  category: string;
  screen: string; // 'indicators', 'quotes', etc.
}

export interface NavigateEventParams {
  destination: string;
  source: string;
}

// ============================================================================
// Event Parameters Union Type
// ============================================================================

export type EventParams =
  | AppOpenedEventParams
  | HomeViewedEventParams
  | SeriesViewedEventParams
  | SeriesGraphInteractedEventParams
  | SeriesTimeRangeChangedEventParams
  | FavoritesToggledEventParams
  | NewsListViewedEventParams
  | NewsArticleOpenedEventParams
  | AlertsScreenViewedEventParams
  | AlertCreatedEventParams
  | AdImpressionEventParams
  | ViewSeriesEventParams
  | ChangeSeriesConfigEventParams
  | ViewQuoteEventParams
  | ChangeQuoteConfigEventParams
  | ViewCryptoEventParams
  | ChangeCryptoConfigEventParams
  | ToggleAlertEventParams
  | CreateAlertEventParams
  | UpdateAlertEventParams
  | DeleteAlertEventParams
  | OpenNewsArticleEventParams
  | FilterByCategoryEventParams
  | NavigateEventParams
  | Record<string, string | number | boolean | undefined>;

