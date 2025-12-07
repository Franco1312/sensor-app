/**
 * Auth API Client - Authentication service
 * Implements all authentication and user management endpoints
 */

import { ApiError } from '../common/ApiError';
import { authenticatedFetch, unauthenticatedFetch, storeTokens } from './httpClient';
import type {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  User,
  UpgradePlanRequest,
  DowngradePlanRequest,
  ApiErrorResponse,
} from './types';

/**
 * Register new user
 * POST /auth/register
 */
export const register = async (data: RegisterRequest): Promise<User> => {
  try {
    const response = await unauthenticatedFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || 'Registration failed',
        response.status,
        errorData
      );
    }

    const user: User = await response.json();
    return user;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      error
    );
}
};

/**
 * Login user
 * POST /auth/login
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await unauthenticatedFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      let errorData: ApiErrorResponse;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }

      throw new ApiError(
        errorData.error || 'Login failed',
        response.status,
        errorData
      );
    }

    const data: LoginResponse = await response.json();

    // Store tokens automatically
    await storeTokens(data.accessToken, data.refreshToken);
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Network'))) {
      throw new ApiError(
        'No se pudo conectar al servidor. Verifica tu conexión a internet.',
        0,
        error
      );
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      error
    );
  }
};

/**
 * Refresh access token
 * POST /auth/refresh
 */
export const refreshToken = async (refreshTokenValue: string): Promise<RefreshTokenResponse> => {
  try {
    const response = await unauthenticatedFetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: refreshTokenValue } as RefreshTokenRequest),
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || 'Token refresh failed',
        response.status,
        errorData
      );
    }

    const data: RefreshTokenResponse = await response.json();
    // Store new tokens automatically
    await storeTokens(data.accessToken, data.refreshToken);
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      error
    );
  }
};

/**
 * Logout user
 * POST /auth/logout
 */
export const logout = async (refreshTokenValue: string, revokeAll: boolean = false): Promise<void> => {
  try {
    const response = await unauthenticatedFetch('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: refreshTokenValue, revokeAll } as LogoutRequest),
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || 'Logout failed',
        response.status,
        errorData
      );
  }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      error
    );
  }
};

/**
 * Request password reset
 * POST /auth/forgot-password
 */
export const requestPasswordReset = async (data: ForgotPasswordRequest): Promise<void> => {
  try {
    const response = await unauthenticatedFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || 'Password reset request failed',
        response.status,
        errorData
      );
    }
    // Always returns 204, no content
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      error
    );
  }
};

/**
 * Reset password
 * POST /auth/reset-password
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  try {
    const response = await unauthenticatedFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || 'Password reset failed',
        response.status,
        errorData
      );
    }
    // Always returns 204, no content
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      error
    );
  }
};

/**
 * Send verification email
 * POST /auth/send-verification-email
 * Requires authentication
 */
export const sendVerificationEmail = async (): Promise<void> => {
  try {
    const response = await authenticatedFetch('/auth/send-verification-email', {
      method: 'POST',
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || 'Failed to send verification email',
        response.status,
        errorData
      );
    }
    // Always returns 204, no content
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      error
    );
  }
};

/**
 * Verify email
 * POST /auth/verify-email
 */
export const verifyEmail = async (data: VerifyEmailRequest): Promise<void> => {
  try {
    const response = await unauthenticatedFetch('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || 'Email verification failed',
        response.status,
        errorData
      );
    }
    // Always returns 204, no content
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      error
    );
  }
};

/**
 * Get current user
 * GET /me
 * Requires authentication
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await authenticatedFetch('/me', {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || 'Failed to get user',
        response.status,
        errorData
      );
    }

    const user: User = await response.json();
    return user;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      error
    );
  }
};

/**
 * Upgrade plan
 * POST /me/upgrade-plan
 * Requires authentication
 */
export const upgradePlan = async (data: UpgradePlanRequest): Promise<void> => {
  try {
    const response = await authenticatedFetch('/me/upgrade-plan', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || 'Failed to upgrade plan',
        response.status,
        errorData
      );
    }
    // Always returns 204, no content
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      error
    );
  }
};

/**
 * Downgrade plan
 * POST /me/downgrade-plan
 * Requires authentication
 */
export const downgradePlan = async (data: DowngradePlanRequest): Promise<void> => {
  try {
    const response = await authenticatedFetch('/me/downgrade-plan', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || 'Failed to downgrade plan',
        response.status,
        errorData
      );
    }
    // Always returns 204, no content
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      error
    );
  }
};
