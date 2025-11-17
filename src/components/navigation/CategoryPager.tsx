/**
 * CategoryPager - Reusable component for swipeable category-based content
 * Wraps PagerView with category-based navigation
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';

interface CategoryPagerProps<T extends string> {
  pagerRef: React.RefObject<PagerView>;
  categories: readonly T[];
  initialIndex: number;
  scrollEnabled?: boolean;
  onPageSelected: (e: { nativeEvent: { position: number } }) => void;
  onPageScroll?: (e: { nativeEvent: { position: number; offset: number } }) => void;
  onPageScrollStateChanged?: (e: { nativeEvent: { pageScrollState: string } }) => void;
  renderPage: (category: T, index: number) => React.ReactNode;
}

export const CategoryPager = <T extends string>({
  pagerRef,
  categories,
  initialIndex,
  scrollEnabled = true,
  onPageSelected,
  onPageScroll,
  onPageScrollStateChanged,
  renderPage,
}: CategoryPagerProps<T>) => {
  return (
    <PagerView
      ref={pagerRef}
      style={styles.pagerView}
      initialPage={initialIndex}
      onPageSelected={onPageSelected}
      onPageScroll={onPageScroll}
      onPageScrollStateChanged={onPageScrollStateChanged}
      scrollEnabled={scrollEnabled}
      overdrag={true}>
      {categories.map((category, index) => (
        <View key={category} style={styles.page}>
          {renderPage(category, index)}
        </View>
      ))}
    </PagerView>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
});

