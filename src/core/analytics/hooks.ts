/**
 * Analytics Hooks - Hooks para tracking de pantallas y eventos
 * Facilita el uso de analytics en componentes React
 */

import React, { useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { analyticsClient } from './analyticsClient';
import { ScreenName, EventName, EventParams } from './events';

// ============================================================================
// Screen Tracking Hook
// ============================================================================

/**
 * Hook para trackear vistas de pantalla
 * Se ejecuta cuando la pantalla recibe foco
 * 
 * @param screenName - Nombre de la pantalla (usar SCREEN_NAMES)
 * @param extraParams - Parámetros adicionales opcionales
 * @param options - Opciones de tracking
 */
export function useScreenTracking(
  screenName: ScreenName,
  extraParams?: Record<string, any>,
  options?: {
    trackOnMount?: boolean; // Track on mount (default: true)
    trackOnFocus?: boolean; // Track on focus (default: true)
  }
): void {
  const { trackOnMount = true, trackOnFocus = true } = options || {};
  const hasTrackedMount = useRef(false);

  // Track on mount
  useEffect(() => {
    if (trackOnMount && !hasTrackedMount.current) {
      analyticsClient.logScreenView(screenName, extraParams);
      hasTrackedMount.current = true;
    }
  }, [screenName, trackOnMount]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track on focus (for React Navigation)
  useFocusEffect(
    React.useCallback(() => {
      if (trackOnFocus) {
        analyticsClient.logScreenView(screenName, extraParams);
      }
    }, [screenName, trackOnFocus]) // eslint-disable-line react-hooks/exhaustive-deps
  );
}

// ============================================================================
// Event Tracking Hook
// ============================================================================

/**
 * Hook que retorna funciones para trackear eventos
 * Útil cuando necesitas trackear eventos desde múltiples lugares
 * 
 * @returns Funciones de tracking
 */
export function useAnalytics() {
  const trackEvent = async (eventName: EventName, params?: EventParams) => {
    await analyticsClient.logEvent(eventName, params as Record<string, any>);
  };

  const trackScreenView = async (screenName: ScreenName, params?: Record<string, any>) => {
    await analyticsClient.logScreenView(screenName, params);
  };

  const setUserId = async (userId: string | null) => {
    await analyticsClient.setUserId(userId);
  };

  const setUserProperty = async (name: string, value: string | null) => {
    await analyticsClient.setUserProperty(name, value);
  };

  const resetAnalytics = async () => {
    await analyticsClient.resetAnalyticsData();
  };

  return {
    trackEvent,
    trackScreenView,
    setUserId,
    setUserProperty,
    resetAnalytics,
  };
}

// ============================================================================
// Convenience Hooks for Specific Events
// ============================================================================

/**
 * Hook para trackear visualización de series
 */
export function useTrackSeriesView() {
  const { trackEvent } = useAnalytics();
  
  return (params: {
    series_code: string;
    series_name: string;
    source: string;
    category?: string;
    has_alerts_enabled?: boolean;
  }) => {
    trackEvent('view_series' as EventName, params);
  };
}

/**
 * Hook para trackear cambios de configuración de series
 */
export function useTrackSeriesConfigChange() {
  const { trackEvent } = useAnalytics();
  
  return (params: {
    series_code: string;
    period: string;
    aggregation?: string;
    view_type?: string;
  }) => {
    trackEvent('change_series_config' as EventName, params);
  };
}

/**
 * Hook para trackear toggle de alertas
 */
export function useTrackAlertToggle() {
  const { trackEvent } = useAnalytics();
  
  return (params: {
    alert_id: string;
    series_code: string;
    enabled: boolean;
    condition_type: string;
  }) => {
    trackEvent('toggle_alert' as EventName, params);
  };
}

/**
 * Hook para trackear apertura de noticias
 */
export function useTrackNewsOpen() {
  const { trackEvent } = useAnalytics();
  
  return (params: {
    article_id: string;
    article_title: string;
    source: string;
    category?: string;
    url?: string;
  }) => {
    trackEvent('open_news_article' as EventName, params);
  };
}

