import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';
import { optionalAuth } from '@/lib/middleware/auth';
import { createOrderSchema } from '@/lib/validation/schemas';
import { calculateDeliveryFee, calculateDistance } from '@/lib/utils/distance';
import { applyVoucherToOrder } from '@/lib/utils/voucher';

/**
 * POST /api/orders
 * Create a new order
 */
export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validatedData = createOrderSchema.parse(body);

    // Optional authentication - allow guest orders
    const user = await optionalAuth(req);

    // If user is authenticated, use their ID
    const customerId = user?.id || validatedData.customerId;

    // Validate restaurant exists and is active
    const { data: restaurant, error: restaurantError } = await db
      .from('restaurants')
      .select('*')
      .eq('id', validatedData.restaurantId)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json(
        {
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Restaurant not found',
          },
        },
        { status: 404 }
      );
    }

    if (restaurant.status !== 'active') {
      return NextResponse.json(
        {
          error: {
            code: 'RESTAURANT_CLOSED',
            message: 'Restaurant is not accepting orders',
          },
        },
        { status: 422 }
      );
    }

    // Validate operating hours
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5); // HH:mm format

    const openingHours = restaurant.opening_hours as Record<string, { open: string; close: string }>;
    if (openingHours && openingHours[dayOfWeek]) {
      const { open, close } = openingHours[dayOfWeek];
      if (currentTime < open || currentTime > close) {
        return NextResponse.json(
          {
            error: {
              code: 'RESTAURANT_CLOSED',
              message: `Restaurant is closed. Opening hours: ${open} - ${close}`,
            },
          },
          { status: 422 }
        );
      }
    }

    // Fetch menu items and validate
    const menuItemIds = validatedData.items.map(item => item.menuItemId);
    const { data: menuItems, error: menuError } = await db
      .from('menu_items')
      .select('*')
      .in('id', menuItemIds)
      .eq('restaurant_id', validatedData.restaurantId);

    if (menuError || !menuItems || menuItems.length !== menuItemIds.length) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'One or more menu items not found or do not belong to this restaurant',
          },
        },
        { status: 400 }
      );
    }

    // Check menu item availability
    for (const menuItem of menuItems) {
      if (menuItem.status !== 'active') {
        return NextResponse.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: `Menu item "${menuItem.name}" is not available`,
            },
          },
          { status: 422 }
        );
      }
    }

    // Calculate subtotal
    let subtotal = 0;
    const orderItemsData = validatedData.items.map(item => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId)!;
      const itemSubtotal = menuItem.price * item.quantity;
      subtotal += itemSubtotal;

      return {
        menuItemId: item.menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        specialInstructions: item.specialInstructions,
      };
    });

    // Validate minimum order amount
    if (subtotal < restaurant.min_order_amount) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: `Minimum order amount is Fr. ${restaurant.min_order_amount.toFixed(2)}`,
          },
        },
        { status: 422 }
      );
    }

    // Calculate delivery fee based on distance
    let deliveryFee = 5.0; // Default fee
    if (
      restaurant.latitude &&
      restaurant.longitude &&
      validatedData.deliveryLatitude &&
      validatedData.deliveryLongitude
    ) {
      const distance = calculateDistance(
        restaurant.latitude,
        restaurant.longitude,
        validatedData.deliveryLatitude,
        validatedData.deliveryLongitude
      );

      // Check if within delivery radius (15 km)
      if (distance > 15) {
        return NextResponse.json(
          {
            error: {
              code: 'DELIVERY_UNAVAILABLE',
              message: 'Delivery address is outside the delivery radius',
            },
          },
          { status: 422 }
        );
      }

      deliveryFee = calculateDeliveryFee(distance);
    }

    // Validate and apply voucher if provided
    let discountAmount = 0;
    if (validatedData.voucherCode) {
      const voucherResult = await applyVoucherToOrder(
        validatedData.voucherCode,
        subtotal,
        undefined, // orderId will be set after order creation
        customerId
      );

      if (!voucherResult.success) {
        return NextResponse.json(
          {
            error: {
              code: 'VOUCHER_INVALID',
              message: voucherResult.error || 'Invalid voucher code',
            },
          },
          { status: 422 }
        );
      }

      discountAmount = voucherResult.discountAmount || 0;
    }

    // Calculate tax (8.1% VAT in Switzerland)
    const taxAmount = (subtotal + deliveryFee - discountAmount) * 0.081;

    // Calculate total
    const totalAmount = subtotal + deliveryFee - discountAmount + taxAmount;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const { data: order, error: orderError } = await db
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: customerId,
        restaurant_id: validatedData.restaurantId,
        status: 'new',
        customer_email: validatedData.customerEmail,
        customer_phone: validatedData.customerPhone,
        customer_first_name: validatedData.customerFirstName,
        customer_last_name: validatedData.customerLastName,
        delivery_address: validatedData.deliveryAddress,
        delivery_city: validatedData.deliveryCity,
        delivery_postal_code: validatedData.deliveryPostalCode,
        delivery_latitude: validatedData.deliveryLatitude,
        delivery_longitude: validatedData.deliveryLongitude,
        delivery_instructions: validatedData.deliveryInstructions,
        scheduled_delivery_time: validatedData.scheduledDeliveryTime,
        subtotal,
        delivery_fee: deliveryFee,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        payment_status: 'pending',
        voucher_code: validatedData.voucherCode,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Order creation error:', orderError);
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to create order',
          },
        },
        { status: 500 }
      );
    }

    // Create order items
    const orderItemsToInsert = orderItemsData.map(item => ({
      order_id: order.id,
      menu_item_id: item.menuItemId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal,
      special_instructions: item.specialInstructions,
    }));

    const { error: orderItemsError } = await db
      .from('order_items')
      .insert(orderItemsToInsert);

    if (orderItemsError) {
      console.error('Order items creation error:', orderItemsError);
      // Rollback order creation
      await db.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to create order items',
          },
        },
        { status: 500 }
      );
    }

    // Award loyalty points if customer is authenticated
    if (customerId) {
      const pointsToAward = Math.floor(totalAmount); // 1 point per CHF spent

      // Check if loyalty record exists
      const { data: loyaltyRecord } = await db
        .from('loyalty_points')
        .select('*')
        .eq('customer_id', customerId)
        .single();

      if (loyaltyRecord) {
        // Update existing record
        await db
          .from('loyalty_points')
          .update({
            points_balance: loyaltyRecord.points_balance + pointsToAward,
            lifetime_points: loyaltyRecord.lifetime_points + pointsToAward,
          })
          .eq('customer_id', customerId);
      } else {
        // Create new loyalty record
        const referralCode = `REF-${customerId.substr(0, 8).toUpperCase()}`;
        await db
          .from('loyalty_points')
          .insert({
            customer_id: customerId,
            points_balance: pointsToAward,
            lifetime_points: pointsToAward,
            referral_code: referralCode,
          });
      }

      // Create loyalty transaction
      await db
        .from('loyalty_transactions')
        .insert({
          customer_id: customerId,
          order_id: order.id,
          transaction_type: 'earned',
          points: pointsToAward,
          description: `Earned ${pointsToAward} points from order ${orderNumber}`,
        });
    }

    // Send notification to restaurant owner
    const { data: restaurantOwner } = await db
      .from('users')
      .select('id, language')
      .eq('id', restaurant.owner_id)
      .single();

    if (restaurantOwner) {
      await db
        .from('notifications')
        .insert({
          user_id: restaurantOwner.id,
          type: 'order_status',
          title: 'New Order Received',
          message: `New order ${orderNumber} received for Fr. ${totalAmount.toFixed(2)}`,
          data: { orderId: order.id, orderNumber },
        });
    }

    // Return order data
    return NextResponse.json(
      {
        order: {
          id: order.id,
          orderNumber: order.order_number,
          status: order.status,
          subtotal: order.subtotal,
          deliveryFee: order.delivery_fee,
          discountAmount: order.discount_amount,
          taxAmount: order.tax_amount,
          totalAmount: order.total_amount,
          paymentStatus: order.payment_status,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Order creation error:', error);

    // Handle validation errors
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
