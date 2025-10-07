-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Super admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Restaurants table policies
CREATE POLICY "Anyone can view active restaurants"
  ON restaurants FOR SELECT
  USING (status = 'active' OR owner_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Restaurant owners can create restaurants"
  ON restaurants FOR INSERT
  WITH CHECK (
    owner_id::text = auth.uid()::text AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'restaurant_owner'
    )
  );

CREATE POLICY "Restaurant owners can update their restaurants"
  ON restaurants FOR UPDATE
  USING (
    owner_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'super_admin'
    )
  );

-- Menu items table policies
CREATE POLICY "Anyone can view active menu items"
  ON menu_items FOR SELECT
  USING (
    status = 'active' OR
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = menu_items.restaurant_id
      AND restaurants.owner_id::text = auth.uid()::text
    ) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Restaurant owners can manage their menu items"
  ON menu_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = menu_items.restaurant_id
      AND restaurants.owner_id::text = auth.uid()::text
    )
  );

-- Orders table policies
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (
    customer_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = orders.restaurant_id
      AND restaurants.owner_id::text = auth.uid()::text
    ) OR
    EXISTS (
      SELECT 1 FROM drivers
      WHERE drivers.id = orders.driver_id
      AND drivers.user_id::text = auth.uid()::text
    ) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Authenticated users can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authorized users can update orders"
  ON orders FOR UPDATE
  USING (
    customer_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = orders.restaurant_id
      AND restaurants.owner_id::text = auth.uid()::text
    ) OR
    EXISTS (
      SELECT 1 FROM drivers
      WHERE drivers.id = orders.driver_id
      AND drivers.user_id::text = auth.uid()::text
    ) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'super_admin'
    )
  );

-- Order items table policies
CREATE POLICY "Users can view order items for their orders"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (
        orders.customer_id::text = auth.uid()::text OR
        EXISTS (
          SELECT 1 FROM restaurants
          WHERE restaurants.id = orders.restaurant_id
          AND restaurants.owner_id::text = auth.uid()::text
        ) OR
        EXISTS (
          SELECT 1 FROM drivers
          WHERE drivers.id = orders.driver_id
          AND drivers.user_id::text = auth.uid()::text
        ) OR
        EXISTS (
          SELECT 1 FROM users
          WHERE id::text = auth.uid()::text
          AND role = 'super_admin'
        )
      )
    )
  );

CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- Drivers table policies
CREATE POLICY "Anyone can view active drivers"
  ON drivers FOR SELECT
  USING (
    status = 'active' OR
    user_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Users can create driver profiles"
  ON drivers FOR INSERT
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Drivers can update their own profiles"
  ON drivers FOR UPDATE
  USING (
    user_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'super_admin'
    )
  );

-- Loyalty points table policies
CREATE POLICY "Users can view their own loyalty points"
  ON loyalty_points FOR SELECT
  USING (
    customer_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'super_admin'
    )
  );

CREATE POLICY "System can manage loyalty points"
  ON loyalty_points FOR ALL
  USING (true);

-- Loyalty transactions table policies
CREATE POLICY "Users can view their own loyalty transactions"
  ON loyalty_transactions FOR SELECT
  USING (
    customer_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'super_admin'
    )
  );

CREATE POLICY "System can create loyalty transactions"
  ON loyalty_transactions FOR INSERT
  WITH CHECK (true);

-- Vouchers table policies
CREATE POLICY "Anyone can view active vouchers"
  ON vouchers FOR SELECT
  USING (
    status = 'active' OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage vouchers"
  ON vouchers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'super_admin'
    )
  );

-- Favorites table policies
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (customer_id::text = auth.uid()::text);

CREATE POLICY "Users can manage their own favorites"
  ON favorites FOR ALL
  USING (customer_id::text = auth.uid()::text);

-- Notifications table policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Activity logs table policies
CREATE POLICY "Super admins can view all activity logs"
  ON activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'super_admin'
    )
  );

CREATE POLICY "System can create activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (true);
