import React, { useState } from 'react';
import { loginUser } from '../services/storage';
import { User } from '../types';
import { Package, Lock, User as UserIcon, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = loginUser(username, password);
    if (user) {
      onLogin(user);
    } else {
      setError("Login yoki parol noto'g'ri!");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-gray-200/50 overflow-hidden border border-white">
        <div className="p-10 pb-0 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-green-500 text-white mb-6 shadow-xl shadow-green-200">
            <Package size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Xush kelibsiz</h1>
          <p className="text-gray-500">OmborPro tizimiga kiring</p>
        </div>
        
        <div className="p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center font-medium animate-pulse">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Login</label>
              <div className="relative group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-500 rounded-2xl outline-none transition-all font-medium text-gray-800 placeholder-gray-400 group-hover:bg-white group-hover:shadow-sm"
                  placeholder="admin"
                  required
                />
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-green-500" size={20} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Parol</label>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-500 rounded-2xl outline-none transition-all font-medium text-gray-800 placeholder-gray-400 group-hover:bg-white group-hover:shadow-sm"
                  placeholder="••••••"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-green-500" size={20} />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 mt-4"
            >
              Tizimga Kirish <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
          </div>
        </div>
      </div>
    </div>
  );
};