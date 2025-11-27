/**
 * ListScreenLayout - Generic layout component for list screens
 * Used by QuotesScreen, IndicatorsScreen, NewsScreen to eliminate code duplication
 */

import React, { ReactNode } from 'react';
import { View, FlatList, ListRenderItem } from 'react-native';
import { Screen, Header } from '@/components/layout';
import { EmptyState, LoadingState } from '../components';
import { useTheme } from '@/theme/ThemeProvider';
import { useTranslation } from '@/i18n';

// ============================================================================
// Types
// ============================================================================

export interface ListScreenConfig<T> {
  // Header
  title: string;
  rightIcon?: ReactNode;
  onRightPress?: () => void;

  // List data
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;

  // States
  loading?: boolean;
  error?: string;
  errorTitle?: string;
  errorMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;

  // List configuration
  contentContainerStyle?: object;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  ListFooterComponent?: ReactNode | (() => ReactNode);
  ListHeaderComponent?: ReactNode | (() => ReactNode);

  // Custom renders
  renderLoading?: () => ReactNode;
  renderError?: (error: string) => ReactNode;
  renderEmpty?: () => ReactNode;

  // Additional content (e.g., filters, tabs)
  additionalContent?: ReactNode;
}

// ============================================================================
// Main Component
// ============================================================================

export const ListScreenLayout = <T,>({
  title,
  rightIcon,
  onRightPress,
  data,
  renderItem,
  keyExtractor,
  loading = false,
  error,
  errorTitle,
  errorMessage,
  emptyTitle,
  emptyMessage,
  contentContainerStyle,
  onEndReached,
  onEndReachedThreshold = 0.5,
  ListFooterComponent,
  ListHeaderComponent,
  renderLoading,
  renderError,
  renderEmpty,
  additionalContent,
}: ListScreenConfig<T>) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Loading state
  if (loading) {
    if (renderLoading) {
      return (
        <Screen scrollable={false}>
          <Header title={title} rightIcon={rightIcon} onRightPress={onRightPress} />
          {additionalContent}
          {renderLoading()}
        </Screen>
      );
    }

    return (
      <Screen scrollable={false}>
        <Header title={title} rightIcon={rightIcon} onRightPress={onRightPress} />
        {additionalContent}
        <LoadingState />
      </Screen>
    );
  }

  // Error state
  if (error) {
    if (renderError) {
      return (
        <Screen scrollable={false}>
          <Header title={title} rightIcon={rightIcon} onRightPress={onRightPress} />
          {additionalContent}
          {renderError(error)}
        </Screen>
      );
    }

    return (
      <Screen scrollable={false}>
        <Header title={title} rightIcon={rightIcon} onRightPress={onRightPress} />
        {additionalContent}
        <View style={{ flex: 1, paddingHorizontal: theme.spacing.base }}>
          <EmptyState
            title={errorTitle || t('components.common.error')}
            message={errorMessage || error}
          />
        </View>
      </Screen>
    );
  }

  // Empty state
  if (data.length === 0) {
    if (renderEmpty) {
      return (
        <Screen scrollable={false}>
          <Header title={title} rightIcon={rightIcon} onRightPress={onRightPress} />
          {additionalContent}
          {renderEmpty()}
        </Screen>
      );
    }

    return (
      <Screen scrollable={false}>
        <Header title={title} rightIcon={rightIcon} onRightPress={onRightPress} />
        {additionalContent}
        <View style={{ flex: 1, paddingHorizontal: theme.spacing.base }}>
          <EmptyState
            title={emptyTitle || t('components.common.emptyTitle')}
            message={emptyMessage || t('components.common.emptyMessage')}
          />
        </View>
      </Screen>
    );
  }

  // Main content
  return (
    <Screen scrollable={false}>
      <Header title={title} rightIcon={rightIcon} onRightPress={onRightPress} />
      {additionalContent}
      <View style={{ flex: 1, paddingHorizontal: theme.spacing.base }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            {
              paddingTop: theme.spacing.md,
              paddingBottom: theme.spacing.xl,
            },
            contentContainerStyle,
          ]}
          onEndReached={onEndReached}
          onEndReachedThreshold={onEndReachedThreshold}
          ListFooterComponent={ListFooterComponent}
          ListHeaderComponent={ListHeaderComponent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Screen>
  );
};

