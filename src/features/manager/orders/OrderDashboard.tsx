import { useState, useEffect } from 'react';
import { Clock, User, Check, X, Phone, RefreshCw } from 'lucide-react';
import { managerApi } from '../../../api/api';
import type { OrderDto } from '../../../types/swagger';
import { toast } from 'sonner';

const OrderDashboard = () => {
  const [activeTab, setActiveTab] = useState<'New' | 'Preparing' | 'Ready' | 'Delivering'>('New');
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await managerApi.getOrders();
      // Ensure we always have an array
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and Polling every 15s
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await managerApi.updateStatus(orderId, status);
      toast.success(`Order updated to ${status}`);
      fetchOrders(); // Refresh immediately
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const tabs = [
    { id: 'New' as const, label: 'New', color: 'text-red-600 border-red-600' },
    { id: 'Preparing' as const, label: 'Preparing', color: 'text-yellow-600 border-yellow-600' },
    { id: 'Ready' as const, label: 'Ready', color: 'text-blue-600 border-blue-600' },
    { id: 'Delivering' as const, label: 'Delivering', color: 'text-green-600 border-green-600' }
  ];

  const filteredOrders = orders.filter(o => o.status === activeTab);

  // Calculate counts for tabs
  const counts = orders.reduce((acc, order) => {
    const s = order.status as string;
    if (s === 'New' || s === 'Preparing' || s === 'Ready' || s === 'Delivering') {
      acc[s] = (acc[s] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const getTimeString = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header with Store Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Status */}
        <div className="rounded-xl bg-white dark:bg-[#2d1b15] p-6 shadow-sm border border-gray-200 dark:border-gray-800 border-l-4 border-l-orange-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">
                Store Status
              </p>
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-lg font-bold text-white ${isOpen ? 'bg-green-600' : 'bg-red-600'}`}>
                  {isOpen ? '🟢 OPEN' : '🔴 CLOSED'}
                </div>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`relative w-12 h-7 rounded-full transition-all ${isOpen ? 'bg-green-600' : 'bg-gray-400'}`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${isOpen ? 'right-1' : 'left-1'
                      }`}
                  ></div>
                </button>
              </div>
            </div>
            <button onClick={fetchOrders} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors" title="Refresh Orders">
              <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white p-6 shadow-lg">
          <p className="text-orange-100 text-sm font-bold uppercase tracking-wider mb-2">
            Today's Revenue
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold">
              ₫{orders.filter(o => o.status === 'Completed' || o.status === 'Delivering').reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
            </h3>
            <span className="text-orange-200 text-sm">approx.</span>
          </div>
        </div>
      </div>

      {/* Order Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap border-2 ${activeTab === tab.id
                ? `border-transparent text-white bg-gradient-to-r ${tab.id === 'New'
                  ? 'from-red-600 to-red-700'
                  : tab.id === 'Preparing'
                    ? 'from-yellow-600 to-yellow-700'
                    : tab.id === 'Ready'
                      ? 'from-blue-600 to-blue-700'
                      : 'from-green-600 to-green-700'
                }`
                : `border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2d1b15] hover:border-gray-300`
              }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id
                ? 'bg-white/30 text-white'
                : `${tab.color.split(' ')[0]} text-opacity-20 bg-opacity-10`
              }`}>
              {counts[tab.id] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl bg-white dark:bg-[#2d1b15] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Card Header */}
              <div className={`p-4 ${activeTab === 'New'
                  ? 'bg-red-50 dark:bg-red-500/10 border-b-2 border-red-600'
                  : activeTab === 'Preparing'
                    ? 'bg-yellow-50 dark:bg-yellow-500/10 border-b-2 border-yellow-600'
                    : activeTab === 'Ready'
                      ? 'bg-blue-50 dark:bg-blue-500/10 border-b-2 border-blue-600'
                      : 'bg-green-50 dark:bg-green-500/10 border-b-2 border-green-600'
                }`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">#{order.id.slice(-6)}</p>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm mt-1">
                      <Clock className="w-4 h-4" />
                      {getTimeString(order.orderDate)}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-500">
                    ₫{order.totalAmount.toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-4">
                {/* Customer Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-bold">{order.user?.name || 'Guest'}</p>
                      {order.user?.phone && (
                        <a
                          href={`tel:${order.user.phone}`}
                          className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          {order.user.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Items</p>
                  {order.orderDetails?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.quantity}x {item.foodName}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        ₫{(item.price * item.quantity).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Notes if any */}
                {order.note && (
                  <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-lg p-2">
                    <p className="text-xs font-bold text-orange-800 dark:text-orange-200 mb-1">Notes:</p>
                    <p className="text-xs text-orange-700 dark:text-orange-300 italic">{order.note}</p>
                  </div>
                )}

                {/* Driver info if delivering */}
                {order.status === 'Delivering' && order.driverName && (
                  <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg p-2">
                    <p className="text-xs font-bold text-green-800 dark:text-green-200">🛵 Driver: {order.driverName}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex gap-2">
                {activeTab === 'New' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'Preparing')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'Cancelled')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                {activeTab === 'Preparing' && (
                  <button
                    onClick={() => handleStatusUpdate(order.id, 'Ready')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Ready for Delivery
                  </button>
                )}
                {activeTab === 'Ready' && (
                  <div className="w-full text-center py-2 text-gray-500 dark:text-gray-400 font-bold">
                    Waiting for Driver
                  </div>
                )}
                {activeTab === 'Delivering' && (
                  <div className="w-full text-center py-2 text-green-600 dark:text-green-400 font-bold">
                    In Delivery
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">No orders in this status</p>
            {isLoading && <p className="text-sm text-gray-400 mt-2">Updating...</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDashboard;
