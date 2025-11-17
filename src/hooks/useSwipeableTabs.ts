/**
 * useSwipeableTabs - Hook for managing swipeable tab navigation
 * Handles synchronization between PagerView and navigation state
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigation, useRoute, useIsFocused, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import PagerView from 'react-native-pager-view';
import { MainTabParamList } from '@/navigation/types';
import { NAVIGATION_TIMING } from '@/constants/navigation';

interface UseSwipeableTabsOptions {
  tabNames: Array<keyof MainTabParamList>;
  disabledScreens?: Array<keyof MainTabParamList>;
}

export const useSwipeableTabs = ({
  tabNames,
  disabledScreens = [],
}: UseSwipeableTabsOptions) => {
  const pagerRef = useRef<PagerView>(null);
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const route = useRoute();
  const isFocused = useIsFocused();
  
  // State management
  const [isNavigating, setIsNavigating] = useState(false);
  const [lastSyncedIndex, setLastSyncedIndex] = useState(-1);
  const [isUserSwiping, setIsUserSwiping] = useState(false);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Computed values
  const currentTabIndex = tabNames.findIndex(name => name === route.name);
  const isSwipeDisabled = disabledScreens.includes(route.name as keyof MainTabParamList);
  const shouldSync = currentTabIndex >= 0 && currentTabIndex !== lastSyncedIndex;
  const canSync = shouldSync && !isNavigating && !isUserSwiping;

  // Helper: Clear pending sync timeout
  const clearSyncTimeout = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }
  }, []);

  // Helper: Sync PagerView to current tab index
  const syncPagerToTab = useCallback((tabIndex: number) => {
    if (pagerRef.current && tabIndex >= 0) {
      pagerRef.current.setPage(tabIndex);
      setLastSyncedIndex(tabIndex);
    }
  }, []);

  // Helper: Mark user as swiping and cancel pending syncs
  const startUserSwipe = useCallback(() => {
    setIsUserSwiping(true);
    clearSyncTimeout();
  }, [clearSyncTimeout]);

  // Sync PagerView when tab changes via bottom tabs (not from swipe)
  useFocusEffect(
    useCallback(() => {
      if (canSync) {
        clearSyncTimeout();
        requestAnimationFrame(() => syncPagerToTab(currentTabIndex));
      }
    }, [canSync, currentTabIndex, clearSyncTimeout, syncPagerToTab])
  );

  // Sync on mount and route changes (only if not from swipe)
  useEffect(() => {
    if (canSync && pagerRef.current && isFocused) {
      clearSyncTimeout();
      
      syncTimeoutRef.current = setTimeout(() => {
        if (!isUserSwiping) {
          syncPagerToTab(currentTabIndex);
        }
      }, NAVIGATION_TIMING.SYNC_DELAY);
      
      return clearSyncTimeout;
    }
  }, [canSync, isFocused, isUserSwiping, currentTabIndex, clearSyncTimeout, syncPagerToTab]);

  // Handle page scroll - detect when user starts swiping
  const handlePageScroll = useCallback(() => {
    if (!isUserSwiping) {
      startUserSwipe();
    }
  }, [isUserSwiping, startUserSwipe]);

  // Handle scroll state changes
  const handlePageScrollStateChanged = useCallback(
    (e: { nativeEvent: { pageScrollState: string } }) => {
      const state = e.nativeEvent.pageScrollState;
      
      if (state === 'idle') {
        // Reset swiping state after delay to ensure smooth transition
        setTimeout(() => setIsUserSwiping(false), 300);
      } else if (state === 'dragging') {
        startUserSwipe();
      }
    },
    [startUserSwipe]
  );

  // Handle page change from swipe gesture
  const handlePageSelected = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      const newIndex = e.nativeEvent.position;
      const tabName = tabNames[newIndex];
      const isDifferentTab = tabName && tabName !== route.name;
      
      if (isDifferentTab && !isNavigating) {
        setIsNavigating(true);
        setLastSyncedIndex(newIndex);
        setIsUserSwiping(true);
        
        // Navigate and reset states after animation
        requestAnimationFrame(() => {
          navigation.navigate(tabName);
          setTimeout(() => {
            setIsNavigating(false);
            setIsUserSwiping(false);
          }, NAVIGATION_TIMING.NAVIGATION_RESET);
        });
      }
    },
    [tabNames, route.name, isNavigating, navigation]
  );

  // Cleanup on unmount
  useEffect(() => clearSyncTimeout, [clearSyncTimeout]);

  return {
    pagerRef,
    currentTabIndex,
    isSwipeDisabled,
    handlePageSelected,
    handlePageScroll,
    handlePageScrollStateChanged,
  };
};

