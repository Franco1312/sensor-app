/**
 * Root Navigator - Main navigation structure
 * Uses bottom tabs for main screens, stack for detail screens
 */

import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/theme/ThemeProvider';
import { TabIcon } from '@/components/common/TabIcon';
import { RootStackParamList, MainTabParamList } from './types';

// Screens
import { HomeScreen } from '@/screens/HomeScreen';
import { IndicatorsScreen } from '@/screens/IndicatorsScreen';
import { IndicatorDetailScreen } from '@/screens/IndicatorDetailScreen';
import { QuotesScreen } from '@/screens/QuotesScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Main Tab Navigator
 * Bottom tabs for primary navigation
 */
const MainTabs = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ focused, size }) => <TabIcon name="home" focused={focused} size={size} />,
        }}
      />
      <Tab.Screen
        name="Indicators"
        component={IndicatorsScreen}
        options={{
          tabBarLabel: 'Gráficos',
          tabBarIcon: ({ focused, size }) => <TabIcon name="chart" focused={focused} size={size} />,
        }}
      />
      <Tab.Screen
        name="Quotes"
        component={QuotesScreen}
        options={{
          tabBarLabel: 'Noticias',
          tabBarIcon: ({ focused, size }) => <TabIcon name="news" focused={focused} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Ajustes',
          tabBarIcon: ({ focused, size }) => <TabIcon name="settings" focused={focused} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};


/**
 * Root Stack Navigator
 * Handles navigation to detail screens
 */
export const RootNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
        translucent={false}
      />
      <NavigationContainer
        theme={{
          dark: theme.isDark,
          colors: {
            primary: theme.colors.primary,
            background: theme.colors.background,
            card: theme.colors.surface,
            text: theme.colors.textPrimary,
            border: theme.colors.border,
            notification: theme.colors.primary,
          },
        }}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: theme.colors.background,
            },
          }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="IndicatorDetail"
            component={IndicatorDetailScreen}
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
              headerTintColor: theme.colors.textPrimary,
              headerTitleStyle: {
                fontWeight: theme.typography.fontWeight.bold,
                fontSize: theme.typography.fontSize.lg,
              },
              headerShadowVisible: false,
              headerTransparent: false,
              contentStyle: {
                backgroundColor: theme.colors.background,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
