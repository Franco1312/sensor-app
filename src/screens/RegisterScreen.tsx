/**
 * RegisterScreen - User registration screen
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { Screen } from '@/components/layout';
import { Text, Button, Input, ChartIcon } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/context/AuthContext';
import { register, type RegisterRequest } from '@/services/auth-api';
import { useTranslation } from '@/i18n';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { login: loginUser } = useAuth();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateForm = (): boolean => {
    if (!email || !password || !confirmPassword) {
      Alert.alert(t('components.common.error'), t('screens.register.errors.emptyFields'));
      return false;
    }

    if (password.length < 8) {
      Alert.alert(t('components.common.error'), t('screens.register.errors.passwordTooShort'));
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('components.common.error'), t('screens.register.errors.passwordsDontMatch'));
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t('components.common.error'), t('screens.register.errors.invalidEmail'));
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const data: RegisterRequest = { email, password };
      const user = await register(data);
      
      // After registration, user needs to verify email
      Alert.alert(
        t('components.common.success'),
        t('screens.register.success.message'),
        [
          {
            text: t('components.common.ok'),
            onPress: () => {
              navigation.navigate('VerifyEmail', { email });
            },
          },
        ]
      );
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : t('screens.register.errors.registrationFailed');
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
                {t('screens.register.title')}
              </Text>
              <Text variant="base" color="textSecondary" style={{ textAlign: 'center' }}>
                {t('screens.register.subtitle')}
              </Text>
            </View>

            {/* Register Form */}
            <View style={styles.form}>
              {/* Email Field */}
              <Input
                label={t('screens.register.emailLabel')}
                leftIcon="person"
                placeholder={t('screens.register.emailPlaceholder')}
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
                label={t('screens.register.passwordLabel')}
                leftIcon="lock"
                rightIcon={showPassword ? 'visibility_off' : 'visibility'}
                onRightIconPress={() => setShowPassword(!showPassword)}
                placeholder={t('screens.register.passwordPlaceholder')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
                containerStyle={{ marginBottom: theme.spacing.base }}
              />

              {/* Confirm Password Field */}
              <Input
                label={t('screens.register.confirmPasswordLabel')}
                leftIcon="lock"
                rightIcon={showConfirmPassword ? 'visibility_off' : 'visibility'}
                onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                placeholder={t('screens.register.confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                editable={!loading}
                containerStyle={{ marginBottom: theme.spacing.sm }}
              />

              {/* Register Button */}
              <Button
                title={t('screens.register.registerButton')}
                variant="primary"
                onPress={handleRegister}
                disabled={loading}
                loading={loading}
                style={{ marginTop: theme.spacing.base }}
              />
            </View>

            {/* Login Link */}
            <View style={[styles.loginContainer, { marginTop: theme.spacing.xl }]}>
              <Text variant="sm" color="textSecondary" style={{ textAlign: 'center' }}>
                {t('screens.register.login.question')}{' '}
                <Text
                  variant="sm"
                  weight="semibold"
                  style={{ color: theme.colors.primary }}
                  onPress={() => navigation.goBack()}>
                  {t('screens.register.login.link')}
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

