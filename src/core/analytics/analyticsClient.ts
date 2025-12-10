/**
 * Analytics Client - Cliente centralizado para Firebase Analytics
 * Encapsula todas las llamadas a Firebase Analytics
 */

// Dynamic import to handle cases where expo-firebase-analytics is not installed yet
let Analytics: any;
try {
  Analytics = require('expo-firebase-analytics');
} catch {
  // Analytics will be undefined if package is not installed
  Analytics = null;
}

// ============================================================================
// Types
// ============================================================================

export interface AnalyticsClient {
  logScreenView: (screenName: string, params?: Record<string, any>) => Promise<void>;
  logEvent: (eventName: string, params?: Record<string, any>) => Promise<void>;
  setUserId: (userId: string | null) => Promise<void>;
  setUserProperty: (name: string, value: string | null) => Promise<void>;
  resetAnalyticsData: () => Promise<void>;
}

// ============================================================================
// Implementation
// ============================================================================

class FirebaseAnalyticsClient implements AnalyticsClient {
  private isInitialized = false;

  /**
   * Initialize analytics (called once at app startup)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Analytics is automatically initialized in Expo
      // Just mark as initialized
      this.isInitialized = true;
    } catch (error) {
      console.warn('[Analytics] Failed to initialize:', error);
      // Continue without analytics - app should work without it
    }
  }

  /**
   * Log a screen view
   */
  async logScreenView(screenName: string, params?: Record<string, any>): Promise<void> {
    if (!Analytics) return;
    try {
      await Analytics.logScreenView({
        screen_name: screenName,
        screen_class: screenName,
        ...params,
      });
    } catch (error) {
      // Silently fail - analytics should not break the app
      console.warn('[Analytics] Failed to log screen view:', error);
    }
  }

  /**
   * Log a custom event
   */
  async logEvent(eventName: string, params?: Record<string, any>): Promise<void> {
    if (!Analytics) return;
    try {
      // Firebase Analytics has restrictions on parameter names and values
      const sanitizedParams = this.sanitizeParams(params);
      
      await Analytics.logEvent(eventName, sanitizedParams);
    } catch (error) {
      // Silently fail - analytics should not break the app
      console.warn('[Analytics] Failed to log event:', error);
    }
  }

  /**
   * Set user ID for analytics
   */
  async setUserId(userId: string | null): Promise<void> {
    if (!Analytics) return;
    try {
      if (userId) {
        await Analytics.setUserId(userId);
      } else {
        await Analytics.setUserId(null);
      }
    } catch (error) {
      console.warn('[Analytics] Failed to set user ID:', error);
    }
  }

  /**
   * Set user property
   */
  async setUserProperty(name: string, value: string | null): Promise<void> {
    if (!Analytics) return;
    try {
      if (value) {
        await Analytics.setUserProperty(name, value);
      } else {
        await Analytics.setUserProperty(name, null);
      }
    } catch (error) {
      console.warn('[Analytics] Failed to set user property:', error);
    }
  }

  /**
   * Reset analytics data (e.g., on logout)
   */
  async resetAnalyticsData(): Promise<void> {
    if (!Analytics) return;
    try {
      await Analytics.resetAnalyticsData();
    } catch (error) {
      console.warn('[Analytics] Failed to reset analytics data:', error);
    }
  }

  /**
   * Sanitize parameters to comply with Firebase Analytics restrictions
   * - Parameter names: max 40 chars, alphanumeric and underscores only
   * - Parameter values: max 100 chars for strings
   */
  private sanitizeParams(params?: Record<string, any>): Record<string, any> | undefined {
    if (!params) return undefined;

    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(params)) {
      // Sanitize key
      let sanitizedKey = key
        .replace(/[^a-zA-Z0-9_]/g, '_')
        .substring(0, 40);

      // Sanitize value
      let sanitizedValue: any = value;
      
      if (typeof value === 'string') {
        sanitizedValue = value.substring(0, 100);
      } else if (typeof value === 'number') {
        // Numbers are fine, but ensure they're finite
        sanitizedValue = isFinite(value) ? value : 0;
      } else if (typeof value === 'boolean') {
        sanitizedValue = value;
      } else {
        // Convert other types to string
        sanitizedValue = String(value).substring(0, 100);
      }

      sanitized[sanitizedKey] = sanitizedValue;
    }

    return sanitized;
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const analyticsClient: AnalyticsClient = new FirebaseAnalyticsClient();

// Analytics is automatically initialized in Expo when the module is loaded
// No explicit initialization needed

// ============================================================================
// Product Analytics Helper Functions
// ============================================================================

import { 
  EVENT_NAMES,
  AppOpenedEventParams,
  HomeViewedEventParams,
  SeriesViewedEventParams,
  SeriesGraphInteractedEventParams,
  SeriesTimeRangeChangedEventParams,
  FavoritesToggledEventParams,
  NewsListViewedEventParams,
  NewsArticleOpenedEventParams,
  AlertsScreenViewedEventParams,
  AlertCreatedEventParams,
  AdImpressionEventParams,
} from './events';

export const analytics = {
  trackAppOpened: (params?: AppOpenedEventParams) => 
    analyticsClient.logEvent(EVENT_NAMES.APP_OPENED, params),
  
  trackHomeViewed: (params?: HomeViewedEventParams) => 
    analyticsClient.logEvent(EVENT_NAMES.HOME_VIEWED, params),
  
  trackSeriesViewed: (params: SeriesViewedEventParams) => 
    analyticsClient.logEvent(EVENT_NAMES.SERIES_VIEWED, params),
  
  trackSeriesGraphInteracted: (params: SeriesGraphInteractedEventParams) => 
    analyticsClient.logEvent(EVENT_NAMES.SERIES_GRAPH_INTERACTED, params),
  
  trackSeriesTimeRangeChanged: (params: SeriesTimeRangeChangedEventParams) => 
    analyticsClient.logEvent(EVENT_NAMES.SERIES_TIME_RANGE_CHANGED, params),
  
  trackFavoritesToggled: (params: FavoritesToggledEventParams) => 
    analyticsClient.logEvent(EVENT_NAMES.FAVORITES_TOGGLED, params),
  
  trackNewsListViewed: (params?: NewsListViewedEventParams) => 
    analyticsClient.logEvent(EVENT_NAMES.NEWS_LIST_VIEWED, params),
  
  trackNewsArticleOpened: (params: NewsArticleOpenedEventParams) => 
    analyticsClient.logEvent(EVENT_NAMES.NEWS_ARTICLE_OPENED, params),
  
  trackAlertsScreenViewed: (params?: AlertsScreenViewedEventParams) => 
    analyticsClient.logEvent(EVENT_NAMES.ALERTS_SCREEN_VIEWED, params),
  
  trackAlertCreated: (params: AlertCreatedEventParams) => 
    analyticsClient.logEvent(EVENT_NAMES.ALERT_CREATED, params),
  
  trackAdImpression: (params: AdImpressionEventParams) => 
    analyticsClient.logEvent(EVENT_NAMES.AD_IMPRESSION, params),
};

