import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { getProducts, getTransactions } from '../services/storage';
import { Product, Transaction } from '../types';
import { TrendingUp, AlertCircle, Package, Activity } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setProducts(getProducts());
    setTransactions(getTransactions());
  }, []);

  const totalItems = products.length;
  const lowStock = products.filter(p => p.quantity < 10).length;
  const totalIn = transactions.filter(t => t.type === 'kirim').length;
  const totalOut = transactions.filter(t => t.type === 'chiqim').length;

  const categoryData = products.reduce((acc: any[], curr) => {
    const existing = acc.find(i => i.name === curr.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: curr.category, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#34C759', '#32ADE6', '#FF9500', '#FF3B30', '#AF52DE'];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 tracking-tight">Boshqaruv Paneli</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 transition-shadow hover:shadow-md">
          <div className="flex justify-between items-start">
             <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
               <Package size={24} />
             </div>
             <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Jami</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
            <p className="text-sm text-gray-500 font-medium">Mahsulotlar</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 transition-shadow hover:shadow-md">
          <div className="flex justify-between items-start">
             <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
               <AlertCircle size={24} />
             </div>
             <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Diqqat</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{lowStock}</p>
            <p className="text-sm text-gray-500 font-medium">Kam qolgan</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 transition-shadow hover:shadow-md">
          <div className="flex justify-between items-start">
             <div className="p-3 bg-green-50 text-green-500 rounded-2xl">
               <TrendingUp size={24} />
             </div>
             <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Bugun</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{totalIn}</p>
            <p className="text-sm text-gray-500 font-medium">Kirim operatsiyalari</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 transition-shadow hover:shadow-md">
          <div className="flex justify-between items-start">
             <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
               <Activity size={24} />
             </div>
             <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Bugun</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{totalOut}</p>
            <p className="text-sm text-gray-500 font-medium">Chiqim operatsiyalari</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6 text-gray-900">Kategoriyalar</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={8}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6 text-gray-900">So'nggi harakatlar</h3>
          <div className="overflow-y-auto h-72 pr-2">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-medium">Vaqt</th>
                  <th className="px-4 py-3 font-medium">Mahsulot</th>
                  <th className="px-4 py-3 font-medium">Holat</th>
                  <th className="px-4 py-3 font-medium text-right">Miqdor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.slice(0, 10).map((t) => (
                  <tr key={t.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{new Date(t.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{t.productName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.type === 'kirim' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {t.type === 'kirim' ? 'Kirim' : 'Chiqim'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">{t.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};