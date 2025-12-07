/**
 * ProfileScreen - User profile screen
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Screen, Header, Section } from '@/components/layout';
import { Text, Card, Badge } from '@/design-system/components';
import { ListItem } from '@/components/layout';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/i18n';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
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

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const { theme, isDarkMode, setThemeMode } = useTheme();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  
  const userData = user || {
    email: 'usuario@ejemplo.com',
  };

  return (
    <Screen scrollable>
      <Header title={t('screens.profile.title')} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.base, paddingBottom: theme.spacing.xl }}>
        {/* User Info Section */}
        <Card style={{ marginBottom: theme.spacing.lg, alignItems: 'center', paddingVertical: theme.spacing.xl }}>
          <UserAvatar size={100} />
          <Text variant="xl" weight="bold" style={{ marginTop: theme.spacing.base, marginBottom: theme.spacing.xs }}>
            {userData.email?.split('@')[0] || 'Usuario'}
          </Text>
          <Text variant="base" color="textSecondary" style={{ marginBottom: theme.spacing.sm }}>
            {userData.email}
          </Text>
          {userData.plan && (
            <Badge
              variant={userData.plan === 'PREMIUM' ? 'primary' : 'secondary'}
              style={{ marginTop: theme.spacing.xs }}>
              {userData.plan}
            </Badge>
          )}
          {userData.isEmailVerified === false && (
            <Badge variant="warning" style={{ marginTop: theme.spacing.xs }}>
              {t('screens.profile.emailNotVerified')}
            </Badge>
          )}
        </Card>

        {/* Account Section */}
        <Section title={t('screens.profile.account')} />

        <ListItem
          title={t('screens.profile.editProfile')}
          subtitle={t('screens.profile.editProfileSubtitle')}
          onPress={() => {
            // TODO: Navigate to edit profile screen
          }}
          style={{ marginBottom: theme.spacing.sm }}
        />

        <ListItem
          title={t('screens.profile.subscription')}
          subtitle={userData.plan ? `${t('screens.profile.currentPlan')}: ${userData.plan}` : t('screens.profile.noPlan')}
          onPress={() => {
            navigation.navigate('Plans');
          }}
          style={{ marginBottom: theme.spacing.sm }}
        />

        <ListItem
          title={t('screens.profile.changePassword')}
          subtitle={t('screens.profile.changePasswordSubtitle')}
          onPress={() => {
            // TODO: Navigate to change password screen
          }}
          style={{ marginBottom: theme.spacing.sm }}
        />

        {/* Preferences Section */}
        <Section title={t('screens.profile.preferences')} />

        <ListItem
          title={t('screens.profile.darkMode')}
          subtitle={isDarkMode ? t('screens.profile.darkModeActive') : t('screens.profile.darkModeInactive')}
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
          title={t('screens.profile.notifications')}
          subtitle={t('screens.profile.notificationsSubtitle')}
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
        <Section title={t('screens.profile.about')} />

        <Card style={{ marginBottom: theme.spacing.md }}>
          <Text variant="base" weight="bold" style={{ marginBottom: theme.spacing.sm }}>
            {t('screens.profile.appName')}
          </Text>
          <Text variant="sm" color="textSecondary" style={{ marginBottom: theme.spacing.sm }}>
            {t('screens.profile.version')}
          </Text>
          <Text variant="sm" color="textSecondary" style={{ marginBottom: theme.spacing.sm }}>
            {t('screens.profile.appDescription')}
          </Text>
        </Card>

        <ListItem
          title={t('screens.profile.terms')}
          subtitle={t('screens.profile.termsSubtitle')}
          onPress={() => {
            // TODO: Navigate to terms screen
          }}
          style={{ marginBottom: theme.spacing.sm }}
        />

        <ListItem
          title={t('screens.profile.privacy')}
          subtitle={t('screens.profile.privacySubtitle')}
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
            {t('screens.profile.logout')}
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

