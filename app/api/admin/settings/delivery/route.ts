import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import { db } from '@/lib/supabase/database';
import { deliverySettingsSchema } from '@/lib/validation/schemas';

// Default delivery settings
const DEFAULT_SETTINGS = {
  deliveryRadius: 20, // km
  baseDeliveryFee: 5.00, // CHF
  perKmFee: 0.50, // CHF per km
  zones: [
    { name: 'Basel', radius: 15, baseFee: 5.00 },
    { name: 'Bern', radius: 15, baseFee: 5.00 },
    { name: 'Luzern', radius: 15, baseFee: 5.00 },
    { name: 'Zürich', radius: 20, baseFee: 6.00 },
    { name: 'Olten', radius: 10, baseFee: 4.50 },
  ],
};

export async function GET(req: NextRequest) {
  try {
    // Validate super admin role
    await requireRole(['super_admin'])(req);

    // Fetch delivery settings from database
    // Using a simple key-value approach in a settings table
    const { data: settingsData, error } = await db
      .from('settings')
      .select('*')
      .eq('key', 'delivery_settings')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching delivery settings:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to fetch delivery settings' } },
        { status: 500 }
      );
    }

    // Return stored settings or defaults
    const settings = settingsData?.value || DEFAULT_SETTINGS;

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('Get delivery settings error:', error);

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

export async function PATCH(req: NextRequest) {
  try {
    // Validate super admin role
    const user = await requireRole(['super_admin'])(req);

    // Parse and validate request body
    const body = await req.json();
    const validatedData = deliverySettingsSchema.parse(body);

    // Fetch current settings
    const { data: currentSettings } = await db
      .from('settings')
      .select('*')
      .eq('key', 'delivery_settings')
      .single();

    const currentValue = currentSettings?.value || DEFAULT_SETTINGS;

    // Merge with new settings
    const updatedSettings = {
      ...currentValue,
      ...validatedData,
    };

    // Upsert settings
    const { data: updatedData, error: upsertError } = await db
      .from('settings')
      .upsert({
        key: 'delivery_settings',
        value: updatedSettings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (upsertError) {
      console.error('Error updating delivery settings:', upsertError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to update delivery settings' } },
        { status: 500 }
      );
    }

    // Create activity log entry
    await db.from('activity_logs').insert({
      user_id: user.id,
      entity_type: 'settings',
      entity_id: null,
      action: 'delivery_settings_updated',
      details: {
        previousSettings: currentValue,
        newSettings: updatedSettings,
      },
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
    });

    return NextResponse.json({
      settings: updatedData.value,
    });
  } catch (error: any) {
    console.error('Update delivery settings error:', error);

    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: error.message } },
        { status: error.statusCode || 401 }
      );
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid settings data', details: error.errors } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
