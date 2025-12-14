import React, { useEffect, useState } from 'react';
import { getProducts, updateProductDetails, getAllCategories } from '../services/storage';
import { Product, UnitType } from '../types';
import { Search, Filter, Edit2, X, Save } from 'lucide-react';

export const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  
  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProducts(getProducts());
    setCategories(getAllCategories());
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search);
    const matchesCat = filterCat === 'all' || p.category === filterCat;
    return matchesSearch && matchesCat;
  });

  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProductDetails(editingProduct);
      setEditingProduct(null);
      loadData();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Mahsulotlar</h2>
          <p className="text-gray-500 mt-1">Ombor zaxirasini boshqarish</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-sm font-medium text-gray-600">
          Jami: <span className="text-gray-900 font-bold">{products.length}</span> ta
        </div>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Qidirish (Nomi, Shtrix-kod)..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent rounded-xl outline-none text-gray-800 placeholder-gray-400"
          />
        </div>
        <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
        <div className="flex items-center gap-3 px-4">
          <Filter className="text-gray-400" size={20} />
          <select 
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            className="bg-transparent outline-none text-gray-700 font-medium cursor-pointer"
          >
            <option value="all">Barcha Kategoriyalar</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="px-6 py-5">Mahsulot Nomi</th>
              <th className="px-6 py-5">Kategoriya</th>
              <th className="px-6 py-5">Shtrix-kod</th>
              <th className="px-6 py-5 text-center">Miqdor</th>
              <th className="px-6 py-5">Birlik</th>
              <th className="px-6 py-5">So'nggi O'zgarish</th>
              <th className="px-6 py-5 text-center">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 font-semibold text-gray-900">{product.name}</td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium border border-gray-200">{product.category}</span>
                </td>
                <td className="px-6 py-4 font-mono text-gray-500 text-sm">{product.barcode}</td>
                <td className={`px-6 py-4 text-center font-bold ${product.quantity < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                  {product.quantity}
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{product.unit.toUpperCase()}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {new Date(product.lastUpdated).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => handleEditClick(product)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Tahrirlash"
                  >
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  Mahsulot topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-white px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-xl text-gray-900">Mahsulotni Tahrirlash</h3>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nomi</label>
                <input 
                  type="text" 
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl px-5 py-3 outline-none transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Kategoriya</label>
                <div className="relative">
                  <select 
                    value={editingProduct.category}
                    onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl px-5 py-3 outline-none transition-all font-medium appearance-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Birlik</label>
                <div className="relative">
                  <select
                    value={editingProduct.unit}
                    onChange={e => setEditingProduct({...editingProduct, unit: e.target.value as UnitType})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl px-5 py-3 outline-none transition-all font-medium appearance-none"
                  >
                     {Object.values(UnitType).map(u => (
                        <option key={u} value={u}>{u.toUpperCase()}</option>
                     ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Shtrix-kod</label>
                <input 
                  type="text" 
                  value={editingProduct.barcode}
                  onChange={e => setEditingProduct({...editingProduct, barcode: e.target.value})}
                  className="w-full bg-gray-100 border-2 border-transparent rounded-2xl px-5 py-3 outline-none text-gray-500 font-mono"
                />
              </div>

              <div className="pt-6 flex justify-end gap-3">
                 <button 
                   type="button" 
                   onClick={() => setEditingProduct(null)}
                   className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                 >
                   Bekor qilish
                 </button>
                 <button 
                   type="submit" 
                   className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                 >
                   <Save size={18} />
                   Saqlash
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};