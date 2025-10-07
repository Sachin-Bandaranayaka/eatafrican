import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';
import { requireCustomerAccess } from '@/lib/middleware/auth';
import { updateCustomerSchema } from '@/lib/validation/schemas';

/**
 * GET /api/customers/[id]
 * Get customer profile information with order history summary
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = params.id;

    // Validate customer access
    await requireCustomerAccess(req, customerId);

    // Fetch customer profile
    const { data: customer, error: customerError } = await db
      .from('users')
      .select('*')
      .eq('id', customerId)
      .single();

    if (customerError || !customer) {
      return NextResponse.json(
        {
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Customer not found',
          },
        },
        { status: 404 }
      );
    }

    // Fetch order history summary
    const { data: orders, error: ordersError } = await db
      .from('orders')
      .select('id, status, total_amount, created_at')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Orders fetch error:', ordersError);
      // Continue without order history if there's an error
    }

    // Calculate order statistics
    const totalOrders = orders?.length || 0;
    const completedOrders = orders?.filter(o => o.status === 'delivered').length || 0;
    const totalSpent = orders
      ?.filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

    // Get recent orders (last 5)
    const recentOrders = orders?.slice(0, 5).map(order => ({
      id: order.id,
      status: order.status,
      totalAmount: order.total_amount,
      createdAt: order.created_at,
    })) || [];

    // Fetch loyalty points
    const { data: loyaltyPoints } = await db
      .from('loyalty_points')
      .select('points_balance, lifetime_points')
      .eq('customer_id', customerId)
      .single();

    return NextResponse.json({
      id: customer.id,
      email: customer.email,
      firstName: customer.first_name,
      lastName: customer.last_name,
      phone: customer.phone,
      language: customer.language,
      status: customer.status,
      role: customer.role,
      createdAt: customer.created_at,
      updatedAt: customer.updated_at,
      orderSummary: {
        totalOrders,
        completedOrders,
        totalSpent,
        recentOrders,
      },
      loyaltyPoints: {
        balance: loyaltyPoints?.points_balance || 0,
        lifetime: loyaltyPoints?.lifetime_points || 0,
      },
    });
  } catch (error: any) {
    console.error('Customer profile fetch error:', error);

    if (error.name === 'AuthError') {
      return NextResponse.json(
        {
          error: {
            code: error.statusCode === 403 ? 'AUTH_UNAUTHORIZED' : 'AUTH_TOKEN_EXPIRED',
            message: error.message,
          },
        },
        { status: error.statusCode }
      );
    }

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
 * PATCH /api/customers/[id]
 * Update customer profile information
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = params.id;

    // Validate customer access
    await requireCustomerAccess(req, customerId);

    // Parse and validate request body
    const body = await req.json();
    const validatedData = updateCustomerSchema.parse(body);

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (validatedData.firstName !== undefined) {
      updateData.first_name = validatedData.firstName;
    }
    if (validatedData.lastName !== undefined) {
      updateData.last_name = validatedData.lastName;
    }
    if (validatedData.phone !== undefined) {
      updateData.phone = validatedData.phone;
    }
    if (validatedData.language !== undefined) {
      updateData.language = validatedData.language;
    }

    // Update customer profile
    const { data: updatedCustomer, error: updateError } = await db
      .from('users')
      .update(updateData)
      .eq('id', customerId)
      .select()
      .single();

    if (updateError) {
      console.error('Customer update error:', updateError);
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to update customer profile',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: updatedCustomer.id,
      email: updatedCustomer.email,
      firstName: updatedCustomer.first_name,
      lastName: updatedCustomer.last_name,
      phone: updatedCustomer.phone,
      language: updatedCustomer.language,
      status: updatedCustomer.status,
      role: updatedCustomer.role,
      createdAt: updatedCustomer.created_at,
      updatedAt: updatedCustomer.updated_at,
    });
  } catch (error: any) {
    console.error('Customer profile update error:', error);

    if (error.name === 'ZodError') {
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

    if (error.name === 'AuthError') {
      return NextResponse.json(
        {
          error: {
            code: error.statusCode === 403 ? 'AUTH_UNAUTHORIZED' : 'AUTH_TOKEN_EXPIRED',
            message: error.message,
          },
        },
        { status: error.statusCode }
      );
    }

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
