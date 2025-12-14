import React, { useState, useEffect, useRef } from 'react';
import { getAllCategories, getProductByBarcode, saveProduct, updateStock } from '../services/storage';
import { UnitType, Product } from '../types';
import { Barcode, Plus, Save, Printer, Scan } from 'lucide-react';
import { BarcodeRenderer } from '../components/BarcodeRenderer';

export const Inbound: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [scannedBarcode, setScannedBarcode] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [unit, setUnit] = useState<UnitType>(UnitType.DONA);
  const [quantity, setQuantity] = useState<number>(0);
  const [generatedBarcode, setGeneratedBarcode] = useState('');
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCategories(getAllCategories());
    if (barcodeInputRef.current) barcodeInputRef.current.focus();
  }, []);

  const handleScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const code = scannedBarcode.trim();
      if (!code) return;
      
      const existingProduct = getProductByBarcode(code);
      if (existingProduct) {
        // Populate form
        setName(existingProduct.name);
        setCategory(existingProduct.category);
        setUnit(existingProduct.unit);
        setGeneratedBarcode(existingProduct.barcode);
        setIsNewProduct(false);
        setMessage({ type: 'success', text: 'Mahsulot topildi! Miqdorni kiriting.' });
      } else {
        // Prepare for new product
        setName('');
        setCategory('');
        setUnit(UnitType.DONA);
        setGeneratedBarcode(code);
        setIsNewProduct(true);
        setMessage({ type: 'success', text: 'Yangi mahsulot! Ma\'lumotlarni to\'ldiring.' });
      }
    }
  };

  const generateRandomBarcode = () => {
    const random = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setGeneratedBarcode(random);
    setScannedBarcode(random);
    setIsNewProduct(true);
    setName('');
    setMessage({ type: 'success', text: 'Yangi shtrix-kod yaratildi.' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCategory = newCategory.trim() || category;
    
    if (!name || !finalCategory || !quantity || !generatedBarcode) {
      setMessage({ type: 'error', text: 'Barcha maydonlarni to\'ldiring!' });
      return;
    }

    if (isNewProduct) {
      const newProduct: Product = {
        id: Date.now().toString(),
        name,
        category: finalCategory,
        barcode: generatedBarcode,
        quantity,
        unit,
        lastUpdated: new Date().toISOString()
      };
      saveProduct(newProduct);
      updateStock(newProduct.id, 0, 'kirim');
      setMessage({ type: 'success', text: 'Yangi mahsulot bazaga qo\'shildi!' });
      
      if (newCategory) setCategories(prev => [...prev, newCategory]);
    } else {
      const existing = getProductByBarcode(generatedBarcode);
      if (existing) {
        updateStock(existing.id, quantity, 'kirim');
        setMessage({ type: 'success', text: 'Mahsulot miqdori yangilandi!' });
      }
    }

    // Reset
    setQuantity(0);
    setName('');
    setScannedBarcode('');
    setGeneratedBarcode('');
    setIsNewProduct(false);
    if (barcodeInputRef.current) barcodeInputRef.current.focus();
  };

  // Logic: Disable unit only if it's an existing product (so !isNewProduct is true) AND we have loaded its name.
  // If it's a new product (!true -> false), it's enabled.
  // If it's clean slate (isNewProduct=false, name=''), disabled is false.
  const isFormLocked = !isNewProduct && !!name;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8 no-print">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-xl text-green-600"><Plus size={24} /></div>
          Kirim Qilish
        </h2>
        <button 
          onClick={generateRandomBarcode}
          className="bg-gray-900 text-white px-5 py-3 rounded-2xl hover:bg-gray-800 flex items-center gap-2 font-medium transition-transform active:scale-95 shadow-lg shadow-gray-200"
        >
          <Barcode size={20} />
          Shtrix-kod Yaratish
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl mb-8 flex items-center justify-center font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'} no-print animate-in fade-in slide-in-from-top-2`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 no-print">
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Scan size={16} /> Skaner (Shtrix-kod)
            </label>
            <input
              ref={barcodeInputRef}
              type="text"
              value={scannedBarcode}
              onChange={(e) => setScannedBarcode(e.target.value)}
              onKeyDown={handleScan}
              placeholder="Skanerlang yoki kiriting..."
              className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-500 rounded-2xl px-6 py-4 outline-none font-mono text-xl transition-all"
              autoFocus
            />
            <p className="text-sm text-gray-400 mt-2 ml-1">Skaner avtomatik ravishda 'Enter' bosadi. Agar qo'lda kiritsangiz, Enter tugmasini bosing.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 no-print relative overflow-hidden">
            {/* Form active indicator */}
            <div className={`absolute top-0 left-0 w-1 h-full ${isNewProduct ? 'bg-green-500' : 'bg-blue-500'} transition-colors`}></div>
            
            <div className="space-y-6">
               <div>
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Mahsulot Nomi</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isFormLocked}
                  className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-500 rounded-2xl px-5 py-3 outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all font-medium text-gray-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Kategoriya</label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => {
                         setCategory(e.target.value);
                         if(e.target.value !== 'new') setNewCategory('');
                      }}
                      disabled={isFormLocked}
                      className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-500 rounded-2xl px-5 py-3 outline-none disabled:opacity-60 disabled:cursor-not-allowed appearance-none transition-all font-medium text-gray-800"
                    >
                      <option value="">Tanlang...</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      <option value="new" className="text-green-600 font-bold">+ Yangi qo'shish</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                  </div>
                </div>
                {category === 'new' && (
                  <div className="animate-in fade-in slide-in-from-left-2">
                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Yangi Kategoriya</label>
                    <input 
                      type="text" 
                      value={newCategory} 
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-white border-2 border-green-200 focus:border-green-500 rounded-2xl px-5 py-3 outline-none transition-all font-medium"
                      placeholder="Nomini yozing..."
                      autoFocus
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">O'lchov Birligi</label>
                   <div className="relative">
                     <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as UnitType)}
                      disabled={isFormLocked}
                      className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-500 rounded-2xl px-5 py-3 outline-none disabled:opacity-60 disabled:cursor-not-allowed appearance-none transition-all font-medium text-gray-800"
                    >
                      {Object.values(UnitType).map(u => (
                        <option key={u} value={u}>{u.toUpperCase()}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Kirim Miqdori</label>
                   <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-green-50 border-2 border-transparent focus:bg-white focus:border-green-500 rounded-2xl px-5 py-3 outline-none font-bold text-xl text-green-700 transition-all"
                    min="1"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-bold py-4 rounded-2xl flex justify-center items-center gap-2 mt-4 transition-all shadow-lg shadow-green-200">
                <Save size={20} />
                Saqlash va Kirim Qilish
              </button>
            </div>
          </form>
        </div>

        {/* Barcode Preview / Print Section */}
        <div className="md:col-span-1">
          {generatedBarcode && (
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-6 text-center">
                <h3 className="text-lg font-bold mb-6 no-print text-gray-900">Shtrix-kod Prevyu</h3>
                <div className="border-2 border-dashed border-gray-200 p-6 rounded-2xl bg-white inline-block">
                   <BarcodeRenderer value={generatedBarcode} />
                   <p className="mt-4 font-bold text-lg text-gray-900">{name || 'Mahsulot Nomi'}</p>
                   <p className="text-sm text-gray-500 font-medium">{category}</p>
                </div>
                <button 
                  onClick={() => window.print()} 
                  className="w-full mt-8 bg-gray-900 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all no-print shadow-xl shadow-gray-200"
                >
                  <Printer size={20} />
                  Chop etish
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};