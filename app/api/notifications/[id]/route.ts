import { NextRequest, NextResponse } from 'next/server';
import { validateAuth } from '@/lib/middleware/auth';
import { markNotificationAsRead, deleteNotification } from '@/lib/utils/notifications';

/**
 * PATCH /api/notifications/[id]
 * Mark a specific notification as read
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const authUser = await validateAuth(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const notificationId = params.id;

    // Mark notification as read
    await markNotificationAsRead(notificationId, authUser.id);

    return NextResponse.json({
      message: 'Notification marked as read',
    });
  } catch (error: any) {
    console.error('Error marking notification as read:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Failed to mark notification as read',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications/[id]
 * Delete a specific notification
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const authUser = await validateAuth(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const notificationId = params.id;

    // Delete notification
    await deleteNotification(notificationId, authUser.id);

    return NextResponse.json({
      message: 'Notification deleted',
    });
  } catch (error: any) {
    console.error('Error deleting notification:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Failed to delete notification',
        },
      },
      { status: 500 }
    );
  }
}
