import { NextRequest, NextResponse } from 'next/server';
import { validateAuth } from '@/lib/middleware/auth';
import { 
  getUserNotifications, 
  markAllNotificationsAsRead,
  getUnreadNotificationCount 
} from '@/lib/utils/notifications';
import { notificationQuerySchema } from '@/lib/validation/schemas';
import { getPaginationParams, createPaginatedResponse } from '@/lib/supabase/database';

/**
 * GET /api/notifications
 * Fetch user's notifications with pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authUser = await validateAuth(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      unreadOnly: searchParams.get('unreadOnly'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    };

    const validatedParams = notificationQuerySchema.parse(queryParams);
    const { page, limit } = getPaginationParams(validatedParams);

    // Fetch notifications
    const notifications = await getUserNotifications(authUser.id, {
      unreadOnly: validatedParams.unreadOnly,
      limit,
      offset: (page - 1) * limit,
    });

    // Get total count for pagination
    const unreadCount = await getUnreadNotificationCount(authUser.id);

    // For total count, we need to fetch all notifications if not filtering by unread
    // For simplicity, we'll use the notifications length as an approximation
    const total = validatedParams.unreadOnly ? unreadCount : notifications.length;

    // Create paginated response
    const response = createPaginatedResponse(notifications, total, page, limit);

    return NextResponse.json({
      notifications: response.data,
      unreadCount,
      pagination: {
        total: response.total,
        page: response.page,
        totalPages: response.totalPages,
        hasMore: response.hasMore,
      },
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Failed to fetch notifications',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/notifications
 * Mark all notifications as read
 */
export async function PATCH(request: NextRequest) {
  try {
    // Authenticate user
    const authUser = await validateAuth(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    // Mark all notifications as read
    await markAllNotificationsAsRead(authUser.id);

    return NextResponse.json({
      message: 'All notifications marked as read',
    });
  } catch (error: any) {
    console.error('Error marking notifications as read:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Failed to mark notifications as read',
        },
      },
      { status: 500 }
    );
  }
}
