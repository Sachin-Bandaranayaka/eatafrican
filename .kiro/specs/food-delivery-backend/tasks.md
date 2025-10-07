# Implementation Plan

- [x] 1. Set up project infrastructure and database
  - Initialize Supabase project and configure connection
  - Create database schema with all tables (users, restaurants, menu_items, orders, order_items, drivers, loyalty_points, loyalty_transactions, vouchers, favorites, notifications, activity_logs)
  - Set up database indexes for performance optimization
  - Configure Supabase Storage buckets for image uploads
  - Set up environment variables and configuration files
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [x] 2. Implement core utilities and middleware
  - Create TypeScript interfaces and types for all data models (User, Restaurant, MenuItem, Order, Driver, etc.)
  - Implement Zod validation schemas for request/response validation
  - Create authentication middleware for JWT validation and role-based access control
  - Implement error handling middleware with standardized error responses
  - Create utility functions for distance calculation, date formatting, and currency formatting
  - Set up rate limiting middleware
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [x] 3. Implement authentication system
- [x] 3.1 Create user registration endpoint (POST /api/auth/register)
  - Implement password hashing with bcrypt
  - Create user record in database with role assignment
  - Generate JWT access and refresh tokens
  - Return user data and tokens
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 3.2 Create login endpoint (POST /api/auth/login)
  - Validate credentials against database
  - Generate JWT tokens on successful authentication
  - Return user data with role information
  - _Requirements: 1.2, 1.3, 1.4, 1.5_

- [x] 3.3 Create password reset endpoints
  - Implement password reset request endpoint (POST /api/auth/reset-password)
  - Generate secure reset token and send email
  - Implement password reset confirmation endpoint
  - _Requirements: 1.3, 8.7_

- [x] 3.4 Create token refresh endpoint (POST /api/auth/refresh)
  - Validate refresh token
  - Generate new access token
  - Implement token rotation
  - _Requirements: 1.5_

- [x] 3.5 Create logout endpoint (POST /api/auth/logout)
  - Invalidate refresh token
  - Clear authentication cookies
  - _Requirements: 1.2, 1.3_


- [x] 4. Implement restaurant management APIs
- [x] 4.1 Create restaurant listing endpoint (GET /api/restaurants)
  - Implement filtering by city, region, cuisine type, and price range
  - Implement search functionality by restaurant name
  - Implement sorting by distance, rating, and name
  - Add pagination support
  - Calculate distance from user location if coordinates provided
  - Return data in format matching frontend expectations
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [x] 4.2 Create restaurant details endpoint (GET /api/restaurants/[id])
  - Fetch complete restaurant information including opening hours
  - Return restaurant data with owner information (for restaurant owners only)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 4.3 Create restaurant creation endpoint (POST /api/restaurants)
  - Validate restaurant owner role
  - Create restaurant record with pending status
  - Associate restaurant with owner user
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 4.4 Create restaurant update endpoint (PATCH /api/restaurants/[id])
  - Validate restaurant owner or admin role
  - Update restaurant details
  - Handle image URL updates
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 4.5 Create restaurant search endpoint (GET /api/restaurants/search)
  - Implement full-text search on restaurant name and description
  - Support filtering and sorting
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [x] 5. Implement menu management APIs
- [x] 5.1 Create menu listing endpoint (GET /api/restaurants/[id]/menu)
  - Fetch all menu items for a restaurant
  - Implement filtering by category (meals, drinks, special_deals)
  - Implement filtering by dietary tags
  - Implement sorting by price and name
  - Return multilingual content based on user language preference
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [x] 5.2 Create menu item creation endpoint (POST /api/restaurants/[id]/menu)
  - Validate restaurant owner role and ownership
  - Create menu item with all details
  - Support multilingual descriptions
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [x] 5.3 Create menu item update endpoint (PATCH /api/restaurants/[id]/menu/[itemId])
  - Validate restaurant owner role and ownership
  - Update menu item details including availability
  - Handle image URL updates
  - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 5.4 Create menu item deletion endpoint (DELETE /api/restaurants/[id]/menu/[itemId])
  - Validate restaurant owner role and ownership
  - Soft delete or hard delete menu item
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 6. Implement order processing APIs
- [x] 6.1 Create order creation endpoint (POST /api/orders)
  - Validate customer authentication or allow guest orders
  - Validate restaurant availability and operating hours
  - Calculate delivery fee based on distance
  - Validate and apply voucher code if provided
  - Calculate order totals (subtotal, delivery fee, discount, tax, total)
  - Create order record with 'new' status
  - Create order items records
  - Award loyalty points if customer is authenticated
  - Send notification to restaurant owner
  - Return order data with payment status 'pending'
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [x] 6.2 Create order details endpoint (GET /api/orders/[id])
  - Fetch complete order information with restaurant, customer, driver, and items
  - Validate user has permission to view order (customer, restaurant owner, driver, or admin)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 6.3 Create order status update endpoint (PATCH /api/orders/[id]/status)
  - Validate user role and permissions for status transitions
  - Update order status (new → confirmed → preparing → ready_for_pickup → assigned → in_transit → delivered)
  - Send notifications to relevant parties on status change
  - Update driver earnings when order is delivered
  - _Requirements: 3.7, 4.4, 4.5, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [x] 6.4 Create customer orders endpoint (GET /api/customers/[id]/orders)
  - Fetch all orders for a customer
  - Implement filtering by status
  - Implement pagination
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_


- [x] 7. Implement driver management APIs
- [x] 7.1 Create driver registration endpoint (POST /api/drivers)
  - Create driver record with pending status
  - Associate driver with user account
  - Store vehicle and license information
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 7.2 Create driver details endpoint (GET /api/drivers/[id])
  - Fetch driver information including statistics
  - Validate user has permission to view driver details
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 7.3 Create driver update endpoint (PATCH /api/drivers/[id])
  - Update driver information including pickup zone
  - Validate driver or admin role
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 7.4 Create available orders endpoint (GET /api/drivers/available-orders)
  - Fetch orders with status 'ready_for_pickup' in driver's pickup zone
  - Filter by driver's pickup zone
  - Return orders with restaurant and delivery details
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 8.3_

- [x] 7.5 Create order acceptance endpoint (POST /api/drivers/[id]/orders/[orderId]/accept)
  - Validate driver is active and in correct pickup zone
  - Assign order to driver
  - Update order status to 'assigned'
  - Send notification to customer with driver details
  - _Requirements: 4.3, 4.4, 4.5, 4.6, 4.7, 8.4_

- [x] 7.6 Create driver orders endpoint (GET /api/drivers/[id]/orders)
  - Fetch all orders assigned to driver
  - Implement filtering by status and date range
  - Calculate total earnings
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 8. Implement customer features APIs
- [x] 8.1 Create customer favorites listing endpoint (GET /api/customers/[id]/favorites)
  - Fetch all favorited menu items with restaurant details
  - Return data in format matching frontend expectations
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [x] 8.2 Create add favorite endpoint (POST /api/customers/[id]/favorites)
  - Add menu item to customer's favorites
  - Prevent duplicate favorites
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [x] 8.3 Create remove favorite endpoint (DELETE /api/customers/[id]/favorites/[itemId])
  - Remove menu item from customer's favorites
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [x] 8.4 Create loyalty points endpoint (GET /api/customers/[id]/loyalty)
  - Fetch customer's loyalty points balance and lifetime points
  - Return referral code
  - List available rewards (10%, 20%, 50% discounts)
  - Fetch loyalty transaction history
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [x] 8.5 Create loyalty points redemption endpoint (POST /api/customers/[id]/loyalty/redeem)
  - Validate customer has sufficient points
  - Deduct points from balance
  - Generate voucher code with discount
  - Create loyalty transaction record
  - _Requirements: 6.3, 6.4, 6.5, 6.6, 6.7_

- [x] 8.6 Create customer profile endpoint (GET /api/customers/[id])
  - Fetch customer profile information
  - Return order history summary
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 8.7 Create customer profile update endpoint (PATCH /api/customers/[id])
  - Update customer information (name, phone, language preference)
  - Validate customer or admin role
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [x] 9. Implement super admin APIs
- [x] 9.1 Create admin restaurant listing endpoint (GET /api/admin/restaurants)
  - Fetch all restaurants with owner information
  - Implement filtering by status (pending, active, suspended)
  - Implement filtering by region
  - Add pagination support
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

- [x] 9.2 Create restaurant approval endpoint (PATCH /api/admin/restaurants/[id]/approve)
  - Validate super admin role
  - Update restaurant status to 'active' or 'suspended'
  - Send notification to restaurant owner
  - Create activity log entry
  - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 8.6_

- [x] 9.3 Create admin driver listing endpoint (GET /api/admin/drivers)
  - Fetch all drivers with user information
  - Implement filtering by status
  - Add pagination support
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

- [x] 9.4 Create driver approval endpoint (PATCH /api/admin/drivers/[id]/approve)
  - Validate super admin role
  - Update driver status to 'active' or 'suspended'
  - Send notification to driver
  - Create activity log entry
  - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 8.6_


- [x] 9.5 Create admin customer listing endpoint (GET /api/admin/customers)
  - Fetch all customers with order statistics
  - Implement filtering and search
  - Add pagination support
  - _Requirements: 5.4, 5.5, 5.6, 5.7, 5.8_

- [x] 9.6 Create admin orders listing endpoint (GET /api/admin/orders)
  - Fetch all orders grouped by region and status
  - Implement filtering by date range, status, and region
  - Add pagination support
  - _Requirements: 5.5, 5.6, 5.7, 5.8_

- [x] 9.7 Create analytics endpoint (GET /api/admin/analytics)
  - Calculate total orders, revenue, and active users
  - Calculate platform revenue, restaurant earnings, and driver earnings
  - Group orders by status and region
  - Calculate average order value and delivery time
  - Support date range filtering
  - _Requirements: 5.6, 5.7, 5.8, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [x] 9.8 Create delivery settings endpoint (GET/PATCH /api/admin/settings/delivery)
  - Fetch and update delivery radius, fees, and zones
  - Validate super admin role
  - _Requirements: 5.7, 5.8_

- [x] 9.9 Create admin account management endpoints
  - Create admin user creation endpoint (POST /api/admin/users)
  - Create admin user listing endpoint (GET /api/admin/users)
  - Validate super admin role
  - _Requirements: 5.8_

- [x] 10. Implement file upload functionality
- [x] 10.1 Create file upload endpoint (POST /api/uploads)
  - Validate file type (JPEG, PNG, WebP)
  - Validate file size (max 5MB)
  - Upload file to Supabase Storage
  - Generate and return public URL
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [x] 10.2 Create file deletion endpoint (DELETE /api/uploads)
  - Validate user has permission to delete file
  - Remove file from Supabase Storage
  - Update database references
  - _Requirements: 12.4, 12.5, 12.6, 12.7_

- [x] 11. Implement notification system
- [x] 11.1 Create notification creation utility
  - Function to create notification records in database
  - Support different notification types (order_status, account, system)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [x] 11.2 Create email notification utility
  - Function to send emails via Supabase Email
  - Support multilingual email templates
  - Handle order status change emails
  - Handle account-related emails (registration, password reset)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [x] 11.3 Create notification listing endpoint (GET /api/notifications)
  - Fetch user's notifications
  - Implement pagination
  - Mark notifications as read
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [ ] 12. Implement voucher system
- [ ] 12.1 Create voucher validation utility
  - Validate voucher code exists and is active
  - Check usage limits and expiration
  - Calculate discount amount
  - _Requirements: 3.8, 6.6, 6.7_

- [ ] 12.2 Create voucher application logic
  - Apply voucher discount to order total
  - Increment voucher usage count
  - Create voucher usage record
  - _Requirements: 3.8, 6.6, 6.7_

- [ ] 12.3 Create admin voucher management endpoints
  - Create voucher creation endpoint (POST /api/admin/vouchers)
  - Create voucher listing endpoint (GET /api/admin/vouchers)
  - Create voucher update endpoint (PATCH /api/admin/vouchers/[id])
  - Validate super admin role
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ] 13. Implement activity logging
- [ ] 13.1 Create activity log utility
  - Function to create activity log entries
  - Log user actions (login, order creation, status changes)
  - Log admin actions (approvals, settings changes)
  - Store IP address and user agent
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

- [ ] 13.2 Create activity log viewing endpoints
  - Create restaurant activity log endpoint (GET /api/admin/restaurants/[id]/activity)
  - Create driver activity log endpoint (GET /api/admin/drivers/[id]/activity)
  - Validate admin role
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

- [ ] 14. Implement search and filtering utilities
- [ ] 14.1 Create distance calculation utility
  - Calculate distance between two coordinates using Haversine formula
  - Format distance string (e.g., "9 km, 47 min from Olten")
  - _Requirements: 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ] 14.2 Create sorting and filtering utilities
  - Implement generic sorting function for database queries
  - Implement filtering logic for restaurants and menu items
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_


- [ ] 15. Implement multi-language support
- [ ] 15.1 Create language detection utility
  - Detect user language from Accept-Language header
  - Fall back to user profile language preference
  - Default to English if no preference found
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [ ] 15.2 Create content localization utility
  - Function to return localized content based on user language
  - Support for menu item translations
  - Support for notification translations
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [ ] 15.3 Create currency and date formatting utilities
  - Format prices as Swiss Francs (Fr. XX.XX.-)
  - Format dates in European format (DD.MM.YYYY)
  - Format times in 24-hour format (HH:mm)
  - _Requirements: 11.4, 11.5, 11.6, 11.7_

- [ ] 16. Implement data seeding and migration scripts
- [ ] 16.1 Create database seed script
  - Create sample users for each role (customer, restaurant owner, driver, super admin)
  - Create sample restaurants with menu items
  - Create sample orders in various states
  - Create sample loyalty points and vouchers
  - _Requirements: All requirements for testing purposes_

- [ ] 16.2 Create data migration utilities
  - Script to migrate existing mock data to database (if needed)
  - Script to export data for backup
  - _Requirements: All requirements for data management_

- [ ] 17. Implement API documentation
- [ ] 17.1 Create API documentation
  - Document all endpoints with request/response examples
  - Document authentication requirements
  - Document error codes and responses
  - Create Postman collection or OpenAPI spec
  - _Requirements: All requirements for developer reference_

- [ ] 18. Integration and testing
- [ ] 18.1 Create integration test suite
  - Test authentication flow (register, login, token refresh)
  - Test restaurant CRUD operations
  - Test menu item CRUD operations
  - Test complete order lifecycle
  - Test driver order acceptance and delivery
  - Test loyalty points and voucher redemption
  - Test admin operations
  - _Requirements: All requirements_

- [ ] 18.2 Test API endpoints with frontend
  - Replace mock data in frontend with API calls
  - Test customer flow (browse, order, track)
  - Test restaurant owner flow (manage menu, view orders)
  - Test driver flow (view orders, accept, deliver)
  - Test super admin flow (approve restaurants, view analytics)
  - Verify all data formats match frontend expectations
  - _Requirements: All requirements_

- [ ] 18.3 Performance testing and optimization
  - Test API response times under load
  - Optimize slow database queries
  - Implement caching where appropriate
  - Test with realistic data volumes
  - _Requirements: All requirements for production readiness_

- [ ] 19. Security audit and hardening
- [ ] 19.1 Conduct security review
  - Review authentication and authorization logic
  - Test for SQL injection vulnerabilities
  - Test for XSS vulnerabilities
  - Verify rate limiting is working
  - Test file upload security
  - Review error messages for information leakage
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [ ] 20. Deployment preparation
- [ ] 20.1 Configure production environment
  - Set up production Supabase project
  - Configure environment variables for production
  - Set up error monitoring (Sentry or similar)
  - Configure logging
  - Set up database backups
  - _Requirements: All requirements for production deployment_

- [ ] 20.2 Create deployment documentation
  - Document deployment process
  - Document environment variable configuration
  - Document database migration process
  - Create troubleshooting guide
  - _Requirements: All requirements for operations_
