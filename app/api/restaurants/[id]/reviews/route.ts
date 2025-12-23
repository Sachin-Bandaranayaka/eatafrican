import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

// GET - Fetch restaurant reviews
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        const { data, error, count } = await supabaseAdmin
            .from('reviews')
            .select(`
                *,
                customer:users!reviews_customer_id_fkey(id, first_name, last_name)
            `, { count: 'exact' })
            .eq('restaurant_id', params.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        // Calculate average rating
        const { data: avgData } = await supabaseAdmin
            .from('reviews')
            .select('rating')
            .eq('restaurant_id', params.id);

        const avgRating = avgData && avgData.length > 0
            ? avgData.reduce((sum, r) => sum + r.rating, 0) / avgData.length
            : 0;

        return NextResponse.json({
            reviews: data || [],
            total: count || 0,
            page,
            totalPages: Math.ceil((count || 0) / limit),
            averageRating: Math.round(avgRating * 10) / 10
        });
    } catch (error: any) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to fetch reviews' } },
            { status: 500 }
        );
    }
}

// POST - Create a review
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { orderId, rating, comment, customerId } = body;

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: { message: 'Rating must be between 1 and 5' } },
                { status: 400 }
            );
        }

        // Check if review already exists for this order
        if (orderId) {
            const { data: existingReview } = await supabaseAdmin
                .from('reviews')
                .select('id')
                .eq('order_id', orderId)
                .single();

            if (existingReview) {
                return NextResponse.json(
                    { error: { message: 'Review already submitted for this order' } },
                    { status: 400 }
                );
            }
        }

        // Create review
        const { data, error } = await supabaseAdmin
            .from('reviews')
            .insert({
                restaurant_id: params.id,
                customer_id: customerId,
                order_id: orderId,
                rating,
                comment: comment || null
            })
            .select()
            .single();

        if (error) throw error;

        // Update restaurant rating
        const { data: allReviews } = await supabaseAdmin
            .from('reviews')
            .select('rating')
            .eq('restaurant_id', params.id);

        if (allReviews && allReviews.length > 0) {
            const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
            await supabaseAdmin
                .from('restaurants')
                .update({
                    rating: Math.round(avgRating * 100) / 100,
                    total_ratings: allReviews.length
                })
                .eq('id', params.id);
        }

        return NextResponse.json({ review: data }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating review:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to create review' } },
            { status: 500 }
        );
    }
}
