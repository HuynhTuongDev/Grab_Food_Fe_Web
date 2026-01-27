import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Store, Tag, Receipt, Settings, LogOut, Menu, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/Button';

export default function AdminLayout() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const MENU_ITEMS = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'User Management', path: '/admin/users', icon: Users },
        { name: 'Store Management', path: '/admin/stores', icon: Store },
        { name: 'Category Mgmt', path: '/admin/categories', icon: Tag },
        { name: 'Transactions', path: '/admin/transactions', icon: Receipt },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* SIDEBAR */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
                    !isSidebarOpen && "-translate-x-full md:hidden"
                )}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-white">FoodDelivery</span>
                        <span className="text-xs text-orange-500 font-bold px-1.5 py-0.5 bg-orange-900/30 rounded">ADMIN</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {MENU_ITEMS.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                                isActive(item.path)
                                    ? "bg-orange-600 text-white shadow-lg shadow-orange-900/20"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
                    <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold">AD</div>
                        <div>
                            <p className="text-sm font-medium text-white">Admin User</p>
                            <p className="text-xs text-gray-500">admin@food...</p>
                        </div>
                    </div>
                    <Link to="/">
                        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800">
                            <LogOut className="w-4 h-4 mr-2" /> Back to Customer App
                        </Button>
                    </Link>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* TOP BAR */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="mr-4 text-gray-500 hover:text-gray-700 md:hidden">
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg font-semibold text-gray-800">
                            {MENU_ITEMS.find(i => isActive(i.path))?.name || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 hidden sm:inline-block">Thứ Hai, 27 tháng 1, 2026</span>
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border border-orange-200">
                            AD
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}
