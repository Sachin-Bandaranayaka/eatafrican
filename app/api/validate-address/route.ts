import { NextRequest, NextResponse } from 'next/server';
import { validateSwissAddress, calculateDeliveryFee } from '@/lib/swiss-postal-codes';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postalCode, city, street } = body;

    // Validate required fields
    if (!postalCode || !city) {
      return NextResponse.json(
        {
          valid: false,
          message: 'Postal code and city are required.',
        },
        { status: 400 }
      );
    }

    // Validate address
    const validation = validateSwissAddress(postalCode.trim(), city.trim());
    
    if (!validation.valid) {
      return NextResponse.json({
        valid: false,
        message: validation.message,
        suggestions: validation.suggestions,
      });
    }

    // Calculate delivery fee
    const deliveryFee = calculateDeliveryFee(postalCode.trim(), city.trim());

    return NextResponse.json({
      valid: true,
      message: validation.message || 'Address validated successfully.',
      deliveryFee,
      region: validation.region,
    });
  } catch (error) {
    console.error('Address validation error:', error);
    return NextResponse.json(
      {
        valid: false,
        message: 'An error occurred while validating the address.',
      },
      { status: 500 }
    );
  }
}
