/**
 * CustomDrawer - Custom drawer component using Modal and native animations
 * Compatible with Expo Go without react-native-reanimated
 */

import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Modal, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { useDrawerAnimations } from '@/hooks/useDrawerAnimations';
import { useDrawerNavigation } from '@/hooks/useDrawerNavigation';
import { useIndicatorsFilter } from '@/context/IndicatorsFilterContext';
import { DrawerHeader } from './DrawerHeader';
import { DrawerMenuList, DrawerMenuItemConfig } from './DrawerMenuList';
import { DrawerOverlay } from './DrawerOverlay';
import { INDICATOR_CATEGORIES } from '@/constants/indicators';
import { QUOTE_CATEGORY_TABS } from '@/constants/quotes';
import { CategoryConfig, ScreenType } from '@/types/navigation';

const DRAWER_WIDTH = 280;

interface CustomDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const DRAWER_MENU_ITEMS: DrawerMenuItemConfig[] = [
  { label: 'Inicio', screen: 'Home', icon: 'home' },
  {
    label: 'Indicadores',
    screen: 'Indicators',
    icon: 'indicators',
    expandable: true,
    subItems: INDICATOR_CATEGORIES.map(cat => ({ label: cat.label, value: cat.value })),
  },
  {
    label: 'Cotizaciones',
    screen: 'Quotes',
    icon: 'quotes',
    expandable: true,
    subItems: QUOTE_CATEGORY_TABS.map(tab => ({ label: tab.label, value: tab.value })),
  },
  { label: 'Alertas', screen: 'Alerts', icon: 'alerts' },
];

export const CustomDrawer: React.FC<CustomDrawerProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { slideAnim, overlayOpacity } = useDrawerAnimations(visible);
  const {
    setSelectedCategory,
    currentCategory,
    setSelectedQuoteCategory,
    currentQuoteCategory,
  } = useIndicatorsFilter();

  // Unified category configuration
  const categoryConfigs = useMemo(() => {
    const configs = new Map<ScreenType, CategoryConfig>();
    
    configs.set('Indicators', {
      getCurrent: () => currentCategory,
      setCurrent: setSelectedCategory,
    });
    
    configs.set('Quotes', {
      getCurrent: () => currentQuoteCategory,
      setCurrent: setSelectedQuoteCategory,
    });
    
    return configs;
  }, [currentCategory, currentQuoteCategory, setSelectedCategory, setSelectedQuoteCategory]);

  const {
    getActiveScreen,
    navigateToScreen,
    navigateToSubItem,
    getCurrentCategory,
  } = useDrawerNavigation({ categoryConfigs });

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const activeScreen = getActiveScreen();

  const toggleExpand = (itemLabel: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemLabel)) {
        newSet.delete(itemLabel);
      } else {
        newSet.add(itemLabel);
      }
      return newSet;
    });
  };

  const handleMenuItemPress = (item: DrawerMenuItemConfig) => {
    if (item.expandable) {
      toggleExpand(item.label);
    } else {
      navigateToScreen(item.screen);
      onClose();
    }
  };

  const handleSubItemPress = (screen: string, categoryValue: string) => {
    navigateToSubItem(screen as any, categoryValue);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}>
      <View style={styles.container}>
        <DrawerOverlay overlayOpacity={overlayOpacity} onPress={onClose} />

        <Animated.View
          style={[
            styles.drawer,
            {
              backgroundColor: theme.colors.background,
              paddingTop: insets.top,
              transform: [{ translateX: slideAnim }],
              ...theme.shadows.md,
              shadowOffset: { width: 2, height: 0 },
            },
          ]}>
          <DrawerHeader />

          <View style={[styles.menuContainer, { paddingTop: theme.spacing.md }]}>
            <DrawerMenuList
              items={DRAWER_MENU_ITEMS}
              activeScreen={activeScreen}
              expandedItems={expandedItems}
              getCurrentCategory={getCurrentCategory}
              onMenuItemPress={handleMenuItemPress}
              onSubItemPress={handleSubItemPress}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
  },
  menuContainer: {
    flex: 1,
  },
});

