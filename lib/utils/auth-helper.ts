/**
 * Centralized authentication helper for admin portal
 * Handles token validation and automatic logout/redirect
 */

export const handleAuthError = () => {
  // Clear all auth data
  localStorage.removeItem('auth_token');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  
  // Redirect to login
  window.location.href = '/admin';
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return false;
  }
  
  try {
    const user = JSON.parse(userStr);
    return user.role === 'super_admin';
  } catch {
    return false;
  }
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    handleAuthError();
    throw new Error('No authentication token');
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
  
  // Handle 401 Unauthorized
  if (response.status === 401) {
    handleAuthError();
    throw new Error('Authentication failed - token expired');
  }
  
  return response;
};
