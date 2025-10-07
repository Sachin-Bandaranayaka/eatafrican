// User and Authentication Types
export type UserRole = 'customer' | 'restaurant_owner' | 'driver' | 'super_admin';
export type UserStatus = 'active' | 'inactive' | 'suspended';
export type Language = 'en' | 'de' | 'fr' | 'it';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  language: Language;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  restaurantId?: string;
  driverId?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  restaurantId?: string;
  driverId?: string;
  iat: number;
  exp: number;
}

// Restaurant Types
export type RestaurantStatus = 'pending' | 'active' | 'suspended';

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  cuisineTypes: string[];
  address: string;
  city: string;
  postalCode: string;
  region: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  email: string;
  minOrderAmount: number;
  status: RestaurantStatus;
  rating: number;
  totalRatings: number;
  logoUrl?: string;
  coverImageUrl?: string;
  openingHours: Record<string, { open: string; close: string }>;
  createdAt: string;
  updatedAt: string;
}

// Menu Item Types
export type MenuCategory = 'meals' | 'drinks' | 'special_deals';
export type MenuItemStatus = 'active' | 'inactive' | 'out_of_stock';

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  mealCategory?: string;
  cuisineType?: string;
  dietaryTags: string[];
  imageUrl?: string;
  galleryUrls: string[];
  quantity: number;
  status: MenuItemStatus;
  translations?: Record<string, { name: string; description: string }>;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export type OrderStatus = 
  | 'new' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready_for_pickup' 
  | 'assigned' 
  | 'in_transit' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  restaurantId: string;
  driverId?: string;
  status: OrderStatus;
  customerEmail?: string;
  customerPhone?: string;
  customerFirstName?: string;
  customerLastName?: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  deliveryInstructions?: string;
  scheduledDeliveryTime: string;
  actualDeliveryTime?: string;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentReference?: string;
  voucherCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  specialInstructions?: string;
  createdAt: string;
}

// Driver Types
export type DriverStatus = 'pending' | 'active' | 'inactive' | 'suspended';

export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  vehicleType: string;
  vehiclePlate: string;
  pickupZone: string;
  status: DriverStatus;
  rating: number;
  totalRatings: number;
  totalDeliveries: number;
  totalEarnings: number;
  profileImageUrl?: string;
  documentsVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Loyalty Types
export type LoyaltyTransactionType = 'earned' | 'redeemed' | 'referral_bonus';

export interface LoyaltyPoints {
  id: string;
  customerId: string;
  pointsBalance: number;
  lifetimePoints: number;
  referralCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  orderId?: string;
  transactionType: LoyaltyTransactionType;
  points: number;
  description: string;
  createdAt: string;
}

// Voucher Types
export type VoucherDiscountType = 'percentage' | 'fixed_amount';
export type VoucherStatus = 'active' | 'inactive' | 'expired';

export interface Voucher {
  id: string;
  code: string;
  discountType: VoucherDiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  validFrom?: string;
  validUntil?: string;
  status: VoucherStatus;
  createdAt: string;
}

// Favorite Types
export interface Favorite {
  id: string;
  customerId: string;
  menuItemId: string;
  createdAt: string;
}

// Notification Types
export type NotificationType = 'order_status' | 'account' | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

// Activity Log Types
export type EntityType = 'restaurant' | 'driver' | 'order' | 'user';

export interface ActivityLog {
  id: string;
  userId: string;
  entityType: EntityType;
  entityId?: string;
  action: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

// Error Types
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  statusCode: number;
}
