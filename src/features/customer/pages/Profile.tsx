import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../../api/api';
import { authStorage } from '../../../utils/auth';
import type { UserProfileDto } from '../../../types/swagger';
import { LogOut, User, Mail, Shield, Wallet, Loader2 } from 'lucide-react';

export function CustomerProfile() {
    const [profile, setProfile] = useState<UserProfileDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [signingOut, setSigningOut] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await userApi.profile();
            const data: any = res.data;
            console.log('DEBUG - Profile API response (after unwrap):', JSON.stringify(data));

            if (data && (data.id || data.email || data.name)) {
                setProfile(data as UserProfileDto);
            } else {
                setError('Dữ liệu trả về không đúng định dạng.');
            }
        } catch (err: any) {
            console.error('Failed to fetch profile:', err);
            setError(err.response?.data?.message || 'Không thể tải thông tin cá nhân. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            setSigningOut(true);
            await userApi.signOut();
        } catch (err) {
            console.warn('Sign-out API call failed, clearing local session anyway:', err);
        } finally {
            authStorage.clear();
            localStorage.removeItem('bypass_user');
            setSigningOut(false);
            navigate('/login', { replace: true });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                    <p className="text-gray-500 text-sm">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] p-6">
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-sm w-full">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2">Lỗi</h2>
                    <p className="text-gray-500 text-sm mb-6">{error}</p>
                    <button
                        onClick={fetchProfile}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-lg mx-auto">
            {/* Header */}
            <h1 className="text-xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h1>

            {/* Avatar & Name Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-2xl font-bold">
                        {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">{profile?.name || 'N/A'}</h2>
                        <p className="text-orange-100 text-sm">{profile?.roleName || 'Customer'}</p>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="space-y-3 mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Email</p>
                        <p className="text-sm font-semibold text-gray-800">{profile?.email || 'N/A'}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Vai trò</p>
                        <p className="text-sm font-semibold text-gray-800">{profile?.roleName || 'Customer'}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Số dư</p>
                        <p className="text-sm font-semibold text-green-600">
                            {profile?.balance != null
                                ? profile.balance.toLocaleString('vi-VN') + ' ₫'
                                : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Sign Out Button */}
            <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {signingOut ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <LogOut className="w-5 h-5" />
                )}
                {signingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
            </button>
        </div>
    );
}
