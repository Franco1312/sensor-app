/**
 * ScreenContainer - Enhanced screen container with common patterns
 * Wrapper around Screen component with additional utilities
 */

import React, { ReactNode } from 'react';
import { Screen } from '@/components/layout';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

interface ScreenContainerProps {
  /**
   * Screen content
   */
  children: ReactNode;
  /**
   * Whether screen is scrollable
   */
  scrollable?: boolean;
  /**
   * Safe area edges
   */
  safeAreaEdges?: ('top' | 'bottom' | 'left' | 'right')[];
  /**
   * Content container style
   */
  contentContainerStyle?: object;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Error state
   */
  error?: string;
  /**
   * Error title
   */
  errorTitle?: string;
  /**
   * Loading skeleton item count
   */
  loadingItemCount?: number;
  /**
   * Custom loading render
   */
  renderLoading?: () => ReactNode;
  /**
   * Custom error render
   */
  renderError?: (error: string) => ReactNode;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = true,
  safeAreaEdges,
  contentContainerStyle,
  loading = false,
  error,
  errorTitle,
  loadingItemCount = 6,
  renderLoading,
  renderError,
}) => {
  // Loading state
  if (loading) {
    return (
      <Screen scrollable={scrollable} safeAreaEdges={safeAreaEdges} contentContainerStyle={contentContainerStyle}>
        {renderLoading ? renderLoading() : <LoadingState itemCount={loadingItemCount} />}
      </Screen>
    );
  }

  // Error state
  if (error) {
    return (
      <Screen scrollable={scrollable} safeAreaEdges={safeAreaEdges} contentContainerStyle={contentContainerStyle}>
        {renderError ? (
          renderError(error)
        ) : (
          <ErrorState title={errorTitle} message={error} />
        )}
      </Screen>
    );
  }

  // Normal content
  return (
    <Screen
      scrollable={scrollable}
      safeAreaEdges={safeAreaEdges}
      contentContainerStyle={contentContainerStyle}>
      {children}
    </Screen>
  );
};

