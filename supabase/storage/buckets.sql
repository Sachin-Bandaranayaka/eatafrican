-- Create storage buckets for file uploads

-- Restaurant images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('restaurant-images', 'restaurant-images', true)
ON CONFLICT (id) DO NOTHING;

-- Menu images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Driver documents bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('driver-documents', 'driver-documents', false)
ON CONFLICT (id) DO NOTHING;

-- User avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for restaurant-images bucket
CREATE POLICY "Anyone can view restaurant images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'restaurant-images');

CREATE POLICY "Restaurant owners can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'restaurant-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Restaurant owners can update their images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'restaurant-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Restaurant owners can delete their images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'restaurant-images' AND
    auth.role() = 'authenticated'
  );

-- Storage policies for menu-images bucket
CREATE POLICY "Anyone can view menu images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');

CREATE POLICY "Restaurant owners can upload menu images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'menu-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Restaurant owners can update menu images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'menu-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Restaurant owners can delete menu images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'menu-images' AND
    auth.role() = 'authenticated'
  );

-- Storage policies for driver-documents bucket (private)
CREATE POLICY "Drivers can view their own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'driver-documents' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'super_admin'
    ))
  );

CREATE POLICY "Drivers can upload their documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'driver-documents' AND
    auth.role() = 'authenticated' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Drivers can update their documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'driver-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Drivers can delete their documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'driver-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for user-avatars bucket
CREATE POLICY "Anyone can view user avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload their avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-avatars' AND
    auth.role() = 'authenticated' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their avatars"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their avatars"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
