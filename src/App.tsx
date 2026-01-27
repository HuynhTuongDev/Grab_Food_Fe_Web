import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import LoginPage from './features/customer/LoginPage';
import RegisterPage from './features/customer/RegisterPage';
import CustomerLayout from './features/customer/layout/CustomerLayout';
import HomePage from './features/customer/home/HomePage';
import CartPage from './features/customer/cart/CartPage';
import WalletPage from './features/customer/wallet/WalletPage';
import OrderHistoryPage from './features/customer/orders/OrderHistoryPage';
import OrderDetailPage from './features/customer/orders/OrderDetailPage';
import ProductDetail from './features/customer/product/ProductDetail';

// Admin Imports
import AdminLayout from './features/admin/layout/AdminLayout';
import AdminDashboard from './features/admin/dashboard/Dashboard';
import UserManagement from './features/admin/users/UserManagement';
import StoreManagement from './features/admin/stores/StoreManagement';
import CategoryManagement from './features/admin/categories/CategoryManagement';
import Transactions from './features/admin/transactions/Transactions';
import Settings from './features/admin/settings/Settings';

// Manager Imports
import ManagerLayout from './features/manager/layout/ManagerLayout';
import OrderDashboard from './features/manager/orders/OrderDashboard';
import MenuManagement from './features/manager/menu/MenuManagement';
import StoreProfile from './features/manager/profile/StoreProfile';

function App() {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Customer Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="orders" element={<OrderHistoryPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="stores" element={<StoreManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Manager Routes */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="orders" element={<OrderDashboard />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="store" element={<StoreProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
