import { Search, MapPin, Star, Heart, Clock, ShoppingBag } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { Link } from 'react-router-dom';
import { foodStoreApi, storeApi, foodTypeApi, voucherApi } from '../../../api/api';
import type { FoodStoreDto, StoreDto } from '../../../types/swagger';

const PROMOTIONS = [
    { id: 1, title: 'Giảm giá 30% cho đơn đầu', color: 'bg-orange-100' },
    { id: 2, title: 'Freeship đơn từ 100k', color: 'bg-blue-100' },
    { id: 3, title: 'Mua 1 tặng 1 trà sữa', color: 'bg-pink-100' },
];

export default function HomePage() {
    const [activeCategory, setActiveCategory] = useState<number>(1);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
    const [foodStores, setFoodStores] = useState<FoodStoreDto[]>([]);
    const [stores, setStores] = useState<StoreDto[]>([]);
    const [vouchers, setVouchers] = useState<any[]>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % PROMOTIONS.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, foodsRes, storesRes, vouchersRes] = await Promise.all([
                    foodTypeApi.getAll(),
                    foodStoreApi.getAll({ FoodTypeId: activeCategory === 1 ? undefined : activeCategory }),
                    storeApi.getAll(),
                    voucherApi.getAll().catch(() => ({ data: [] }))
                ]);

                setCategories(Array.isArray(catsRes.data) ? catsRes.data : []);
                setFoodStores(Array.isArray(foodsRes.data) ? foodsRes.data : []);
                setStores(Array.isArray(storesRes.data) ? storesRes.data : []);

                let voucherData = Array.isArray(vouchersRes.data) ? vouchersRes.data : [];
                if (voucherData.length === 0) {
                    // Fallback to stylized internal promos if API has no vouchers
                    voucherData = [
                        { id: 1, title: 'Giảm giá 30% cho đơn đầu', color: 'bg-orange-50', code: 'GRAB30' },
                        { id: 2, title: 'Freeship đơn từ 100k', color: 'bg-blue-50', code: 'FREESHIP' },
                        { id: 3, title: 'Mua 1 tặng 1 trà sữa', color: 'bg-pink-50', code: 'BOBOLIFE' },
                    ];
                }
                setVouchers(voucherData);

                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch data", error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [activeCategory]);

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            {/* HEADER SECTION */}
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 rounded-b-[2rem] shadow-xl p-6 pt-10 text-white relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">FoodDelivery</h1>
                        <p className="text-sm opacity-90">Đặt món ngon, giao tận nơi</p>
                    </div>
                    <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                        <MapPin className="w-3 h-3" />
                        <span>Hồ Chí Minh</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-2 flex items-center space-x-2">
                    <Search className="w-5 h-5 text-gray-400 ml-2" />
                    <Input
                        className="border-none shadow-none focus-visible:ring-0 p-0 h-auto placeholder:text-gray-400 text-gray-800"
                        placeholder="Tìm kiếm món ăn, nhà hàng..."
                    />
                </div>
            </div>

            <div className=" px-4 mt-6 space-y-8">
                {/* PROMOTION BANNER */}
                <div className="relative overflow-hidden rounded-[2rem] shadow-xl shadow-orange-100 h-48">
                    <motion.div
                        className="flex h-full"
                        animate={{ x: `-${currentBanner * 100}%` }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        {vouchers.map((promo) => (
                            <div key={promo.id} className={cn("w-full h-full min-w-full flex items-center justify-between p-8 relative overflow-hidden", promo.color || 'bg-white')}>
                                <div className="relative z-10 max-w-[60%]">
                                    <Badge className="bg-orange-600 mb-2 uppercase tracking-tighter shadow-lg shadow-orange-200">Voucher</Badge>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2 italic uppercase tracking-tighter">{promo.title}</h3>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Code:</span>
                                        <code className="bg-white/50 backdrop-blur px-2 py-1 rounded-lg text-orange-600 font-bold border border-orange-100">{promo.code || 'SAVE10'}</code>
                                    </div>
                                </div>
                                <div className="relative z-10">
                                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl rotate-12 transition-transform hover:rotate-0">
                                        <ShoppingBag className="w-10 h-10 text-orange-600" />
                                    </div>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-orange-200/20 blur-2xl" />
                                <div className="absolute bottom-0 left-1/2 -ml-20 -mb-20 w-40 h-40 rounded-full bg-blue-200/20 blur-2xl" />
                            </div>
                        ))}
                    </motion.div>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-1.5">
                        {vouchers.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn("h-1.5 rounded-full transition-all duration-500", currentBanner === idx ? "w-8 bg-orange-600" : "w-1.5 bg-gray-300")}
                            />
                        ))}
                    </div>

                    {/* Floating elements */}
                    <div className="absolute top-2 left-2 flex space-x-2">
                        <div className="w-1 h-1 bg-white/20 rounded-full" />
                        <div className="w-1 h-1 bg-white/20 rounded-full" />
                    </div>
                </div>

                {/* CATEGORY PILLS */}
                <div>
                    {isLoading ? (
                        <div className="flex space-x-3 overflow-hidden">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-20 h-8 bg-gray-200 rounded-full animate-pulse" />)}
                        </div>
                    ) : (
                        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={cn(
                                        "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                                        activeCategory === cat.id
                                            ? "bg-orange-500 text-white border-orange-500 shadow-md"
                                            : "bg-white text-gray-700 border-gray-200"
                                    )}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* POPULAR ITEMS */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">🔥 Món phổ biến</h2>
                        <Link to="/foods" className="text-orange-500 text-xs hover:text-orange-600 font-medium">
                            Xem tất cả →
                        </Link>
                    </div>
                    {isLoading ? (
                        <div className="flex space-x-4">
                            {[1, 2, 3].map(i => <div key={i} className="w-[160px] h-48 bg-gray-200 rounded-xl animate-pulse" />)}
                        </div>
                    ) : (
                        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                            {foodStores.map((item) => (
                                <Link to={`/product/${item.id}`} key={item.id} className="min-w-[160px] w-[160px] block group">
                                    <Card className="overflow-hidden border-none shadow-md h-full hover:shadow-lg transition-shadow">
                                        <div className="relative h-32">
                                            <img src={item.food?.imageSrc || ''} alt={item.food?.name} className="w-full h-full object-cover" />
                                            <button className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-gray-500 hover:text-red-500 transition-colors">
                                                <Heart className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <CardContent className="p-3">
                                            <h3 className="font-semibold text-gray-900 truncate">{item.food?.name}</h3>
                                            <p className="text-xs text-gray-500 truncate mb-2">{item.store?.name}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-xs text-yellow-500 font-medium">
                                                    <Star className="w-3 h-3 fill-yellow-500 mr-1" />
                                                    4.8
                                                </div>
                                                <span className="text-sm font-bold text-orange-600">
                                                    {item.price.toLocaleString()}đ
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* RESTAURANTS LIST */}
                <div className="pb-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">🏪 Các nhà hàng gần bạn</h2>
                    <Link to="/stores" className="text-orange-500 text-xs hover:text-orange-600 font-medium mb-4 block text-right -mt-3">
                        Xem tất cả →
                    </Link>
                    <div className="space-y-4">
                        {stores.map((store) => (
                            <Link to={`/store/${store.id}`} key={store.id} className="block group">
                                <Card className="flex overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 relative">
                                        <img src={store.imageSrc} alt={store.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 p-3 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-gray-900 line-clamp-1">{store.name}</h3>
                                                <Badge variant="success" className="text-[10px] px-1.5 py-0 h-5">OPEN</Badge>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 lines-clamp-1">{store.address}</p>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                                            <div className="flex items-center space-x-3">
                                                <span className="flex items-center text-yellow-500 font-medium">
                                                    <Star className="w-3 h-3 fill-yellow-500 mr-1" />4.5
                                                </span>
                                                <span className="flex items-center">
                                                    <MapPin className="w-3 h-3 mr-1" />2km
                                                </span>
                                            </div>
                                            <span className="flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />15p
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
