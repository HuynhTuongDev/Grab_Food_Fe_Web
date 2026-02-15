import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Plus, Star, Phone, Check, Loader2, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { addressApi } from '../../../api/api';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';

interface AddressItem {
    id: number;
    name: string;
    phone: string;
    detail: string;
    isDefault: boolean;
    [key: string]: any;
}

export default function AddressPage() {
    const [addresses, setAddresses] = useState<AddressItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAddress, setNewAddress] = useState({ name: '', phone: '', detail: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchAddresses = async () => {
        try {
            setIsLoading(true);
            const res = await addressApi.getAll();
            const data = Array.isArray(res.data) ? res.data : [];
            setAddresses(data);
        } catch (err) {
            console.error('Failed to fetch addresses:', err);
            toast.error('Không thể tải danh sách địa chỉ');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleSetDefault = async (id: number) => {
        try {
            await addressApi.setDefault(id);
            toast.success('Đã đặt địa chỉ mặc định');
            await fetchAddresses();
        } catch (err) {
            console.error('Failed to set default:', err);
            toast.error('Không thể đặt địa chỉ mặc định');
        }
    };

    const handleAddAddress = async () => {
        if (!newAddress.name.trim() || !newAddress.detail.trim()) {
            toast.error('Vui lòng nhập tên và địa chỉ');
            return;
        }
        try {
            setIsSubmitting(true);
            await addressApi.create(newAddress);
            toast.success('Đã thêm địa chỉ mới');
            setNewAddress({ name: '', phone: '', detail: '' });
            setShowAddForm(false);
            await fetchAddresses();
        } catch (err) {
            console.error('Failed to create address:', err);
            toast.error('Không thể thêm địa chỉ');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 rounded-b-[2rem] shadow-xl p-6 pt-10 text-white">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold">Địa chỉ giao hàng</h1>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-xs text-white/70 ml-12">Quản lý các địa chỉ nhận hàng của bạn</p>
            </div>

            <div className="px-4 mt-6">
                {/* Add Address Form */}
                {showAddForm && (
                    <Card className="border-none shadow-md p-5 mb-6 rounded-2xl bg-white space-y-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Plus className="w-4 h-4 text-orange-500" />
                            Thêm địa chỉ mới
                        </h3>
                        <Input
                            placeholder="Tên người nhận"
                            value={newAddress.name}
                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                            className="rounded-xl"
                        />
                        <Input
                            placeholder="Số điện thoại"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                            className="rounded-xl"
                        />
                        <Input
                            placeholder="Địa chỉ chi tiết"
                            value={newAddress.detail}
                            onChange={(e) => setNewAddress({ ...newAddress, detail: e.target.value })}
                            className="rounded-xl"
                        />
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-xl"
                                onClick={() => setShowAddForm(false)}
                            >
                                Huỷ
                            </Button>
                            <Button
                                className="flex-1 rounded-xl shadow-md shadow-orange-200"
                                onClick={handleAddAddress}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Lưu
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Address List */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl h-28 animate-pulse shadow-sm" />
                        ))}
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="text-center py-16">
                        <Home className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ nào.</p>
                        <Button onClick={() => setShowAddForm(true)} className="rounded-xl shadow-md shadow-orange-200">
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm địa chỉ đầu tiên
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {addresses.map((addr) => (
                            <Card
                                key={addr.id}
                                className={cn(
                                    "p-4 border-none shadow-sm rounded-2xl bg-white transition-all hover:shadow-md",
                                    addr.isDefault && "ring-2 ring-orange-500 ring-offset-2"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-9 h-9 rounded-xl flex items-center justify-center",
                                            addr.isDefault ? "bg-orange-500 text-white shadow-md" : "bg-gray-100 text-gray-400"
                                        )}>
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm">{addr.name}</h3>
                                            {addr.phone && (
                                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {addr.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {addr.isDefault && (
                                        <Badge variant="success" className="text-[10px] px-2">
                                            <Star className="w-3 h-3 mr-1 fill-current" />
                                            Mặc định
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-2 ml-11">{addr.detail || addr.address}</p>
                                {!addr.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(addr.id)}
                                        className="mt-3 ml-11 text-xs font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
                                    >
                                        <Check className="w-3 h-3" />
                                        Đặt làm mặc định
                                    </button>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
