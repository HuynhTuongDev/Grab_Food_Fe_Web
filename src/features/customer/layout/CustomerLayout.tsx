import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, CreditCard, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Badge } from '../../../components/ui/Badge';

export default function CustomerLayout() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="pb-20 min-h-screen bg-gray-50">
            <Outlet />

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around z-40 max-w-md mx-auto sm:max-w-full">
                <Link
                    to="/"
                    className={cn(
                        'flex flex-col items-center justify-center w-full h-full space-y-1',
                        isActive('/') ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'
                    )}
                >
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Trang chủ</span>
                </Link>

                <Link
                    to="/cart"
                    className={cn(
                        'flex flex-col items-center justify-center w-full h-full space-y-1 relative',
                        isActive('/cart') ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'
                    )}
                >
                    <div className="relative">
                        <ShoppingCart className="w-6 h-6" />
                        <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                            2
                        </Badge>
                    </div>
                    <span className="text-[10px] font-medium">Giỏ hàng</span>
                </Link>

                <Link
                    to="/wallet"
                    className={cn(
                        'flex flex-col items-center justify-center w-full h-full space-y-1',
                        isActive('/wallet') ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'
                    )}
                >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Ví</span>
                </Link>

                <Link
                    to="/orders"
                    className={cn(
                        'flex flex-col items-center justify-center w-full h-full space-y-1',
                        isActive('/orders') ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'
                    )}
                >
                    <Clock className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Đơn hàng</span>
                </Link>
            </div>
        </div>
    );
}
