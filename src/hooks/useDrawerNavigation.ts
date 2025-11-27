/**
 * useDrawerNavigation - Unified drawer navigation hook
 */

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { ScreenType, NavigationTarget, CategoryConfig } from '@/types/navigation';
import { getActiveScreenFromState, getNavigationTarget } from '@/utils/drawerNavigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface UseDrawerNavigationConfig {
  categoryConfigs: Map<ScreenType, CategoryConfig>;
}

export const useDrawerNavigation = (config: UseDrawerNavigationConfig) => {
  const navigation = useNavigation<NavigationProp>();

  /**
   * Get current active screen from navigation state
   */
  const getActiveScreen = (): ScreenType | null => {
    const state = navigation.getState();
    return getActiveScreenFromState(state);
  };

  /**
   * Navigate to a screen using unified navigation target
   */
  const navigateToScreen = (screen: ScreenType) => {
    const target = getNavigationTarget(screen);
    
    if (target.type === 'stack') {
      navigation.navigate(target.screen);
    } else {
      navigation.navigate('MainTabs', { screen: target.screen });
    }
  };

  /**
   * Navigate to a subitem with category filter
   */
  const navigateToSubItem = (screen: ScreenType, categoryValue: string) => {
    const categoryConfig = config.categoryConfigs.get(screen);
    
    // Set category if config exists
    if (categoryConfig) {
      categoryConfig.setCurrent(categoryValue);
    }
    
    // Navigate using unified target
    navigateToScreen(screen);
  };

  /**
   * Get current category for a screen
   */
  const getCurrentCategory = (screen: ScreenType): string | null => {
    const categoryConfig = config.categoryConfigs.get(screen);
    return categoryConfig ? categoryConfig.getCurrent() : null;
  };

  return {
    getActiveScreen,
    navigateToScreen,
    navigateToSubItem,
    getCurrentCategory,
  };
};

