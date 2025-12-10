/**
 * LoginScreen - Authentication screen based on design
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { Screen } from '@/components/layout';
import { Text, Button, Input } from '@/design-system/components';
import { AppLogo } from '@/components/brand';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/context/AuthContext';
import { login, requestPasswordReset, type LoginRequest } from '@/services/auth-api';
import { useTranslation } from '@/i18n';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useScreenTracking, SCREEN_NAMES } from '@/core/analytics';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { login: loginUser } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Track screen view
  useScreenTracking(SCREEN_NAMES.LOGIN);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('components.common.error'), t('screens.login.errors.emptyFields'));
      return;
    }

    setLoading(true);
    try {
      const credentials: LoginRequest = { email, password };
      const response = await login(credentials);
      await loginUser(response);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : t('screens.login.errors.loginFailed');
      Alert.alert(t('components.common.error'), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert(t('components.common.error'), t('screens.login.errors.emailRequired'));
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset({ email });
      Alert.alert(
        t('components.common.success'),
        t('screens.login.errors.resetSuccess'),
        [
          {
            text: t('components.common.ok'),
            onPress: () => {
              // Navigate to reset password screen if needed
              // navigation.navigate('ResetPassword', { email });
            },
          },
        ]
      );
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : t('screens.login.errors.resetFailed');
      Alert.alert(t('components.common.error'), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scrollable={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          contentContainerStyle={[
            styles.container,
            {
              backgroundColor: theme.colors.background,
              padding: theme.spacing.base,
            },
          ]}
          keyboardShouldPersistTaps="handled">
          <View style={[styles.content, { maxWidth: 400 }]}>
            {/* Logo and Welcome Text */}
            <View style={[styles.header, { marginBottom: theme.spacing.xl }]}>
              <AppLogo variant="default" size={64} style={{ marginBottom: theme.spacing.base }} />
              <Text variant="3xl" weight="bold" style={{ marginBottom: theme.spacing.sm, textAlign: 'center' }}>
                {t('screens.login.title')}
              </Text>
              <Text variant="base" color="textSecondary" style={{ textAlign: 'center' }}>
                {t('screens.login.subtitle')}
              </Text>
            </View>

            {/* Login Form */}
            <View style={styles.form}>
              {/* Email or User Field */}
              <Input
                label={t('screens.login.emailLabel')}
                leftIcon="person"
                placeholder={t('screens.login.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
                containerStyle={{ marginBottom: theme.spacing.base }}
              />

              {/* Password Field */}
              <Input
                label={t('screens.login.passwordLabel')}
                leftIcon="lock"
                rightIcon={showPassword ? 'visibility_off' : 'visibility'}
                onRightIconPress={() => setShowPassword(!showPassword)}
                placeholder={t('screens.login.passwordPlaceholder')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
                containerStyle={{ marginBottom: theme.spacing.sm }}
              />

              {/* Forgot Password Link */}
              <TouchableOpacity
                onPress={handleForgotPassword}
                activeOpacity={0.7}
                style={{ alignSelf: 'flex-end', marginBottom: theme.spacing.base }}>
                <Text variant="sm" weight="medium" style={{ color: theme.colors.primary }}>
                  {t('screens.login.forgotPassword')}
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <Button
                title={t('screens.login.loginButton')}
                variant="primary"
                onPress={handleLogin}
                disabled={loading}
                loading={loading}
                style={{ marginTop: theme.spacing.base }}
              />
            </View>

            {/* Divider */}
            <View style={[styles.divider, { marginVertical: theme.spacing.lg }]}>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
              <Text variant="xs" weight="medium" color="textSecondary" style={{ paddingHorizontal: theme.spacing.base }}>
                {t('screens.login.divider')}
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            </View>

            {/* Social Logins */}
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    marginBottom: theme.spacing.sm,
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  // TODO: Implement Google login
                  Alert.alert(t('components.common.info'), t('screens.login.alerts.googleComingSoon'));
                }}>
                <Text variant="sm" weight="medium" style={{ color: theme.colors.textPrimary }}>
                  {t('screens.login.googleLogin')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  // TODO: Implement Apple login
                  Alert.alert(t('components.common.info'), t('screens.login.alerts.appleComingSoon'));
                }}>
                <Text variant="sm" weight="medium" style={{ color: theme.colors.textPrimary }}>
                  {t('screens.login.appleLogin')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={[styles.signUpContainer, { marginTop: theme.spacing.xl }]}>
              <Text variant="sm" color="textSecondary" style={{ textAlign: 'center' }}>
                {t('screens.login.signUp.question')}{' '}
                <Text
                  variant="sm"
                  weight="semibold"
                  style={{ color: theme.colors.primary }}
                  onPress={() => {
                    navigation.navigate('Register' as never);
                  }}>
                  {t('screens.login.signUp.link')}
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
  },
  form: {
    width: '100%',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  socialContainer: {
    width: '100%',
  },
  socialButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  signUpContainer: {
    width: '100%',
  },
});
