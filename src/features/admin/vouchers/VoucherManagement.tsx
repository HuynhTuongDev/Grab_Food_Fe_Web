import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Ticket, X, Calendar } from 'lucide-react';
import { voucherApi } from '../../../api/api';
import { toast } from 'sonner';

export default function VoucherManagement() {
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);

    const [form, setForm] = useState({
        code: '',
        discountAmount: 0,
        minOrderAmount: 0,
        expiryDate: '',
        isActive: true
    });

    const fetchVouchers = async () => {
        try {
            const res = await voucherApi.getAll();
            setVouchers(Array.isArray(res.data) ? res.data : []);
        } catch {
            console.error('Failed to fetch vouchers');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchVouchers(); }, []);

    const resetForm = () => {
        setForm({ code: '', discountAmount: 0, minOrderAmount: 0, expiryDate: '', isActive: true });
        setEditing(null);
    };

    const handleEdit = (v: any) => {
        setEditing(v);
        setForm({
            code: v.code || '',
            discountAmount: v.discountAmount || 0,
            minOrderAmount: v.minOrderAmount || 0,
            expiryDate: v.expiryDate ? v.expiryDate.split('T')[0] : '',
            isActive: v.isActive ?? true
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...form,
                expiryDate: new Date(form.expiryDate).toISOString()
            };
            if (editing) {
                await voucherApi.update(editing.id, payload);
                toast.success('Voucher updated');
            } else {
                await voucherApi.create(payload);
                toast.success('Voucher created');
            }
            setIsModalOpen(false);
            resetForm();
            fetchVouchers();
        } catch {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this voucher?')) return;
        try {
            await voucherApi.delete(id);
            toast.success('Voucher deleted');
            fetchVouchers();
        } catch {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Voucher Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage discount codes</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    New Voucher
                </button>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white dark:bg-[#2d1b15] rounded-xl h-20 animate-pulse shadow-sm" />
                    ))}
                </div>
            ) : vouchers.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-[#2d1b15] rounded-xl shadow-sm">
                    <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No vouchers found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vouchers.map(v => (
                        <div key={v.id} className="bg-white dark:bg-[#2d1b15] rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2">
                                <span className={`px-2 py-1 text-xs font-bold rounded-bl-lg ${v.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {v.isActive ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                                    <Ticket className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white tracking-wide">{v.code}</h3>
                                    <p className="text-orange-600 font-bold text-xl">
                                        -{v.discountAmount?.toLocaleString()}đ
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Min order: {v.minOrderAmount?.toLocaleString()}đ
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                                        <Calendar className="w-3 h-3" />
                                        Exp: {new Date(v.expiryDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={() => handleEdit(v)}
                                    className="flex-1 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    <Edit2 className="w-4 h-4" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(v.id)}
                                    className="flex-1 py-1.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-[#2d1b15] rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editing ? 'Edit Voucher' : 'New Voucher'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Code</label>
                                <input
                                    type="text"
                                    value={form.code}
                                    onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 dark:bg-gray-900 dark:text-white"
                                    placeholder="SALE50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Discount</label>
                                    <input
                                        type="number"
                                        value={form.discountAmount}
                                        onChange={e => setForm({ ...form, discountAmount: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 dark:bg-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Min Order</label>
                                    <input
                                        type="number"
                                        value={form.minOrderAmount}
                                        onChange={e => setForm({ ...form, minOrderAmount: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 dark:bg-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                                <input
                                    type="date"
                                    value={form.expiryDate}
                                    onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 dark:bg-gray-900 dark:text-white"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={form.isActive}
                                    onChange={e => setForm({ ...form, isActive: e.target.checked })}
                                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                                />
                                <label htmlFor="isActive" className="text-sm font-bold text-gray-700 dark:text-gray-300">Active</label>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!form.code || !form.expiryDate}
                                className="flex-1 px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                            >
                                {editing ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
