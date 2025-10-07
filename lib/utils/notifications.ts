import { db } from '../supabase/database';
import type { Database } from '../supabase/types';

type NotificationType = Database['public']['Tables']['notifications']['Row']['type'];
type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];

export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

/**
 * Create a notification record in the database
 * @param params - Notification parameters
 * @returns Created notification
 */
export async function createNotification(params: CreateNotificationParams) {
  const { userId, type, title, message, data } = params;

  const notificationData: NotificationInsert = {
    user_id: userId,
    type,
    title,
    message,
    data: data || null,
    read: false,
  };

  const { data: notification, error } = await db
    .from('notifications')
    .insert(notificationData)
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    throw new Error(`Failed to create notification: ${error.message}`);
  }

  return notification;
}

/**
 * Create multiple notifications at once
 * @param notifications - Array of notification parameters
 * @returns Created notifications
 */
export async function createNotifications(notifications: CreateNotificationParams[]) {
  const notificationData: NotificationInsert[] = notifications.map(n => ({
    user_id: n.userId,
    type: n.type,
    title: n.title,
    message: n.message,
    data: n.data || null,
    read: false,
  }));

  const { data: createdNotifications, error } = await db
    .from('notifications')
    .insert(notificationData)
    .select();

  if (error) {
    console.error('Error creating notifications:', error);
    throw new Error(`Failed to create notifications: ${error.message}`);
  }

  return createdNotifications;
}

/**
 * Mark a notification as read
 * @param notificationId - Notification ID
 * @param userId - User ID (for authorization)
 */
export async function markNotificationAsRead(notificationId: string, userId: string) {
  const { error } = await db
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error marking notification as read:', error);
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }
}

/**
 * Mark all notifications as read for a user
 * @param userId - User ID
 */
export async function markAllNotificationsAsRead(userId: string) {
  const { error } = await db
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) {
    console.error('Error marking all notifications as read:', error);
    throw new Error(`Failed to mark all notifications as read: ${error.message}`);
  }
}

/**
 * Get notifications for a user
 * @param userId - User ID
 * @param options - Query options
 */
export async function getUserNotifications(
  userId: string,
  options?: {
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
  }
) {
  let query = db
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (options?.unreadOnly) {
    query = query.eq('read', false);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
  }

  const { data: notifications, error } = await query;

  if (error) {
    console.error('Error fetching notifications:', error);
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }

  return notifications;
}

/**
 * Delete a notification
 * @param notificationId - Notification ID
 * @param userId - User ID (for authorization)
 */
export async function deleteNotification(notificationId: string, userId: string) {
  const { error } = await db
    .from('notifications')
    .delete()
    .eq('id', notificationId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting notification:', error);
    throw new Error(`Failed to delete notification: ${error.message}`);
  }
}

/**
 * Get unread notification count for a user
 * @param userId - User ID
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { count, error } = await db
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) {
    console.error('Error getting unread notification count:', error);
    throw new Error(`Failed to get unread notification count: ${error.message}`);
  }

  return count || 0;
}
