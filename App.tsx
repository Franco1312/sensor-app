/**
 * App - Root component
 * Wraps the app with ThemeProvider, QueryClientProvider and Navigation
 */

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { RootNavigator } from '@/navigation';
import { queryClient, asyncStoragePersister } from '@/store/queryClient';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
        </PersistQueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
