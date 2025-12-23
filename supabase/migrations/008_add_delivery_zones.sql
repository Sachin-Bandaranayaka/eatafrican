-- Add delivery_zones column to cities table
ALTER TABLE cities ADD COLUMN IF NOT EXISTS delivery_zones TEXT[] DEFAULT '{}';

-- Update existing cities with sample delivery zones
UPDATE cities SET delivery_zones = ARRAY['4000', '4001', '4002', '4003', '4004', '4005'] WHERE name = 'Basel';
UPDATE cities SET delivery_zones = ARRAY['3000', '3001', '3002', '3003', '3004', '3005'] WHERE name = 'Bern';
UPDATE cities SET delivery_zones = ARRAY['6000', '6001', '6002', '6003', '6004', '6005'] WHERE name = 'Luzern';
UPDATE cities SET delivery_zones = ARRAY['4600', '4601', '4602', '4603'] WHERE name = 'Olten';
UPDATE cities SET delivery_zones = ARRAY['8000', '8001', '8002', '8003', '8004', '8005', '8006', '8008'] WHERE name = 'Zürich';
