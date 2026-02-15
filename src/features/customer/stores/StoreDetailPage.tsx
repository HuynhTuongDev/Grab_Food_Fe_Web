import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Heart, Clock } from 'lucide-react';
import { storeApi, foodStoreApi, favoriteApi, reviewApi } from '../../../api/api';
import type { StoreDto, FoodStoreDto } from '../../../types/swagger';
import { Card, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { toast } from 'sonner';

export default function StoreDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [store, setStore] = useState<StoreDto | null>(null);
    const [foods, setFoods] = useState<FoodStoreDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFav, setIsFav] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        if (!id) return;
        favoriteApi.checkStore(Number(id)).then(res => setIsFav(!!res.data)).catch(() => { });
    }, [id]);

    const toggleFav = async () => {
        if (!id) return;
        try {
            if (isFav) {
                await favoriteApi.removeStore(Number(id));
                setIsFav(false);
                toast.success('Đã bỏ yêu thích');
            } else {
                await favoriteApi.addStore(Number(id));
                setIsFav(true);
                toast.success('Đã thêm yêu thích ♥');
            }
        } catch { toast.error('Lỗi khi thao tác yêu thích'); }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const [storeRes, foodStoreRes] = await Promise.all([
                    storeApi.getById(Number(id)),
                    foodStoreApi.getAll(),
                ]);

                const storeData: any = storeRes.data;
                setStore(storeData);

                const allFoodStores = Array.isArray(foodStoreRes.data) ? foodStoreRes.data : [];
                // Filter food-stores belonging to this store
                setFoods(allFoodStores.filter((fs) => fs.storeId === Number(id)));

                // Fetch reviews for this store
                const reviewsRes = await reviewApi.getByStore(Number(id)).catch(() => ({ data: [] }));
                setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
            } catch (err) {
                console.error('Failed to fetch store detail:', err);
                setError('Không thể tải thông tin cửa hàng.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !store) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <p className="text-gray-500 mb-4">{error || 'Không tìm thấy cửa hàng.'}</p>
                <button onClick={() => navigate(-1)} className="text-orange-500 font-semibold">
                    ← Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            {/* Store Header Image */}
            <div className="relative h-[220px]">
                <img
                    src={store.imageSrc || ''}
                    alt={store.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button onClick={toggleFav} className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors">
                        <Heart className={`w-6 h-6 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Store Info */}
            <div className="bg-white -mt-6 rounded-t-3xl relative z-10 p-5">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
                    <Badge variant="success" className="text-xs shrink-0 ml-2">OPEN</Badge>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center text-yellow-500 font-bold">
                        <Star className="w-4 h-4 fill-yellow-500 mr-1" />
                        4.5
                    </span>
                    <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {store.address}
                    </span>
                    <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        15-25p
                    </span>
                </div>

                <hr className="border-gray-100 mb-4" />

                {/* Food Items */}
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                    🍽️ Thực đơn ({foods.length} món)
                </h2>

                {foods.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">Cửa hàng chưa có món ăn nào.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {foods.map((item) => (
                            <Link to={`/product/${item.id}`} key={item.id} className="block group">
                                <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow h-full">
                                    <div className="relative h-32">
                                        <img
                                            src={item.food?.imageSrc || ''}
                                            alt={item.food?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <CardContent className="p-3">
                                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                                            {item.food?.name}
                                        </h3>
                                        <p className="text-xs text-gray-400 truncate">
                                            {item.food?.foodTypeName}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm font-bold text-orange-600">
                                                {item.price.toLocaleString()}đ
                                            </span>
                                            <span className="flex items-center text-xs text-yellow-500">
                                                <Star className="w-3 h-3 fill-yellow-500 mr-0.5" />
                                                4.8
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Reviews Section */}
                <hr className="border-gray-100 my-6" />
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                    ⭐ Đánh giá ({reviews.length})
                </h2>

                {reviews.length === 0 ? (
                    <p className="text-gray-400 text-center py-6">Chưa có đánh giá nào.</p>
                ) : (
                    <div className="space-y-3">
                        {reviews.slice(0, 10).map((r: any) => (
                            <Card key={r.id} className="p-4 border-none shadow-sm rounded-xl">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
                                        {(r.userName || r.user?.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-gray-900">{r.userName || r.user?.name || 'Người dùng'}</span>
                                            <span className="text-yellow-500 text-xs font-bold flex items-center">
                                                {Array.from({ length: r.rating || 0 }).map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 fill-yellow-500" />
                                                ))}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600">{r.comment || r.content}</p>
                                        {r.reply && (
                                            <div className="mt-2 bg-gray-50 rounded-lg p-2">
                                                <p className="text-[10px] text-gray-400 font-bold">Phản hồi từ cửa hàng:</p>
                                                <p className="text-xs text-gray-600">{r.reply}</p>
                                            </div>
                                        )}
                                        <p className="text-[10px] text-gray-400 mt-1">
                                            {new Date(r.createdAt || r.date || Date.now()).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
