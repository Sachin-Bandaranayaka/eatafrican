"use client";

import { useState } from 'react';
import { Star, X } from 'lucide-react';

interface ReviewModalProps {
    order: {
        id: string;
        restaurant: {
            id: string;
            name: string;
        };
    };
    onClose: () => void;
    onSubmit: (orderId: string, rating: number, comment: string) => Promise<void>;
}

export default function ReviewModal({ order, onClose, onSubmit }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;
        
        setSubmitting(true);
        try {
            await onSubmit(order.id, rating, comment);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold text-gray-800 mb-2">Leave a Review</h2>
                <p className="text-gray-500 mb-6">How was your experience with {order.restaurant.name}?</p>

                <form onSubmit={handleSubmit}>
                    {/* Star Rating */}
                    <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="p-1 transition-transform hover:scale-110"
                            >
                                <Star
                                    size={36}
                                    className={`transition-colors ${
                                        star <= (hoveredRating || rating)
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-gray-300'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Rating Labels */}
                    <div className="text-center mb-6">
                        {rating === 0 && <p className="text-gray-400">Select a rating</p>}
                        {rating === 1 && <p className="text-red-500">Poor</p>}
                        {rating === 2 && <p className="text-orange-500">Fair</p>}
                        {rating === 3 && <p className="text-amber-500">Good</p>}
                        {rating === 4 && <p className="text-lime-500">Very Good</p>}
                        {rating === 5 && <p className="text-green-500">Excellent!</p>}
                    </div>

                    {/* Comment */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review (Optional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us about your experience..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900 resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={rating === 0 || submitting}
                            className="flex-1 px-4 py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
