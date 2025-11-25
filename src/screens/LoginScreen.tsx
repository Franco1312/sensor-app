/**
 * LoginScreen - Authentication screen based on design
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { Screen } from '@/components/layout';
import { Text, Button, Input, ChartIcon } from '@/components/common';
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
                Bienvenido de vuelta
              </Text>
              <Text variant="base" color="textSecondary" style={{ textAlign: 'center' }}>
                Inicia sesión para continuar en Radar Económico
              </Text>
            </View>

            {/* Login Form */}
            <View style={styles.form}>
              {/* Email or User Field */}
              <Input
                label="Email o Usuario"
                leftIcon="person"
                placeholder="Ingresa tu email o usuario"
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
                label="Contraseña"
                leftIcon="lock"
                rightIcon={showPassword ? 'visibility_off' : 'visibility'}
                onRightIconPress={() => setShowPassword(!showPassword)}
                placeholder="Ingresa tu contraseña"
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
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <Button
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
              <Text variant="xs" weight="medium" color="textSecondary" style={{ paddingHorizontal: theme.spacing.base }}>
                O
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
                  Alert.alert('Info', 'Login con Google - Próximamente');
                }}>
                <Text variant="sm" weight="medium" style={{ color: theme.colors.textPrimary }}>
                  Continuar con Google
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
                  Alert.alert('Info', 'Login con Apple - Próximamente');
                }}>
                <Text variant="sm" weight="medium" style={{ color: theme.colors.textPrimary }}>
                  Continuar con Apple
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={[styles.signUpContainer, { marginTop: theme.spacing.xl }]}>
              <Text variant="sm" color="textSecondary" style={{ textAlign: 'center' }}>
                ¿No tienes una cuenta?{' '}
                <Text
                  variant="sm"
                  weight="semibold"
                  style={{ color: theme.colors.primary }}
                  onPress={() => {
                    // TODO: Navigate to register screen
                    Alert.alert('Info', 'Registro - Próximamente');
                  }}>
                  Regístrate ahora
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
