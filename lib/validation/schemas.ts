import { z } from 'zod';

// User Validation Schemas
export const userRoleSchema = z.enum(['customer', 'restaurant_owner', 'driver', 'super_admin']);
export const languageSchema = z.enum(['en', 'de', 'fr', 'it']);

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  role: userRoleSchema,
  language: languageSchema.optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Restaurant Validation Schemas
export const createRestaurantSchema = z.object({
  name: z.string().min(1, 'Restaurant name is required'),
  description: z.string().min(1, 'Description is required'),
  cuisineTypes: z.array(z.string()).min(1, 'At least one cuisine type is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  region: z.string().min(1, 'Region is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email address'),
  minOrderAmount: z.number().min(0).default(24.00),
  logoUrl: z.string().url().optional(),
  coverImageUrl: z.string().url().optional(),
  openingHours: z.record(z.object({
    open: z.string(),
    close: z.string(),
  })),
});

export const updateRestaurantSchema = createRestaurantSchema.partial();

export const restaurantQuerySchema = z.object({
  city: z.string().optional(),
  region: z.string().optional(),
  cuisineType: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['distance', 'rating', 'name']).optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

// Menu Item Validation Schemas
export const menuCategorySchema = z.enum(['meals', 'drinks', 'special_deals']);

export const createMenuItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  category: menuCategorySchema,
  mealCategory: z.string().optional(),
  cuisineType: z.string().optional(),
  dietaryTags: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional(),
  quantity: z.number().min(0).default(0),
  status: z.enum(['active', 'inactive']).optional(),
  translations: z.record(z.object({
    name: z.string(),
    description: z.string(),
  })).optional(),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

export const menuQuerySchema = z.object({
  category: menuCategorySchema.nullable().optional(),
  dietaryTag: z.string().nullable().optional(),
  sortBy: z.enum(['price', 'name']).nullable().optional(),
});

// Order Validation Schemas
export const orderStatusSchema = z.enum([
  'new',
  'confirmed',
  'preparing',
  'ready_for_pickup',
  'assigned',
  'in_transit',
  'delivered',
  'cancelled',
]);

export const createOrderSchema = z.object({
  restaurantId: z.string().uuid('Invalid restaurant ID'),
  customerId: z.string().uuid('Invalid customer ID').optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  customerFirstName: z.string().optional(),
  customerLastName: z.string().optional(),
  items: z.array(z.object({
    menuItemId: z.string().uuid('Invalid menu item ID'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    specialInstructions: z.string().optional(),
  })).min(1, 'At least one item is required'),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  deliveryCity: z.string().min(1, 'Delivery city is required'),
  deliveryPostalCode: z.string().min(1, 'Postal code is required'),
  deliveryLatitude: z.number().optional(),
  deliveryLongitude: z.number().optional(),
  deliveryInstructions: z.string().optional(),
  scheduledDeliveryTime: z.string().datetime(),
  voucherCode: z.string().optional(),
  paymentIntentId: z.string().optional(), // Stripe Payment Intent ID for payment integration
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
  driverId: z.string().uuid().optional(),
  actualDeliveryTime: z.string().datetime().optional(),
});

export const orderQuerySchema = z.object({
  status: orderStatusSchema.optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

// Driver Validation Schemas
export const createDriverSchema = z.object({
  licenseNumber: z.string().min(1, 'License number is required'),
  vehicleType: z.string().min(1, 'Vehicle type is required'),
  vehiclePlate: z.string().min(1, 'Vehicle plate is required'),
  pickupZone: z.string().min(1, 'Pickup zone is required'),
  profileImageUrl: z.string().url().optional(),
});

export const updateDriverSchema = createDriverSchema.partial();

export const driverOrderQuerySchema = z.object({
  status: z.enum(['assigned', 'in_transit', 'delivered']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Customer Validation Schemas
export const updateCustomerSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  language: languageSchema.optional(),
});

export const addFavoriteSchema = z.object({
  menuItemId: z.string().uuid('Invalid menu item ID'),
});

export const redeemLoyaltySchema = z.object({
  points: z.number().min(1, 'Points must be positive'),
  rewardType: z.string().min(1, 'Reward type is required'),
});

// Admin Validation Schemas
export const adminRestaurantQuerySchema = z.object({
  status: z.enum(['pending', 'active', 'suspended']).optional(),
  region: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const approveRestaurantSchema = z.object({
  status: z.enum(['active', 'suspended']),
});

export const approveDriverSchema = z.object({
  status: z.enum(['active', 'suspended']),
});

export const adminDriverQuerySchema = z.object({
  status: z.enum(['pending', 'active', 'inactive', 'suspended']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const adminCustomerQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const adminOrderQuerySchema = z.object({
  status: orderStatusSchema.optional(),
  region: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const analyticsQuerySchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  region: z.string().optional(),
});

export const deliverySettingsSchema = z.object({
  deliveryRadius: z.number().min(1).max(100).optional(),
  baseDeliveryFee: z.number().min(0).optional(),
  perKmFee: z.number().min(0).optional(),
  zones: z.array(z.object({
    name: z.string(),
    radius: z.number(),
    baseFee: z.number(),
  })).optional(),
});

export const createAdminUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  language: languageSchema.optional(),
});

// File Upload Validation Schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(5242880), // 5MB
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp']),
});

// Pagination Schema
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

// Notification Validation Schemas
export const notificationTypeSchema = z.enum(['order_status', 'account', 'system', 'promotion']);

export const notificationQuerySchema = z.object({
  unreadOnly: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const markNotificationReadSchema = z.object({
  notificationId: z.string().uuid('Invalid notification ID'),
});

// Voucher Validation Schemas
export const voucherDiscountTypeSchema = z.enum(['percentage', 'fixed_amount']);
export const voucherStatusSchema = z.enum(['active', 'inactive', 'expired']);

export const createVoucherSchema = z.object({
  code: z.string().min(3, 'Voucher code must be at least 3 characters').max(50).toUpperCase(),
  discountType: voucherDiscountTypeSchema,
  discountValue: z.number().min(0, 'Discount value must be positive'),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  usageLimit: z.number().min(1).optional(),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
  status: voucherStatusSchema.default('active'),
});

export const updateVoucherSchema = z.object({
  code: z.string().min(3).max(50).toUpperCase().optional(),
  discountType: voucherDiscountTypeSchema.optional(),
  discountValue: z.number().min(0).optional(),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  usageLimit: z.number().min(1).optional(),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
  status: voucherStatusSchema.optional(),
});

export const voucherQuerySchema = z.object({
  status: voucherStatusSchema.optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});
