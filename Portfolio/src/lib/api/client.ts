/**
 * Base API client for making requests to the backend
 */

// API base URL - use environment variable in production
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Interface for API error response
 */
export interface ApiError {
  message: string;
  error?: string;
}

/**
 * Options for API requests
 */
export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Get the authorization header if a token exists
 */
const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Make a request to the API
 * @param endpoint API endpoint (without base URL)
 * @param options Request options
 * @returns Promise with the response data
 */
export async function apiRequest<T>(endpoint: string, options: RequestOptions): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };
  
  // Request options
  const requestOptions: RequestInit = {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };
  
  try {
    const response = await fetch(url, requestOptions);
    
    // Parse the response as JSON
    const data = await response.json();
    
    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      throw {
        message: data.message || 'An error occurred',
        error: data.error,
        status: response.status
      };
    }
    
    return data as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Shorthand for GET requests
 */
export function get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET', headers });
}

/**
 * Shorthand for POST requests
 */
export function post<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'POST', body, headers });
}

/**
 * Shorthand for PUT requests
 */
export function put<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'PUT', body, headers });
}

/**
 * Shorthand for DELETE requests
 */
export function del<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE', headers });
}
