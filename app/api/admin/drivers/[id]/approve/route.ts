import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import { db } from '@/lib/supabase/database';
import { approveDriverSchema } from '@/lib/validation/schemas';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate super admin role
    const user = await requireRole(['super_admin'])(req);

    const driverId = params.id;

    // Parse and validate request body
    const body = await req.json();
    const validatedData = approveDriverSchema.parse(body);

    // Fetch driver with user information
    const { data: driver, error: fetchError } = await db
      .from('drivers')
      .select(`
        id,
        status,
        vehicle_type,
        vehicle_plate,
        user:users!drivers_user_id_fkey (
          id,
          email,
          first_name,
          last_name,
          language
        )
      `)
      .eq('id', driverId)
      .single();

    if (fetchError || !driver) {
      return NextResponse.json(
        { error: { code: 'RESOURCE_NOT_FOUND', message: 'Driver not found' } },
        { status: 404 }
      );
    }

    // Update driver status
    const { data: updatedDriver, error: updateError } = await db
      .from('drivers')
      .update({
        status: validatedData.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', driverId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating driver status:', updateError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to update driver status' } },
        { status: 500 }
      );
    }

    // Create activity log entry
    await db.from('activity_logs').insert({
      user_id: user.id,
      entity_type: 'driver',
      entity_id: driverId,
      action: `driver_${validatedData.status}`,
      details: {
        previousStatus: driver.status,
        newStatus: validatedData.status,
        driverName: `${driver.user.first_name} ${driver.user.last_name}`,
      },
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
    });

    // Create notification for driver
    const notificationMessage = validatedData.status === 'active'
      ? `Your driver account has been approved and is now active! You can start accepting deliveries.`
      : `Your driver account status has been updated to ${validatedData.status}.`;

    await db.from('notifications').insert({
      user_id: driver.user.id,
      type: 'account',
      title: validatedData.status === 'active' ? 'Driver Account Approved' : 'Driver Status Updated',
      message: notificationMessage,
      data: {
        driverId: driverId,
        status: validatedData.status,
      },
    });

    // TODO: Send email notification to driver
    // This would be implemented when email service is set up
    // await sendEmail({
    //   to: driver.user.email,
    //   subject: validatedData.status === 'active' ? 'Driver Account Approved' : 'Driver Status Updated',
    //   template: 'driver-status-change',
    //   data: {
    //     firstName: driver.user.first_name,
    //     status: validatedData.status,
    //     language: driver.user.language,
    //   },
    // });

    return NextResponse.json({
      driver: {
        id: updatedDriver.id,
        status: updatedDriver.status,
        updatedAt: updatedDriver.updated_at,
      },
    });
  } catch (error: any) {
    console.error('Driver approval error:', error);

    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: error.message } },
        { status: error.statusCode || 401 }
      );
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid request data', details: error.errors } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
