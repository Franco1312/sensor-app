/**
 * VerifyEmailScreen - Email verification screen
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { Screen } from '@/components/layout';
import { Text, Button, Input } from '@/design-system/components';
import { AppLogo } from '@/components/brand';
import { useTheme } from '@/theme/ThemeProvider';
import { verifyEmail, sendVerificationEmail } from '@/services/auth-api';
import { useTranslation } from '@/i18n';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/context/AuthContext';

type VerifyEmailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerifyEmail'>;
type VerifyEmailRouteProp = {
  params: RootStackParamList['VerifyEmail'];
};

export const VerifyEmailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { refreshUser } = useAuth();
  const navigation = useNavigation<VerifyEmailScreenNavigationProp>();
  const route = useRoute<VerifyEmailRouteProp>();
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [token, setToken] = useState('');

  const email = route.params?.email || '';

  const handleVerify = async () => {
    if (!token) {
      Alert.alert(t('components.common.error'), t('screens.verifyEmail.errors.tokenRequired'));
      return;
    }

    setLoading(true);
    try {
      await verifyEmail({ token });
      await refreshUser();
      Alert.alert(
        t('components.common.success'),
        t('screens.verifyEmail.success.message'),
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
      const errorMessage = error instanceof Error ? error.message : t('screens.verifyEmail.errors.verificationFailed');
      Alert.alert(t('components.common.error'), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      Alert.alert(t('components.common.error'), t('screens.verifyEmail.errors.emailRequired'));
      return;
    }

    setSendingEmail(true);
    try {
      await sendVerificationEmail();
      Alert.alert(t('components.common.success'), t('screens.verifyEmail.success.emailSent'));
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : t('screens.verifyEmail.errors.sendFailed');
      Alert.alert(t('components.common.error'), errorMessage);
    } finally {
      setSendingEmail(false);
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
                {t('screens.verifyEmail.title')}
              </Text>
              <Text variant="base" color="textSecondary" style={{ textAlign: 'center', marginBottom: theme.spacing.sm }}>
                {t('screens.verifyEmail.subtitle')}
              </Text>
              {email && (
                <Text variant="sm" color="textSecondary" style={{ textAlign: 'center' }}>
                  {email}
                </Text>
              )}
            </View>

            {/* Verification Form */}
            <View style={styles.form}>
              {/* Token Field */}
              <Input
                label={t('screens.verifyEmail.tokenLabel')}
                leftIcon="lock"
                placeholder={t('screens.verifyEmail.tokenPlaceholder')}
                value={token}
                onChangeText={setToken}
                autoCapitalize="none"
                editable={!loading}
                containerStyle={{ marginBottom: theme.spacing.base }}
              />

              {/* Verify Button */}
              <Button
                title={t('screens.verifyEmail.verifyButton')}
                variant="primary"
                onPress={handleVerify}
                disabled={loading}
                loading={loading}
                style={{ marginTop: theme.spacing.base }}
              />

              {/* Resend Email Link */}
              {email && (
                <TouchableOpacity
                  onPress={handleResendEmail}
                  activeOpacity={0.7}
                  disabled={sendingEmail}
                  style={{ alignSelf: 'center', marginTop: theme.spacing.base }}>
                  <Text variant="sm" weight="medium" style={{ color: theme.colors.primary }}>
                    {sendingEmail ? t('screens.verifyEmail.sending') : t('screens.verifyEmail.resendEmail')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Back to Login Link */}
            <View style={[styles.loginContainer, { marginTop: theme.spacing.xl }]}>
              <Text variant="sm" color="textSecondary" style={{ textAlign: 'center' }}>
                <Text
                  variant="sm"
                  weight="semibold"
                  style={{ color: theme.colors.primary }}
                  onPress={() => navigation.navigate('Login' as never)}>
                  {t('screens.verifyEmail.backToLogin')}
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
  loginContainer: {
    width: '100%',
  },
});

