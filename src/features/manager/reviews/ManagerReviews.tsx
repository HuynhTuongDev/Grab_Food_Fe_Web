import { useState, useEffect } from 'react';
import { Star, MessageCircle, Send } from 'lucide-react';
import { reviewApi, storeApi } from '../../../api/api';
import { toast } from 'sonner';
import { cn } from '../../../lib/utils';

export default function ManagerReviews() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Try to get store reviews - manager's store
                const storesRes = await storeApi.getAll();
                const stores = Array.isArray(storesRes.data) ? storesRes.data : [];
                if (stores.length > 0) {
                    const storeId = (stores[0] as any).id;
                    const reviewsRes = await reviewApi.getByStore(storeId);
                    setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
                }
            } catch {
                console.error('Failed to fetch reviews');
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const handleReply = async (reviewId: number) => {
        if (!replyText.trim()) return;
        setIsSending(true);
        try {
            await reviewApi.reply(reviewId, replyText.trim());
            toast.success('Đã gửi phản hồi');
            setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, reply: replyText.trim() } : r));
            setReplyingTo(null);
            setReplyText('');
        } catch {
            toast.error('Không thể gửi phản hồi');
        } finally {
            setIsSending(false);
        }
    };

    const renderStars = (rating: number) => (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn("w-4 h-4", i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300")} />
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review Management</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reply to customer reviews</p>
                </div>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                    {reviews.length} reviews
                </span>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white dark:bg-[#2d1b15] rounded-xl h-28 animate-pulse shadow-sm" />
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-[#2d1b15] rounded-xl shadow-sm">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Chưa có đánh giá nào.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(r => (
                        <div key={r.id} className="bg-white dark:bg-[#2d1b15] rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
                                    {(r.userName || r.user?.name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-gray-900 dark:text-white">{r.userName || r.user?.name || 'Khách hàng'}</span>
                                        {renderStars(r.rating || 0)}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{r.comment || r.content}</p>
                                    {r.foodName && (
                                        <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg text-gray-500 dark:text-gray-400">
                                            🍽️ {r.foodName}
                                        </span>
                                    )}
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(r.createdAt || r.date || Date.now()).toLocaleDateString('vi-VN')}
                                    </p>

                                    {/* Existing reply */}
                                    {r.reply && (
                                        <div className="mt-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                                            <p className="text-xs font-bold text-green-700 dark:text-green-300 mb-1">💬 Phản hồi của bạn:</p>
                                            <p className="text-sm text-green-800 dark:text-green-200">{r.reply}</p>
                                        </div>
                                    )}

                                    {/* Reply form */}
                                    {!r.reply && (
                                        replyingTo === r.id ? (
                                            <div className="mt-3 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={replyText}
                                                    onChange={e => setReplyText(e.target.value)}
                                                    placeholder="Nhập phản hồi..."
                                                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                                    onKeyDown={e => e.key === 'Enter' && handleReply(r.id)}
                                                />
                                                <button
                                                    onClick={() => handleReply(r.id)}
                                                    disabled={isSending || !replyText.trim()}
                                                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg flex items-center gap-1 disabled:opacity-50 transition-colors"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                                    className="px-3 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setReplyingTo(r.id)}
                                                className="mt-3 text-sm text-orange-600 font-bold hover:underline flex items-center gap-1"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                Phản hồi
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
