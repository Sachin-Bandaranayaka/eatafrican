import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/supabase/database';
import { requireAuth, requireRole } from '@/lib/middleware/auth';
import { AuthError } from '@/lib/middleware/auth';

// Validation schema for driver registration
const driverRegistrationSchema = z.object({
  userId: z.string().uuid(),
  licenseNumber: z.string().min(1, 'License number is required'),
  vehicleType: z.string().min(1, 'Vehicle type is required'),
  vehiclePlate: z.string().min(1, 'Vehicle plate is required'),
  pickupZone: z.enum(['Basel', 'Bern', 'Luzern', 'Zürich', 'Olten']),
  profileImageUrl: z.string().url().optional(),
});

/**
 * POST /api/drivers
 * Create a new driver registration
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth()(req);

    // Parse and validate request body
    const body = await req.json();
    const validatedData = driverRegistrationSchema.parse(body);

    // Verify the user exists and is not already a driver
    const { data: existingUser, error: userError } = await db
      .from('users')
      .select('id, role')
      .eq('id', validatedData.userId)
      .single();

    if (userError || !existingUser) {
      return NextResponse.json(
        {
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        },
        { status: 404 }
      );
    }

    // Check if user is already a driver
    const { data: existingDriver } = await db
      .from('drivers')
      .select('id')
      .eq('user_id', validatedData.userId)
      .single();

    if (existingDriver) {
      return NextResponse.json(
        {
          error: {
            code: 'DUPLICATE_ENTRY',
            message: 'User is already registered as a driver',
          },
        },
        { status: 409 }
      );
    }

    // Create driver record
    const { data: driver, error: driverError } = await db
      .from('drivers')
      .insert({
        user_id: validatedData.userId,
        license_number: validatedData.licenseNumber,
        vehicle_type: validatedData.vehicleType,
        vehicle_plate: validatedData.vehiclePlate,
        pickup_zone: validatedData.pickupZone,
        profile_image_url: validatedData.profileImageUrl,
        status: 'pending',
        rating: 0,
        total_ratings: 0,
        total_deliveries: 0,
        total_earnings: 0,
        documents_verified: false,
      })
      .select()
      .single();

    if (driverError) {
      console.error('Error creating driver:', driverError);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to create driver record',
            details: driverError.message,
          },
        },
        { status: 500 }
      );
    }

    // Update user role to driver if not already
    if (existingUser.role !== 'driver') {
      await db
        .from('users')
        .update({ role: 'driver', updated_at: new Date().toISOString() })
        .eq('id', validatedData.userId);
    }

    // Create activity log
    await db.from('activity_logs').insert({
      user_id: user.id,
      entity_type: 'driver',
      entity_id: driver.id,
      action: 'driver_registration',
      details: {
        pickupZone: validatedData.pickupZone,
        vehicleType: validatedData.vehicleType,
      },
    });

    // Format response
    const response = {
      id: driver.id,
      userId: driver.user_id,
      licenseNumber: driver.license_number,
      vehicleType: driver.vehicle_type,
      vehiclePlate: driver.vehicle_plate,
      pickupZone: driver.pickup_zone,
      status: driver.status,
      rating: driver.rating,
      totalRatings: driver.total_ratings,
      totalDeliveries: driver.total_deliveries,
      totalEarnings: driver.total_earnings,
      profileImageUrl: driver.profile_image_url,
      documentsVerified: driver.documents_verified,
      createdAt: driver.created_at,
      updatedAt: driver.updated_at,
    };

    return NextResponse.json({ driver: response }, { status: 201 });
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

    console.error('Unexpected error in POST /api/drivers:', error);
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
