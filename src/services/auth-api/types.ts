/**
 * Auth API Types
 * Types for authentication and user management endpoints
 */

export type UserRole = 'USER' | 'ADMIN';
export type SubscriptionPlan = 'FREE' | 'PREMIUM' | string;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  plan: SubscriptionPlan;
  planExpiresAt: string | null;
  isEmailVerified: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
  revokeAll?: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}


export interface ValidationErrorDetail {
  path: string[];
  message: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: ValidationErrorDetail[];
}

