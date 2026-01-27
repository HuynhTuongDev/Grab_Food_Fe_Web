import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Clock, User, Check, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toast } from 'sonner';

const ORDERS_DATA = [
    { id: 'ORD001', status: 'pending', time: '2 phút', user: 'Nguyễn Văn A', phone: '0901234567', total: 95000, items: ['Phở Bò Tái x2', 'Trà Đá x1'], note: 'Ít hành' },
    { id: 'ORD002', status: 'pending', time: '5 phút', user: 'Trần Văn B', phone: '0909999999', total: 120000, items: ['Cơm Gà x2'], note: '' },
    { id: 'ORD003', status: 'preparing', time: '12 phút', user: 'Lê Thị C', phone: '0912345678', total: 55000, items: ['Bún Bò Huế x1'], note: '' },
    { id: 'ORD004', status: 'ready', time: '18 phút', user: 'Phạm Thị D', phone: '0987654321', total: 89000, items: ['Pizza Hải Sản x1'], note: '' },
    { id: 'ORD005', status: 'delivering', time: '25 phút', user: 'Trương Văn E', phone: '0966666666', total: 110000, items: ['Bún Chả x2'], note: '', driver: 'Nguyễn Văn X' },
];

export default function OrderDashboard() {
    const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'ready' | 'delivering'>('pending');
    const [isOpen, setIsOpen] = useState(true);

    const filteredOrders = ORDERS_DATA.filter(o => o.status === activeTab);

    const handleAction = (id: string, action: string) => {
        toast.success(`Đã ${action} đơn hàng ${id}`);
    };

    return (
        <div className="p-4">
            {/* STORE STATUS */}
            <Card className="mb-4 p-4 flex justify-between items-center bg-white border-l-4 border-l-[#FF5C28]">
                <div>
                    <p className="text-gray-500 text-sm">Trạng thái cửa hàng:</p>
                    <div className="flex items-center space-x-2 mt-1">
                        {isOpen ? <Badge className="bg-green-500 hover:bg-green-600">ĐANG MỞ CỬA</Badge> : <Badge variant="secondary">ĐÃ ĐÓNG</Badge>}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={isOpen} onChange={() => setIsOpen(!isOpen)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-gray-500 text-sm">Doanh thu hôm nay:</p>
                    <h2 className="text-xl font-bold text-gray-900">1,250,000đ</h2>
                </div>
            </Card>

            {/* TABS */}
            <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide mb-4">
                {[
                    { id: 'pending', label: 'Mới', count: 2, color: 'text-red-500 border-red-500' },
                    { id: 'preparing', label: 'Nấu', count: 1, color: 'text-yellow-500 border-yellow-500' },
                    { id: 'ready', label: 'Sẵn', count: 1, color: 'text-blue-500 border-blue-500' },
                    { id: 'delivering', label: 'Giao', count: 1, color: 'text-green-500 border-green-500' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex-1 min-w-[80px] py-2 px-1 text-sm font-medium border-b-2 transition-colors flex flex-col items-center justify-center",
                            activeTab === tab.id ? tab.color : "border-transparent text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <span className="flex items-center">
                            {tab.label}
                            <span className={cn("ml-1 text-xs px-1.5 rounded-full text-white", activeTab === tab.id ? tab.color.replace('text-', 'bg-').replace('border-', '') : "bg-gray-400")}>
                                {tab.count}
                            </span>
                        </span>
                    </button>
                ))}
            </div>

            {/* ORDERS LIST */}
            <div className="space-y-4">
                {filteredOrders.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Không có đơn hàng nào</p>
                    </div>
                )}

                {filteredOrders.map((order) => (
                    <Card key={order.id} className={cn("p-4 border-l-4 shadow-sm", activeTab === 'pending' ? "border-l-red-500 animate-pulse" : "border-l-gray-300")}>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-bold text-gray-900">#{order.id}</span>
                                    {order.status === 'pending' && <span className="text-red-500 text-xs font-bold animate-pulse">🔴 Mới</span>}
                                </div>
                                <div className="flex items-center text-xs text-orange-600 mt-1 font-medium">
                                    <Clock className="w-3 h-3 mr-1" /> {order.time}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg">{order.total.toLocaleString()}đ</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg mb-3 text-sm space-y-2">
                            <div className="flex items-start">
                                <User className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium">{order.user}</p>
                                    <a href={`tel:${order.phone}`} className="text-blue-500 text-xs">{order.phone}</a>
                                </div>
                            </div>
                            {/* Items */}
                            <div className="border-t border-gray-200 pt-2 mt-2">
                                {order.items.map((item, idx) => (
                                    <p key={idx} className="text-gray-700">• {item}</p>
                                ))}
                            </div>
                            {order.note && (
                                <div className="text-xs text-red-500 italic mt-1 bg-red-50 p-1 rounded">
                                    📝 Ghi chú: {order.note}
                                </div>
                            )}
                        </div>

                        {order.status === 'delivering' && (
                            <div className="mb-3 p-2 bg-green-50 rounded flex items-center text-sm text-green-700">
                                <span className="mr-2">🛵 Tài xế:</span>
                                <span className="font-bold">{order.driver}</span>
                            </div>
                        )}

                        {/* ACTION BUTTONS */}
                        <div className="grid grid-cols-2 gap-3">
                            {activeTab === 'pending' && (
                                <>
                                    <Button className="bg-green-500 hover:bg-green-600" onClick={() => handleAction(order.id, 'nhận')}>
                                        <Check className="w-4 h-4 mr-1" /> NHẬN ĐƠN
                                    </Button>
                                    <Button variant="danger" onClick={() => handleAction(order.id, 'từ chối')}>
                                        <X className="w-4 h-4 mr-1" /> TỪ CHỐI
                                    </Button>
                                </>
                            )}
                            {activeTab === 'preparing' && (
                                <Button className="col-span-2 bg-blue-500 hover:bg-blue-600" onClick={() => handleAction(order.id, 'sẵn sàng')}>
                                    <Check className="w-4 h-4 mr-1" /> SẴN SÀNG GIAO
                                </Button>
                            )}
                            {activeTab === 'ready' && (
                                <Button variant="secondary" disabled className="col-span-2">
                                    Đang chờ tài xế...
                                </Button>
                            )}
                            {activeTab === 'delivering' && (
                                <Button variant="outline" className="col-span-2 text-green-600 border-green-200 bg-green-50">
                                    Đang giao hàng...
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
