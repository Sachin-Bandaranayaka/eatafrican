-- Create cities table for managing delivery zones
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_cities_active ON cities(is_active);
CREATE INDEX idx_cities_display_order ON cities(display_order);

-- Insert initial cities
INSERT INTO cities (name, display_order, is_active) VALUES
  ('Basel', 1, true),
  ('Bern', 2, true),
  ('Luzern', 3, true),
  ('Olten', 4, true),
  ('Zürich', 5, true);

-- Add RLS policies
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active cities
CREATE POLICY "Anyone can view active cities"
  ON cities FOR SELECT
  USING (is_active = true);

-- Only super admins can modify cities
CREATE POLICY "Super admins can manage cities"
  ON cities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

-- Add trigger to update updated_at
CREATE TRIGGER update_cities_updated_at
  BEFORE UPDATE ON cities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
