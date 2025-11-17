/**
 * SettingsScreen - Configuración y tema
 */

import React from 'react';
import { View, Switch } from 'react-native';
import { ScreenContainer, Header, ListItem } from '@/components/layout';
import { AppText, Card } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';

export const SettingsScreen: React.FC = () => {
  const { theme, isDarkMode, setThemeMode } = useTheme();

  return (
    <ScreenContainer>
      <Header title="Ajustes" />

      <View style={{ padding: theme.spacing.base, gap: theme.spacing.lg }}>
        {/* Theme Section */}
        <View>
          <AppText variant="lg" weight="bold" style={{ marginBottom: theme.spacing.base }}>
            Apariencia
          </AppText>

          <ListItem
            title="Modo Oscuro"
            subtitle={isDarkMode ? 'Activado' : 'Desactivado'}
            rightContent={
              <Switch
                value={isDarkMode}
                onValueChange={setThemeMode}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={theme.colors.surface}
              />
            }
            style={{ marginBottom: theme.spacing.md }}
          />
        </View>

        {/* About Section */}
        <View>
          <AppText variant="lg" weight="bold" style={{ marginBottom: theme.spacing.base }}>
            Acerca de
          </AppText>

          <Card style={{ marginBottom: theme.spacing.md }}>
            <AppText variant="base" weight="bold" style={{ marginBottom: theme.spacing.sm }}>
              Radar Económico
            </AppText>
            <AppText variant="sm" color="textSecondary" style={{ marginBottom: theme.spacing.sm }}>
              Versión 1.0.0
            </AppText>
            <AppText variant="sm" color="textSecondary">
              Aplicación para seguimiento de indicadores económicos y cotizaciones de mercado.
            </AppText>
          </Card>
        </View>
      </View>
    </ScreenContainer>
  );
};
