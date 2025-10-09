import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/supabase/database';
import { requireDriverAccess, requireRole } from '@/lib/middleware/auth';
import { AuthError } from '@/lib/middleware/auth';

// Validation schema for driver update
const driverUpdateSchema = z.object({
  licenseNumber: z.string().min(1).optional(),
  vehicleType: z.string().min(1).optional(),
  vehiclePlate: z.string().min(1).optional(),
  pickupZone: z.enum(['Basel', 'Bern', 'Luzern', 'Zürich', 'Olten']).optional(),
  profileImageUrl: z.string().url().optional(),
  status: z.enum(['pending', 'active', 'inactive', 'suspended']).optional(),
});

/**
 * GET /api/drivers/[id]
 * Fetch driver details including statistics
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: driverId } = await params;

    // Validate user has permission to view driver details
    const user = await requireDriverAccess(req, driverId);

    // Fetch driver information
    const { data: driver, error: driverError } = await db
      .from('drivers')
      .select(`
        *,
        users!drivers_user_id_fkey (
          id,
          email,
          first_name,
          last_name,
          phone,
          language,
          status
        )
      `)
      .eq('id', driverId)
      .single();

    if (driverError || !driver) {
      return NextResponse.json(
        {
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Driver not found',
          },
        },
        { status: 404 }
      );
    }

    // Calculate additional statistics
    const { data: orderStats } = await db
      .from('orders')
      .select('status, total_amount, delivery_fee')
      .eq('driver_id', driverId);

    const completedOrders = orderStats?.filter(o => o.status === 'delivered') || [];
    const totalEarnings = completedOrders.reduce((sum, order) => sum + (order.delivery_fee || 0), 0);
    const averageDeliveryEarnings = completedOrders.length > 0 
      ? totalEarnings / completedOrders.length 
      : 0;

    // Format response
    const response = {
      id: driver.id,
      userId: driver.user_id,
      user: driver.users ? {
        id: driver.users.id,
        email: driver.users.email,
        firstName: driver.users.first_name,
        lastName: driver.users.last_name,
        phone: driver.users.phone,
        language: driver.users.language,
        status: driver.users.status,
      } : undefined,
      licenseNumber: driver.license_number,
      vehicleType: driver.vehicle_type,
      vehiclePlate: driver.vehicle_plate,
      pickupZone: driver.pickup_zone,
      status: driver.status,
      rating: driver.rating,
      totalRatings: driver.total_ratings,
      totalDeliveries: driver.total_deliveries,
      totalEarnings: parseFloat(driver.total_earnings || 0),
      profileImageUrl: driver.profile_image_url,
      documentsVerified: driver.documents_verified,
      statistics: {
        completedDeliveries: completedOrders.length,
        totalEarnings: parseFloat(totalEarnings.toFixed(2)),
        averageDeliveryEarnings: parseFloat(averageDeliveryEarnings.toFixed(2)),
      },
      createdAt: driver.created_at,
      updatedAt: driver.updated_at,
    };

    return NextResponse.json({ driver: response }, { status: 200 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_ERROR',
            message: error.message,
          },
        },
        { status: error.statusCode }
      );
    }

    console.error('Unexpected error in GET /api/drivers/[id]:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/drivers/[id]
 * Update driver information
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: driverId } = await params;

    // Validate user has permission to update driver
    const user = await requireDriverAccess(req, driverId);

    // Parse and validate request body
    const body = await req.json();
    const validatedData = driverUpdateSchema.parse(body);

    // Check if driver exists
    const { data: existingDriver, error: fetchError } = await db
      .from('drivers')
      .select('*')
      .eq('id', driverId)
      .single();

    if (fetchError || !existingDriver) {
      return NextResponse.json(
        {
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Driver not found',
          },
        },
        { status: 404 }
      );
    }

    // Only super admin can change status
    if (validatedData.status && user.role !== 'super_admin') {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_UNAUTHORIZED',
            message: 'Only administrators can change driver status',
          },
        },
        { status: 403 }
      );
    }

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (validatedData.licenseNumber !== undefined) {
      updateData.license_number = validatedData.licenseNumber;
    }
    if (validatedData.vehicleType !== undefined) {
      updateData.vehicle_type = validatedData.vehicleType;
    }
    if (validatedData.vehiclePlate !== undefined) {
      updateData.vehicle_plate = validatedData.vehiclePlate;
    }
    if (validatedData.pickupZone !== undefined) {
      updateData.pickup_zone = validatedData.pickupZone;
    }
    if (validatedData.profileImageUrl !== undefined) {
      updateData.profile_image_url = validatedData.profileImageUrl;
    }
    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status;
    }

    // Update driver
    const { data: updatedDriver, error: updateError } = await db
      .from('drivers')
      .update(updateData)
      .eq('id', driverId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating driver:', updateError);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to update driver',
            details: updateError.message,
          },
        },
        { status: 500 }
      );
    }

    // Create activity log
    await db.from('activity_logs').insert({
      user_id: user.id,
      entity_type: 'driver',
      entity_id: driverId,
      action: 'driver_updated',
      details: validatedData,
    });

    // Format response
    const response = {
      id: updatedDriver.id,
      userId: updatedDriver.user_id,
      licenseNumber: updatedDriver.license_number,
      vehicleType: updatedDriver.vehicle_type,
      vehiclePlate: updatedDriver.vehicle_plate,
      pickupZone: updatedDriver.pickup_zone,
      status: updatedDriver.status,
      rating: updatedDriver.rating,
      totalRatings: updatedDriver.total_ratings,
      totalDeliveries: updatedDriver.total_deliveries,
      totalEarnings: parseFloat(updatedDriver.total_earnings || 0),
      profileImageUrl: updatedDriver.profile_image_url,
      documentsVerified: updatedDriver.documents_verified,
      createdAt: updatedDriver.created_at,
      updatedAt: updatedDriver.updated_at,
    };

    return NextResponse.json({ driver: response }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    if (error instanceof AuthError) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_ERROR',
            message: error.message,
          },
        },
        { status: error.statusCode }
      );
    }

    console.error('Unexpected error in PATCH /api/drivers/[id]:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}
