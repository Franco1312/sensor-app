/**
 * ProfileScreen - User profile screen
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Screen, Header, Section } from '@/components/layout';
import { Text, Card } from '@/components/common';
import { ListItem } from '@/components/layout';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/context/AuthContext';
import Svg, { Path } from 'react-native-svg';

/**
 * User Avatar Icon Component
 */
const UserAvatar: React.FC<{ size?: number }> = ({ size = 80 }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.avatarContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.colors.primaryLight,
          borderWidth: 3,
          borderColor: theme.colors.primary,
        },
      ]}>
      <Svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          fill={theme.colors.primary}
        />
      </Svg>
    </View>
  );
};

export const ProfileScreen: React.FC = () => {
  const { theme, isDarkMode, setThemeMode } = useTheme();
  const { user, logout } = useAuth();
  const userData = user || {
    name: 'Usuario',
    email: 'usuario@ejemplo.com',
  };

  return (
    <Screen scrollable>
      <Header title="Perfil" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.base, paddingBottom: theme.spacing.xl }}>
        {/* User Info Section */}
        <Card style={{ marginBottom: theme.spacing.lg, alignItems: 'center', paddingVertical: theme.spacing.xl }}>
          <UserAvatar size={100} />
          <Text variant="xl" weight="bold" style={{ marginTop: theme.spacing.base, marginBottom: theme.spacing.xs }}>
            {userData.name}
          </Text>
          <Text variant="base" color="textSecondary">
            {userData.email}
          </Text>
        </Card>

        {/* Account Section */}
        <Section title="Cuenta" />

        <ListItem
          title="Editar Perfil"
          subtitle="Actualiza tu información personal"
          onPress={() => {
            // TODO: Navigate to edit profile screen
          }}
          style={{ marginBottom: theme.spacing.sm }}
        />

        <ListItem
          title="Cambiar Contraseña"
          subtitle="Actualiza tu contraseña de acceso"
          onPress={() => {
            // TODO: Navigate to change password screen
          }}
          style={{ marginBottom: theme.spacing.sm }}
        />

        {/* Preferences Section */}
        <Section title="Preferencias" />

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
          style={{ marginBottom: theme.spacing.sm }}
        />

        <ListItem
          title="Notificaciones"
          subtitle="Gestiona tus notificaciones"
          rightContent={
            <Switch
              value={true}
              onValueChange={() => {
                // TODO: Handle notifications toggle
              }}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          }
          style={{ marginBottom: theme.spacing.sm }}
        />

        {/* About Section */}
        <Section title="Acerca de" />

        <Card style={{ marginBottom: theme.spacing.md }}>
          <Text variant="base" weight="bold" style={{ marginBottom: theme.spacing.sm }}>
            Radar Económico
          </Text>
          <Text variant="sm" color="textSecondary" style={{ marginBottom: theme.spacing.sm }}>
            Versión 1.0.0
          </Text>
          <Text variant="sm" color="textSecondary" style={{ marginBottom: theme.spacing.sm }}>
            Aplicación para seguimiento de indicadores económicos y cotizaciones de mercado.
          </Text>
        </Card>

        <ListItem
          title="Términos y Condiciones"
          subtitle="Lee nuestros términos de uso"
          onPress={() => {
            // TODO: Navigate to terms screen
          }}
          style={{ marginBottom: theme.spacing.sm }}
        />

        <ListItem
          title="Política de Privacidad"
          subtitle="Conoce cómo protegemos tus datos"
          onPress={() => {
            // TODO: Navigate to privacy policy screen
          }}
          style={{ marginBottom: theme.spacing.sm }}
        />

        {/* Logout Section */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: theme.colors.errorLight,
              borderColor: theme.colors.error,
              marginTop: theme.spacing.lg,
            },
          ]}
          onPress={() => {
            logout();
          }}
          activeOpacity={0.7}>
          <Text variant="base" weight="semibold" style={{ color: theme.colors.error }}>
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

