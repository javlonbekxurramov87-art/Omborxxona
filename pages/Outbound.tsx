import React, { useState, useEffect, useRef } from 'react';
import { getProductByBarcode, updateStock } from '../services/storage';
import { Product } from '../types';
import { ArrowUpFromLine, Search, CheckCircle, AlertTriangle } from 'lucide-react';

export const Outbound: React.FC = () => {
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [amount, setAmount] = useState<number>(1);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const code = barcode.trim();
      if (!code) return;

      const found = getProductByBarcode(code);
      if (found) {
        setProduct(found);
        setAmount(1);
        setMessage(null);
      } else {
        setProduct(null);
        setMessage({ type: 'error', text: 'Mahsulot topilmadi!' });
      }
    }
  };

  const handleOutbound = () => {
    if (!product) return;
    
    if (amount <= 0) {
      setMessage({ type: 'error', text: 'Miqdor noto\'g\'ri!' });
      return;
    }

    if (amount > product.quantity) {
      setMessage({ type: 'error', text: `Omborda yetarli emas! Mavjud: ${product.quantity} ${product.unit}` });
      return;
    }

    const success = updateStock(product.id, amount, 'chiqim');
    if (success) {
      setMessage({ type: 'success', text: `${product.name} - ${amount} ${product.unit} chiqim qilindi.` });
      setProduct(null);
      setBarcode('');
      setAmount(1);
      inputRef.current?.focus();
    } else {
      setMessage({ type: 'error', text: 'Xatolik yuz berdi.' });
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-xl text-orange-500"><ArrowUpFromLine size={24} /></div>
        Chiqim Qilish
      </h2>

      {/* Scanner Input */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
          Skaner (Shtrix-kod)
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={handleScan}
            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-2xl px-6 py-5 pl-14 outline-none text-2xl font-mono shadow-inner transition-all placeholder-gray-300"
            placeholder="Skanerlang..."
            autoFocus
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={28} />
        </div>
      </div>

      {/* Message Area */}
      {message && (
        <div className={`p-6 rounded-3xl mb-8 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
          <div className={`p-2 rounded-full ${message.type === 'success' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
            {message.type === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
          </div>
          <span className="font-semibold text-lg">{message.text}</span>
        </div>
      )}

      {/* Product Card */}
      {product && (
        <div className="bg-white rounded-3xl shadow-xl shadow-orange-100 overflow-hidden border border-white animate-in zoom-in-95 duration-300">
          <div className="bg-orange-500 p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-1">{product.name}</h3>
                <p className="opacity-90 font-medium text-lg">{product.category}</p>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-20 transform rotate-12">
               <ArrowUpFromLine size={120} />
            </div>
          </div>
          <div className="p-8">
             <div className="flex justify-between items-center mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide mb-1">Omborda mavjud</p>
                  <p className="text-4xl font-bold text-gray-900 tracking-tight">{product.quantity} <span className="text-xl font-medium text-gray-500">{product.unit}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide mb-1">Kod</p>
                  <p className="font-mono bg-white px-3 py-1 rounded-lg border border-gray-200 text-gray-600">{product.barcode}</p>
                </div>
             </div>

             <div className="space-y-6">
               <div>
                 <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Chiqim Miqdori</label>
                 <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setAmount(Math.max(1, amount - 1))}
                      className="w-16 h-16 rounded-2xl bg-gray-100 text-2xl font-bold hover:bg-gray-200 text-gray-600 transition-colors"
                    >-</button>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="flex-1 bg-white border-2 border-gray-200 rounded-2xl h-16 text-center text-3xl font-bold focus:border-orange-500 outline-none transition-colors"
                    />
                     <button 
                      onClick={() => setAmount(amount + 1)}
                      className="w-16 h-16 rounded-2xl bg-gray-100 text-2xl font-bold hover:bg-gray-200 text-gray-600 transition-colors"
                    >+</button>
                 </div>
               </div>

               <button 
                onClick={handleOutbound}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 rounded-2xl text-xl shadow-lg shadow-orange-200 transition-all active:scale-[0.98] mt-4"
               >
                 TASDIQLASH
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};