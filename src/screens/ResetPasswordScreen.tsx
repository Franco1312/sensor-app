/**
 * ResetPasswordScreen - Password reset screen
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { Screen } from '@/components/layout';
import { Text, Button, Input, ChartIcon } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { resetPassword } from '@/services/auth-api';
import { useTranslation } from '@/i18n';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
type ResetPasswordRouteProp = {
  params: RootStackParamList['ResetPassword'];
};

export const ResetPasswordScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
  const route = useRoute<ResetPasswordRouteProp>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [token, setToken] = useState(route.params?.token || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateForm = (): boolean => {
    if (!token || !password || !confirmPassword) {
      Alert.alert(t('components.common.error'), t('screens.resetPassword.errors.emptyFields'));
      return false;
    }

    if (password.length < 8) {
      Alert.alert(t('components.common.error'), t('screens.resetPassword.errors.passwordTooShort'));
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('components.common.error'), t('screens.resetPassword.errors.passwordsDontMatch'));
      return false;
    }

    return true;
  };

  const handleReset = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, newPassword: password });
      Alert.alert(
        t('components.common.success'),
        t('screens.resetPassword.success.message'),
        [
          {
            text: t('components.common.ok'),
            onPress: () => {
              navigation.navigate('Login' as never);
            },
          },
        ]
      );
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : t('screens.resetPassword.errors.resetFailed');
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
              <View
                style={[
                  styles.logoContainer,
                  {
                    backgroundColor: theme.colors.primaryLight,
                    borderRadius: theme.radii.xl,
                    marginBottom: theme.spacing.base,
                  },
                ]}>
                <ChartIcon size={32} />
              </View>
              <Text variant="3xl" weight="bold" style={{ marginBottom: theme.spacing.sm, textAlign: 'center' }}>
                {t('screens.resetPassword.title')}
              </Text>
              <Text variant="base" color="textSecondary" style={{ textAlign: 'center' }}>
                {t('screens.resetPassword.subtitle')}
              </Text>
            </View>

            {/* Reset Form */}
            <View style={styles.form}>
              {/* Token Field */}
              <Input
                label={t('screens.resetPassword.tokenLabel')}
                leftIcon="lock"
                placeholder={t('screens.resetPassword.tokenPlaceholder')}
                value={token}
                onChangeText={setToken}
                autoCapitalize="none"
                editable={!loading}
                containerStyle={{ marginBottom: theme.spacing.base }}
              />

              {/* Password Field */}
              <Input
                label={t('screens.resetPassword.passwordLabel')}
                leftIcon="lock"
                rightIcon={showPassword ? 'visibility_off' : 'visibility'}
                onRightIconPress={() => setShowPassword(!showPassword)}
                placeholder={t('screens.resetPassword.passwordPlaceholder')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
                containerStyle={{ marginBottom: theme.spacing.base }}
              />

              {/* Confirm Password Field */}
              <Input
                label={t('screens.resetPassword.confirmPasswordLabel')}
                leftIcon="lock"
                rightIcon={showConfirmPassword ? 'visibility_off' : 'visibility'}
                onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                placeholder={t('screens.resetPassword.confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                editable={!loading}
                containerStyle={{ marginBottom: theme.spacing.sm }}
              />

              {/* Reset Button */}
              <Button
                title={t('screens.resetPassword.resetButton')}
                variant="primary"
                onPress={handleReset}
                disabled={loading}
                loading={loading}
                style={{ marginTop: theme.spacing.base }}
              />
            </View>

            {/* Back to Login Link */}
            <View style={[styles.loginContainer, { marginTop: theme.spacing.xl }]}>
              <Text variant="sm" color="textSecondary" style={{ textAlign: 'center' }}>
                <Text
                  variant="sm"
                  weight="semibold"
                  style={{ color: theme.colors.primary }}
                  onPress={() => navigation.navigate('Login' as never)}>
                  {t('screens.resetPassword.backToLogin')}
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
  logoContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '100%',
  },
  loginContainer: {
    width: '100%',
  },
});

