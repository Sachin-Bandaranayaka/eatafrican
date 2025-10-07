import { supabaseAdmin } from './config';
import { STORAGE_BUCKETS } from './config';

// Allowed file types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

// Max file sizes (in bytes)
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

// Validate file type
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

// Validate file size
export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize;
}

// Generate unique filename
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalFilename.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
}

// Upload file to Supabase Storage
export async function uploadFile(
  bucket: keyof typeof STORAGE_BUCKETS,
  file: File,
  folder?: string
): Promise<{ url: string; path: string }> {
  const bucketName = STORAGE_BUCKETS[bucket];
  const filename = generateUniqueFilename(file.name);
  const path = folder ? `${folder}/${filename}` : filename;

  const { data, error } = await supabaseAdmin.storage
    .from(bucketName)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('File upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(bucketName)
    .getPublicUrl(path);

  return {
    url: urlData.publicUrl,
    path: data.path,
  };
}

// Delete file from Supabase Storage
export async function deleteFile(
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string
): Promise<void> {
  const bucketName = STORAGE_BUCKETS[bucket];

  const { error } = await supabaseAdmin.storage
    .from(bucketName)
    .remove([path]);

  if (error) {
    console.error('File deletion error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

// Upload image with validation
export async function uploadImage(
  bucket: keyof typeof STORAGE_BUCKETS,
  file: File,
  folder?: string
): Promise<{ url: string; path: string }> {
  // Validate file type
  if (!validateFileType(file, ALLOWED_IMAGE_TYPES)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
  }

  // Validate file size
  if (!validateFileSize(file, MAX_IMAGE_SIZE)) {
    throw new Error('File size exceeds maximum limit of 5MB.');
  }

  return uploadFile(bucket, file, folder);
}

// Upload document with validation
export async function uploadDocument(
  bucket: keyof typeof STORAGE_BUCKETS,
  file: File,
  folder?: string
): Promise<{ url: string; path: string }> {
  // Validate file type
  if (!validateFileType(file, ALLOWED_DOCUMENT_TYPES)) {
    throw new Error('Invalid file type. Only PDF, JPEG, and PNG documents are allowed.');
  }

  // Validate file size
  if (!validateFileSize(file, MAX_DOCUMENT_SIZE)) {
    throw new Error('File size exceeds maximum limit of 10MB.');
  }

  return uploadFile(bucket, file, folder);
}

// Get public URL for a file
export function getPublicUrl(
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string
): string {
  const bucketName = STORAGE_BUCKETS[bucket];
  const { data } = supabaseAdmin.storage
    .from(bucketName)
    .getPublicUrl(path);

  return data.publicUrl;
}

// List files in a folder
export async function listFiles(
  bucket: keyof typeof STORAGE_BUCKETS,
  folder?: string
): Promise<any[]> {
  const bucketName = STORAGE_BUCKETS[bucket];

  const { data, error } = await supabaseAdmin.storage
    .from(bucketName)
    .list(folder);

  if (error) {
    console.error('List files error:', error);
    throw new Error(`Failed to list files: ${error.message}`);
  }

  return data || [];
}
