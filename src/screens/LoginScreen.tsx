/**
 * LoginScreen - Authentication screen based on design
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { ScreenContainer } from '@/components/layout';
import { AppText, AppButton } from '@/components/common';
import { InputIcon, ChartIcon } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/context/AuthContext';
import { login, requestPasswordReset, LoginRequest } from '@/services/auth-api';

export const LoginScreen: React.FC = () => {
  const { theme } = useTheme();
  const { login: loginUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const credentials: LoginRequest = { email, password };
      const response = await login(credentials);
      loginUser(response.data.user, response.data.token);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu email primero');
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset({ email });
      Alert.alert('Éxito', 'Se ha enviado un email con las instrucciones para recuperar tu contraseña');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al solicitar recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scrollable={false}>
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
              <AppText variant="3xl" weight="bold" style={{ marginBottom: theme.spacing.sm, textAlign: 'center' }}>
                Bienvenido de vuelta
              </AppText>
              <AppText variant="base" color="textSecondary" style={{ textAlign: 'center' }}>
                Inicia sesión para continuar en Radar Económico
              </AppText>
            </View>

            {/* Login Form */}
            <View style={styles.form}>
              {/* Email or User Field */}
              <View style={[styles.inputContainer, { marginBottom: theme.spacing.base }]}>
                <AppText variant="sm" weight="medium" style={{ marginBottom: theme.spacing.xs, color: theme.colors.textPrimary }}>
                  Email o Usuario
                </AppText>
                <View style={styles.inputWrapper}>
                  <View style={styles.iconLeft}>
                    <InputIcon name="person" size={20} />
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.border,
                        color: theme.colors.textPrimary,
                        paddingLeft: 40,
                      },
                    ]}
                    placeholder="Ingresa tu email o usuario"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={[styles.inputContainer, { marginBottom: theme.spacing.sm }]}>
                <AppText variant="sm" weight="medium" style={{ marginBottom: theme.spacing.xs, color: theme.colors.textPrimary }}>
                  Contraseña
                </AppText>
                <View style={styles.inputWrapper}>
                  <View style={styles.iconLeft}>
                    <InputIcon name="lock" size={20} />
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.border,
                        color: theme.colors.textPrimary,
                        paddingLeft: 40,
                        paddingRight: 40,
                      },
                    ]}
                    placeholder="Ingresa tu contraseña"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.iconRight}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}>
                    <InputIcon name={showPassword ? 'visibility_off' : 'visibility'} size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password Link */}
              <TouchableOpacity
                onPress={handleForgotPassword}
                activeOpacity={0.7}
                style={{ alignSelf: 'flex-end', marginBottom: theme.spacing.base }}>
                <AppText variant="sm" weight="medium" style={{ color: theme.colors.primary }}>
                  ¿Olvidaste tu contraseña?
                </AppText>
              </TouchableOpacity>

              {/* Login Button */}
              <AppButton
                title="Iniciar Sesión"
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
              <AppText variant="xs" weight="medium" color="textSecondary" style={{ paddingHorizontal: theme.spacing.base }}>
                O
              </AppText>
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
                  Alert.alert('Info', 'Login con Google - Próximamente');
                }}>
                <AppText variant="sm" weight="medium" style={{ color: theme.colors.textPrimary }}>
                  Continuar con Google
                </AppText>
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
                  Alert.alert('Info', 'Login con Apple - Próximamente');
                }}>
                <AppText variant="sm" weight="medium" style={{ color: theme.colors.textPrimary }}>
                  Continuar con Apple
                </AppText>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={[styles.signUpContainer, { marginTop: theme.spacing.xl }]}>
              <AppText variant="sm" color="textSecondary" style={{ textAlign: 'center' }}>
                ¿No tienes una cuenta?{' '}
                <AppText
                  variant="sm"
                  weight="semibold"
                  style={{ color: theme.colors.primary }}
                  onPress={() => {
                    // TODO: Navigate to register screen
                    Alert.alert('Info', 'Registro - Próximamente');
                  }}>
                  Regístrate ahora
                </AppText>
              </AppText>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
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
  inputContainer: {
    width: '100%',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  iconLeft: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  iconRight: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
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
