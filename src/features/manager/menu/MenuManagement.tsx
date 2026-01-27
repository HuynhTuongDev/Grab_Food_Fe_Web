import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Search, Plus } from 'lucide-react';

export default function MenuManagement() {
    const [items, setItems] = useState([
        { id: 1, name: 'Phở Bò Tái', price: 45000, active: true },
        { id: 2, name: 'Bún Bò Huế', price: 55000, active: false },
        { id: 3, name: 'Pizza Hải Sản', price: 89000, active: true },
    ]);

    const toggleItem = (id: number) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, active: !item.active } : item));
    };

    return (
        <div className="p-4">
            <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input className="pl-9" placeholder="Tìm món ăn..." />
                </div>
                <Button size="icon" className="bg-[#FF5C28] hover:bg-[#E54D1F]">
                    <Plus className="w-5 h-5" />
                </Button>
            </div>

            <div className="space-y-3">
                {items.map(item => (
                    <Card key={item.id} className="p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                <p className="text-sm text-gray-500">{item.price.toLocaleString()}đ</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            <button onClick={() => toggleItem(item.id)} className={`px-2 py-1 rounded text-xs font-bold text-white transition-colors ${item.active ? 'bg-green-500' : 'bg-gray-400'}`}>
                                {item.active ? 'ĐANG BÁN' : 'HẾT MÓN'}
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
