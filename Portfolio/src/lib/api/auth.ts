import { post, get } from './client';
import type { LoginRequest, LoginResponse, User } from './types';

/**
 * Login user
 * @param credentials Username and password
 * @returns Promise with login response
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  // In a production environment, this would call a real API
  // For now, simulate a login response
  if (credentials.username === 'admin' && credentials.password === 'password') {
    return {
      success: true,
      token: 'mock-jwt-token',
      message: 'Login successful'
    };
  } else {
    return {
      success: false,
      message: 'Invalid username or password'
    };
  }
}

/**
 * Get current user data
 * @returns Promise with user data
 */
export async function getUser(): Promise<User> {
  // In a production environment, this would verify the JWT and return user data
  // For now, return mock user data
  return {
    userId: '1',
    role: 'admin'
  };
}
