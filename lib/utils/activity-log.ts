import { NextRequest } from 'next/server';
import { db } from '@/lib/supabase/database';
import type { EntityType } from '@/lib/types';

export interface CreateActivityLogParams {
  userId: string;
  entityType: EntityType;
  entityId?: string;
  action: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Create an activity log entry
 */
export async function createActivityLog(params: CreateActivityLogParams): Promise<void> {
  try {
    const { data, error } = await db
      .from('activity_logs')
      .insert({
        user_id: params.userId,
        entity_type: params.entityType,
        entity_id: params.entityId,
        action: params.action,
        details: params.details,
        ip_address: params.ipAddress,
        user_agent: params.userAgent,
      });

    if (error) {
      console.error('Failed to create activity log:', error);
      // Don't throw error - activity logging should not break the main flow
    }
  } catch (error) {
    console.error('Activity log error:', error);
    // Silently fail - logging errors should not affect user operations
  }
}

/**
 * Extract IP address from request
 */
export function getIpAddress(req: NextRequest): string | undefined {
  // Check various headers for IP address
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to connection IP (may not be available in all environments)
  return req.ip || undefined;
}

/**
 * Extract user agent from request
 */
export function getUserAgent(req: NextRequest): string | undefined {
  return req.headers.get('user-agent') || undefined;
}

/**
 * Log user login action
 */
export async function logLogin(
  userId: string,
  req: NextRequest,
  details?: Record<string, any>
): Promise<void> {
  await createActivityLog({
    userId,
    entityType: 'user',
    entityId: userId,
    action: 'user_login',
    details,
    ipAddress: getIpAddress(req),
    userAgent: getUserAgent(req),
  });
}

/**
 * Log user logout action
 */
export async function logLogout(
  userId: string,
  req: NextRequest
): Promise<void> {
  await createActivityLog({
    userId,
    entityType: 'user',
    entityId: userId,
    action: 'user_logout',
    ipAddress: getIpAddress(req),
    userAgent: getUserAgent(req),
  });
}

/**
 * Log order creation
 */
export async function logOrderCreated(
  userId: string,
  orderId: string,
  req: NextRequest,
  details?: Record<string, any>
): Promise<void> {
  await createActivityLog({
    userId,
    entityType: 'order',
    entityId: orderId,
    action: 'order_created',
    details,
    ipAddress: getIpAddress(req),
    userAgent: getUserAgent(req),
  });
}

/**
 * Log order status change
 */
export async function logOrderStatusChange(
  userId: string,
  orderId: string,
  req: NextRequest,
  details: { oldStatus: string; newStatus: string; [key: string]: any }
): Promise<void> {
  await createActivityLog({
    userId,
    entityType: 'order',
    entityId: orderId,
    action: 'order_status_changed',
    details,
    ipAddress: getIpAddress(req),
    userAgent: getUserAgent(req),
  });
}

/**
 * Log restaurant approval
 */
export async function logRestaurantApproval(
  userId: string,
  restaurantId: string,
  req: NextRequest,
  details: { oldStatus: string; newStatus: string; [key: string]: any }
): Promise<void> {
  await createActivityLog({
    userId,
    entityType: 'restaurant',
    entityId: restaurantId,
    action: 'restaurant_status_changed',
    details,
    ipAddress: getIpAddress(req),
    userAgent: getUserAgent(req),
  });
}

/**
 * Log restaurant creation
 */
export async function logRestaurantCreated(
  userId: string,
  restaurantId: string,
  req: NextRequest,
  details?: Record<string, any>
): Promise<void> {
  await createActivityLog({
    userId,
    entityType: 'restaurant',
    entityId: restaurantId,
    action: 'restaurant_created',
    details,
    ipAddress: getIpAddress(req),
    userAgent: getUserAgent(req),
  });
}

/**
 * Log restaurant update
 */
export async function logRestaurantUpdated(
  userId: string,
  restaurantId: string,
  req: NextRequest,
  details?: Record<string, any>
): Promise<void> {
  await createActivityLog({
    userId,
    entityType: 'restaurant',
    entityId: restaurantId,
    action: 'restaurant_updated',
    details,
    ipAddress: getIpAddress(req),
    userAgent: getUserAgent(req),
  });
}

/**
 * Log driver approval
 */
export async function logDriverApproval(
  userId: string,
  driverId: string,
  req: NextRequest,
  details: { oldStatus: string; newStatus: string; [key: string]: any }
): Promise<void> {
  await createActivityLog({
    userId,
    entityType: 'driver',
    entityId: driverId,
    action: 'driver_status_changed',
    details,
    ipAddress: getIpAddress(req),
    userAgent: getUserAgent(req),
  });
}

/**
 * Log driver registration
 */
export async function logDriverCreated(
  userId: string,
  driverId: string,
  req: NextRequest,
  details?: Record<string, any>
): Promise<void> {
  await createActivityLog({
    userId,
    entityType: 'driver',
    entityId: driverId,
    action: 'driver_created',
    details,
    ipAddress: getIpAddress(req),
    userAgent: getUserAgent(req),
  });
}

/**
 * Log driver update
 */
export async function logDriverUpdated(
  userId: string,
  driverId: string,
  req: NextRequest,
  details?: Record<string, any>
): Promise<void> {
  await createActivityLog({
    userId,
    entityType: 'driver',
    entityId: driverId,
    action: 'driver_updated',
    details,
    ipAddress: getIpAddress(req),
    userAgent: getUserAgent(req),
  });
}

/**
 * Log delivery settings change
 */
export async function logDeliverySettingsChanged(
  userId: string,
  req: NextRequest,
  details?: Record<string, any>
): Promise<void> {
  await createActivityLog({
    userId,
    entityType: 'user',
    action: 'delivery_settings_changed',
    details,
    ipAddress: getIpAddress(req),
    userAgent: getUserAgent(req),
  });
}

/**
 * Log admin account creation
 */
export async function logAdminAccountCreated(
  userId: string,
  newUserId: string,
  req: NextRequest,
  details?: Record<string, any>
): Promise<void> {
  await createActivityLog({
    userId,
    entityType: 'user',
    entityId: newUserId,
    action: 'admin_account_created',
    details,
    ipAddress: getIpAddress(req),
    userAgent: getUserAgent(req),
  });
}
