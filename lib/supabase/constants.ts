// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  RESTAURANT_OWNER: 'restaurant_owner',
  DRIVER: 'driver',
  SUPER_ADMIN: 'super_admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// User status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

// Restaurant status
export const RESTAURANT_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
} as const;

export type RestaurantStatus = typeof RESTAURANT_STATUS[keyof typeof RESTAURANT_STATUS];

// Menu item categories
export const MENU_CATEGORIES = {
  MEALS: 'meals',
  DRINKS: 'drinks',
  SPECIAL_DEALS: 'special_deals',
} as const;

export type MenuCategory = typeof MENU_CATEGORIES[keyof typeof MENU_CATEGORIES];

// Menu item status
export const MENU_ITEM_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
} as const;

export type MenuItemStatus = typeof MENU_ITEM_STATUS[keyof typeof MENU_ITEM_STATUS];

// Order status
export const ORDER_STATUS = {
  NEW: 'new',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY_FOR_PICKUP: 'ready_for_pickup',
  ASSIGNED: 'assigned',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// Driver status
export const DRIVER_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

export type DriverStatus = typeof DRIVER_STATUS[keyof typeof DRIVER_STATUS];

// Loyalty transaction types
export const LOYALTY_TRANSACTION_TYPES = {
  EARNED: 'earned',
  REDEEMED: 'redeemed',
  REFERRAL_BONUS: 'referral_bonus',
} as const;

export type LoyaltyTransactionType = typeof LOYALTY_TRANSACTION_TYPES[keyof typeof LOYALTY_TRANSACTION_TYPES];

// Voucher discount types
export const VOUCHER_DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount',
} as const;

export type VoucherDiscountType = typeof VOUCHER_DISCOUNT_TYPES[keyof typeof VOUCHER_DISCOUNT_TYPES];

// Voucher status
export const VOUCHER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  EXPIRED: 'expired',
} as const;

export type VoucherStatus = typeof VOUCHER_STATUS[keyof typeof VOUCHER_STATUS];

// Notification types
export const NOTIFICATION_TYPES = {
  ORDER_STATUS: 'order_status',
  ACCOUNT: 'account',
  SYSTEM: 'system',
  PROMOTION: 'promotion',
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

// Supported languages
export const LANGUAGES = {
  EN: 'en',
  DE: 'de',
  FR: 'fr',
  IT: 'it',
} as const;

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];

// Swiss regions/cities
export const REGIONS = {
  BASEL: 'Basel',
  BERN: 'Bern',
  LUZERN: 'Luzern',
  ZURICH: 'Zürich',
  OLTEN: 'Olten',
} as const;

export type Region = typeof REGIONS[keyof typeof REGIONS];

// Cuisine types
export const CUISINE_TYPES = {
  ETHIOPIAN: 'Ethiopian',
  ERITREAN: 'Eritrean',
  KENYAN: 'Kenyan',
  GHANAIAN: 'Ghanaian',
  NIGERIAN: 'Nigerian',
  EAST_AFRICAN: 'East African',
  WEST_AFRICAN: 'West African',
} as const;

export type CuisineType = typeof CUISINE_TYPES[keyof typeof CUISINE_TYPES];

// Dietary tags
export const DIETARY_TAGS = {
  VEGETARIAN: 'vegetarian',
  VEGAN: 'vegan',
  GLUTEN_FREE: 'gluten_free',
  HALAL: 'halal',
  SPICY: 'spicy',
} as const;

export type DietaryTag = typeof DIETARY_TAGS[keyof typeof DIETARY_TAGS];

// Loyalty rewards
export const LOYALTY_REWARDS = [
  { discount: '10% DISCOUNT', points: 100, id: 'reward_10' },
  { discount: '20% DISCOUNT', points: 200, id: 'reward_20' },
  { discount: '50% DISCOUNT', points: 500, id: 'reward_50' },
] as const;

// Default values
export const DEFAULTS = {
  MIN_ORDER_AMOUNT: 24.00,
  DELIVERY_FEE: 2.99,
  DELIVERY_RADIUS_KM: 10,
  POINTS_PER_FRANC: 1, // 1 point per CHF spent
  PAGINATION_LIMIT: 20,
  MAX_PAGINATION_LIMIT: 100,
} as const;

// Order status transitions (valid state changes)
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [ORDER_STATUS.NEW]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PREPARING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PREPARING]: [ORDER_STATUS.READY_FOR_PICKUP, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.READY_FOR_PICKUP]: [ORDER_STATUS.ASSIGNED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.ASSIGNED]: [ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.IN_TRANSIT]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.DELIVERED]: [],
  [ORDER_STATUS.CANCELLED]: [],
};

// Validate order status transition
export function isValidOrderStatusTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean {
  const allowedTransitions = ORDER_STATUS_TRANSITIONS[currentStatus];
  return allowedTransitions.includes(newStatus);
}
