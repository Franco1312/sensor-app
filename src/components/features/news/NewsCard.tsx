/**
 * NewsCard - Card component for displaying news articles
 * Based on design/newsScreen design
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useTranslation } from '@/i18n';
import { News } from '@/types';
import Svg, { Path } from 'react-native-svg';

interface NewsCardProps {
  news: News;
  onPress?: () => void;
  onVerMasPress?: () => void;
  showVisitButton?: boolean;
}

const NewsCardComponent: React.FC<NewsCardProps> = ({ news, onPress, onVerMasPress, showVisitButton = true }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const [hasMeasured, setHasMeasured] = useState(false);

  if (!news) {
    return null;
  }

  const handleVerMas = useCallback(() => {
    if (onVerMasPress) {
      onVerMasPress();
    } else if (onPress) {
      onPress();
    }
  }, [onVerMasPress, onPress]);

  const toggleSummary = useCallback(() => {
    setIsSummaryExpanded(prev => !prev);
  }, []);

  const handleTextLayout = (event: any) => {
    if (hasMeasured) {
      return;
    }
    const { lines } = event.nativeEvent;
    // Solo mostrar botón si realmente hay más de 3 líneas
    if (lines && lines.length > 3) {
      setIsTextTruncated(true);
      setHasMeasured(true);
    } else if (lines && lines.length <= 3) {
      setIsTextTruncated(false);
      setHasMeasured(true);
    }
  };

  const hasSummary = useMemo(() => news.summary && news.summary.trim().length > 0, [news.summary]);
  // Solo mostrar botón si realmente detectamos que el texto está truncado (más de 3 líneas)
  // No usar longitud de caracteres porque no es preciso
  const shouldShowExpandButton = useMemo(() => hasSummary && isTextTruncated, [hasSummary, isTextTruncated]);
  
  const handleSummaryPress = useCallback(() => {
    if (shouldShowExpandButton) {
      setIsSummaryExpanded(prev => !prev);
    }
  }, [shouldShowExpandButton]);

  // Truncar texto manualmente para mostrar "Ver más" inline
  // Solo truncar si realmente detectamos que está truncado
  const getTruncatedText = useMemo(() => {
    if (isSummaryExpanded) {
      return news.summary;
    }
    // Solo truncar si realmente detectamos truncamiento (más de 3 líneas)
    if (!shouldShowExpandButton) {
      return news.summary;
    }
    // Aproximadamente 100 caracteres para 3 líneas (más conservador para asegurar que realmente esté truncado)
    if (news.summary.length > 100) {
      const truncated = news.summary.substring(0, 100);
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace > 70) {
        return truncated.substring(0, lastSpace);
      }
      return truncated;
    }
    return news.summary;
  }, [news.summary, isSummaryExpanded, shouldShowExpandButton]);


  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.divider }]}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text variant="xs" weight="medium" style={{ color: theme.colors.primary, marginBottom: theme.spacing.xs }}>
            {news.sourceName || t('components.common.noSource')}
          </Text>
          <Text variant="base" weight="bold" style={styles.title} numberOfLines={4}>
            {news.title || t('components.common.noTitle')}
          </Text>
          {hasSummary && (
            <View style={styles.summaryTouchable}>
              {/* Texto invisible para medir si realmente está truncado */}
              {!hasMeasured && (
                <View style={styles.measureContainer}>
                  <Text
                    variant="sm"
                    color="textSecondary"
                    style={styles.summary}
                    onTextLayout={handleTextLayout}>
                    {news.summary}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                activeOpacity={shouldShowExpandButton ? 0.7 : 1}
                onPress={handleSummaryPress}
                disabled={!shouldShowExpandButton}>
                <Text
                  variant="sm"
                  color="textSecondary"
                  style={styles.summary}>
                  {getTruncatedText}
                  {shouldShowExpandButton && !isSummaryExpanded && (
                    <>
                      <Text variant="sm" color="textSecondary">...</Text>
                      <Text
                        onPress={toggleSummary}
                        variant="sm"
                        weight="semibold"
                        style={{ color: theme.colors.primary }}>
                        {' '}{t('components.common.verMas')}
                      </Text>
                    </>
                  )}
                  {shouldShowExpandButton && isSummaryExpanded && (
                    <Text
                      onPress={toggleSummary}
                      variant="sm"
                      weight="semibold"
                      style={{ color: theme.colors.primary }}>
                      {'\n'}{t('components.common.verMenos')}
                    </Text>
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {news.imageUrl && (
          <Image
            source={{ uri: news.imageUrl }}
            style={[styles.image, { borderRadius: theme.radii.base }]}
            resizeMode="cover"
          />
        )}
      </View>
      {showVisitButton && (
        <TouchableOpacity
          onPress={handleVerMas}
          activeOpacity={0.6}
          style={[styles.visitButton, { backgroundColor: theme.colors.surfaceSecondary }]}>
          <Text variant="sm" weight="semibold" color="textSecondary">
            {t('components.common.visitNews')}
          </Text>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
              stroke={theme.colors.textSecondary}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Memoize component to prevent unnecessary re-renders
export const NewsCard = React.memo(NewsCardComponent, (prevProps, nextProps) => {
  // Custom comparison: only re-render if news id or callbacks change
  return prevProps.news.id === nextProps.news.id &&
    prevProps.onPress === nextProps.onPress &&
    prevProps.onVerMasPress === nextProps.onVerMasPress &&
    prevProps.showVisitButton === nextProps.showVisitButton;
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 6,
    lineHeight: 20,
  },
  summaryTouchable: {
    marginTop: 6,
  },
  summary: {
    lineHeight: 18,
  },
  measureContainer: {
    position: 'absolute',
    opacity: 0,
    zIndex: -1,
    width: '100%',
    pointerEvents: 'none',
  },
  visitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    marginTop: 12,
  },
  image: {
    width: 96,
    height: 96,
    flexShrink: 0,
  },
});

