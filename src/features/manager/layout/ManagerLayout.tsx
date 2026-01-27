import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, ClipboardList, Store, LogOut } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/Button';

export default function ManagerLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="pb-20 min-h-screen bg-gray-50">
            {/* TOP BAR */}
            <div className="bg-[#FF5C28] text-white p-4 flex justify-between items-center shadow-md">
                <div>
                    <h1 className="font-bold text-lg">Phở Hà Nội</h1>
                    <p className="text-xs opacity-90">Manager Portal</p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 h-8"
                    onClick={() => navigate('/login')}
                >
                    <LogOut className="w-4 h-4 mr-1" /> Thoát
                </Button>
            </div>

            <Outlet />

            {/* BOTTOM NAV */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around z-40 max-w-md mx-auto sm:max-w-full">
                <Link
                    to="/manager/orders"
                    className={cn(
                        'flex flex-col items-center justify-center w-full h-full space-y-1',
                        isActive('/manager/orders') ? 'text-[#FF5C28]' : 'text-gray-500 hover:text-gray-700'
                    )}
                >
                    <Package className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Đơn hàng</span>
                </Link>

                <Link
                    to="/manager/menu"
                    className={cn(
                        'flex flex-col items-center justify-center w-full h-full space-y-1',
                        isActive('/manager/menu') ? 'text-[#FF5C28]' : 'text-gray-500 hover:text-gray-700'
                    )}
                >
                    <ClipboardList className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Thực đơn</span>
                </Link>

                <Link
                    to="/manager/store"
                    className={cn(
                        'flex flex-col items-center justify-center w-full h-full space-y-1',
                        isActive('/manager/store') ? 'text-[#FF5C28]' : 'text-gray-500 hover:text-gray-700'
                    )}
                >
                    <Store className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Cửa hàng</span>
                </Link>
            </div>
        </div>
    );
}
