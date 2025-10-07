-- Seed data for testing
-- This script creates comprehensive sample data for development and testing purposes
-- Password for all test users: 'password123' (hashed with bcrypt)

-- Clear existing data (optional - uncomment if you want to reset)
-- TRUNCATE TABLE activity_logs, notifications, favorites, loyalty_transactions, loyalty_points, order_items, orders, drivers, menu_items, restaurants, users CASCADE;

-- ============================================================================
-- USERS
-- ============================================================================
-- Insert test users (passwords are hashed version of 'password123')
-- Hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, language, status) VALUES
  -- Super Admin
  ('11111111-1111-1111-1111-111111111111', 'admin@eatafrican.ch', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'super_admin', 'Admin', 'User', '+41791234567', 'en', 'active'),
  
  -- Customers
  ('22222222-2222-2222-2222-222222222222', 'customer@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'customer', 'John', 'Doe', '+41791234568', 'en', 'active'),
  ('55555555-5555-5555-5555-555555555555', 'customer2@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'customer', 'Sarah', 'Smith', '+41791234571', 'de', 'active'),
  ('66666666-6666-6666-6666-666666666666', 'customer3@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'customer', 'Pierre', 'Dubois', '+41791234572', 'fr', 'active'),
  ('77777777-7777-7777-7777-777777777777', 'customer4@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'customer', 'Marco', 'Rossi', '+41791234573', 'it', 'active'),
  
  -- Restaurant Owners
  ('33333333-3333-3333-3333-333333333333', 'owner1@restaurant.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'restaurant_owner', 'Maria', 'Garcia', '+41791234569', 'de', 'active'),
  ('88888888-8888-8888-8888-888888888888', 'owner2@restaurant.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'restaurant_owner', 'Kwame', 'Mensah', '+41791234574', 'en', 'active'),
  ('99999999-9999-9999-9999-999999999999', 'owner3@restaurant.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'restaurant_owner', 'Amara', 'Okafor', '+41791234575', 'en', 'active'),
  ('aaaaaaaa-1111-1111-1111-111111111111', 'owner4@restaurant.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'restaurant_owner', 'Fatima', 'Diallo', '+41791234576', 'fr', 'active'),
  
  -- Drivers
  ('44444444-4444-4444-4444-444444444444', 'driver1@delivery.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'driver', 'Ahmed', 'Hassan', '+41791234570', 'fr', 'active'),
  ('bbbbbbbb-1111-1111-1111-111111111111', 'driver2@delivery.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'driver', 'Kofi', 'Agyeman', '+41791234577', 'en', 'active'),
  ('cccccccc-1111-1111-1111-111111111111', 'driver3@delivery.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'driver', 'Yusuf', 'Ali', '+41791234578', 'de', 'active'),
  ('dddddddd-1111-1111-1111-111111111111', 'driver4@delivery.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'driver', 'Chidi', 'Nwosu', '+41791234579', 'en', 'pending')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- RESTAURANTS
-- ============================================================================
INSERT INTO restaurants (id, owner_id, name, description, cuisine_types, address, city, postal_code, region, latitude, longitude, phone, email, min_order_amount, status, rating, total_ratings, opening_hours) VALUES
  -- Active Restaurants
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Ethiopian Delight', 'Authentic Ethiopian cuisine with traditional injera and wot', ARRAY['Ethiopian', 'East African'], 'Hauptstrasse 123', 'Basel', '4051', 'Basel', 47.5596, 7.5886, '+41612345678', 'info@ethiopiandelight.ch', 24.00, 'active', 4.5, 120, 
  '{"monday": {"open": "11:00", "close": "22:00"}, "tuesday": {"open": "11:00", "close": "22:00"}, "wednesday": {"open": "11:00", "close": "22:00"}, "thursday": {"open": "11:00", "close": "22:00"}, "friday": {"open": "11:00", "close": "23:00"}, "saturday": {"open": "11:00", "close": "23:00"}, "sunday": {"open": "12:00", "close": "21:00"}}'::jsonb),
  
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '88888888-8888-8888-8888-888888888888', 'Kenyan Kitchen', 'Traditional Kenyan dishes and grilled specialties', ARRAY['Kenyan', 'East African'], 'Bahnhofstrasse 45', 'Zürich', '8001', 'Zürich', 47.3769, 8.5417, '+41443456789', 'info@kenyankitchen.ch', 24.00, 'active', 4.7, 85,
  '{"monday": {"open": "10:00", "close": "22:00"}, "tuesday": {"open": "10:00", "close": "22:00"}, "wednesday": {"open": "10:00", "close": "22:00"}, "thursday": {"open": "10:00", "close": "22:00"}, "friday": {"open": "10:00", "close": "23:00"}, "saturday": {"open": "10:00", "close": "23:00"}, "sunday": {"open": "11:00", "close": "21:00"}}'::jsonb),
  
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '99999999-9999-9999-9999-999999999999', 'Nigerian Flavors', 'Delicious Nigerian jollof rice, suya, and more', ARRAY['Nigerian', 'West African'], 'Spitalstrasse 78', 'Bern', '3011', 'Bern', 46.9480, 7.4474, '+41313456789', 'info@nigerianflavors.ch', 24.00, 'active', 4.6, 95,
  '{"monday": {"open": "11:30", "close": "22:00"}, "tuesday": {"open": "11:30", "close": "22:00"}, "wednesday": {"open": "11:30", "close": "22:00"}, "thursday": {"open": "11:30", "close": "22:00"}, "friday": {"open": "11:30", "close": "23:30"}, "saturday": {"open": "11:30", "close": "23:30"}, "sunday": {"open": "12:00", "close": "21:00"}}'::jsonb),
  
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-1111-1111-1111-111111111111', 'Ghanaian Grill', 'Authentic Ghanaian cuisine and grilled dishes', ARRAY['Ghanaian', 'West African'], 'Pilatusstrasse 12', 'Luzern', '6003', 'Luzern', 47.0502, 8.3093, '+41413456789', 'info@ghanaiangrill.ch', 24.00, 'active', 4.4, 67,
  '{"monday": {"open": "11:00", "close": "22:00"}, "tuesday": {"open": "11:00", "close": "22:00"}, "wednesday": {"open": "11:00", "close": "22:00"}, "thursday": {"open": "11:00", "close": "22:00"}, "friday": {"open": "11:00", "close": "23:00"}, "saturday": {"open": "11:00", "close": "23:00"}, "sunday": {"open": "12:00", "close": "21:00"}}'::jsonb),
  
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'Eritrean Taste', 'Traditional Eritrean dishes with a modern twist', ARRAY['Eritrean', 'East African'], 'Ringstrasse 34', 'Olten', '4600', 'Olten', 47.3500, 7.9000, '+41623456789', 'info@eritreantaste.ch', 24.00, 'active', 4.8, 112,
  '{"monday": {"open": "11:00", "close": "22:00"}, "tuesday": {"open": "11:00", "close": "22:00"}, "wednesday": {"open": "11:00", "close": "22:00"}, "thursday": {"open": "11:00", "close": "22:00"}, "friday": {"open": "11:00", "close": "23:00"}, "saturday": {"open": "11:00", "close": "23:00"}, "sunday": {"open": "12:00", "close": "21:00"}}'::jsonb),
  
  -- Pending Restaurant (awaiting approval)
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '88888888-8888-8888-8888-888888888888', 'Senegalese Delights', 'Fresh Senegalese cuisine with seafood specialties', ARRAY['Senegalese', 'West African'], 'Marktgasse 56', 'Basel', '4051', 'Basel', 47.5596, 7.5886, '+41612345679', 'info@senegalese.ch', 24.00, 'pending', 0.0, 0,
  '{"monday": {"open": "11:00", "close": "22:00"}, "tuesday": {"open": "11:00", "close": "22:00"}, "wednesday": {"open": "11:00", "close": "22:00"}, "thursday": {"open": "11:00", "close": "22:00"}, "friday": {"open": "11:00", "close": "23:00"}, "saturday": {"open": "11:00", "close": "23:00"}, "sunday": {"open": "12:00", "close": "21:00"}}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- MENU ITEMS
-- ============================================================================
INSERT INTO menu_items (id, restaurant_id, name, description, price, category, meal_category, cuisine_type, dietary_tags, quantity, status, translations) VALUES
  -- Ethiopian Delight Menu
  ('11111111-aaaa-aaaa-aaaa-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Doro Wot', 'Spicy chicken stew with hard-boiled eggs, served with injera', 18.50, 'meals', 'main_dishes', 'Ethiopian', ARRAY[]::varchar[], 50, 'active',
  '{"de": {"name": "Doro Wot", "description": "Würziger Hühnereintopf mit hartgekochten Eiern, serviert mit Injera"}, "fr": {"name": "Doro Wot", "description": "Ragoût de poulet épicé avec œufs durs, servi avec injera"}}'::jsonb),
  
  ('22222222-aaaa-aaaa-aaaa-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Vegetarian Combo', 'Assortment of vegetarian dishes including lentils, chickpeas, and vegetables', 16.00, 'meals', 'main_dishes', 'Ethiopian', ARRAY['vegetarian', 'vegan'], 50, 'active',
  '{"de": {"name": "Vegetarisches Kombi", "description": "Auswahl an vegetarischen Gerichten mit Linsen, Kichererbsen und Gemüse"}, "fr": {"name": "Combo Végétarien", "description": "Assortiment de plats végétariens avec lentilles, pois chiches et légumes"}}'::jsonb),
  
  ('33333333-aaaa-aaaa-aaaa-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ethiopian Coffee', 'Traditional Ethiopian coffee ceremony', 4.50, 'drinks', NULL, 'Ethiopian', ARRAY['vegan'], 100, 'active', NULL),
  
  ('eeeeeeee-aaaa-aaaa-aaaa-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Kitfo', 'Ethiopian steak tartare with spiced butter and cottage cheese', 20.00, 'meals', 'main_dishes', 'Ethiopian', ARRAY[]::varchar[], 30, 'active', NULL),
  
  ('eeeeeeee-aaaa-aaaa-aaaa-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Tibs', 'Sautéed beef with vegetables and Ethiopian spices', 19.50, 'meals', 'main_dishes', 'Ethiopian', ARRAY[]::varchar[], 40, 'active', NULL),
  
  -- Kenyan Kitchen Menu
  ('44444444-bbbb-bbbb-bbbb-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Nyama Choma', 'Grilled goat meat with ugali and kachumbari', 22.00, 'meals', 'main_dishes', 'Kenyan', ARRAY[]::varchar[], 30, 'active', NULL),
  
  ('55555555-bbbb-bbbb-bbbb-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Sukuma Wiki', 'Braised collard greens with tomatoes and onions', 12.00, 'meals', 'appetizers', 'Kenyan', ARRAY['vegetarian', 'vegan'], 50, 'active', NULL),
  
  ('eeeeeeee-bbbb-bbbb-bbbb-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Ugali with Fish', 'Cornmeal ugali served with grilled tilapia', 21.00, 'meals', 'main_dishes', 'Kenyan', ARRAY[]::varchar[], 25, 'active', NULL),
  
  ('eeeeeeee-bbbb-bbbb-bbbb-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Kenyan Tea', 'Traditional spiced milk tea', 3.50, 'drinks', NULL, 'Kenyan', ARRAY['vegetarian'], 100, 'active', NULL),
  
  -- Nigerian Flavors Menu
  ('eeeeeeee-cccc-cccc-cccc-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Jollof Rice with Chicken', 'Famous Nigerian jollof rice with grilled chicken', 17.50, 'meals', 'main_dishes', 'Nigerian', ARRAY[]::varchar[], 60, 'active', NULL),
  
  ('eeeeeeee-cccc-cccc-cccc-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Suya Platter', 'Spicy grilled beef skewers with peanut spice', 19.00, 'meals', 'main_dishes', 'Nigerian', ARRAY[]::varchar[], 40, 'active', NULL),
  
  ('eeeeeeee-cccc-cccc-cccc-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Egusi Soup', 'Melon seed soup with vegetables and meat', 16.50, 'meals', 'main_dishes', 'Nigerian', ARRAY[]::varchar[], 35, 'active', NULL),
  
  ('eeeeeeee-cccc-cccc-cccc-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Puff Puff', 'Sweet fried dough balls', 5.00, 'meals', 'desserts', 'Nigerian', ARRAY['vegetarian'], 80, 'active', NULL),
  
  ('eeeeeeee-cccc-cccc-cccc-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Chapman', 'Nigerian fruit punch cocktail', 6.00, 'drinks', NULL, 'Nigerian', ARRAY['vegan'], 100, 'active', NULL),
  
  -- Ghanaian Grill Menu
  ('eeeeeeee-dddd-dddd-dddd-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Waakye', 'Rice and beans with spaghetti, egg, and stew', 15.00, 'meals', 'main_dishes', 'Ghanaian', ARRAY[]::varchar[], 50, 'active', NULL),
  
  ('eeeeeeee-dddd-dddd-dddd-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Banku with Tilapia', 'Fermented corn dough with grilled tilapia and pepper sauce', 20.00, 'meals', 'main_dishes', 'Ghanaian', ARRAY[]::varchar[], 30, 'active', NULL),
  
  ('eeeeeeee-dddd-dddd-dddd-333333333333', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Kelewele', 'Spicy fried plantains', 8.00, 'meals', 'appetizers', 'Ghanaian', ARRAY['vegan'], 60, 'active', NULL),
  
  ('eeeeeeee-dddd-dddd-dddd-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Sobolo', 'Hibiscus drink', 4.00, 'drinks', NULL, 'Ghanaian', ARRAY['vegan'], 100, 'active', NULL),
  
  -- Eritrean Taste Menu
  ('eeeeeeee-eeee-eeee-eeee-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Zigni', 'Spicy beef stew with berbere spice', 19.00, 'meals', 'main_dishes', 'Eritrean', ARRAY[]::varchar[], 40, 'active', NULL),
  
  ('eeeeeeee-eeee-eeee-eeee-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Shiro', 'Chickpea flour stew', 14.00, 'meals', 'main_dishes', 'Eritrean', ARRAY['vegetarian', 'vegan'], 50, 'active', NULL),
  
  ('eeeeeeee-eeee-eeee-eeee-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Ful', 'Fava bean stew with vegetables', 13.00, 'meals', 'main_dishes', 'Eritrean', ARRAY['vegetarian', 'vegan'], 45, 'active', NULL),
  
  -- Special Deals
  ('ffffffff-aaaa-aaaa-aaaa-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Weekend Special - Family Platter', 'Large platter with assorted Ethiopian dishes for 4 people', 65.00, 'special_deals', NULL, 'Ethiopian', ARRAY[]::varchar[], 20, 'active', NULL),
  
  ('ffffffff-bbbb-bbbb-bbbb-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Lunch Special', 'Choice of main dish with drink', 14.90, 'special_deals', NULL, 'Kenyan', ARRAY[]::varchar[], 30, 'active', NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- DRIVERS
-- ============================================================================
INSERT INTO drivers (id, user_id, license_number, vehicle_type, vehicle_plate, pickup_zone, status, rating, total_ratings, total_deliveries, total_earnings, documents_verified) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'CH-DL-123456', 'Motorcycle', 'BS-12345', 'Basel', 'active', 4.8, 45, 120, 2400.00, true),
  ('eeeeeeee-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-1111-1111-1111-111111111111', 'CH-DL-234567', 'Car', 'ZH-23456', 'Zürich', 'active', 4.7, 38, 95, 1900.00, true),
  ('ffffffff-dddd-dddd-dddd-dddddddddddd', 'cccccccc-1111-1111-1111-111111111111', 'CH-DL-345678', 'Bicycle', 'BE-34567', 'Bern', 'active', 4.9, 52, 140, 2100.00, true),
  ('gggggggg-dddd-dddd-dddd-dddddddddddd', 'dddddddd-1111-1111-1111-111111111111', 'CH-DL-456789', 'Motorcycle', 'LU-45678', 'Luzern', 'pending', 0.0, 0, 0, 0.00, false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- LOYALTY POINTS
-- ============================================================================
INSERT INTO loyalty_points (customer_id, points_balance, lifetime_points, referral_code) VALUES
  ('22222222-2222-2222-2222-222222222222', 150, 350, 'JOHN-REF-2024'),
  ('55555555-5555-5555-5555-555555555555', 50, 50, 'SARAH-REF-2024'),
  ('66666666-6666-6666-6666-666666666666', 200, 450, 'PIERRE-REF-2024'),
  ('77777777-7777-7777-7777-777777777777', 75, 125, 'MARCO-REF-2024')
ON CONFLICT (customer_id) DO NOTHING;

-- ============================================================================
-- VOUCHERS
-- ============================================================================
INSERT INTO vouchers (code, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, usage_count, valid_from, valid_until, status) VALUES
  -- Active vouchers
  ('WELCOME10', 'percentage', 10.00, 20.00, 5.00, 100, 15, NOW() - INTERVAL '7 days', NOW() + INTERVAL '30 days', 'active'),
  ('SUMMER20', 'percentage', 20.00, 30.00, 10.00, 50, 8, NOW() - INTERVAL '1 day', NOW() + INTERVAL '60 days', 'active'),
  ('FREESHIP', 'fixed_amount', 2.99, 15.00, NULL, NULL, 45, NOW() - INTERVAL '14 days', NOW() + INTERVAL '90 days', 'active'),
  ('LOYALTY10', 'percentage', 10.00, 25.00, 8.00, NULL, 0, NOW(), NOW() + INTERVAL '365 days', 'active'),
  ('LOYALTY20', 'percentage', 20.00, 40.00, 15.00, NULL, 0, NOW(), NOW() + INTERVAL '365 days', 'active'),
  ('LOYALTY50', 'percentage', 50.00, 50.00, 25.00, NULL, 0, NOW(), NOW() + INTERVAL '365 days', 'active'),
  ('NEWYEAR25', 'percentage', 25.00, 35.00, 12.00, 200, 45, NOW() - INTERVAL '3 days', NOW() + INTERVAL '20 days', 'active'),
  
  -- Expired voucher
  ('EXPIRED15', 'percentage', 15.00, 25.00, 7.00, 50, 50, NOW() - INTERVAL '60 days', NOW() - INTERVAL '5 days', 'expired')
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- ORDERS
-- ============================================================================
INSERT INTO orders (id, order_number, customer_id, restaurant_id, driver_id, status, customer_email, customer_phone, customer_first_name, customer_last_name, delivery_address, delivery_city, delivery_postal_code, delivery_latitude, delivery_longitude, scheduled_delivery_time, actual_delivery_time, subtotal, delivery_fee, discount_amount, tax_amount, total_amount, payment_status, payment_method, voucher_code, created_at) VALUES
  -- Delivered orders
  ('oooooooo-oooo-oooo-oooo-oooooooooooo', 'ORD-20250107-000001', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'delivered', 'customer@example.com', '+41791234568', 'John', 'Doe', 'Teststrasse 10', 'Basel', '4052', 47.5596, 7.5886, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours', 34.50, 2.99, 0.00, 0.00, 37.49, 'completed', 'card', NULL, NOW() - INTERVAL '3 hours'),
  
  ('11111111-oooo-oooo-oooo-111111111111', 'ORD-20250107-000002', '55555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'eeeeeeee-dddd-dddd-dddd-dddddddddddd', 'delivered', 'customer2@example.com', '+41791234571', 'Sarah', 'Smith', 'Bahnhofplatz 5', 'Zürich', '8001', 47.3769, 8.5417, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '4 hours', 43.00, 3.50, 4.30, 0.00, 42.20, 'completed', 'card', 'WELCOME10', NOW() - INTERVAL '5 hours'),
  
  ('22222222-oooo-oooo-oooo-222222222222', 'ORD-20250106-000001', '66666666-6666-6666-6666-666666666666', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'ffffffff-dddd-dddd-dddd-dddddddddddd', 'delivered', 'customer3@example.com', '+41791234572', 'Pierre', 'Dubois', 'Bundesplatz 12', 'Bern', '3011', 46.9480, 7.4474, NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours', 52.50, 4.00, 0.00, 0.00, 56.50, 'completed', 'card', NULL, NOW() - INTERVAL '1 day'),
  
  -- In transit orders
  ('33333333-oooo-oooo-oooo-333333333333', 'ORD-20250107-000003', '77777777-7777-7777-7777-777777777777', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'in_transit', 'customer4@example.com', '+41791234573', 'Marco', 'Rossi', 'Seestrasse 45', 'Luzern', '6003', 47.0502, 8.3093, NOW() + INTERVAL '30 minutes', NULL, 35.00, 3.20, 0.00, 0.00, 38.20, 'completed', 'card', NULL, NOW() - INTERVAL '45 minutes'),
  
  ('44444444-oooo-oooo-oooo-444444444444', 'ORD-20250107-000004', '22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'in_transit', 'customer@example.com', '+41791234568', 'John', 'Doe', 'Ringstrasse 78', 'Olten', '4600', 47.3500, 7.9000, NOW() + INTERVAL '20 minutes', NULL, 46.00, 3.80, 9.20, 0.00, 40.60, 'completed', 'card', 'SUMMER20', NOW() - INTERVAL '35 minutes'),
  
  -- Assigned orders (driver accepted, not picked up yet)
  ('55555555-oooo-oooo-oooo-555555555555', 'ORD-20250107-000005', '55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'assigned', 'customer2@example.com', '+41791234571', 'Sarah', 'Smith', 'Hauptstrasse 234', 'Basel', '4051', 47.5596, 7.5886, NOW() + INTERVAL '45 minutes', NULL, 32.00, 2.99, 0.00, 0.00, 34.99, 'completed', 'card', NULL, NOW() - INTERVAL '15 minutes'),
  
  -- Ready for pickup orders
  ('66666666-oooo-oooo-oooo-666666666666', 'ORD-20250107-000006', '66666666-6666-6666-6666-666666666666', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NULL, 'ready_for_pickup', 'customer3@example.com', '+41791234572', 'Pierre', 'Dubois', 'Limmatquai 89', 'Zürich', '8001', 47.3769, 8.5417, NOW() + INTERVAL '1 hour', NULL, 36.50, 3.50, 0.00, 0.00, 40.00, 'completed', 'card', NULL, NOW() - INTERVAL '25 minutes'),
  
  ('77777777-oooo-oooo-oooo-777777777777', 'ORD-20250107-000007', '77777777-7777-7777-7777-777777777777', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NULL, 'ready_for_pickup', 'customer4@example.com', '+41791234573', 'Marco', 'Rossi', 'Kramgasse 56', 'Bern', '3011', 46.9480, 7.4474, NOW() + INTERVAL '50 minutes', NULL, 33.50, 4.00, 0.00, 0.00, 37.50, 'completed', 'card', NULL, NOW() - INTERVAL '20 minutes'),
  
  -- Preparing orders
  ('88888888-oooo-oooo-oooo-888888888888', 'ORD-20250107-000008', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 'preparing', 'customer@example.com', '+41791234568', 'John', 'Doe', 'Teststrasse 10', 'Basel', '4052', 47.5596, 7.5886, NOW() + INTERVAL '1 hour 15 minutes', NULL, 39.50, 2.99, 0.00, 0.00, 42.49, 'completed', 'card', NULL, NOW() - INTERVAL '10 minutes'),
  
  ('99999999-oooo-oooo-oooo-999999999999', 'ORD-20250107-000009', '55555555-5555-5555-5555-555555555555', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NULL, 'preparing', 'customer2@example.com', '+41791234571', 'Sarah', 'Smith', 'Seestrasse 23', 'Luzern', '6003', 47.0502, 8.3093, NOW() + INTERVAL '1 hour 10 minutes', NULL, 28.00, 3.20, 0.00, 0.00, 31.20, 'completed', 'card', NULL, NOW() - INTERVAL '8 minutes'),
  
  -- Confirmed orders (restaurant confirmed, not started preparing)
  ('aaaaaaaa-oooo-oooo-oooo-aaaaaaaaaaaa', 'ORD-20250107-000010', '66666666-6666-6666-6666-666666666666', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NULL, 'confirmed', 'customer3@example.com', '+41791234572', 'Pierre', 'Dubois', 'Bahnhofstrasse 101', 'Zürich', '8001', 47.3769, 8.5417, NOW() + INTERVAL '1 hour 30 minutes', NULL, 57.00, 3.50, 0.00, 0.00, 60.50, 'completed', 'card', NULL, NOW() - INTERVAL '5 minutes'),
  
  -- New orders (just placed, awaiting restaurant confirmation)
  ('bbbbbbbb-oooo-oooo-oooo-bbbbbbbbbbbb', 'ORD-20250107-000011', '77777777-7777-7777-7777-777777777777', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NULL, 'new', 'customer4@example.com', '+41791234573', 'Marco', 'Rossi', 'Ringstrasse 34', 'Olten', '4600', 47.3500, 7.9000, NOW() + INTERVAL '1 hour 45 minutes', NULL, 33.00, 3.80, 0.00, 0.00, 36.80, 'completed', 'card', NULL, NOW() - INTERVAL '2 minutes'),
  
  ('cccccccc-oooo-oooo-oooo-cccccccccccc', 'ORD-20250107-000012', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NULL, 'new', 'customer@example.com', '+41791234568', 'John', 'Doe', 'Spitalstrasse 45', 'Bern', '3011', 46.9480, 7.4474, NOW() + INTERVAL '1 hour 40 minutes', NULL, 50.50, 4.00, 0.00, 0.00, 54.50, 'completed', 'card', NULL, NOW() - INTERVAL '1 minute'),
  
  -- Guest order (no customer_id)
  ('dddddddd-oooo-oooo-oooo-dddddddddddd', 'ORD-20250107-000013', NULL, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 'new', 'guest@example.com', '+41791234599', 'Guest', 'User', 'Hauptstrasse 456', 'Basel', '4051', 47.5596, 7.5886, NOW() + INTERVAL '2 hours', NULL, 34.50, 2.99, 0.00, 0.00, 37.49, 'pending', NULL, NULL, NOW() - INTERVAL '30 seconds'),
  
  -- Cancelled order
  ('eeeeeeee-oooo-oooo-oooo-eeeeeeeeeeee', 'ORD-20250106-000002', '55555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NULL, 'cancelled', 'customer2@example.com', '+41791234571', 'Sarah', 'Smith', 'Bahnhofplatz 5', 'Zürich', '8001', 47.3769, 8.5417, NOW() - INTERVAL '12 hours', NULL, 29.00, 3.50, 0.00, 0.00, 32.50, 'refunded', 'card', NULL, NOW() - INTERVAL '13 hours')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- ORDER ITEMS
-- ============================================================================
INSERT INTO order_items (order_id, menu_item_id, name, price, quantity, subtotal, special_instructions) VALUES
  -- Order 1 items
  ('oooooooo-oooo-oooo-oooo-oooooooooooo', '11111111-aaaa-aaaa-aaaa-111111111111', 'Doro Wot', 18.50, 1, 18.50, NULL),
  ('oooooooo-oooo-oooo-oooo-oooooooooooo', '22222222-aaaa-aaaa-aaaa-222222222222', 'Vegetarian Combo', 16.00, 1, 16.00, 'Extra spicy please'),
  
  -- Order 2 items
  ('11111111-oooo-oooo-oooo-111111111111', '44444444-bbbb-bbbb-bbbb-444444444444', 'Nyama Choma', 22.00, 1, 22.00, NULL),
  ('11111111-oooo-oooo-oooo-111111111111', '55555555-bbbb-bbbb-bbbb-555555555555', 'Sukuma Wiki', 12.00, 1, 12.00, NULL),
  ('11111111-oooo-oooo-oooo-111111111111', 'eeeeeeee-bbbb-bbbb-bbbb-222222222222', 'Kenyan Tea', 3.50, 2, 7.00, NULL),
  
  -- Order 3 items
  ('22222222-oooo-oooo-oooo-222222222222', 'eeeeeeee-cccc-cccc-cccc-111111111111', 'Jollof Rice with Chicken', 17.50, 2, 35.00, NULL),
  ('22222222-oooo-oooo-oooo-222222222222', 'eeeeeeee-cccc-cccc-cccc-222222222222', 'Suya Platter', 19.00, 1, 19.00, 'Medium spice'),
  
  -- Order 4 items
  ('33333333-oooo-oooo-oooo-333333333333', 'eeeeeeee-dddd-dddd-dddd-111111111111', 'Waakye', 15.00, 1, 15.00, NULL),
  ('33333333-oooo-oooo-oooo-333333333333', 'eeeeeeee-dddd-dddd-dddd-222222222222', 'Banku with Tilapia', 20.00, 1, 20.00, 'Well done fish'),
  
  -- Order 5 items
  ('44444444-oooo-oooo-oooo-444444444444', 'eeeeeeee-eeee-eeee-eeee-111111111111', 'Zigni', 19.00, 2, 38.00, NULL),
  ('44444444-oooo-oooo-oooo-444444444444', 'eeeeeeee-eeee-eeee-eeee-222222222222', 'Shiro', 14.00, 1, 14.00, NULL),
  
  -- Order 6 items
  ('55555555-oooo-oooo-oooo-555555555555', '11111111-aaaa-aaaa-aaaa-111111111111', 'Doro Wot', 18.50, 1, 18.50, NULL),
  ('55555555-oooo-oooo-oooo-555555555555', 'eeeeeeee-aaaa-aaaa-aaaa-111111111111', 'Kitfo', 20.00, 1, 20.00, 'Medium rare'),
  
  -- Order 7 items
  ('66666666-oooo-oooo-oooo-666666666666', '44444444-bbbb-bbbb-bbbb-444444444444', 'Nyama Choma', 22.00, 1, 22.00, NULL),
  ('66666666-oooo-oooo-oooo-666666666666', 'eeeeeeee-bbbb-bbbb-bbbb-111111111111', 'Ugali with Fish', 21.00, 1, 21.00, NULL),
  
  -- Order 8 items
  ('77777777-oooo-oooo-oooo-777777777777', 'eeeeeeee-cccc-cccc-cccc-333333333333', 'Egusi Soup', 16.50, 2, 33.00, NULL),
  ('77777777-oooo-oooo-oooo-777777777777', 'eeeeeeee-cccc-cccc-cccc-555555555555', 'Chapman', 6.00, 1, 6.00, NULL),
  
  -- Order 9 items
  ('88888888-oooo-oooo-oooo-888888888888', 'eeeeeeee-aaaa-aaaa-aaaa-222222222222', 'Tibs', 19.50, 2, 39.00, NULL),
  ('88888888-oooo-oooo-oooo-888888888888', '33333333-aaaa-aaaa-aaaa-333333333333', 'Ethiopian Coffee', 4.50, 1, 4.50, NULL),
  
  -- Order 10 items
  ('99999999-oooo-oooo-oooo-999999999999', 'eeeeeeee-dddd-dddd-dddd-111111111111', 'Waakye', 15.00, 1, 15.00, NULL),
  ('99999999-oooo-oooo-oooo-999999999999', 'eeeeeeee-dddd-dddd-dddd-333333333333', 'Kelewele', 8.00, 1, 8.00, NULL),
  ('99999999-oooo-oooo-oooo-999999999999', 'eeeeeeee-dddd-dddd-dddd-444444444444', 'Sobolo', 4.00, 1, 4.00, NULL),
  
  -- Order 11 items
  ('aaaaaaaa-oooo-oooo-oooo-aaaaaaaaaaaa', 'ffffffff-bbbb-bbbb-bbbb-111111111111', 'Lunch Special', 14.90, 2, 29.80, NULL),
  ('aaaaaaaa-oooo-oooo-oooo-aaaaaaaaaaaa', '44444444-bbbb-bbbb-bbbb-444444444444', 'Nyama Choma', 22.00, 1, 22.00, NULL),
  ('aaaaaaaa-oooo-oooo-oooo-aaaaaaaaaaaa', 'eeeeeeee-bbbb-bbbb-bbbb-222222222222', 'Kenyan Tea', 3.50, 2, 7.00, NULL),
  
  -- Order 12 items
  ('bbbbbbbb-oooo-oooo-oooo-bbbbbbbbbbbb', 'eeeeeeee-eeee-eeee-eeee-111111111111', 'Zigni', 19.00, 1, 19.00, NULL),
  ('bbbbbbbb-oooo-oooo-oooo-bbbbbbbbbbbb', 'eeeeeeee-eeee-eeee-eeee-333333333333', 'Ful', 13.00, 1, 13.00, NULL),
  
  -- Order 13 items
  ('cccccccc-oooo-oooo-oooo-cccccccccccc', 'eeeeeeee-cccc-cccc-cccc-111111111111', 'Jollof Rice with Chicken', 17.50, 2, 35.00, NULL),
  ('cccccccc-oooo-oooo-oooo-cccccccccccc', 'eeeeeeee-cccc-cccc-cccc-222222222222', 'Suya Platter', 19.00, 1, 19.00, NULL),
  
  -- Order 14 items (guest order)
  ('dddddddd-oooo-oooo-oooo-dddddddddddd', '11111111-aaaa-aaaa-aaaa-111111111111', 'Doro Wot', 18.50, 1, 18.50, NULL),
  ('dddddddd-oooo-oooo-oooo-dddddddddddd', '22222222-aaaa-aaaa-aaaa-222222222222', 'Vegetarian Combo', 16.00, 1, 16.00, NULL),
  
  -- Order 15 items (cancelled)
  ('eeeeeeee-oooo-oooo-oooo-eeeeeeeeeeee', '55555555-bbbb-bbbb-bbbb-555555555555', 'Sukuma Wiki', 12.00, 1, 12.00, NULL),
  ('eeeeeeee-oooo-oooo-oooo-eeeeeeeeeeee', 'eeeeeeee-bbbb-bbbb-bbbb-111111111111', 'Ugali with Fish', 21.00, 1, 21.00, NULL)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- LOYALTY TRANSACTIONS
-- ============================================================================
INSERT INTO loyalty_transactions (customer_id, order_id, transaction_type, points, description, created_at) VALUES
  -- Earned points from orders
  ('22222222-2222-2222-2222-222222222222', 'oooooooo-oooo-oooo-oooo-oooooooooooo', 'earned', 37, 'Points earned from order ORD-20250107-000001', NOW() - INTERVAL '2 hours'),
  ('55555555-5555-5555-5555-555555555555', '11111111-oooo-oooo-oooo-111111111111', 'earned', 42, 'Points earned from order ORD-20250107-000002', NOW() - INTERVAL '4 hours'),
  ('66666666-6666-6666-6666-666666666666', '22222222-oooo-oooo-oooo-222222222222', 'earned', 56, 'Points earned from order ORD-20250106-000001', NOW() - INTERVAL '23 hours'),
  ('77777777-7777-7777-7777-777777777777', '33333333-oooo-oooo-oooo-333333333333', 'earned', 38, 'Points earned from order ORD-20250107-000003', NOW() - INTERVAL '45 minutes'),
  ('22222222-2222-2222-2222-222222222222', '44444444-oooo-oooo-oooo-444444444444', 'earned', 40, 'Points earned from order ORD-20250107-000004', NOW() - INTERVAL '35 minutes'),
  
  -- Redeemed points
  ('22222222-2222-2222-2222-222222222222', NULL, 'redeemed', -100, 'Redeemed 10% discount voucher', NOW() - INTERVAL '5 days'),
  ('66666666-6666-6666-6666-666666666666', NULL, 'redeemed', -200, 'Redeemed 20% discount voucher', NOW() - INTERVAL '10 days'),
  ('77777777-7777-7777-7777-777777777777', NULL, 'redeemed', -50, 'Redeemed 10% discount voucher', NOW() - INTERVAL '3 days'),
  
  -- Referral bonuses
  ('22222222-2222-2222-2222-222222222222', NULL, 'referral_bonus', 50, 'Referral bonus for new customer signup', NOW() - INTERVAL '15 days'),
  ('66666666-6666-6666-6666-666666666666', NULL, 'referral_bonus', 50, 'Referral bonus for new customer signup', NOW() - INTERVAL '20 days')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================
INSERT INTO notifications (user_id, type, title, message, data, read, created_at) VALUES
  -- Customer notifications
  ('22222222-2222-2222-2222-222222222222', 'order_status', 'Order Delivered', 'Your order has been delivered successfully!', '{"order_id": "oooooooo-oooo-oooo-oooo-oooooooooooo", "order_number": "ORD-20250107-000001"}'::jsonb, true, NOW() - INTERVAL '2 hours'),
  ('22222222-2222-2222-2222-222222222222', 'order_status', 'Driver on the way', 'Your driver is on the way with your order', '{"order_id": "44444444-oooo-oooo-oooo-444444444444", "order_number": "ORD-20250107-000004"}'::jsonb, false, NOW() - INTERVAL '35 minutes'),
  ('22222222-2222-2222-2222-222222222222', 'promotion', 'New Discount Available', 'Use code SUMMER20 for 20% off your next order!', '{"voucher_code": "SUMMER20"}'::jsonb, false, NOW() - INTERVAL '1 day'),
  ('22222222-2222-2222-2222-222222222222', 'account', 'Loyalty Points Earned', 'You earned 37 points from your recent order!', '{"points": 37}'::jsonb, true, NOW() - INTERVAL '2 hours'),
  
  ('55555555-5555-5555-5555-555555555555', 'order_status', 'Order Delivered', 'Your order has been delivered successfully!', '{"order_id": "11111111-oooo-oooo-oooo-111111111111", "order_number": "ORD-20250107-000002"}'::jsonb, true, NOW() - INTERVAL '4 hours'),
  ('55555555-5555-5555-5555-555555555555', 'order_status', 'Order Preparing', 'Your order is being prepared', '{"order_id": "99999999-oooo-oooo-oooo-999999999999", "order_number": "ORD-20250107-000009"}'::jsonb, false, NOW() - INTERVAL '8 minutes'),
  
  ('66666666-6666-6666-6666-666666666666', 'order_status', 'Order Ready for Pickup', 'Your order is ready and waiting for a driver', '{"order_id": "66666666-oooo-oooo-oooo-666666666666", "order_number": "ORD-20250107-000006"}'::jsonb, false, NOW() - INTERVAL '25 minutes'),
  ('66666666-6666-6666-6666-666666666666', 'order_status', 'Order Confirmed', 'Your order has been confirmed by the restaurant', '{"order_id": "aaaaaaaa-oooo-oooo-oooo-aaaaaaaaaaaa", "order_number": "ORD-20250107-000010"}'::jsonb, false, NOW() - INTERVAL '5 minutes'),
  
  ('77777777-7777-7777-7777-777777777777', 'order_status', 'Driver on the way', 'Your driver is on the way with your order', '{"order_id": "33333333-oooo-oooo-oooo-333333333333", "order_number": "ORD-20250107-000003"}'::jsonb, false, NOW() - INTERVAL '45 minutes'),
  ('77777777-7777-7777-7777-777777777777', 'order_status', 'New Order Placed', 'Your order has been placed successfully', '{"order_id": "bbbbbbbb-oooo-oooo-oooo-bbbbbbbbbbbb", "order_number": "ORD-20250107-000011"}'::jsonb, false, NOW() - INTERVAL '2 minutes'),
  
  -- Restaurant owner notifications
  ('33333333-3333-3333-3333-333333333333', 'account', 'Restaurant Approved', 'Your restaurant Ethiopian Delight has been approved and is now live!', '{"restaurant_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"}'::jsonb, true, NOW() - INTERVAL '30 days'),
  ('33333333-3333-3333-3333-333333333333', 'order_status', 'New Order Received', 'You have a new order #ORD-20250107-000008', '{"order_id": "88888888-oooo-oooo-oooo-888888888888", "order_number": "ORD-20250107-000008"}'::jsonb, false, NOW() - INTERVAL '10 minutes'),
  ('33333333-3333-3333-3333-333333333333', 'order_status', 'New Order Received', 'You have a new order #ORD-20250107-000005', '{"order_id": "55555555-oooo-oooo-oooo-555555555555", "order_number": "ORD-20250107-000005"}'::jsonb, true, NOW() - INTERVAL '15 minutes'),
  
  ('88888888-8888-8888-8888-888888888888', 'account', 'Restaurant Approved', 'Your restaurant Kenyan Kitchen has been approved and is now live!', '{"restaurant_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"}'::jsonb, true, NOW() - INTERVAL '25 days'),
  ('88888888-8888-8888-8888-888888888888', 'order_status', 'New Order Received', 'You have a new order #ORD-20250107-000010', '{"order_id": "aaaaaaaa-oooo-oooo-oooo-aaaaaaaaaaaa", "order_number": "ORD-20250107-000010"}'::jsonb, false, NOW() - INTERVAL '5 minutes'),
  ('88888888-8888-8888-8888-888888888888', 'account', 'Restaurant Pending Approval', 'Your restaurant Senegalese Delights is pending approval', '{"restaurant_id": "ffffffff-ffff-ffff-ffff-ffffffffffff"}'::jsonb, false, NOW() - INTERVAL '2 days'),
  
  ('99999999-9999-9999-9999-999999999999', 'account', 'Restaurant Approved', 'Your restaurant Nigerian Flavors has been approved and is now live!', '{"restaurant_id": "cccccccc-cccc-cccc-cccc-cccccccccccc"}'::jsonb, true, NOW() - INTERVAL '20 days'),
  
  ('aaaaaaaa-1111-1111-1111-111111111111', 'account', 'Restaurant Approved', 'Your restaurant Ghanaian Grill has been approved and is now live!', '{"restaurant_id": "dddddddd-dddd-dddd-dddd-dddddddddddd"}'::jsonb, true, NOW() - INTERVAL '18 days'),
  
  -- Driver notifications
  ('44444444-4444-4444-4444-444444444444', 'account', 'Driver Approved', 'Your driver account has been approved. You can now accept deliveries!', '{"driver_id": "dddddddd-dddd-dddd-dddd-dddddddddddd"}'::jsonb, true, NOW() - INTERVAL '35 days'),
  ('44444444-4444-4444-4444-444444444444', 'order_status', 'Order Assigned', 'You have been assigned order #ORD-20250107-000005', '{"order_id": "55555555-oooo-oooo-oooo-555555555555", "order_number": "ORD-20250107-000005"}'::jsonb, false, NOW() - INTERVAL '15 minutes'),
  ('44444444-4444-4444-4444-444444444444', 'order_status', 'Delivery Completed', 'You completed delivery for order #ORD-20250107-000001. Earnings: Fr. 2.99', '{"order_id": "oooooooo-oooo-oooo-oooo-oooooooooooo", "earnings": 2.99}'::jsonb, true, NOW() - INTERVAL '2 hours'),
  
  ('bbbbbbbb-1111-1111-1111-111111111111', 'account', 'Driver Approved', 'Your driver account has been approved. You can now accept deliveries!', '{"driver_id": "eeeeeeee-dddd-dddd-dddd-dddddddddddd"}'::jsonb, true, NOW() - INTERVAL '30 days'),
  ('bbbbbbbb-1111-1111-1111-111111111111', 'order_status', 'Delivery Completed', 'You completed delivery for order #ORD-20250107-000002. Earnings: Fr. 3.50', '{"order_id": "11111111-oooo-oooo-oooo-111111111111", "earnings": 3.50}'::jsonb, true, NOW() - INTERVAL '4 hours'),
  
  ('cccccccc-1111-1111-1111-111111111111', 'account', 'Driver Approved', 'Your driver account has been approved. You can now accept deliveries!', '{"driver_id": "ffffffff-dddd-dddd-dddd-dddddddddddd"}'::jsonb, true, NOW() - INTERVAL '28 days'),
  
  ('dddddddd-1111-1111-1111-111111111111', 'account', 'Driver Application Received', 'Your driver application is under review', '{"driver_id": "gggggggg-dddd-dddd-dddd-dddddddddddd"}'::jsonb, false, NOW() - INTERVAL '3 days'),
  
  -- Admin notifications
  ('11111111-1111-1111-1111-111111111111', 'system', 'New Restaurant Registration', 'Senegalese Delights has registered and is pending approval', '{"restaurant_id": "ffffffff-ffff-ffff-ffff-ffffffffffff"}'::jsonb, false, NOW() - INTERVAL '2 days'),
  ('11111111-1111-1111-1111-111111111111', 'system', 'New Driver Application', 'Chidi Nwosu has applied to become a driver', '{"driver_id": "gggggggg-dddd-dddd-dddd-dddddddddddd"}'::jsonb, false, NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- ACTIVITY LOGS
-- ============================================================================
INSERT INTO activity_logs (user_id, entity_type, entity_id, action, details, ip_address, created_at) VALUES
  -- Restaurant approvals
  ('11111111-1111-1111-1111-111111111111', 'restaurant', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'approved', '{"status": "active", "approved_by": "admin@eatafrican.ch", "restaurant_name": "Ethiopian Delight"}'::jsonb, '192.168.1.100', NOW() - INTERVAL '30 days'),
  ('11111111-1111-1111-1111-111111111111', 'restaurant', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'approved', '{"status": "active", "approved_by": "admin@eatafrican.ch", "restaurant_name": "Kenyan Kitchen"}'::jsonb, '192.168.1.100', NOW() - INTERVAL '25 days'),
  ('11111111-1111-1111-1111-111111111111', 'restaurant', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'approved', '{"status": "active", "approved_by": "admin@eatafrican.ch", "restaurant_name": "Nigerian Flavors"}'::jsonb, '192.168.1.100', NOW() - INTERVAL '20 days'),
  ('11111111-1111-1111-1111-111111111111', 'restaurant', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'approved', '{"status": "active", "approved_by": "admin@eatafrican.ch", "restaurant_name": "Ghanaian Grill"}'::jsonb, '192.168.1.100', NOW() - INTERVAL '18 days'),
  ('11111111-1111-1111-1111-111111111111', 'restaurant', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'approved', '{"status": "active", "approved_by": "admin@eatafrican.ch", "restaurant_name": "Eritrean Taste"}'::jsonb, '192.168.1.100', NOW() - INTERVAL '15 days'),
  
  -- Driver approvals
  ('11111111-1111-1111-1111-111111111111', 'driver', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'approved', '{"status": "active", "approved_by": "admin@eatafrican.ch", "driver_name": "Ahmed Hassan"}'::jsonb, '192.168.1.100', NOW() - INTERVAL '35 days'),
  ('11111111-1111-1111-1111-111111111111', 'driver', 'eeeeeeee-dddd-dddd-dddd-dddddddddddd', 'approved', '{"status": "active", "approved_by": "admin@eatafrican.ch", "driver_name": "Kofi Agyeman"}'::jsonb, '192.168.1.100', NOW() - INTERVAL '30 days'),
  ('11111111-1111-1111-1111-111111111111', 'driver', 'ffffffff-dddd-dddd-dddd-dddddddddddd', 'approved', '{"status": "active", "approved_by": "admin@eatafrican.ch", "driver_name": "Yusuf Ali"}'::jsonb, '192.168.1.100', NOW() - INTERVAL '28 days'),
  
  -- Restaurant owner actions
  ('33333333-3333-3333-3333-333333333333', 'restaurant', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'updated', '{"field": "opening_hours", "action": "updated opening hours"}'::jsonb, '192.168.1.101', NOW() - INTERVAL '10 days'),
  ('33333333-3333-3333-3333-333333333333', 'menu_item', '11111111-aaaa-aaaa-aaaa-111111111111', 'created', '{"item_name": "Doro Wot", "price": 18.50}'::jsonb, '192.168.1.101', NOW() - INTERVAL '29 days'),
  ('33333333-3333-3333-3333-333333333333', 'menu_item', '22222222-aaaa-aaaa-aaaa-222222222222', 'created', '{"item_name": "Vegetarian Combo", "price": 16.00}'::jsonb, '192.168.1.101', NOW() - INTERVAL '29 days'),
  ('33333333-3333-3333-3333-333333333333', 'order', '88888888-oooo-oooo-oooo-888888888888', 'status_changed', '{"from": "new", "to": "preparing", "order_number": "ORD-20250107-000008"}'::jsonb, '192.168.1.101', NOW() - INTERVAL '10 minutes'),
  
  ('88888888-8888-8888-8888-888888888888', 'restaurant', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'updated', '{"field": "description", "action": "updated restaurant description"}'::jsonb, '192.168.1.102', NOW() - INTERVAL '15 days'),
  ('88888888-8888-8888-8888-888888888888', 'restaurant', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'created', '{"restaurant_name": "Senegalese Delights", "status": "pending"}'::jsonb, '192.168.1.102', NOW() - INTERVAL '2 days'),
  
  -- Driver actions
  ('44444444-4444-4444-4444-444444444444', 'order', '55555555-oooo-oooo-oooo-555555555555', 'accepted', '{"order_number": "ORD-20250107-000005", "pickup_zone": "Basel"}'::jsonb, '192.168.1.103', NOW() - INTERVAL '15 minutes'),
  ('44444444-4444-4444-4444-444444444444', 'order', 'oooooooo-oooo-oooo-oooo-oooooooooooo', 'delivered', '{"order_number": "ORD-20250107-000001", "delivery_time": "45 minutes"}'::jsonb, '192.168.1.103', NOW() - INTERVAL '2 hours'),
  ('44444444-4444-4444-4444-444444444444', 'order', '44444444-oooo-oooo-oooo-444444444444', 'picked_up', '{"order_number": "ORD-20250107-000004", "restaurant": "Eritrean Taste"}'::jsonb, '192.168.1.103', NOW() - INTERVAL '35 minutes'),
  
  ('bbbbbbbb-1111-1111-1111-111111111111', 'order', '11111111-oooo-oooo-oooo-111111111111', 'delivered', '{"order_number": "ORD-20250107-000002", "delivery_time": "52 minutes"}'::jsonb, '192.168.1.104', NOW() - INTERVAL '4 hours'),
  
  ('cccccccc-1111-1111-1111-111111111111', 'order', '22222222-oooo-oooo-oooo-222222222222', 'delivered', '{"order_number": "ORD-20250106-000001", "delivery_time": "48 minutes"}'::jsonb, '192.168.1.105', NOW() - INTERVAL '23 hours'),
  
  -- Customer actions
  ('22222222-2222-2222-2222-222222222222', 'order', 'oooooooo-oooo-oooo-oooo-oooooooooooo', 'created', '{"order_number": "ORD-20250107-000001", "total": 37.49}'::jsonb, '192.168.1.106', NOW() - INTERVAL '3 hours'),
  ('22222222-2222-2222-2222-222222222222', 'order', '44444444-oooo-oooo-oooo-444444444444', 'created', '{"order_number": "ORD-20250107-000004", "total": 40.60, "voucher": "SUMMER20"}'::jsonb, '192.168.1.106', NOW() - INTERVAL '35 minutes'),
  ('22222222-2222-2222-2222-222222222222', 'loyalty', NULL, 'redeemed', '{"points": 100, "reward": "10% discount voucher"}'::jsonb, '192.168.1.106', NOW() - INTERVAL '5 days'),
  
  ('55555555-5555-5555-5555-555555555555', 'order', '11111111-oooo-oooo-oooo-111111111111', 'created', '{"order_number": "ORD-20250107-000002", "total": 42.20, "voucher": "WELCOME10"}'::jsonb, '192.168.1.107', NOW() - INTERVAL '5 hours'),
  ('55555555-5555-5555-5555-555555555555', 'order', 'eeeeeeee-oooo-oooo-oooo-eeeeeeeeeeee', 'cancelled', '{"order_number": "ORD-20250106-000002", "reason": "Changed mind"}'::jsonb, '192.168.1.107', NOW() - INTERVAL '12 hours'),
  
  -- Admin settings changes
  ('11111111-1111-1111-1111-111111111111', 'settings', NULL, 'updated', '{"setting": "delivery_radius", "value": "15km", "region": "Basel"}'::jsonb, '192.168.1.100', NOW() - INTERVAL '7 days'),
  ('11111111-1111-1111-1111-111111111111', 'voucher', NULL, 'created', '{"code": "NEWYEAR25", "discount": "25%"}'::jsonb, '192.168.1.100', NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- FAVORITES
-- ============================================================================
INSERT INTO favorites (customer_id, menu_item_id, created_at) VALUES
  -- John's favorites
  ('22222222-2222-2222-2222-222222222222', '11111111-aaaa-aaaa-aaaa-111111111111', NOW() - INTERVAL '20 days'),
  ('22222222-2222-2222-2222-222222222222', '44444444-bbbb-bbbb-bbbb-444444444444', NOW() - INTERVAL '15 days'),
  ('22222222-2222-2222-2222-222222222222', 'eeeeeeee-aaaa-aaaa-aaaa-111111111111', NOW() - INTERVAL '10 days'),
  ('22222222-2222-2222-2222-222222222222', 'eeeeeeee-cccc-cccc-cccc-111111111111', NOW() - INTERVAL '8 days'),
  
  -- Sarah's favorites
  ('55555555-5555-5555-5555-555555555555', '22222222-aaaa-aaaa-aaaa-222222222222', NOW() - INTERVAL '18 days'),
  ('55555555-5555-5555-5555-555555555555', '55555555-bbbb-bbbb-bbbb-555555555555', NOW() - INTERVAL '12 days'),
  ('55555555-5555-5555-5555-555555555555', 'eeeeeeee-dddd-dddd-dddd-333333333333', NOW() - INTERVAL '7 days'),
  
  -- Pierre's favorites
  ('66666666-6666-6666-6666-666666666666', 'eeeeeeee-cccc-cccc-cccc-222222222222', NOW() - INTERVAL '14 days'),
  ('66666666-6666-6666-6666-666666666666', 'eeeeeeee-eeee-eeee-eeee-111111111111', NOW() - INTERVAL '9 days'),
  ('66666666-6666-6666-6666-666666666666', 'eeeeeeee-dddd-dddd-dddd-222222222222', NOW() - INTERVAL '6 days'),
  
  -- Marco's favorites
  ('77777777-7777-7777-7777-777777777777', 'eeeeeeee-dddd-dddd-dddd-111111111111', NOW() - INTERVAL '11 days'),
  ('77777777-7777-7777-7777-777777777777', 'eeeeeeee-eeee-eeee-eeee-222222222222', NOW() - INTERVAL '5 days'),
  ('77777777-7777-7777-7777-777777777777', '44444444-bbbb-bbbb-bbbb-444444444444', NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED DATA SUMMARY
-- ============================================================================
-- Users: 13 (1 admin, 4 customers, 4 restaurant owners, 4 drivers)
-- Restaurants: 6 (5 active, 1 pending)
-- Menu Items: 23 across all restaurants
-- Drivers: 4 (3 active, 1 pending)
-- Orders: 15 (various statuses: delivered, in_transit, assigned, ready_for_pickup, preparing, confirmed, new, cancelled)
-- Order Items: 40+ items across all orders
-- Loyalty Points: 4 customers with points
-- Loyalty Transactions: 10 transactions (earned, redeemed, referral bonuses)
-- Vouchers: 8 (7 active, 1 expired)
-- Notifications: 30+ notifications for various users
-- Activity Logs: 30+ activity log entries
-- Favorites: 13 favorite items across customers
