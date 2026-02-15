import { Minus, Plus, Trash2, MapPin, ShoppingBag, CreditCard, Tag, Ticket, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '../../../lib/utils';
import { userApi, orderApi, voucherApi, addressApi } from '../../../api/api';

export default function CartPage() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherError, setVoucherError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [defaultAddress, setDefaultAddress] = useState<any>(null);

    // Debounce ref for cart updates
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Vui lòng đăng nhập để xem giỏ hàng');
            navigate('/login');
            return;
        }

        fetchCart();
        fetchVouchers();
        fetchDefaultAddress();
    }, [navigate]);

    const fetchDefaultAddress = async () => {
        try {
            const res = await addressApi.getDefault().catch(() => ({ data: null }));
            setDefaultAddress(res.data);
        } catch (e) {
            console.error("Failed to fetch default address", e);
        }
    };

    const fetchVouchers = async () => {
        try {
            const res = await voucherApi.getAvailable().catch(() => voucherApi.getAll().catch(() => ({ data: [] })));
            setVouchers(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error("Failed to fetch vouchers", e);
        }
    };

    const fetchCart = async () => {
        try {
            const res = await userApi.getCart();
            const orderList = res.data?.orderList || {};
            const items = Object.entries(orderList).map(([key, val]: [string, any]) => ({
                id: key,
                ...val,
                price: val.foodStore?.price || 0,
                name: val.foodStore?.food?.name || 'Sản phẩm',
                image: val.foodStore?.food?.imageSrc || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'
            }));
            setCartItems(items);
        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounced cart sync to backend
    const debouncedUpdateCart = useCallback((newOrderList: any) => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        if (abortRef.current) abortRef.current.abort();

        debounceTimer.current = setTimeout(async () => {
            try {
                abortRef.current = new AbortController();
                await userApi.updateCart({ orderList: newOrderList });
            } catch (e: any) {
                if (e?.name !== 'CanceledError') {
                    console.error("Failed to sync cart", e);
                }
            }
        }, 500);
    }, []);

    const updateQuantity = async (id: string, delta: number) => {
        const item = cartItems.find(i => i.id === id);
        if (!item) return;

        const newQty = Math.max(0, item.quantity + delta);
        if (newQty === 0) {
            await removeItem(id);
            return;
        }

        // Optimistic update
        const updatedItems = cartItems.map(i => i.id === id ? { ...i, quantity: newQty } : i);
        setCartItems(updatedItems);

        // Debounced backend sync
        const newOrderList = updatedItems.reduce((acc, i) => ({
            ...acc,
            [i.id]: { quantity: i.quantity, foodStore: i.foodStore }
        }), {});
        debouncedUpdateCart(newOrderList);
    };

    const removeItem = async (id: string) => {
        try {
            const remaining = cartItems.filter(i => i.id !== id);
            setCartItems(remaining);
            const newOrderList = remaining.reduce((acc, i) => ({ ...acc, [i.id]: { quantity: i.quantity, foodStore: i.foodStore } }), {});
            await userApi.updateCart({ orderList: newOrderList });
            toast.success('Đã xóa khỏi giỏ hàng');
        } catch (e) {
            toast.error("Lỗi khi xóa món ăn");
            await fetchCart(); // Rollback
        }
    };

    const handleApplyVoucherCode = async () => {
        if (!voucherCode.trim()) return;
        setVoucherError('');
        try {
            const res = await voucherApi.getByCode(voucherCode.trim());
            if (res.data) {
                setSelectedVoucher(res.data);
                toast.success('Áp dụng mã giảm giá thành công!');
                setVoucherCode('');
            } else {
                setVoucherError('Mã giảm giá không hợp lệ.');
            }
        } catch (err: any) {
            setVoucherError(err.response?.data?.message || 'Mã giảm giá không tồn tại hoặc đã hết hạn.');
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = cartItems.length > 0 ? 15000 : 0;
    const discount = selectedVoucher ? (selectedVoucher.discountType === 'percentage' ? (subtotal * selectedVoucher.value / 100) : (selectedVoucher.value || 0)) : 0;
    const total = Math.max(0, subtotal + shippingFee - discount);

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            toast.error('Giỏ hàng trống');
            return;
        }

        try {
            setIsCheckingOut(true);
            const firstStoreId = cartItems[0]?.foodStore?.storeId;
            const orderPayload: any = {
                storeId: firstStoreId,
                totalAmount: total,
                orderLines: cartItems.map(item => ({
                    foodStoreId: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            if (selectedVoucher?.id) {
                orderPayload.voucherId = selectedVoucher.id;
            }
            if (defaultAddress?.id) {
                orderPayload.addressId = defaultAddress.id;
            }

            await orderApi.create(orderPayload);
            await userApi.clearCart();
            toast.success('Đặt hàng thành công! 🎉');
            navigate('/orders');
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Đặt hàng thất bại");
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 bg-gray-50 min-h-screen space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 bg-white rounded-t-[2.5rem] mt-4 shadow-2xl">
                <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-16 h-16 text-orange-200" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng đang đợi!</h2>
                <p className="text-gray-500 mb-8 max-w-[250px]">Hãy thêm những món ăn yêu thích vào giỏ hàng và thưởng thức ngay.</p>
                <Button onClick={() => navigate('/')} className="px-10 py-6 rounded-2xl text-lg shadow-lg shadow-orange-200">
                    Khám phá menu
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-50 min-h-screen pb-40">
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                    <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Giỏ hàng</h1>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 mb-8">
                {cartItems.map((item) => (
                    <Card key={item.id} className="p-3 border-none shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex space-x-4">
                            <div className="relative">
                                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover shadow-sm" />
                                <Badge className="absolute -top-2 -right-2 bg-orange-600 border-2 border-white">{item.quantity}</Badge>
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-gray-900 leading-tight">{item.name}</h3>
                                        <button className="text-gray-300 hover:text-red-500 transition-colors" onClick={() => removeItem(item.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">Store: {item.foodStore?.store?.name || 'Grab Food'}</p>
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                    <span className="font-extrabold text-orange-600 text-lg">{(item.price * item.quantity).toLocaleString()}đ</span>
                                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-orange-600 hover:bg-white transition-all">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm font-bold w-8 text-center text-gray-900">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-orange-600 hover:bg-white transition-all">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="space-y-6">
                {/* Voucher Section */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-900 font-bold">
                        <Tag className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Ưu đãi của bạn</span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                        {/* Voucher code input */}
                        <div className="flex gap-2">
                            <Input
                                placeholder="Nhập mã giảm giá..."
                                value={voucherCode}
                                onChange={(e) => { setVoucherCode(e.target.value); setVoucherError(''); }}
                                className="rounded-xl text-sm flex-1"
                            />
                            <Button size="sm" className="rounded-xl px-4 shrink-0" onClick={handleApplyVoucherCode}>
                                Áp dụng
                            </Button>
                        </div>
                        {voucherError && <p className="text-xs text-red-500">{voucherError}</p>}

                        {/* Available vouchers */}
                        {vouchers.length === 0 ? (
                            <div className="flex items-center justify-between text-gray-400">
                                <span className="text-xs">Chưa có mã giảm giá khả dụng</span>
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {vouchers.slice(0, 3).map(v => (
                                    <button
                                        key={v.id}
                                        onClick={() => setSelectedVoucher(selectedVoucher?.id === v.id ? null : v)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                                            selectedVoucher?.id === v.id ? "border-orange-500 bg-orange-50" : "border-gray-50 bg-gray-50/50"
                                        )}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                <Ticket className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-900">{v.title || v.code || v.name}</p>
                                                <p className="text-[10px] text-gray-500">Giảm {v.value?.toLocaleString()}{v.discountType === 'percentage' ? '%' : 'đ'}</p>
                                            </div>
                                        </div>
                                        <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center", selectedVoucher?.id === v.id ? "bg-orange-600 border-orange-600" : "border-gray-300")}>
                                            {selectedVoucher?.id === v.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Address Section */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-900 font-bold">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Địa chỉ giao hàng</span>
                    </div>
                    <Link to="/addresses" className="block">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4 text-orange-500" />
                                </div>
                                {defaultAddress ? (
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">{defaultAddress.name}</p>
                                        <p className="text-xs text-gray-500 italic">{defaultAddress.detail || defaultAddress.address}</p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">Chưa có địa chỉ. Nhấn để thêm.</p>
                                )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                        </div>
                    </Link>
                </div>

                {/* Summary */}
                <Card className="p-5 border-none shadow-sm space-y-3 bg-white rounded-2xl">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400 font-medium">Tạm tính</span>
                        <span className="font-bold text-gray-900">{subtotal.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400 font-medium">Phí giao hàng</span>
                        <span className="font-bold text-gray-900">{shippingFee.toLocaleString()}đ</span>
                    </div>
                    {selectedVoucher && (
                        <div className="flex justify-between text-sm text-emerald-600">
                            <span className="font-medium flex items-center italic">
                                <Ticket className="w-3 h-3 mr-1" /> KM ({selectedVoucher.code || selectedVoucher.title || 'GIAMGIA'})
                            </span>
                            <span className="font-bold">-{discount.toLocaleString()}đ</span>
                        </div>
                    )}
                    <div className="pt-3 border-t border-dashed border-gray-100 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Tổng thanh toán</p>
                            <span className="text-2xl font-black text-orange-600">{total.toLocaleString()}đ</span>
                        </div>
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="fixed bottom-20 left-4 right-4 z-40">
                <Button
                    className="w-full py-7 text-lg font-bold rounded-2xl shadow-2xl shadow-orange-300 transform active:scale-95 transition-transform"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                >
                    {isCheckingOut ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    THANH TOÁN NGAY
                </Button>
            </div>
        </div>
    );
}
