// Utility functions for authentication and role-based routing

export type UserRole = 'customer' | 'restaurant_owner' | 'driver' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  restaurantId?: string;
  driverId?: string;
}

/**
 * Get the redirect URL based on user role
 */
export function getRoleBasedRedirectUrl(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'restaurant_owner':
      return '/restaurant-owner';
    case 'driver':
      return '/driver-portal';
    case 'customer':
    default:
      return '/restaurants';
  }
}

/**
 * Get user display name
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return '';
  return `${user.firstName} ${user.lastName}`.trim() || user.email;
}
