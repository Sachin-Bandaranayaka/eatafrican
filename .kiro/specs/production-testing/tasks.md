# Implementation Plan

- [x] 1. Set up testing environment and validate infrastructure
  - Verify Supabase MCP connection is configured and working
  - Check database schema matches design specifications
  - Validate all tables exist with correct columns and types
  - Verify indexes are created for performance-critical queries
  - Test RLS policies are active and enforcing access control
  - Verify Supabase Storage buckets exist and are configured correctly
  - Check environment variables are set correctly
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [ ] 2. Test authentication system with real data
- [x] 2.1 Test user registration flow
  - Register new customer with valid data and verify user created in database
  - Test registration with duplicate email (should fail with appropriate error)
  - Test registration with weak password (should fail validation)
  - Register restaurant owner and verify role assignment
  - Register driver and verify role assignment
  - Verify JWT tokens are returned and contain correct claims
  - Query database to confirm user records created correctly
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 2.2 Test login and token management
  - Login with valid credentials and verify JWT tokens returned
  - Test login with invalid password (should fail)
  - Test login with non-existent email (should fail)
  - Verify JWT token contains correct user ID and role
  - Test token refresh endpoint with valid refresh token
  - Test with expired access token (should require refresh)
  - Test logout and verify tokens invalidated
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 2.3 Test password reset flow
  - Request password reset for valid email
  - Verify reset email sent (check notifications table)
  - Complete password reset with valid token
  - Test reset with expired token (should fail)
  - Login with new password to verify change
  - _Requirements: 2.5_

- [x] 2.4 Test role-based access control
  - Test customer accessing customer-only endpoints
  - Test restaurant owner accessing their restaurant data
  - Test restaurant owner attempting to access another restaurant (should fail)
  - Test driver accessing driver-only endpoints
  - Test super admin accessing all endpoints
  - Verify unauthorized access returns 401/403 errors
  - _Requirements: 2.7_

- [x] 3. Test restaurant management with real data
- [x] 3.1 Test restaurant creation and approval
  - Create restaurant as restaurant owner with complete data
  - Verify restaurant created with status 'pending' in database
  - Verify owner_id correctly set
  - Upload restaurant logo to Supabase Storage
  - Upload cover image to Supabase Storage
  - Verify image URLs returned and accessible
  - Admin approves restaurant (status changes to 'active')
  - Verify approval notification created
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 3.2 Test restaurant listing and filtering
  - List all active restaurants and verify data format
  - Filter restaurants by city (Basel, Bern, Luzern, Zürich)
  - Filter restaurants by region
  - Filter restaurants by cuisine type
  - Search restaurants by name (partial match)
  - Verify only active restaurants shown to customers
  - Verify pending restaurants shown to admins
  - Test pagination with large result sets
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 3.3 Test restaurant sorting
  - Sort restaurants by rating (high to low)
  - Sort restaurants by name (alphabetical)
  - Sort restaurants by distance (requires user coordinates)
  - Verify distance calculation is accurate
  - Verify distance string formatted correctly (e.g., "9 km, 47 min from Olten")
  - _Requirements: 3.7_

- [x] 3.4 Test restaurant updates
  - Update restaurant details as owner
  - Update opening hours
  - Update minimum order amount
  - Replace restaurant logo
  - Replace cover image
  - Verify changes reflected immediately in database
  - Test update as different owner (should fail)
  - Test update as admin (should succeed)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_


- [-] 4. Test menu management with real data
- [x] 4.1 Test menu item creation
  - Create menu item as restaurant owner with complete data
  - Add dietary tags (vegan, vegetarian, gluten_free)
  - Add multilingual descriptions (EN, DE, FR, IT)
  - Upload menu item image to Supabase Storage
  - Upload multiple gallery images
  - Verify menu item created in database
  - Test creation as different owner (should fail)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 4.2 Test menu listing and filtering
  - List all menu items for a restaurant
  - Filter by category (meals, drinks, special_deals)
  - Filter by dietary tags (vegan, vegetarian, gluten_free)
  - Sort by price (low to high, high to low)
  - Sort by name (alphabetical)
  - Verify multilingual content returned based on language preference
  - Verify out_of_stock items handled correctly
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 4.3 Test menu item updates
  - Update menu item price
  - Update menu item availability (quantity)
  - Mark item as out_of_stock
  - Update item description and translations
  - Replace item image
  - Verify changes reflected immediately
  - Test update as different owner (should fail)
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ] 4.4 Test menu item deletion
  - Delete menu item as restaurant owner
  - Verify item removed or marked inactive in database
  - Test deletion as different owner (should fail)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [-] 5. Test order processing with real data
- [x] 5.1 Test order creation as authenticated customer
  - Add multiple menu items to cart
  - Provide delivery address with coordinates
  - Calculate delivery fee based on distance
  - Apply valid voucher code
  - Verify order totals calculated correctly (subtotal, delivery fee, discount, tax, total)
  - Create order and verify order record in database
  - Verify order_items records created
  - Verify unique order number generated
  - Verify loyalty points awarded to customer
  - Verify restaurant notification created
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

- [x] 5.2 Test order creation as guest user
  - Create order without authentication
  - Provide customer email, phone, name
  - Verify order created with guest customer details
  - Verify no loyalty points awarded
  - _Requirements: 5.8_

- [x] 5.3 Test order calculations
  - Verify subtotal matches sum of item prices × quantities
  - Verify delivery fee calculated from distance
  - Apply percentage discount voucher and verify calculation
  - Apply fixed amount discount voucher and verify calculation
  - Verify max discount limit enforced
  - Verify min order amount for voucher enforced
  - Test voucher below min order (should fail)
  - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_


- [x] 5.4 Test order status transitions
  - Restaurant confirms order (new → confirmed)
  - Verify status updated in database
  - Verify customer notification created
  - Restaurant marks preparing (confirmed → preparing)
  - Restaurant marks ready for pickup (preparing → ready_for_pickup)
  - Verify driver notification created
  - Driver accepts order (ready_for_pickup → assigned)
  - Verify order assigned to driver in database
  - Driver confirms pickup (assigned → in_transit)
  - Driver confirms delivery (in_transit → delivered)
  - Verify actual_delivery_time recorded
  - Verify driver earnings calculated and updated
  - Test invalid status transitions (should fail)
  - _Requirements: 5.7_

- [ ] 5.5 Test order viewing and filtering
  - View order details as customer
  - View order details as restaurant owner
  - View order details as driver
  - View order details as admin
  - Test unauthorized access (should fail)
  - List customer orders with status filter
  - List customer orders with pagination
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

- [ ] 6. Test driver operations with real data
- [ ] 6.1 Test driver registration and approval
  - Register as driver with complete data
  - Upload license document to Supabase Storage
  - Upload vehicle document to Supabase Storage
  - Verify driver created with status 'pending' in database
  - Admin approves driver (status changes to 'active')
  - Verify approval notification created
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ] 6.2 Test available orders for drivers
  - Create orders in ready_for_pickup status
  - Driver views available orders in their pickup zone
  - Verify only orders in driver's zone shown
  - Verify orders outside zone not shown
  - Verify inactive drivers don't see orders
  - Verify order details include restaurant and delivery info
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ] 6.3 Test order acceptance by driver
  - Driver accepts available order
  - Verify order assigned to driver in database
  - Verify order status changed to 'assigned'
  - Verify customer notification created with driver details
  - Test accepting already assigned order (should fail)
  - Test accepting as inactive driver (should fail)
  - _Requirements: 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ] 6.4 Test driver order completion
  - Driver confirms pickup
  - Verify status changed to 'in_transit'
  - Driver confirms delivery
  - Verify status changed to 'delivered'
  - Verify actual_delivery_time recorded
  - Verify driver earnings calculated correctly
  - Verify driver total_deliveries incremented
  - Verify driver total_earnings updated
  - Query database to confirm all updates
  - _Requirements: 6.4, 6.5, 6.6, 6.7_

- [ ] 6.5 Test driver earnings and statistics
  - View driver total earnings
  - View driver earnings by date range
  - View completed deliveries count
  - Verify earnings match sum of delivery fees
  - View driver rating and statistics
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_


- [ ] 7. Test customer features with real data
- [ ] 7.1 Test favorites management
  - Add menu item to favorites as customer
  - Verify favorite record created in database
  - Test adding duplicate favorite (should prevent)
  - View all favorites with restaurant and item details
  - Remove item from favorites
  - Verify favorite record deleted from database
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ] 7.2 Test loyalty points system
  - View customer loyalty points balance
  - View lifetime points earned
  - View loyalty transaction history
  - Complete order and verify points awarded
  - Verify points calculation based on order total
  - Verify loyalty_transactions record created
  - Verify points_balance updated correctly
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ] 7.3 Test loyalty points redemption
  - Redeem 100 points for 10% discount voucher
  - Verify points deducted from balance
  - Verify voucher generated with correct discount
  - Verify loyalty_transactions record created
  - Redeem 200 points for 20% discount voucher
  - Redeem 500 points for 50% discount voucher
  - Test redemption with insufficient points (should fail)
  - Use redeemed voucher in order
  - _Requirements: 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ] 7.4 Test customer profile management
  - View customer profile information
  - Update customer name
  - Update customer phone
  - Update customer language preference
  - Verify changes saved in database
  - Test update as different customer (should fail)
  - _Requirements: 7.7_

- [ ] 7.5 Test customer order history
  - View all customer orders
  - Filter orders by status (new, confirmed, delivered, etc.)
  - View order details with items and totals
  - Verify pagination works correctly
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ] 8. Test super admin dashboard with real data
- [ ] 8.1 Test restaurant management dashboard
  - View all restaurants (pending, active, suspended)
  - Filter restaurants by status
  - Filter restaurants by region
  - Search restaurants by name
  - View restaurant details with owner information
  - Approve pending restaurant
  - Verify status changed to 'active' in database
  - Verify notification sent to owner
  - Suspend active restaurant
  - Verify status changed to 'suspended'
  - View restaurant activity log
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10_

- [ ] 8.2 Test driver management dashboard
  - View all drivers with status filters
  - View driver details with statistics
  - Approve pending driver
  - Verify status changed to 'active' in database
  - Verify notification sent to driver
  - Suspend active driver
  - View driver activity log
  - View driver delivery history
  - View driver earnings breakdown
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10_


- [ ] 8.3 Test customer management dashboard
  - View all customers with search functionality
  - View customer details
  - View customer order history
  - View customer loyalty points
  - Suspend customer account
  - View customer activity log
  - _Requirements: 8.5, 8.6, 8.7, 8.8, 8.9, 8.10_

- [ ] 8.4 Test orders management dashboard
  - View all orders across all restaurants
  - Filter orders by status (new, confirmed, preparing, etc.)
  - Filter orders by region
  - Filter orders by date range
  - View order details with all information
  - Update order status as admin
  - Export orders data
  - _Requirements: 8.6, 8.7, 8.8, 8.9, 8.10_

- [ ] 8.5 Test analytics dashboard
  - View total orders count
  - View total revenue
  - Calculate and verify platform revenue
  - Calculate and verify restaurant earnings
  - Calculate and verify driver earnings
  - View active users count (customers, restaurants, drivers)
  - View orders grouped by status
  - View orders grouped by region
  - Calculate average order value
  - Filter analytics by date range
  - Verify all calculations are accurate by querying database
  - _Requirements: 8.6, 8.7, 8.8, 8.9, 8.10_

- [ ] 8.6 Test delivery settings management
  - View current delivery settings
  - Update delivery radius
  - Update base delivery fee
  - Update per-km delivery fee
  - Add new delivery zone
  - Update zone boundaries
  - Verify settings saved in database
  - Verify new settings applied to subsequent orders
  - _Requirements: 8.7, 8.8, 8.9, 8.10_

- [ ] 8.7 Test voucher management
  - Create percentage discount voucher (e.g., 10% off)
  - Create fixed amount discount voucher (e.g., Fr. 5.00 off)
  - Set usage limits
  - Set expiration date
  - Set minimum order amount
  - Set maximum discount amount
  - View all vouchers with filters
  - Update voucher details
  - Deactivate voucher
  - View voucher usage statistics
  - Verify voucher records in database
  - _Requirements: 8.8, 8.9, 8.10_

- [ ] 8.8 Test admin user management
  - Create new admin user account
  - Assign super_admin role
  - View all admin users
  - Update admin user details
  - Deactivate admin user
  - Verify admin permissions work correctly
  - _Requirements: 8.8, 8.9, 8.10_

- [ ] 9. Test notification system with real data
- [ ] 9.1 Test order-related notifications
  - Place order and verify restaurant notification created
  - Confirm order and verify customer notification created
  - Mark order ready and verify driver notification created
  - Assign order to driver and verify customer notification with driver details
  - Complete delivery and verify customer confirmation notification
  - Query notifications table to verify all records created
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [ ] 9.2 Test account-related notifications
  - Register restaurant and verify pending notification
  - Approve restaurant and verify welcome notification
  - Register driver and verify pending notification
  - Approve driver and verify welcome notification
  - Request password reset and verify reset link notification
  - _Requirements: 9.6, 9.7_


- [ ] 9.3 Test notification viewing and management
  - View user notifications list
  - Mark notification as read
  - Filter unread notifications
  - Verify notification data structure
  - Test notification pagination
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [ ] 9.4 Test multi-language notifications
  - Set user language preference to German
  - Trigger notification and verify German content
  - Set language to French and verify French content
  - Set language to Italian and verify Italian content
  - Verify fallback to English for missing translations
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [ ] 10. Test search and filtering with real data
- [ ] 10.1 Test restaurant search
  - Search by exact restaurant name
  - Search by partial restaurant name
  - Search by cuisine type
  - Verify search results are accurate
  - Test search with no results
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [ ] 10.2 Test restaurant filtering
  - Filter by city (Basel, Bern, Luzern, Zürich)
  - Filter by region
  - Filter by cuisine type (Ethiopian, Kenyan, Ghanaian, Nigerian)
  - Filter by minimum order amount range
  - Combine multiple filters
  - Verify filtered results are correct
  - _Requirements: 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [ ] 10.3 Test restaurant sorting
  - Sort by distance (requires user coordinates)
  - Verify distance calculation accuracy
  - Sort by rating (high to low)
  - Sort by name (alphabetical)
  - Verify sorting is correct
  - _Requirements: 10.4, 10.5_

- [ ] 10.4 Test menu item filtering
  - Filter by category (meals, drinks, special_deals)
  - Filter by dietary tags (vegan)
  - Filter by dietary tags (vegetarian)
  - Filter by dietary tags (gluten_free)
  - Combine multiple dietary tags
  - Sort by price (low to high, high to low)
  - Sort by name
  - Verify filtered and sorted results
  - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7_

- [ ] 11. Test voucher system with real data
- [ ] 11.1 Test voucher validation
  - Apply valid voucher code to order
  - Verify discount calculated correctly
  - Apply expired voucher (should fail with error)
  - Apply voucher below minimum order amount (should fail)
  - Apply voucher at usage limit (should fail)
  - Apply inactive voucher (should fail)
  - Apply non-existent voucher code (should fail)
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [ ] 11.2 Test voucher discount calculations
  - Apply 10% percentage discount voucher
  - Verify discount amount calculated correctly
  - Apply 20% percentage discount voucher
  - Apply fixed amount discount voucher (Fr. 5.00)
  - Verify max discount limit enforced
  - Verify discount doesn't exceed order subtotal
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [ ] 11.3 Test voucher usage tracking
  - Use voucher in order
  - Verify usage_count incremented in database
  - Use voucher multiple times up to limit
  - Verify voucher becomes inactive at limit
  - Query vouchers table to verify usage data
  - _Requirements: 11.4, 11.5, 11.6, 11.7_


- [ ] 12. Test file upload functionality with real data
- [ ] 12.1 Test image upload
  - Upload valid JPEG image
  - Verify file stored in Supabase Storage
  - Verify public URL returned
  - Verify URL is accessible
  - Upload valid PNG image
  - Upload valid WebP image
  - Upload invalid file type (should fail with error)
  - Upload oversized file >5MB (should fail with error)
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [ ] 12.2 Test image management
  - Upload restaurant logo
  - Update restaurant logo (replace existing)
  - Verify old image handling
  - Upload menu item image
  - Upload multiple gallery images
  - Delete image from storage
  - Verify image removed from storage bucket
  - _Requirements: 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [ ] 12.3 Test storage bucket configuration
  - Verify restaurant-images bucket exists
  - Verify bucket permissions are correct
  - Test public access to uploaded images
  - Verify file size limits enforced
  - Verify file type restrictions enforced
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [ ] 13. Test multi-language support with real data
- [ ] 13.1 Test language detection and preference
  - Set user language preference to German (de)
  - Verify preference saved in database
  - Set language to French (fr)
  - Set language to Italian (it)
  - Set language to English (en)
  - Test language detection from Accept-Language header
  - Verify fallback to English when no preference set
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

- [ ] 13.2 Test content localization
  - Create menu item with translations in all languages
  - Request menu in German and verify German content returned
  - Request menu in French and verify French content returned
  - Request menu in Italian and verify Italian content returned
  - Request menu in English and verify English content returned
  - Test fallback to English for missing translations
  - _Requirements: 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

- [ ] 13.3 Test formatting and localization
  - Verify prices formatted as Swiss Francs (Fr. XX.XX.-)
  - Verify dates formatted in European format (DD.MM.YYYY)
  - Verify times formatted in 24-hour format (HH:mm)
  - Test in all supported languages
  - _Requirements: 13.4, 13.5, 13.6, 13.7_

- [ ] 14. Test frontend components with real backend data
- [ ] 14.1 Test restaurant list component
  - Load restaurant list from API
  - Verify restaurants displayed with correct data
  - Verify restaurant logos and cover images load
  - Verify cuisine types displayed correctly
  - Verify distance and delivery time shown
  - Verify minimum order amount displayed
  - Verify rating displayed
  - Test loading state
  - Test empty results state
  - Test error handling
  - Test pagination controls
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_

- [ ] 14.2 Test restaurant menu component
  - Load restaurant menu from API
  - Verify menu items displayed with correct data
  - Verify item images load correctly
  - Verify prices formatted correctly
  - Verify dietary tags displayed
  - Verify item descriptions shown
  - Test category tabs (meals, drinks, special_deals)
  - Test filtering by dietary tags
  - Test sorting by price
  - Test out of stock items display
  - Test add to cart functionality
  - _Requirements: 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_


- [ ] 14.3 Test cart component
  - Add items to cart
  - Verify cart state maintained
  - Update item quantities
  - Remove items from cart
  - Verify subtotal calculated correctly
  - Display delivery fee
  - Apply voucher discount
  - Verify total calculated correctly
  - Test empty cart state
  - Test cart persistence
  - Clear cart after order
  - _Requirements: 14.3, 14.4, 14.5, 14.6, 14.7_

- [ ] 14.4 Test order placement and tracking
  - Place order through frontend
  - Verify order submitted to API
  - Verify order confirmation displayed
  - View order tracking page
  - Verify order status displayed
  - Verify order timeline shown
  - Verify restaurant details displayed
  - Verify delivery address shown
  - Verify driver details shown (when assigned)
  - Test status updates in real-time
  - Verify order items and totals displayed
  - _Requirements: 14.4, 14.5, 14.6, 14.7_

- [ ] 14.5 Test driver portal components
  - Login as driver
  - View available orders list
  - Verify orders displayed with correct data
  - Accept order through UI
  - Verify order assigned
  - Confirm pickup through UI
  - Verify status updated
  - Confirm delivery through UI
  - Verify status updated to delivered
  - View earnings dashboard
  - Verify earnings displayed correctly
  - _Requirements: 14.5, 14.6, 14.7_

- [ ] 14.6 Test admin dashboard components
  - Login as super admin
  - View analytics dashboard
  - Verify charts and metrics displayed
  - View restaurant management
  - Test restaurant approval workflow
  - View driver management
  - Test driver approval workflow
  - View customer management
  - View orders management
  - Test filtering and search
  - View activity logs
  - Test voucher management
  - Test delivery settings
  - _Requirements: 14.6, 14.7_

- [ ] 14.7 Test error handling in frontend
  - Test API error responses displayed correctly
  - Test network error handling
  - Test validation error messages
  - Test unauthorized access handling
  - Test 404 not found handling
  - Verify user-friendly error messages
  - _Requirements: 14.7_

- [ ] 15. Test performance with real data
- [ ] 15.1 Measure API response times
  - Measure GET /api/restaurants response time
  - Measure GET /api/restaurants/[id]/menu response time
  - Measure POST /api/orders response time
  - Measure GET /api/admin/analytics response time
  - Identify endpoints with response time >500ms
  - Document slow endpoints for optimization
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7_

- [ ] 15.2 Analyze database query performance
  - Use Supabase MCP to analyze query execution plans
  - Identify slow queries (>100ms)
  - Identify full table scans
  - Verify indexes are being used
  - Identify missing indexes
  - Test pagination performance with large datasets
  - Test filtering performance
  - Test sorting performance
  - _Requirements: 15.2, 15.3, 15.4, 15.5, 15.6, 15.7_


- [ ] 15.3 Test frontend performance
  - Measure page load times
  - Measure time to interactive
  - Test image loading performance
  - Test component render times
  - Identify performance bottlenecks
  - Test with slow network conditions (throttling)
  - _Requirements: 15.5, 15.6, 15.7_

- [ ] 16. Test error handling and edge cases
- [ ] 16.1 Test validation errors
  - Submit invalid email format
  - Submit weak password
  - Submit negative price
  - Submit invalid phone number
  - Submit missing required fields
  - Verify error messages are clear and helpful
  - Verify error codes are correct
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_

- [ ] 16.2 Test authorization errors
  - Access endpoint without authentication (should return 401)
  - Access resource of different user (should return 403)
  - Perform action without permission (should return 403)
  - Use expired JWT token (should return 401)
  - Use invalid JWT token (should return 401)
  - Verify error messages don't leak sensitive information
  - _Requirements: 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_

- [ ] 16.3 Test resource not found errors
  - Request non-existent restaurant (should return 404)
  - Request non-existent order (should return 404)
  - Request non-existent menu item (should return 404)
  - Request non-existent user (should return 404)
  - Verify error messages are appropriate
  - _Requirements: 16.3, 16.4, 16.5, 16.6, 16.7_

- [ ] 16.4 Test business logic errors
  - Place order when restaurant is closed (should fail)
  - Apply voucher below minimum order (should fail)
  - Redeem loyalty points with insufficient balance (should fail)
  - Accept already assigned order (should fail)
  - Invalid order status transition (should fail)
  - Verify error messages explain the issue
  - _Requirements: 16.4, 16.5, 16.6, 16.7_

- [ ] 17. Test security with real data
- [ ] 17.1 Test SQL injection prevention
  - Attempt SQL injection in search queries
  - Attempt SQL injection in filter parameters
  - Attempt SQL injection in text fields
  - Verify all queries use parameterized statements
  - Verify no SQL errors exposed to users
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7_

- [ ] 17.2 Test XSS prevention
  - Submit script tags in text fields
  - Submit malicious HTML in descriptions
  - Submit event handlers in input fields
  - Verify input is sanitized
  - Verify output is properly encoded
  - _Requirements: 17.2, 17.3, 17.4, 17.5, 17.6, 17.7_

- [ ] 17.3 Test authentication security
  - Verify passwords are hashed (not stored in plain text)
  - Verify JWT tokens are properly signed
  - Verify token expiration is enforced
  - Verify refresh token rotation works
  - Test password strength requirements
  - Verify account lockout after failed attempts (if implemented)
  - _Requirements: 17.4, 17.5, 17.6, 17.7_

- [ ] 17.4 Test file upload security
  - Attempt to upload executable file (should fail)
  - Attempt to upload PHP/script file (should fail)
  - Attempt to upload oversized file (should fail)
  - Verify file type validation
  - Verify file size validation
  - Verify uploaded files cannot execute
  - _Requirements: 17.6, 17.7_


- [ ] 18. Test data integrity with real data
- [ ] 18.1 Test referential integrity
  - Verify foreign key constraints are enforced
  - Test cascade deletes work correctly
  - Query database for orphaned records
  - Verify all order_items have valid order_id
  - Verify all orders have valid restaurant_id and customer_id
  - Verify all menu_items have valid restaurant_id
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7_

- [ ] 18.2 Test data consistency
  - Verify order totals match sum of item prices
  - Verify loyalty points balance matches transaction history
  - Verify voucher usage counts are accurate
  - Verify driver earnings match completed deliveries
  - Verify restaurant order counts are accurate
  - Query database to validate all calculations
  - _Requirements: 18.2, 18.3, 18.4, 18.5, 18.6, 18.7_

- [ ] 18.3 Test transaction atomicity
  - Test order creation (all records created or none)
  - Test order status update (all related updates succeed or rollback)
  - Test loyalty points redemption (points deducted and voucher created atomically)
  - Verify no partial updates in database
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7_

- [ ] 18.4 Test concurrent updates
  - Test multiple users updating same resource
  - Test race conditions in order assignment
  - Test concurrent voucher usage
  - Verify data remains consistent
  - _Requirements: 18.7_

- [ ] 19. Test complete end-to-end user journeys
- [ ] 19.1 Test complete customer journey
  - Customer registers account
  - Customer browses restaurants
  - Customer filters by cuisine type
  - Customer views restaurant menu
  - Customer adds items to cart
  - Customer applies voucher code
  - Customer places order
  - Customer receives order confirmation
  - Restaurant confirms order
  - Restaurant prepares order
  - Restaurant marks ready for pickup
  - Driver accepts order
  - Customer receives driver notification
  - Driver picks up order
  - Driver delivers order
  - Customer receives delivery confirmation
  - Customer earns loyalty points
  - Verify all steps work together seamlessly
  - Verify all data persisted correctly
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7_

- [ ] 19.2 Test complete restaurant owner journey
  - Restaurant owner registers
  - Owner creates restaurant profile
  - Owner uploads restaurant logo and cover image
  - Owner sets opening hours
  - Admin approves restaurant
  - Owner receives approval notification
  - Owner adds menu items with images
  - Owner adds multilingual descriptions
  - Customer places order
  - Owner receives order notification
  - Owner confirms order
  - Owner marks preparing
  - Owner marks ready for pickup
  - Order is delivered
  - Owner views order history
  - Owner views earnings
  - Verify all operations succeed
  - Verify all data accurate
  - _Requirements: 19.2, 19.3, 19.4, 19.5, 19.6, 19.7_

- [ ] 19.3 Test complete driver journey
  - Driver registers
  - Driver uploads license and vehicle documents
  - Admin approves driver
  - Driver receives approval notification
  - Driver sets pickup zone
  - Driver views available orders
  - Driver accepts order
  - Customer receives driver notification
  - Driver confirms pickup
  - Driver confirms delivery
  - Driver views earnings
  - Driver views delivery history
  - Verify all operations succeed
  - Verify earnings calculated correctly
  - _Requirements: 19.3, 19.4, 19.5, 19.6, 19.7_


- [ ] 19.4 Test complete admin journey
  - Admin logs in
  - Admin views pending restaurants
  - Admin approves restaurant
  - Admin views pending drivers
  - Admin approves driver
  - Admin views all orders
  - Admin filters orders by region and status
  - Admin views analytics dashboard
  - Admin creates voucher
  - Admin updates delivery settings
  - Admin views activity logs
  - Verify all admin operations work
  - Verify all data displayed correctly
  - _Requirements: 19.4, 19.5, 19.6, 19.7_

- [ ] 20. Production readiness validation
- [ ] 20.1 Validate environment configuration
  - Verify all environment variables are set
  - Verify Supabase project is configured correctly
  - Verify database connection works
  - Verify Supabase Storage is configured
  - Verify API keys are secured
  - Verify CORS settings are correct
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7_

- [ ] 20.2 Validate database preparation
  - Verify all migrations are applied
  - Verify all tables exist with correct schema
  - Verify all indexes are created
  - Verify RLS policies are enabled
  - Verify seed data is loaded (if needed)
  - Verify database backups are configured
  - Test database connection pooling
  - _Requirements: 20.2, 20.3, 20.4, 20.5, 20.6, 20.7_

- [ ] 20.3 Validate monitoring and logging
  - Verify error tracking is configured (if using Sentry or similar)
  - Verify application logging is working
  - Verify log levels are appropriate
  - Verify sensitive data is not logged
  - Test error notifications
  - Verify performance monitoring is active
  - _Requirements: 20.3, 20.4, 20.5, 20.6, 20.7_

- [ ] 20.4 Validate security measures
  - Verify HTTPS is enforced
  - Verify JWT tokens are secure
  - Verify passwords are hashed
  - Verify rate limiting is active
  - Verify input validation is working
  - Verify file upload restrictions are enforced
  - Verify no sensitive data exposed in errors
  - _Requirements: 20.6, 20.7_

- [ ] 20.5 Validate performance benchmarks
  - Verify API response times are acceptable (<500ms for 95% of requests)
  - Verify database queries are optimized
  - Verify frontend load times are acceptable
  - Verify image loading is optimized
  - Verify pagination is working efficiently
  - Document any performance issues
  - _Requirements: 20.7_

- [ ] 20.6 Validate documentation
  - Verify API documentation is complete
  - Verify deployment guide is written
  - Verify troubleshooting guide is available
  - Verify environment setup is documented
  - Verify testing procedures are documented
  - Verify all README files are up to date
  - _Requirements: 20.2, 20.7_

- [ ] 20.7 Final production readiness checklist
  - All critical tests pass (100%)
  - Performance benchmarks met
  - Security audit completed
  - Data integrity validated
  - Frontend components functional
  - Documentation complete
  - Monitoring active
  - Backups configured
  - Create final production readiness report
  - Make go/no-go decision
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7_
