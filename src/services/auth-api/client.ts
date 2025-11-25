/**
 * Auth API Client - Mock authentication service
 * Simulates authentication endpoints with mock data
 */

import { ApiError } from '../common/ApiError';

// Mock delay to simulate network request
const MOCK_DELAY = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
  await delay(MOCK_DELAY);

  // Mock validation
  if (!credentials.email || !credentials.password) {
    throw new ApiError('Email y contraseña son requeridos', 400);
  }

  // Mock successful login
  if (credentials.email === 'error@example.com') {
    throw new ApiError('Credenciales inválidas', 401);
  }

  return {
    success: true,
    data: {
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        id: '1',
        email: credentials.email,
        name: 'Usuario Mock',
      },
    },
  };
};

/**
 * Register new user
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  await delay(MOCK_DELAY);

  // Mock validation
  if (!data.email || !data.password || !data.name) {
    throw new ApiError('Todos los campos son requeridos', 400);
  }

  if (data.password.length < 6) {
    throw new ApiError('La contraseña debe tener al menos 6 caracteres', 400);
  }

  // Mock email already exists
  if (data.email === 'exists@example.com') {
    throw new ApiError('Este email ya está registrado', 409);
  }

  return {
    success: true,
    data: {
      token: 'mock_jwt_token_' + Date.now(),
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
  await delay(MOCK_DELAY);

  // Mock validation
  if (!data.email) {
    throw new ApiError('Email es requerido', 400);
  }

  // Mock email not found
  if (data.email === 'notfound@example.com') {
    throw new ApiError('Email no encontrado', 404);
  }

  return {
    success: true,
    message: 'Se ha enviado un email con las instrucciones para recuperar tu contraseña',
  };
};

