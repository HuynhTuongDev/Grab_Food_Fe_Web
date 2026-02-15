import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Settings, X } from 'lucide-react';
import { foodApi, foodTypeApi } from '../../../api/api';
import type { FoodDto } from '../../../types/swagger';
import { toast } from 'sonner';

const MenuManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<FoodDto[]>([]);
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Category Management State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // New Item Form
  const [newItem, setNewItem] = useState({
    name: '',
    imageSrc: '',
    price: 0,
    foodTypeId: 1, // default
    isAvailable: true
  });

  const fetchData = async () => {
    try {
      const [foodRes, typeRes] = await Promise.all([
        foodApi.getAll(),
        foodTypeApi.getAll()
      ]);
      setMenuItems(Array.isArray(foodRes.data) ? foodRes.data : []);
      setCategories(Array.isArray(typeRes.data) ? typeRes.data : []);
      // Set default type ID if categories exist
      if (Array.isArray(typeRes.data) && typeRes.data.length > 0) {
        setNewItem(prev => ({ ...prev, foodTypeId: typeRes.data[0].id }));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    try {
      await foodApi.create(newItem);
      toast.success("Food item created");
      setIsModalOpen(false);
      fetchData();
    } catch {
      toast.error("Failed to create item");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await foodApi.delete(id);
      toast.success("Item deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      await foodTypeApi.create({ name: newCatName });
      toast.success("Category created");
      setNewCatName('');
      fetchData();
    } catch {
      toast.error("Failed to create category");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Delete this category? Items in it may be affected.")) return;
    try {
      await foodTypeApi.delete(id);
      toast.success("Category deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete category");
    }
  };



  /* Removed hardcoded categories array - duplicate variable */

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.foodTypeId === selectedCategory;
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /* Removed unused toggleAvailability and deleteItem helpers that were not async/connected to API */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Menu Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your restaurant menu and items</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Categories */}
        <div className="rounded-xl bg-white dark:bg-[#2d1b15] p-6 shadow-sm border border-gray-200 dark:border-gray-800 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Categories</h3>
            <button
              onClick={() => setIsCatModalOpen(true)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500"
              title="Manage Categories"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-all ${selectedCategory === 'All'
                ? 'bg-orange-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              All Items
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`text-left px-4 py-3 rounded-lg font-medium transition-all ${selectedCategory === category.id
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </nav>
          <div className="mt-6 p-4 rounded-lg bg-orange-100 dark:bg-orange-500/20 border border-orange-200 dark:border-orange-800">
            <p className="text-sm font-bold text-orange-800 dark:text-orange-200">Total Items</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-500 mt-1">{menuItems.length}</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#2d1b15] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Items Table */}
          <div className="rounded-xl bg-white dark:bg-[#2d1b15] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading menu items...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Availability</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <img
                              src={item.imageSrc}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300">
                              {item.foodTypeName}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900 dark:text-white">{item.price?.toLocaleString('vi-VN')}₫</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-gray-900 dark:text-white">-</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${item.isAvailable
                                ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'
                                }`}
                            >
                              {item.isAvailable ? 'Available' : 'Out of Stock'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          No items found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredItems.length} of {menuItems.length} items
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Previous
              </button>
              <button className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#2d1b15] rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Add New Item</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Item Name</label>
                <input
                  type="text"
                  placeholder="Enter item name"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onChange={(e) => setNewItem({ ...newItem, foodTypeId: Number(e.target.value) })}
                  value={newItem.foodTypeId}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price</label>
                <input
                  type="number"
                  placeholder="Enter price"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                />
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
                <input
                  type="text"
                  placeholder="Image URL"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg"
                  value={newItem.imageSrc}
                  onChange={(e) => setNewItem({ ...newItem, imageSrc: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Category Management Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#2d1b15] rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Categories</h2>
              <button onClick={() => setIsCatModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="New Category Name"
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-white"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
              />
              <button
                onClick={handleCreateCategory}
                disabled={!newCatName.trim()}
                className="px-4 py-2 bg-orange-600 text-white font-bold rounded-lg disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg group">
                  <span className="font-medium text-gray-900 dark:text-gray-200">{cat.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 bg-white dark:bg-gray-800 text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
