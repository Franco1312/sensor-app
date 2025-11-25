/**
 * CustomDrawer - Custom drawer component using Modal and native animations
 * Compatible with Expo Go without react-native-reanimated
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Modal, Animated, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from '@/components/ui';
import { DrawerMenuItem } from './DrawerMenuItem';
import { DrawerSubItem } from './DrawerSubItem';
import { useTheme } from '@/theme/ThemeProvider';
import { useIndicatorsFilter } from '@/context/IndicatorsFilterContext';
import { RootStackParamList, MainTabParamList } from '@/navigation/types';
import { INDICATOR_CATEGORIES } from '@/constants/indicators';
import { QUOTE_CATEGORY_TABS } from '@/constants/quotes';

const DRAWER_WIDTH = 280;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CustomDrawerProps {
  visible: boolean;
  onClose: () => void;
}

interface DrawerMenuItem {
  label: string;
  tabScreen: keyof MainTabParamList;
  icon: 'home' | 'profile' | 'indicators' | 'quotes';
  expandable?: boolean;
  subItems?: Array<{ label: string; value: string }>;
}

const DRAWER_MENU_ITEMS: DrawerMenuItem[] = [
  { label: 'Inicio', tabScreen: 'Home', icon: 'home' },
  {
    label: 'Indicadores',
    tabScreen: 'Indicators',
    icon: 'indicators',
    expandable: true,
    subItems: INDICATOR_CATEGORIES.map(cat => ({ label: cat.label, value: cat.value })),
  },
  {
    label: 'Cotizaciones',
    tabScreen: 'Quotes',
    icon: 'quotes',
    expandable: true,
    subItems: QUOTE_CATEGORY_TABS.map(tab => ({ label: tab.label, value: tab.value })),
  },
];

export const CustomDrawer: React.FC<CustomDrawerProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const {
    setSelectedCategory,
    currentCategory,
    setSelectedQuoteCategory,
    currentQuoteCategory,
  } = useIndicatorsFilter();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Get current active screen from navigation state
  const getActiveScreen = (): keyof MainTabParamList | null => {
    const state = navigation.getState();
    const mainTabsState = state?.routes.find((r: any) => r.name === 'MainTabs')?.state;
    if (mainTabsState && 'index' in mainTabsState && mainTabsState.routes) {
      const activeRoute = mainTabsState.routes[mainTabsState.index as number];
      return activeRoute?.name as keyof MainTabParamList;
    }
    return null;
  };

  const activeScreen = getActiveScreen();

  useEffect(() => {
    if (visible) {
      // Open animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Close animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, overlayOpacity]);

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

  const handleMenuItemPress = (item: DrawerMenuItem) => {
    if (item.expandable) {
      toggleExpand(item.label);
    } else {
      navigation.navigate('MainTabs', { screen: item.tabScreen });
      onClose();
    }
  };

  const handleSubItemPress = (tabScreen: keyof MainTabParamList, categoryValue: string) => {
    // Set the category filter in context and navigate
    if (tabScreen === 'Indicators') {
      setSelectedCategory(categoryValue);
      navigation.navigate('MainTabs', { screen: tabScreen });
    } else if (tabScreen === 'Quotes') {
      setSelectedQuoteCategory(categoryValue);
      navigation.navigate('MainTabs', { screen: tabScreen });
    } else {
      navigation.navigate('MainTabs', { screen: tabScreen });
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Overlay */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: theme.colors.overlay,
                  opacity: overlayOpacity,
                },
              ]}
          />
        </Pressable>

        {/* Drawer Content */}
        <Animated.View
          style={[
            styles.drawer,
            {
              backgroundColor: theme.colors.background,
              paddingTop: insets.top,
              transform: [{ translateX: slideAnim }],
              ...theme.shadows.md,
              shadowOffset: { width: 2, height: 0 }, // Horizontal shadow for drawer
            },
          ]}>
      <View style={[styles.header, { paddingBottom: theme.spacing.lg, borderBottomColor: theme.colors.border, paddingHorizontal: theme.spacing.base }]}>
        <Text variant="2xl" weight="bold" style={{ color: theme.colors.textPrimary }}>
          Radar Económico
        </Text>
      </View>

          <View style={[styles.menuContainer, { paddingTop: theme.spacing.md }]}>
            {DRAWER_MENU_ITEMS.map((item, index) => {
              const isActive = activeScreen === item.tabScreen;
              const isExpanded = expandedItems.has(item.label);
              const hasSubItems = item.expandable && item.subItems && item.subItems.length > 0;

              // Check if any subitem is active
              const hasActiveSubItem = hasSubItems
                ? item.subItems!.some(subItem => {
                    if (activeScreen !== item.tabScreen) return false;
                    if (item.tabScreen === 'Indicators') {
                      return currentCategory === subItem.value;
                    }
                    if (item.tabScreen === 'Quotes') {
                      return currentQuoteCategory === subItem.value;
                    }
                    return false;
                  })
                : false;

              return (
                <View key={index}>
                  <DrawerMenuItem
                    label={item.label}
                    icon={item.icon}
                    isActive={isActive}
                    isExpanded={isExpanded}
                    hasSubItems={hasSubItems}
                    hasActiveSubItem={hasActiveSubItem}
                    onPress={() => handleMenuItemPress(item)}
                  />

                  {/* Sub-items */}
                  {hasSubItems && isExpanded && (
                    <View>
                      {item.subItems!.map((subItem, subIndex) => {
                        // Determine if subitem is active based on screen type
                        const isSubItemActive =
                          activeScreen === item.tabScreen &&
                          (item.tabScreen === 'Indicators'
                            ? currentCategory === subItem.value
                            : item.tabScreen === 'Quotes'
                              ? currentQuoteCategory === subItem.value
                              : false);
                        return (
                          <DrawerSubItem
                            key={subIndex}
                            label={subItem.label}
                            isActive={isSubItemActive}
                            onPress={() => handleSubItemPress(item.tabScreen, subItem.value)}
                          />
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
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
  header: {
    paddingTop: 20,
    borderBottomWidth: 1,
  },
  menuContainer: {
    flex: 1,
  },
});

