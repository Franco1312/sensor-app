/**
 * useCategoryPager - Hook for managing category-based pager navigation
 * Used for screens with internal category tabs (e.g., QuotesScreen)
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import PagerView from 'react-native-pager-view';

interface UseCategoryPagerOptions<T extends string> {
  categories: readonly T[];
  defaultCategory?: T;
}

const BOUNDARY_OFFSET_THRESHOLD = 0.2;
const BOUNDARY_RESET_THRESHOLD = 0.1;
const BOUNDARY_TIMEOUT_MS = 300;

export const useCategoryPager = <T extends string>({
  categories,
  defaultCategory,
}: UseCategoryPagerOptions<T>) => {
  const pagerRef = useRef<PagerView>(null);
  const boundaryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize state
  const getInitialIndex = useCallback(() => {
    if (defaultCategory) {
      const index = categories.indexOf(defaultCategory);
      return index >= 0 ? index : 0;
    }
    return 0;
  }, [categories, defaultCategory]);

  const initialIndex = getInitialIndex();
  const [activeCategory, setActiveCategory] = useState<T>(
    defaultCategory || categories[0]
  );
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Helper: Clear boundary timeout
  const clearBoundaryTimeout = useCallback(() => {
    if (boundaryTimeoutRef.current) {
      clearTimeout(boundaryTimeoutRef.current);
      boundaryTimeoutRef.current = null;
    }
  }, []);

  // Helper: Temporarily disable scroll to allow parent pager to handle swipe
  const disableScrollTemporarily = useCallback(() => {
    setScrollEnabled(false);
    clearBoundaryTimeout();
    boundaryTimeoutRef.current = setTimeout(() => {
      setScrollEnabled(true);
      boundaryTimeoutRef.current = null;
    }, BOUNDARY_TIMEOUT_MS);
  }, [clearBoundaryTimeout]);

  // Helper: Update category and index
  const updateCategory = useCallback((category: T, index: number) => {
    setActiveCategory(category);
    setCurrentIndex(index);
  }, []);

  // Helper: Navigate pager to specific index
  const navigateToIndex = useCallback((index: number) => {
    if (index >= 0 && index < categories.length && pagerRef.current) {
      pagerRef.current.setPage(index);
      updateCategory(categories[index], index);
    }
  }, [categories, updateCategory]);

  // Sync PagerView when activeCategory changes (from tab press)
  useEffect(() => {
    const categoryIndex = categories.indexOf(activeCategory);
    if (categoryIndex >= 0 && categoryIndex !== currentIndex && pagerRef.current) {
      pagerRef.current.setPage(categoryIndex);
      setCurrentIndex(categoryIndex);
    }
  }, [activeCategory, categories, currentIndex]);

  // Handle page change from swipe gesture
  const handlePageSelected = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      const newIndex = e.nativeEvent.position;
      if (newIndex >= 0 && newIndex < categories.length) {
        updateCategory(categories[newIndex], newIndex);
      }
    },
    [categories, updateCategory]
  );

  // Handle page scroll to detect boundary swipes
  const handlePageScroll = useCallback(
    (e: { nativeEvent: { position: number; offset: number } }) => {
      const { position, offset } = e.nativeEvent;
      const isAtFirstPage = position === 0;
      const isAtLastPage = position === categories.length - 1;
      const absOffset = Math.abs(offset);

      clearBoundaryTimeout();

      // At first page, swiping left (negative offset) - let parent handle
      if (isAtFirstPage && offset < -BOUNDARY_OFFSET_THRESHOLD) {
        disableScrollTemporarily();
      }
      // At last page, swiping right (positive offset) - let parent handle
      else if (isAtLastPage && offset > BOUNDARY_OFFSET_THRESHOLD) {
        disableScrollTemporarily();
      }
      // Reset if we're no longer at boundary
      else if (!scrollEnabled && absOffset < BOUNDARY_RESET_THRESHOLD) {
        setScrollEnabled(true);
      }
    },
    [categories.length, scrollEnabled, clearBoundaryTimeout, disableScrollTemporarily]
  );

  // Handle scroll state changes
  const handlePageScrollStateChanged = useCallback(
    (e: { nativeEvent: { pageScrollState: string } }) => {
      const state = e.nativeEvent.pageScrollState;
      setIsScrolling(state === 'dragging');
      
      // Re-enable scroll when dragging ends
      if (state === 'idle' && !scrollEnabled) {
        setScrollEnabled(true);
      }
    },
    [scrollEnabled]
  );

  // Handle category change from tab press
  const handleCategoryChange = useCallback(
    (category: T) => {
      const categoryIndex = categories.indexOf(category);
      if (categoryIndex >= 0) {
        navigateToIndex(categoryIndex);
      }
    },
    [categories, navigateToIndex]
  );

  // Cleanup on unmount
  useEffect(() => clearBoundaryTimeout, [clearBoundaryTimeout]);

  // Computed values
  const isAtFirstPage = currentIndex === 0;
  const isAtLastPage = currentIndex === categories.length - 1;

  return {
    pagerRef,
    activeCategory,
    currentIndex,
    initialIndex,
    handlePageSelected,
    handlePageScroll,
    handlePageScrollStateChanged,
    handleCategoryChange,
    isAtFirstPage,
    isAtLastPage,
    isScrolling,
    scrollEnabled,
  };
};

