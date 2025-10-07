import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';
import { requireAuth } from '@/lib/middleware/auth';

/**
 * GET /api/orders/[id]
 * Get order details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    // Require authentication
    const user = await requireAuth()(req);

    // Fetch order with related data
    const { data: order, error: orderError } = await db
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        {
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Order not found',
          },
        },
        { status: 404 }
      );
    }

    // Validate user has permission to view order
    const canView = 
      user.role === 'super_admin' ||
      (user.role === 'customer' && order.customer_id === user.id) ||
      (user.role === 'restaurant_owner' && user.restaurantId === order.restaurant_id) ||
      (user.role === 'driver' && user.driverId && order.driver_id === user.driverId);

    if (!canView) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_UNAUTHORIZED',
            message: 'You do not have permission to view this order',
          },
        },
        { status: 403 }
      );
    }

    // Fetch restaurant details
    const { data: restaurant } = await db
      .from('restaurants')
      .select('id, name, address, phone')
      .eq('id', order.restaurant_id)
      .single();

    // Fetch customer details (if exists)
    let customer = null;
    if (order.customer_id) {
      const { data: customerData } = await db
        .from('users')
        .select('id, first_name, last_name, email, phone')
        .eq('id', order.customer_id)
        .single();
      
      if (customerData) {
        customer = {
          id: customerData.id,
          firstName: customerData.first_name,
          lastName: customerData.last_name,
          email: customerData.email,
          phone: customerData.phone,
        };
      }
    } else {
      // Guest order - use order data
      customer = {
        firstName: order.customer_first_name,
        lastName: order.customer_last_name,
        email: order.customer_email,
        phone: order.customer_phone,
      };
    }

    // Fetch driver details (if assigned)
    let driver = null;
    if (order.driver_id) {
      const { data: driverData } = await db
        .from('drivers')
        .select('id, user_id, vehicle_type, vehicle_plate')
        .eq('id', order.driver_id)
        .single();

      if (driverData) {
        const { data: driverUser } = await db
          .from('users')
          .select('first_name, last_name, phone')
          .eq('id', driverData.user_id)
          .single();

        if (driverUser) {
          driver = {
            id: driverData.id,
            firstName: driverUser.first_name,
            lastName: driverUser.last_name,
            phone: driverUser.phone,
            vehicleType: driverData.vehicle_type,
            vehiclePlate: driverData.vehicle_plate,
          };
        }
      }
    }

    // Fetch order items
    const { data: orderItems } = await db
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    const items = orderItems?.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal,
      specialInstructions: item.special_instructions,
    })) || [];

    // Build response
    const response = {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      restaurant: restaurant ? {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        phone: restaurant.phone,
      } : null,
      customer,
      driver,
      items,
      deliveryAddress: order.delivery_address,
      deliveryCity: order.delivery_city,
      deliveryPostalCode: order.delivery_postal_code,
      deliveryInstructions: order.delivery_instructions,
      scheduledDeliveryTime: order.scheduled_delivery_time,
      actualDeliveryTime: order.actual_delivery_time,
      subtotal: order.subtotal,
      deliveryFee: order.delivery_fee,
      discountAmount: order.discount_amount,
      taxAmount: order.tax_amount,
      totalAmount: order.total_amount,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      voucherCode: order.voucher_code,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Order fetch error:', error);

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
