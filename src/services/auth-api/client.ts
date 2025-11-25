/**
 * Auth API Client - Authentication service
 */

import { ApiError } from '../common/ApiError';

// Delay to simulate network request
const REQUEST_DELAY = 1000;

const delay = (ms: number): Promise<void> => new Promise<void>(resolve => setTimeout(() => resolve(), ms));

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Login user
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  await delay(REQUEST_DELAY);

  // Validation
  if (!credentials.email || !credentials.password) {
    throw new ApiError('Email y contraseña son requeridos', 400);
  }

  // Error case for testing
  if (credentials.email === 'error@example.com') {
    throw new ApiError('Credenciales inválidas', 401);
  }

  return {
    success: true,
    data: {
      token: 'jwt_token_' + Date.now(),
      user: {
        id: '1',
        email: credentials.email,
        name: 'Usuario',
      },
    },
  };
};

/**
 * Register new user
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  await delay(REQUEST_DELAY);

  // Validation
  if (!data.email || !data.password || !data.name) {
    throw new ApiError('Todos los campos son requeridos', 400);
  }

  if (data.password.length < 6) {
    throw new ApiError('La contraseña debe tener al menos 6 caracteres', 400);
  }

  // Email already exists case
  if (data.email === 'exists@example.com') {
    throw new ApiError('Este email ya está registrado', 409);
  }

  return {
    success: true,
    data: {
      token: 'jwt_token_' + Date.now(),
      user: {
        id: String(Date.now()),
        email: data.email,
        name: data.name,
      },
    },
  };
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  await delay(REQUEST_DELAY);

  // Validation
  if (!data.email) {
    throw new ApiError('Email es requerido', 400);
  }

  // Email not found case
  if (data.email === 'notfound@example.com') {
    throw new ApiError('Email no encontrado', 404);
  }

  return {
    success: true,
    message: 'Se ha enviado un email con las instrucciones para recuperar tu contraseña',
  };
};

