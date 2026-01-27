import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userApi } from '../../api/api';

export default function LoginPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await userApi.login({ email, password });
            toast.success('Đăng nhập thành công');
            window.location.href = '/'; // Hard redirect to refresh state if needed
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
            toast.error(msg);
            console.error('Login Error Details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">🍕</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">FoodDelivery</h2>
                    <p className="mt-2 text-gray-600">Đặt món ngon, giao tận nơi</p>
                </div>

                <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl text-center">Đăng nhập</CardTitle>
                        <CardDescription className="text-center">Nhập email và mật khẩu của bạn</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="Mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-white"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Link to="#" className="text-sm text-orange-500 hover:underline">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                ĐĂNG NHẬP
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center text-sm text-gray-600">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="ml-1 text-orange-500 font-medium hover:underline">
                            Đăng ký ngay
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
