import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { uploadImage, deleteFile, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/supabase/storage';
import { STORAGE_BUCKETS, supabaseAdmin } from '@/lib/supabase/config';

/**
 * POST /api/uploads
 * Upload a file to Supabase Storage
 */
export async function POST(req: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth()(req);

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = formData.get('bucket') as string | null;
    const folder = formData.get('folder') as string | null;

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'No file provided',
          },
        },
        { status: 400 }
      );
    }

    // Validate file type (JPEG, PNG, WebP)
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
            details: {
              allowedTypes: ALLOWED_IMAGE_TYPES,
              receivedType: file.type,
            },
          },
        },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'File size exceeds maximum limit of 5MB.',
            details: {
              maxSize: MAX_IMAGE_SIZE,
              receivedSize: file.size,
            },
          },
        },
        { status: 400 }
      );
    }

    // Determine bucket based on user role or provided bucket
    let targetBucket: keyof typeof STORAGE_BUCKETS = 'RESTAURANT_IMAGES';
    
    if (bucket) {
      // Validate bucket name
      const validBuckets = Object.keys(STORAGE_BUCKETS);
      if (!validBuckets.includes(bucket)) {
        return NextResponse.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid bucket name',
              details: {
                validBuckets,
              },
            },
          },
          { status: 400 }
        );
      }
      targetBucket = bucket as keyof typeof STORAGE_BUCKETS;
    } else {
      // Auto-determine bucket based on user role
      if (user.role === 'restaurant_owner') {
        targetBucket = 'RESTAURANT_IMAGES';
      } else if (user.role === 'driver') {
        targetBucket = 'DRIVER_DOCUMENTS';
      } else if (user.role === 'customer') {
        targetBucket = 'USER_AVATARS';
      }
    }

    // Upload file to Supabase Storage
    const { url, path } = await uploadImage(
      targetBucket,
      file,
      folder || undefined
    );

    // Return success response
    return NextResponse.json(
      {
        url,
        path,
        filename: file.name,
        size: file.size,
        mimeType: file.type,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('File upload error:', error);

    // Handle specific errors
    if (error.message?.includes('Invalid file type')) {
      return NextResponse.json(
        {
          error: {
            code: 'FILE_UPLOAD_ERROR',
            message: error.message,
          },
        },
        { status: 400 }
      );
    }

    if (error.message?.includes('File size exceeds')) {
      return NextResponse.json(
        {
          error: {
            code: 'FILE_UPLOAD_ERROR',
            message: error.message,
          },
        },
        { status: 400 }
      );
    }

    if (error.name === 'AuthError') {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_UNAUTHORIZED',
            message: error.message,
          },
        },
        { status: error.statusCode || 401 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: {
          code: 'FILE_UPLOAD_ERROR',
          message: 'Failed to upload file',
          details: error.message,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/uploads
 * Delete a file from Supabase Storage
 */
export async function DELETE(req: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth()(req);

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');
    const bucket = searchParams.get('bucket');

    // Validate required parameters
    if (!path) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'File path is required',
          },
        },
        { status: 400 }
      );
    }

    if (!bucket) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Bucket name is required',
          },
        },
        { status: 400 }
      );
    }

    // Validate bucket name
    const validBuckets = Object.keys(STORAGE_BUCKETS);
    if (!validBuckets.includes(bucket)) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid bucket name',
            details: {
              validBuckets,
            },
          },
        },
        { status: 400 }
      );
    }

    // Check user permissions based on bucket and role
    const targetBucket = bucket as keyof typeof STORAGE_BUCKETS;
    
    // Super admin can delete any file
    if (user.role !== 'super_admin') {
      // Restaurant owners can only delete from RESTAURANT_IMAGES and MENU_IMAGES
      if (user.role === 'restaurant_owner') {
        if (targetBucket !== 'RESTAURANT_IMAGES' && targetBucket !== 'MENU_IMAGES') {
          return NextResponse.json(
            {
              error: {
                code: 'AUTH_UNAUTHORIZED',
                message: 'You do not have permission to delete files from this bucket',
              },
            },
            { status: 403 }
          );
        }

        // Verify the file belongs to the restaurant owner's restaurant
        if (user.restaurantId) {
          // Check if the path contains the restaurant ID or if the file is referenced in their restaurant/menu
          const pathSegments = path.split('/');
          const restaurantIdInPath = pathSegments.find(segment => 
            segment.length === 36 && segment.includes('-')
          );

          // If there's a restaurant ID in the path, verify it matches
          if (restaurantIdInPath && restaurantIdInPath !== user.restaurantId) {
            return NextResponse.json(
              {
                error: {
                  code: 'AUTH_UNAUTHORIZED',
                  message: 'You do not have permission to delete this file',
                },
              },
              { status: 403 }
            );
          }
        }
      }
      // Drivers can only delete from DRIVER_DOCUMENTS
      else if (user.role === 'driver') {
        if (targetBucket !== 'DRIVER_DOCUMENTS') {
          return NextResponse.json(
            {
              error: {
                code: 'AUTH_UNAUTHORIZED',
                message: 'You do not have permission to delete files from this bucket',
              },
            },
            { status: 403 }
          );
        }
      }
      // Customers can only delete from USER_AVATARS
      else if (user.role === 'customer') {
        if (targetBucket !== 'USER_AVATARS') {
          return NextResponse.json(
            {
              error: {
                code: 'AUTH_UNAUTHORIZED',
                message: 'You do not have permission to delete files from this bucket',
              },
            },
            { status: 403 }
          );
        }
      }
    }

    // Check if file is referenced in database before deletion
    // This helps prevent orphaned references
    const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKETS[targetBucket]}/${path}`;
    
    // Check restaurants table
    const { data: restaurantsWithFile } = await supabaseAdmin
      .from('restaurants')
      .select('id')
      .or(`logo_url.eq.${fileUrl},cover_image_url.eq.${fileUrl}`)
      .limit(1);

    if (restaurantsWithFile && restaurantsWithFile.length > 0) {
      // Update database references to null before deleting
      await supabaseAdmin
        .from('restaurants')
        .update({ 
          logo_url: null,
          cover_image_url: null 
        })
        .or(`logo_url.eq.${fileUrl},cover_image_url.eq.${fileUrl}`);
    }

    // Check menu_items table
    const { data: menuItemsWithFile } = await supabaseAdmin
      .from('menu_items')
      .select('id')
      .eq('image_url', fileUrl)
      .limit(1);

    if (menuItemsWithFile && menuItemsWithFile.length > 0) {
      // Update database references to null before deleting
      await supabaseAdmin
        .from('menu_items')
        .update({ image_url: null })
        .eq('image_url', fileUrl);
    }

    // Check drivers table
    const { data: driversWithFile } = await supabaseAdmin
      .from('drivers')
      .select('id')
      .eq('profile_image_url', fileUrl)
      .limit(1);

    if (driversWithFile && driversWithFile.length > 0) {
      // Update database references to null before deleting
      await supabaseAdmin
        .from('drivers')
        .update({ profile_image_url: null })
        .eq('profile_image_url', fileUrl);
    }

    // Delete file from Supabase Storage
    await deleteFile(targetBucket, path);

    // Return success response
    return NextResponse.json(
      {
        message: 'File deleted successfully',
        path,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('File deletion error:', error);

    if (error.name === 'AuthError') {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_UNAUTHORIZED',
            message: error.message,
          },
        },
        { status: error.statusCode || 401 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: {
          code: 'FILE_UPLOAD_ERROR',
          message: 'Failed to delete file',
          details: error.message,
        },
      },
      { status: 500 }
    );
  }
}
