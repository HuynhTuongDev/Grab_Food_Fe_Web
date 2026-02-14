import { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Search } from 'lucide-react';
import { storeApi } from '../../../api/api';
import type { StoreDto } from '../../../types/swagger';
import { toast } from 'sonner';

const StoreManagement = () => {
    const [stores, setStores] = useState<StoreDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const res = await storeApi.getAll();
            setStores(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Failed to fetch stores", error);
            toast.error("Failed to load stores");
        } finally {
            setLoading(false);
        }
    };

    const filteredStores = stores.filter(store =>
        store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Store Management</h2>
                <p className="text-gray-600 dark:text-gray-400">View and manage all registered stores.</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search stores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#2d1b15] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-orange-500"
                />
            </div>

            {/* Store Grid */}
            {loading ? (
                <div className="text-center py-10">Loading stores...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStores.map((store) => (
                        <div key={store.id} className="bg-white dark:bg-[#2d1b15] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-32 bg-gray-200 dark:bg-gray-800 relative">
                                {store.imageSrc ? (
                                    <img src={store.imageSrc} alt={store.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Store className="w-12 h-12" />
                                    </div>
                                )}
                            </div>
                            <div className="p-5 space-y-3">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate" title={store.name}>{store.name}</h3>

                                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span className="line-clamp-2">{store.address || 'No address provided'}</span>
                                </div>

                                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                    <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300">
                                        ID: {store.id}
                                    </span>
                                    <button className="text-orange-600 font-bold text-sm hover:underline">View Details</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {!loading && filteredStores.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No stores found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default StoreManagement;
