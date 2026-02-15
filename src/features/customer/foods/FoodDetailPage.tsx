import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, Loader2 } from 'lucide-react';
import { foodApi } from '../../../api/api';
import type { FoodDto } from '../../../types/swagger';
import { Badge } from '../../../components/ui/Badge';

export default function FoodDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [food, setFood] = useState<FoodDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFood = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const res = await foodApi.getById(Number(id));
                setFood(res.data as any);
            } catch (err) {
                console.error('Failed to fetch food:', err);
                setError('Không thể tải thông tin món ăn.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchFood();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (error || !food) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <p className="text-gray-500 mb-4">{error || 'Không tìm thấy món ăn.'}</p>
                <button onClick={() => navigate(-1)} className="text-orange-500 font-semibold">
                    ← Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="pb-24 bg-white min-h-screen">
            {/* Header Image */}
            <div className="relative h-[280px]">
                <img
                    src={food.imageSrc || ''}
                    alt={food.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors">
                        <Heart className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 -mt-6 bg-white rounded-t-3xl relative z-10">
                <div className="flex justify-between items-start mb-3">
                    <h1 className="text-2xl font-bold text-gray-900">{food.name}</h1>
                    <Badge
                        variant={food.isAvailable ? 'success' : 'destructive'}
                        className="shrink-0 ml-2"
                    >
                        {food.isAvailable ? 'Còn hàng' : 'Hết hàng'}
                    </Badge>
                </div>

                <div className="flex items-center space-x-3 text-sm text-gray-500 mb-4">
                    <span className="flex items-center text-yellow-500 font-bold">
                        <Star className="w-4 h-4 fill-yellow-500 mr-1" />
                        4.8
                    </span>
                    <span>•</span>
                    <span>{food.foodTypeName}</span>
                </div>

                <div className="bg-orange-50 rounded-xl p-4 mb-6">
                    <p className="text-xs text-orange-600 font-medium mb-1">Giá</p>
                    <p className="text-2xl font-bold text-orange-600">
                        {food.price != null ? food.price.toLocaleString('vi-VN') + ' ₫' : 'Liên hệ'}
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">📝 Thông tin</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-400">Mã món</p>
                                <p className="text-sm font-semibold text-gray-800">#{food.id}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-400">Loại món</p>
                                <p className="text-sm font-semibold text-gray-800">{food.foodTypeName || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-400">Trạng thái</p>
                                <p className={`text-sm font-semibold ${food.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                                    {food.isAvailable ? 'Đang bán' : 'Ngừng bán'}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-400">Mã loại</p>
                                <p className="text-sm font-semibold text-gray-800">#{food.foodTypeId}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
