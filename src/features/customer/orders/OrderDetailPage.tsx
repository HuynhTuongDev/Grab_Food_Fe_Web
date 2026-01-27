import { ArrowLeft, MapPin, Package2, Clock, Phone, Store, Receipt, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { orderApi } from '../../../api/api';
import { cn } from '../../../lib/utils';

const STATUS_STEPS = [
    { label: 'Chờ xử lý', icon: Clock },
    { label: 'Đang chuẩn bị', icon: Store },
    { label: 'Đang giao', icon: Package2 },
    { label: 'Hoàn thành', icon: CheckCircle2 }
];

export default function OrderDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) return;
            try {
                const res = await orderApi.getById(id);
                setOrder(res.data);
            } catch (error) {
                console.error(error);
                toast.error("Không thể tải chi tiết đơn hàng");
                navigate('/orders');
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [id, navigate]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center p-4"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
    if (!order) return null;

    const currentStatus = order.status || 0;

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* HEADER */}
            <div className="bg-white p-4 sticky top-0 z-40 shadow-sm flex items-center space-x-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* STATUS TRACKER */}
                <Card className="p-6 border-none shadow-sm rounded-3xl bg-white overflow-hidden relative">
                    <div className="flex justify-between relative z-10">
                        {STATUS_STEPS.map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center flex-1">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-500",
                                    idx <= currentStatus ? "bg-orange-500 text-white shadow-lg shadow-orange-100" : "bg-gray-100 text-gray-300"
                                )}>
                                    <step.icon className="w-5 h-5" />
                                </div>
                                <span className={cn(
                                    "text-[8px] uppercase tracking-widest font-black text-center",
                                    idx <= currentStatus ? "text-orange-500" : "text-gray-300"
                                )}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                        {/* Connecting Line */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 -z-0" style={{ left: '12.5%', right: '12.5%' }} />
                        <div
                            className="absolute top-5 left-0 h-0.5 bg-orange-500 -z-0 transition-all duration-1000"
                            style={{
                                left: '12.5%',
                                width: `${(Math.min(currentStatus, 3) / 3) * 75}%`
                            }}
                        />
                    </div>
                </Card>

                {/* STORE INFO */}
                <Card className="p-4 border-none shadow-sm rounded-3xl bg-white flex items-center space-x-4">
                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center overflow-hidden">
                        <img src={order.store?.imageSrc || ''} className="w-full h-full object-cover" alt="store" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 leading-tight">{order.store?.name || 'Nhà hàng của bạn'}</h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <MapPin className="w-3 h-3 mr-1 text-orange-500" />
                            {order.store?.address || 'Địa chỉ lấy hàng'}
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" className="bg-gray-50 rounded-xl">
                        <Phone className="w-4 h-4 text-orange-600" />
                    </Button>
                </Card>

                {/* ORDER DETAILS */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-900 font-bold ml-1">
                        <Receipt className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Tóm tắt đơn hàng</span>
                    </div>
                    <Card className="p-6 border-none shadow-sm rounded-3xl bg-white space-y-4">
                        <div className="space-y-3">
                            {order.orderLines?.map((line: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center font-bold text-gray-400">
                                            {line.quantity}x
                                        </div>
                                        <span className="font-medium text-gray-700">{line.foodStore?.food?.name || 'Sản phẩm'}</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{(line.price * line.quantity).toLocaleString()}đ</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-center mt-4">
                            <div className="text-xs text-gray-400 font-medium">
                                ID: #{order.id.toUpperCase()} <br />
                                Ngày: {new Date(order.orderDate).toLocaleString('vi-VN')}
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Tổng cộng</p>
                                <span className="text-2xl font-black text-orange-600">{(order.totalAmount || 0).toLocaleString()}đ</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* DELIVERY ADDRESS */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-900 font-bold ml-1">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Địa chỉ giao hàng</span>
                    </div>
                    <Card className="p-4 border-none shadow-sm rounded-3xl bg-white">
                        <p className="text-sm text-gray-600 leading-relaxed italic">
                            "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
                        </p>
                    </Card>
                </div>
            </div>

            {/* FLOATING ACTION */}
            <div className="fixed bottom-4 left-4 right-4 z-40 bg-white/80 backdrop-blur-lg p-2 rounded-3xl border border-gray-100 shadow-2xl flex space-x-2">
                <Button variant="outline" className="flex-1 py-6 rounded-2xl font-bold border-gray-200">HỖ TRỢ</Button>
                <Button className="flex-1 py-6 rounded-2xl font-bold shadow-lg shadow-orange-100" onClick={() => navigate('/')}>ĐẶT LẠI</Button>
            </div>
        </div>
    );
}
