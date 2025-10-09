import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import { db } from '@/lib/supabase/database';

export async function GET(req: NextRequest) {
  try {
    // Validate super admin role
    await requireRole(['super_admin'])(req);

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Fetch recent activity logs
    const { data: logs, error } = await db
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activity logs:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to fetch activity logs' } },
        { status: 500 }
      );
    }

    // Format logs for display
    const formattedLogs = (logs || []).map(log => ({
      id: log.id,
      message: `${log.action} - ${log.details || ''}`,
      created_at: log.created_at,
      user_id: log.user_id,
      type: log.type
    }));

    return NextResponse.json({ logs: formattedLogs });
  } catch (error: any) {
    console.error('Activity logs error:', error);

    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: error.message } },
        { status: error.statusCode || 401 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
