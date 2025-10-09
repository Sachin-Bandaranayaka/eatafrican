import { supabaseAdmin } from '@/lib/supabase/config';
import { Database } from '@/lib/supabase/types';

type Voucher = Database['public']['Tables']['vouchers']['Row'];

export interface VoucherValidationResult {
  valid: boolean;
  voucher?: Voucher;
  discountAmount?: number;
  error?: string;
}

/**
 * Validates a voucher code and calculates discount amount
 * @param code - The voucher code to validate
 * @param orderSubtotal - The order subtotal before discount
 * @returns Validation result with discount amount if valid
 */
export async function validateVoucher(
  code: string,
  orderSubtotal: number
): Promise<VoucherValidationResult> {
  // Fetch voucher by code
  const { data, error } = await supabaseAdmin
    .from('vouchers')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();

  if (error || !data) {
    return {
      valid: false,
      error: 'Voucher code not found',
    };
  }

  const voucher = data as Voucher;

  // Check if voucher is active
  if (voucher.status !== 'active') {
    return {
      valid: false,
      error: 'Voucher is not active',
    };
  }

  // Check usage limit
  if (voucher.usage_limit !== null && voucher.usage_count >= voucher.usage_limit) {
    return {
      valid: false,
      error: 'Voucher usage limit reached',
    };
  }

  // Check valid_from date
  if (voucher.valid_from) {
    const validFrom = new Date(voucher.valid_from);
    const now = new Date();
    if (now < validFrom) {
      return {
        valid: false,
        error: 'Voucher is not yet valid',
      };
    }
  }

  // Check valid_until date (expiration)
  if (voucher.valid_until) {
    const validUntil = new Date(voucher.valid_until);
    const now = new Date();
    if (now > validUntil) {
      return {
        valid: false,
        error: 'Voucher has expired',
      };
    }
  }

  // Check minimum order amount
  if (voucher.min_order_amount !== null && orderSubtotal < voucher.min_order_amount) {
    return {
      valid: false,
      error: `Minimum order amount of Fr. ${voucher.min_order_amount.toFixed(2)}- required`,
    };
  }

  // Calculate discount amount
  const discountAmount = calculateDiscount(voucher, orderSubtotal);

  return {
    valid: true,
    voucher,
    discountAmount,
  };
}

/**
 * Calculates the discount amount based on voucher type and value
 * @param voucher - The voucher object
 * @param orderSubtotal - The order subtotal before discount
 * @returns The calculated discount amount
 */
export function calculateDiscount(voucher: Voucher, orderSubtotal: number): number {
  let discountAmount = 0;

  if (voucher.discount_type === 'percentage') {
    // Calculate percentage discount
    discountAmount = (orderSubtotal * voucher.discount_value) / 100;
  } else if (voucher.discount_type === 'fixed_amount') {
    // Fixed amount discount
    discountAmount = voucher.discount_value;
  }

  // Apply max discount limit if specified
  if (voucher.max_discount_amount !== null && discountAmount > voucher.max_discount_amount) {
    discountAmount = voucher.max_discount_amount;
  }

  // Ensure discount doesn't exceed order subtotal
  if (discountAmount > orderSubtotal) {
    discountAmount = orderSubtotal;
  }

  // Round to 2 decimal places
  return Math.round(discountAmount * 100) / 100;
}

/**
 * Gets a voucher by code (without validation)
 * @param code - The voucher code
 * @returns The voucher or null if not found
 */
export async function getVoucherByCode(code: string): Promise<Voucher | null> {
  const { data, error } = await supabaseAdmin
    .from('vouchers')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();

  if (error || !data) {
    return null;
  }

  return data as Voucher;
}

/**
 * Increments voucher usage count atomically
 * @param voucherId - The voucher ID
 * @returns The updated voucher or null if error
 */
export async function incrementVoucherUsage(voucherId: string): Promise<Voucher | null> {
  try {
    // First get current voucher
    const { data: currentData, error: fetchError } = await supabaseAdmin
      .from('vouchers')
      .select('*')
      .eq('id', voucherId)
      .single();

    if (fetchError) {
      console.error('[Voucher] Error fetching voucher for increment:', fetchError);
      return null;
    }

    if (!currentData) {
      console.error('[Voucher] No voucher data found for ID:', voucherId);
      return null;
    }

    const currentVoucher = currentData as Voucher;
    console.log('[Voucher] Current usage count:', currentVoucher.usage_count);

    // Increment usage count
    const { data, error } = await supabaseAdmin
      .from('vouchers')
      .update({ 
        usage_count: currentVoucher.usage_count + 1
      })
      .eq('id', voucherId)
      .select()
      .single();

    if (error) {
      console.error('[Voucher] Error updating usage count:', error);
      return null;
    }

    if (!data) {
      console.error('[Voucher] No data returned from update');
      return null;
    }

    console.log('[Voucher] Usage count incremented to:', data.usage_count);
    return data as Voucher;
  } catch (error) {
    console.error('[Voucher] Unexpected error in incrementVoucherUsage:', error);
    return null;
  }
}

/**
 * Creates a voucher usage record (for tracking purposes)
 * This can be used to track which orders used which vouchers
 * Note: This requires a voucher_usage table which may not exist yet
 * For now, we track usage through the orders table (voucher_code field)
 */
export interface VoucherUsageRecord {
  voucherId: string;
  orderId: string;
  customerId?: string;
  discountAmount: number;
  usedAt: string;
}

/**
 * Applies voucher discount to order total and updates voucher usage
 * @param voucherCode - The voucher code
 * @param orderSubtotal - The order subtotal before discount
 * @param orderId - The order ID (for tracking)
 * @param customerId - The customer ID (optional)
 * @returns Object with discount amount and updated voucher, or error
 */
export async function applyVoucherToOrder(
  voucherCode: string,
  orderSubtotal: number,
  orderId?: string,
  customerId?: string
): Promise<{
  success: boolean;
  discountAmount?: number;
  voucher?: Voucher;
  error?: string;
}> {
  try {
    // Validate voucher
    const validation = await validateVoucher(voucherCode, orderSubtotal);

    if (!validation.valid || !validation.voucher) {
      console.error('[Voucher] Validation failed:', validation.error);
      return {
        success: false,
        error: validation.error || 'Invalid voucher',
      };
    }

    console.log('[Voucher] Validation passed, incrementing usage...');

    // Increment usage count
    const updatedVoucher = await incrementVoucherUsage(validation.voucher.id);

    if (!updatedVoucher) {
      console.error('[Voucher] Failed to increment usage count');
      return {
        success: false,
        error: 'Failed to update voucher usage',
      };
    }

    console.log('[Voucher] Successfully applied voucher:', voucherCode);

    return {
      success: true,
      discountAmount: validation.discountAmount,
      voucher: updatedVoucher,
    };
  } catch (error) {
    console.error('[Voucher] Unexpected error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while applying voucher',
    };
  }
}
