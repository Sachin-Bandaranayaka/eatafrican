-- Seed data for testing
-- This script creates sample data for development and testing purposes

-- Insert test users (passwords are hashed version of 'password123')
-- Note: In production, use bcrypt to hash passwords properly
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, language, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@eatafrican.ch', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'super_admin', 'Admin', 'User', '+41791234567', 'en', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'customer@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'customer', 'John', 'Doe', '+41791234568', 'en', 'active'),
  ('33333333-3333-3333-3333-333333333333', 'owner@restaurant.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'restaurant_owner', 'Maria', 'Garcia', '+41791234569', 'de', 'active'),
  ('44444444-4444-4444-4444-444444444444', 'driver@delivery.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'driver', 'Ahmed', 'Hassan', '+41791234570', 'fr', 'active'),
  ('55555555-5555-5555-5555-555555555555', 'customer2@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYvYOm', 'customer', 'Sarah', 'Smith', '+41791234571', 'it', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert test restaurants
INSERT INTO restaurants (id, owner_id, name, description, cuisine_types, address, city, postal_code, region, latitude, longitude, phone, email, min_order_amount, status, rating, total_ratings, opening_hours) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Ethiopian Delight', 'Authentic Ethiopian cuisine with traditional injera and wot', ARRAY['Ethiopian', 'East African'], 'Hauptstrasse 123', 'Basel', '4051', 'Basel', 47.5596, 7.5886, '+41612345678', 'info@ethiopiandelight.ch', 24.00, 'active', 4.5, 120, 
  '{"monday": {"open": "11:00", "close": "22:00"}, "tuesday": {"open": "11:00", "close": "22:00"}, "wednesday": {"open": "11:00", "close": "22:00"}, "thursday": {"open": "11:00", "close": "22:00"}, "friday": {"open": "11:00", "close": "23:00"}, "saturday": {"open": "11:00", "close": "23:00"}, "sunday": {"open": "12:00", "close": "21:00"}}'::jsonb),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'Kenyan Kitchen', 'Traditional Kenyan dishes and grilled specialties', ARRAY['Kenyan', 'East African'], 'Bahnhofstrasse 45', 'Zürich', '8001', 'Zürich', 47.3769, 8.5417, '+41443456789', 'info@kenyankitchen.ch', 24.00, 'active', 4.7, 85,
  '{"monday": {"open": "10:00", "close": "22:00"}, "tuesday": {"open": "10:00", "close": "22:00"}, "wednesday": {"open": "10:00", "close": "22:00"}, "thursday": {"open": "10:00", "close": "22:00"}, "friday": {"open": "10:00", "close": "23:00"}, "saturday": {"open": "10:00", "close": "23:00"}, "sunday": {"open": "11:00", "close": "21:00"}}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert test menu items
INSERT INTO menu_items (id, restaurant_id, name, description, price, category, meal_category, cuisine_type, dietary_tags, quantity, status) VALUES
  ('11111111-aaaa-aaaa-aaaa-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Doro Wot', 'Spicy chicken stew with hard-boiled eggs, served with injera', 18.50, 'meals', 'main_dishes', 'Ethiopian', ARRAY[]::varchar[], 50, 'active'),
  ('22222222-aaaa-aaaa-aaaa-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Vegetarian Combo', 'Assortment of vegetarian dishes including lentils, chickpeas, and vegetables', 16.00, 'meals', 'main_dishes', 'Ethiopian', ARRAY['vegetarian', 'vegan'], 50, 'active'),
  ('33333333-aaaa-aaaa-aaaa-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ethiopian Coffee', 'Traditional Ethiopian coffee ceremony', 4.50, 'drinks', NULL, 'Ethiopian', ARRAY['vegan'], 100, 'active'),
  ('44444444-bbbb-bbbb-bbbb-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Nyama Choma', 'Grilled goat meat with ugali and kachumbari', 22.00, 'meals', 'main_dishes', 'Kenyan', ARRAY[]::varchar[], 30, 'active'),
  ('55555555-bbbb-bbbb-bbbb-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Sukuma Wiki', 'Braised collard greens with tomatoes and onions', 12.00, 'meals', 'appetizers', 'Kenyan', ARRAY['vegetarian', 'vegan'], 50, 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert test driver
INSERT INTO drivers (id, user_id, license_number, vehicle_type, vehicle_plate, pickup_zone, status, rating, total_ratings, total_deliveries, total_earnings, documents_verified) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'CH-DL-123456', 'Motorcycle', 'ZH-12345', 'Basel', 'active', 4.8, 45, 120, 2400.00, true)
ON CONFLICT (id) DO NOTHING;

-- Insert test loyalty points
INSERT INTO loyalty_points (customer_id, points_balance, lifetime_points) VALUES
  ('22222222-2222-2222-2222-222222222222', 150, 350),
  ('55555555-5555-5555-5555-555555555555', 50, 50)
ON CONFLICT (customer_id) DO NOTHING;

-- Insert test vouchers
INSERT INTO vouchers (code, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, usage_count, valid_from, valid_until, status) VALUES
  ('WELCOME10', 'percentage', 10.00, 20.00, 5.00, 100, 15, NOW() - INTERVAL '7 days', NOW() + INTERVAL '30 days', 'active'),
  ('SUMMER20', 'percentage', 20.00, 30.00, 10.00, 50, 8, NOW() - INTERVAL '1 day', NOW() + INTERVAL '60 days', 'active'),
  ('FREESHIP', 'fixed_amount', 2.99, 15.00, NULL, NULL, 45, NOW() - INTERVAL '14 days', NOW() + INTERVAL '90 days', 'active')
ON CONFLICT (code) DO NOTHING;

-- Insert test order
INSERT INTO orders (id, customer_id, restaurant_id, driver_id, status, customer_email, customer_phone, customer_first_name, customer_last_name, delivery_address, delivery_city, delivery_postal_code, delivery_latitude, delivery_longitude, scheduled_delivery_time, subtotal, delivery_fee, discount_amount, tax_amount, total_amount, payment_status) VALUES
  ('oooooooo-oooo-oooo-oooo-oooooooooooo', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'delivered', 'customer@example.com', '+41791234568', 'John', 'Doe', 'Teststrasse 10', 'Basel', '4052', 47.5596, 7.5886, NOW() - INTERVAL '2 hours', 34.50, 2.99, 0.00, 0.00, 37.49, 'completed')
ON CONFLICT (id) DO NOTHING;

-- Insert test order items
INSERT INTO order_items (order_id, menu_item_id, name, price, quantity, subtotal) VALUES
  ('oooooooo-oooo-oooo-oooo-oooooooooooo', '11111111-aaaa-aaaa-aaaa-111111111111', 'Doro Wot', 18.50, 1, 18.50),
  ('oooooooo-oooo-oooo-oooo-oooooooooooo', '22222222-aaaa-aaaa-aaaa-222222222222', 'Vegetarian Combo', 16.00, 1, 16.00)
ON CONFLICT DO NOTHING;

-- Insert test loyalty transaction
INSERT INTO loyalty_transactions (customer_id, order_id, transaction_type, points, description) VALUES
  ('22222222-2222-2222-2222-222222222222', 'oooooooo-oooo-oooo-oooo-oooooooooooo', 'earned', 37, 'Points earned from order ORD-20250107-000001')
ON CONFLICT DO NOTHING;

-- Insert test notifications
INSERT INTO notifications (user_id, type, title, message, read) VALUES
  ('22222222-2222-2222-2222-222222222222', 'order_status', 'Order Delivered', 'Your order has been delivered successfully!', true),
  ('22222222-2222-2222-2222-222222222222', 'promotion', 'New Discount Available', 'Use code SUMMER20 for 20% off your next order!', false),
  ('33333333-3333-3333-3333-333333333333', 'account', 'Restaurant Approved', 'Your restaurant has been approved and is now live!', true)
ON CONFLICT DO NOTHING;

-- Insert test activity logs
INSERT INTO activity_logs (user_id, entity_type, entity_id, action, details) VALUES
  ('11111111-1111-1111-1111-111111111111', 'restaurant', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'approved', '{"status": "active", "approved_by": "admin@eatafrican.ch"}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'driver', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'approved', '{"status": "active", "approved_by": "admin@eatafrican.ch"}'::jsonb)
ON CONFLICT DO NOTHING;

-- Insert test favorites
INSERT INTO favorites (customer_id, menu_item_id) VALUES
  ('22222222-2222-2222-2222-222222222222', '11111111-aaaa-aaaa-aaaa-111111111111'),
  ('22222222-2222-2222-2222-222222222222', '44444444-bbbb-bbbb-bbbb-444444444444'),
  ('55555555-5555-5555-5555-555555555555', '22222222-aaaa-aaaa-aaaa-222222222222')
ON CONFLICT DO NOTHING;
