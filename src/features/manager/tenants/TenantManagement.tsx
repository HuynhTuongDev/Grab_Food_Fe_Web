import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Building2, X } from 'lucide-react';
import { tenantApi } from '../../../api/api';
import { toast } from 'sonner';

export default function TenantManagement() {
    const [tenants, setTenants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({ name: '', description: '', address: '', phone: '' });

    const fetchTenants = async () => {
        try {
            const res = await tenantApi.getAll();
            setTenants(Array.isArray(res.data) ? res.data : []);
        } catch {
            console.error('Failed to fetch tenants');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchTenants(); }, []);

    const handleSubmit = async () => {
        try {
            if (editing) {
                await tenantApi.update({ ...form, id: editing.id });
                toast.success('Cập nhật thành công');
            } else {
                await tenantApi.create(form);
                toast.success('Tạo thành công');
            }
            setShowForm(false);
            setEditing(null);
            setForm({ name: '', description: '', address: '', phone: '' });
            fetchTenants();
        } catch {
            toast.error('Thao tác thất bại');
        }
    };

    const handleEdit = (tenant: any) => {
        setEditing(tenant);
        setForm({
            name: tenant.name || '',
            description: tenant.description || '',
            address: tenant.address || '',
            phone: tenant.phone || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xoá tenant này?')) return;
        try {
            await tenantApi.delete(id);
            toast.success('Đã xoá');
            fetchTenants();
        } catch {
            toast.error('Không thể xoá');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tenant Management</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage store tenants</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', description: '', address: '', phone: '' }); }}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Tenant
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-[#2d1b15] rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editing ? 'Edit Tenant' : 'New Tenant'}</h2>
                            <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <input
                                type="text" placeholder="Tenant Name" value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            />
                            <input
                                type="text" placeholder="Description" value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            />
                            <input
                                type="text" placeholder="Address" value={form.address}
                                onChange={e => setForm({ ...form, address: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            />
                            <input
                                type="text" placeholder="Phone" value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => { setShowForm(false); setEditing(null); }}
                                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit} disabled={!form.name.trim()}
                                className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg disabled:opacity-50 transition-colors"
                            >
                                {editing ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tenant List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white dark:bg-[#2d1b15] rounded-xl h-20 animate-pulse shadow-sm" />
                    ))}
                </div>
            ) : tenants.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-[#2d1b15] rounded-xl shadow-sm">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No tenants found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tenants.map(t => (
                        <div key={t.id} className="bg-white dark:bg-[#2d1b15] rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{t.name}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{t.description || 'No description'}</p>
                                    </div>
                                </div>
                            </div>
                            {t.address && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">📍 {t.address}</p>}
                            {t.phone && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">📞 {t.phone}</p>}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(t)}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-orange-600 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 font-bold transition-colors"
                                >
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(t.id)}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 font-bold transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
