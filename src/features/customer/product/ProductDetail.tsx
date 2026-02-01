import { ArrowLeft, Heart, Minus, Plus, Star, MapPin, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { foodStoreApi, userApi } from '../../../api/api';
import type { FoodStoreDto } from '../../../types/swagger';

export default function ProductDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('vua');
    const [toppings, setToppings] = useState<string[]>(['trung']);
    const [product, setProduct] = useState<FoodStoreDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                // Note: In swagger we don't have getFoodStoreById, but we have /foods/{id}. 
                // However ProductDetail typically shows an item from a store (FoodStore).
                // Since we mocked getAll, we can filter client side or mock a new endpoint.
                // For now let's just use getAll and find.
                const res = await foodStoreApi.getAll();
                const found = res.data.find(f => f.id === id);
                setProduct(found || null);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load product");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product || !id) return;

        try {
            const cartRes = await userApi.getCart().catch(() => ({ data: { orderList: {} } }));
            const currentOrderList = (cartRes.data as any)?.orderList || {};

            const newOrderList = {
                ...currentOrderList,
                [id]: {
                    quantity: ((currentOrderList[id] as any)?.quantity || 0) + quantity,
                    foodStore: product
                }
            };

            await userApi.updateCart({ orderList: newOrderList });
            toast.success('Đã thêm vào giỏ hàng');
            navigate('/cart');
        } catch (error) {
            toast.error("Không thể thêm vào giỏ hàng");
        }
    };

    const toggleTopping = (topping: string) => {
        setToppings(prev =>
            prev.includes(topping)
                ? prev.filter(t => t !== topping)
                : [...prev, topping]
        );
    };

    const calculateTotal = () => {
        if (!product) return 0;
        let total = product.price;
        if (selectedSize === 'vua') total += 10000;
        if (selectedSize === 'lon') total += 20000;

        if (toppings.includes('trung')) total += 10000;
        if (toppings.includes('thit')) total += 15000;
        if (toppings.includes('rau')) total += 5000;

        return total * quantity;
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

    return (
        <div className="bg-white min-h-screen pb-24 relative">
            {/* HEADER IMAGE */}
            <div className="relative h-[300px]">
                <img src={product.food?.imageSrc || ''} alt={product.food?.name} className="w-full h-full object-cover" />
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
                    <button onClick={() => navigate(-1)} className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors">
                        <Heart className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="p-4 -mt-6 bg-white rounded-t-3xl relative z-10">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">{product.food?.name}</h1>
                    <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                        <span className="flex items-center text-yellow-500 font-bold">
                            <Star className="w-4 h-4 fill-yellow-500 mr-1" />4.8
                        </span>
                        <span>({100} đánh giá)</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <h3 className="font-semibold text-gray-900">{product.store?.name}</h3>
                            <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {product.store?.address}</span>
                                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> 15-20 phút</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">📝 Mô tả món ăn:</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Món ngon chất lượng từ {product.store?.name}</p>
                    </div>

                    <hr className="border-gray-100" />

                    <div>
                        <h3 className="font-bold text-gray-900 mb-3">🍱 Chọn size:</h3>
                        <div className="space-y-3">
                            {[
                                { id: 'nho', label: 'Nhỏ', price: 0 },
                                { id: 'vua', label: 'Vừa', price: 10000 },
                                { id: 'lon', label: 'Lớn', price: 20000 }
                            ].map((size) => (
                                <label key={size.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="size"
                                            className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                                            checked={selectedSize === size.id}
                                            onChange={() => setSelectedSize(size.id)}
                                        />
                                        <span className="ml-3 font-medium text-gray-700">{size.label}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">+{size.price.toLocaleString()}đ</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-3">🥢 Topping (Chọn nhiều):</h3>
                        <div className="space-y-3">
                            {[
                                { id: 'trung', label: 'Trứng', price: 10000 },
                                { id: 'thit', label: 'Thêm thịt', price: 15000 },
                                { id: 'rau', label: 'Rau thêm', price: 5000 }
                            ].map((topping) => (
                                <label key={topping.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                                            checked={toppings.includes(topping.id)}
                                            onChange={() => toggleTopping(topping.id)}
                                        />
                                        <span className="ml-3 font-medium text-gray-700">{topping.label}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">+{topping.price.toLocaleString()}đ</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">💬 Ghi chú:</h3>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                            rows={3}
                            placeholder="Ví dụ: Ít hành, không cay..."
                        />
                    </div>

                    <div className="flex items-center justify-center space-x-6 py-4">
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(q => q + 1)}
                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 flex items-center justify-between shadow-lg max-w-md mx-auto sm:max-w-full">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Tổng cộng</span>
                    <span className="text-xl font-bold text-orange-600">{calculateTotal().toLocaleString()}đ</span>
                </div>
                <Button onClick={handleAddToCart} className="px-8 py-3 rounded-xl shadow-lg shadow-orange-200">
                    THÊM VÀO GIỎ
                </Button>
            </div>
        </div>
    );
}
