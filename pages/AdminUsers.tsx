import React, { useState, useEffect } from 'react';
import { getUsers, saveUser, deleteUser } from '../services/storage';
import { User, Permission } from '../types';
import { Trash2, UserPlus, Shield, Check } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(['dashboard']);

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const availablePermissions: { id: Permission; label: string }[] = [
    { id: 'dashboard', label: 'Boshqaruv (Dashboard)' },
    { id: 'kirim', label: 'Kirim (Inbound)' },
    { id: 'chiqim', label: 'Chiqim (Outbound)' },
    { id: 'inventory', label: 'Ombor (Inventory)' },
    { id: 'admin', label: 'Admin Panel' },
  ];

  const togglePermission = (perm: Permission) => {
    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(prev => prev.filter(p => p !== perm));
    } else {
      setSelectedPermissions(prev => [...prev, perm]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !fullName) return;

    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      fullName,
      permissions: selectedPermissions
    };

    saveUser(newUser);
    setUsers(getUsers());
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu foydalanuvchini o\'chirmoqchimisiz?')) {
      deleteUser(id);
      setUsers(getUsers());
    }
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setFullName('');
    setSelectedPermissions(['dashboard']);
    setIsFormOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Xodimlar</h2>
          <p className="text-gray-500 mt-1">Foydalanuvchi huquqlarini boshqarish</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-gray-900 text-white px-5 py-3 rounded-2xl hover:bg-gray-800 flex items-center gap-2 font-medium transition-all shadow-lg shadow-gray-200"
        >
          <UserPlus size={20} />
          Yangi Xodim
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-8 animate-in slide-in-from-top-4">
          <h3 className="text-xl font-bold mb-6 text-gray-900">Yangi Xodim Qo'shish</h3>
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">To'liq Ism</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-500 rounded-2xl px-4 py-3 outline-none transition-all"
                  placeholder="Eshmatov Toshmat"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Login</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-500 rounded-2xl px-4 py-3 outline-none transition-all"
                  placeholder="xodim1"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Parol</label>
                <input 
                  type="text" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-500 rounded-2xl px-4 py-3 outline-none transition-all"
                  placeholder="pass123"
                  required
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Ruxsatlar</label>
              <div className="flex flex-wrap gap-3">
                {availablePermissions.map(perm => (
                  <button
                    key={perm.id}
                    type="button"
                    onClick={() => togglePermission(perm.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 flex items-center gap-2 transition-all ${
                      selectedPermissions.includes(perm.id)
                        ? 'bg-green-500 text-white border-green-500 shadow-md shadow-green-100'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {selectedPermissions.includes(perm.id) && <Check size={14} />}
                    {perm.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={resetForm}
                className="px-6 py-3 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors"
              >
                Bekor qilish
              </button>
              <button 
                type="submit" 
                className="px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 font-bold shadow-lg shadow-green-200"
              >
                Saqlash
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-lg">
                    {user.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{user.fullName}</h3>
                    <p className="text-sm text-gray-400 font-medium">@{user.username}</p>
                  </div>
                </div>
                {user.username !== 'admin' && (
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield size={16} className="text-green-500" />
                  <span className="font-semibold uppercase tracking-wide text-xs">Ruxsatlar</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {user.permissions.map(perm => (
                    <span key={perm} className="px-2 py-1 bg-gray-50 text-gray-600 border border-gray-100 rounded-lg text-xs font-medium">
                      {availablePermissions.find(p => p.id === perm)?.label || perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-50 text-xs text-gray-400 flex justify-between font-mono">
              <span>ID: {user.id.slice(0, 6)}</span>
              <span className="bg-gray-50 px-2 rounded">pwd: ••••</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};