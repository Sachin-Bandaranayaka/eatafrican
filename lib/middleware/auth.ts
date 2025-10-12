import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AuthUser, UserRole } from '@/lib/types';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Validates JWT token and returns authenticated user
 */
export async function validateAuth(req: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[Auth] No authorization header or invalid format');
      return null;
    }

    const token = authHeader.substring(7);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.log('[Auth] Token validation failed:', error?.message || 'No user');
      return null;
    }

    // Fetch user details from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return null;
    }

    // Check if user is active
    if (userData.status !== 'active') {
      throw new AuthError('Account is inactive or suspended', 403);
    }

    // Fetch additional role-specific data
    let restaurantId: string | undefined;
    let driverId: string | undefined;

    if (userData.role === 'restaurant_owner') {
      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', userData.id)
        .single();
      
      restaurantId = restaurant?.id;
    }

    if (userData.role === 'driver') {
      const { data: driver } = await supabase
        .from('drivers')
        .select('id')
        .eq('user_id', userData.id)
        .single();
      
      driverId = driver?.id;
    }

    return {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      firstName: userData.first_name,
      lastName: userData.last_name,
      phone: userData.phone,
      language: userData.language,
      status: userData.status,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
      restaurantId,
      driverId,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    return null;
  }
}

/**
 * Middleware to require authentication
 */
export function requireAuth() {
  return async (req: NextRequest): Promise<AuthUser> => {
    const user = await validateAuth(req);
    
    if (!user) {
      throw new AuthError('Authentication required', 401);
    }

    return user;
  };
}

/**
 * Middleware to require specific roles
 */
export function requireRole(allowedRoles: UserRole[]) {
  return async (req: NextRequest): Promise<AuthUser> => {
    const user = await requireAuth()(req);

    if (!allowedRoles.includes(user.role)) {
      throw new AuthError('Insufficient permissions', 403);
    }

    return user;
  };
}

/**
 * Middleware to check if user owns a restaurant
 */
export async function requireRestaurantOwnership(
  req: NextRequest,
  restaurantId: string
): Promise<AuthUser> {
  const user = await requireRole(['restaurant_owner', 'super_admin'])(req);

  if (user.role === 'super_admin') {
    return user; // Super admin can access any restaurant
  }

  if (user.restaurantId !== restaurantId) {
    throw new AuthError('You do not have access to this restaurant', 403);
  }

  return user;
}

/**
 * Middleware to check if user is the driver or admin
 */
export async function requireDriverAccess(
  req: NextRequest,
  driverId: string
): Promise<AuthUser> {
  const user = await requireRole(['driver', 'super_admin'])(req);

  if (user.role === 'super_admin') {
    return user; // Super admin can access any driver
  }

  if (user.driverId !== driverId) {
    throw new AuthError('You do not have access to this driver account', 403);
  }

  return user;
}

/**
 * Middleware to check if user can access customer data
 */
export async function requireCustomerAccess(
  req: NextRequest,
  customerId: string
): Promise<AuthUser> {
  const user = await requireAuth()(req);

  if (user.role === 'super_admin') {
    return user; // Super admin can access any customer
  }

  if (user.id !== customerId) {
    throw new AuthError('You do not have access to this customer account', 403);
  }

  return user;
}

/**
 * Optional authentication - returns user if authenticated, null otherwise
 */
export async function optionalAuth(req: NextRequest): Promise<AuthUser | null> {
  try {
    return await validateAuth(req);
  } catch {
    return null;
  }
}
