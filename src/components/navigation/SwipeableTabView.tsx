/**
 * SwipeableTabView - Wrapper component to enable swipe gestures between tabs
 * Uses PagerView to handle swipe gestures while maintaining bottom tab navigation
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { MainTabParamList } from '@/navigation/types';
import { useSwipeableTabs } from '@/hooks/useSwipeableTabs';
import { SCREENS_WITH_INTERNAL_SWIPE } from '@/constants/navigation';

interface SwipeableTabViewProps {
  children: React.ReactNode[];
  tabNames: Array<keyof MainTabParamList>;
}

export const SwipeableTabView: React.FC<SwipeableTabViewProps> = ({
  children,
  tabNames,
}) => {
  const {
    pagerRef,
    currentTabIndex,
    isSwipeDisabled,
    handlePageSelected,
    handlePageScroll,
    handlePageScrollStateChanged,
  } = useSwipeableTabs({
    tabNames,
    disabledScreens: SCREENS_WITH_INTERNAL_SWIPE,
  });

  // Enable scroll conditionally - when internal swipe is disabled, always allow external swipe
  // When internal swipe is enabled, it will handle boundaries and allow external swipe when needed
  return (
    <PagerView
      ref={pagerRef}
      style={styles.pagerView}
      initialPage={currentTabIndex >= 0 ? currentTabIndex : 0}
      onPageSelected={handlePageSelected}
      onPageScroll={handlePageScroll}
      onPageScrollStateChanged={handlePageScrollStateChanged}
      scrollEnabled={true}
      overdrag={false}>
      {children.map((child, index) => (
        <View key={index} style={styles.page}>
          {child}
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

