// Client-side authentication utilities
import { supabaseClient } from '@/lib/supabase/config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: 'customer' | 'restaurant_owner' | 'driver';
}

export interface AuthResponse {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    restaurantId?: string;
    driverId?: string;
  };
  token?: string;
  refreshToken?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Login function
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || {
          code: 'LOGIN_FAILED',
          message: 'Login failed. Please try again.',
        },
      };
    }

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('refresh_token', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Dispatch custom event to notify components of auth change
      window.dispatchEvent(new Event('auth-change'));
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    return {
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
      },
    };
  }
}

// Register function
export async function register(userData: RegisterData): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
        role: userData.role || 'customer', // Default to customer role
        phone: userData.phoneNumber,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || {
          code: 'REGISTRATION_FAILED',
          message: 'Registration failed. Please try again.',
        },
      };
    }

    // Store token in localStorage if registration returns tokens
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('refresh_token', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Dispatch custom event to notify components of auth change
      window.dispatchEvent(new Event('auth-change'));
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    return {
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
      },
    };
  }
}

// Logout function
export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Dispatch custom event to notify components of auth change
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-change'));
    }
  }
}

// Reset password request
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: any }> {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || {
          code: 'RESET_FAILED',
          message: 'Password reset request failed.',
        },
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
      },
    };
  }
}

// Get current user from localStorage
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
}

// Get auth token
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

